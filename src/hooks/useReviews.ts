import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface Review {
  id: string;
  created_at: string;
  reviewer_id: string;
  reviewed_user_id: string;
  trade_proposal_id: string | null;
  rating: number;
  comment: string | null;
  is_seller_review: boolean;
  helpful_count: number;
}

export interface UserRating {
  average_rating: number;
  total_reviews: number;
}

export function useReviews() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const createReview = useCallback(
    async (data: {
      reviewedUserId: string;
      tradeProposalId: string;
      rating: number;
      comment?: string;
      isSellerReview?: boolean;
    }) => {
      if (!user) return null;

      setLoading(true);
      try {
        const { data: review, error } = await supabase
          .from("reviews")
          .insert({
            reviewer_id: user.id,
            reviewed_user_id: data.reviewedUserId,
            trade_proposal_id: data.tradeProposalId,
            rating: data.rating,
            comment: data.comment || null,
            is_seller_review: data.isSellerReview ?? false,
          })
          .select()
          .single();

        if (error) throw error;

        toast({
          title: "¡Reseña enviada!",
          description: "Tu calificación ha sido registrada.",
        });

        return review as Review;
      } catch (error: any) {
        console.error("Error creating review:", error);
        toast({
          title: "Error",
          description: error.message || "No se pudo enviar la reseña.",
          variant: "destructive",
        });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [user, toast]
  );

  const getReviewsForUser = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("reviewed_user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []) as Review[];
    } catch (error) {
      console.error("Error fetching reviews:", error);
      return [];
    }
  }, []);

  const getUserRating = useCallback(async (userId: string): Promise<UserRating> => {
    try {
      const { data, error } = await supabase.rpc("get_user_rating", {
        target_user_id: userId,
      });

      if (error) throw error;

      if (data && data.length > 0) {
        return {
          average_rating: Number(data[0].average_rating) || 0,
          total_reviews: Number(data[0].total_reviews) || 0,
        };
      }
      return { average_rating: 0, total_reviews: 0 };
    } catch (error) {
      console.error("Error fetching user rating:", error);
      return { average_rating: 0, total_reviews: 0 };
    }
  }, []);

  const canReviewTrade = useCallback(
    async (tradeProposalId: string): Promise<boolean> => {
      if (!user) return false;

      try {
        // Check if trade is completed and user hasn't reviewed yet
        const { data: trade, error: tradeError } = await supabase
          .from("trade_proposals")
          .select("*")
          .eq("id", tradeProposalId)
          .eq("status", "completed")
          .single();

        if (tradeError || !trade) return false;

        // Check if user is a participant
        if (trade.proposer_id !== user.id && trade.receiver_id !== user.id) {
          return false;
        }

        // Check if user already reviewed
        const { data: existingReview } = await supabase
          .from("reviews")
          .select("id")
          .eq("trade_proposal_id", tradeProposalId)
          .eq("reviewer_id", user.id)
          .single();

        return !existingReview;
      } catch {
        return false;
      }
    },
    [user]
  );

  return {
    loading,
    createReview,
    getReviewsForUser,
    getUserRating,
    canReviewTrade,
  };
}
