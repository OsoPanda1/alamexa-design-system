import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface TradeProposal {
  id: string;
  created_at: string;
  updated_at: string;
  proposer_id: string;
  proposer_product_id: string | null;
  receiver_id: string;
  receiver_product_id: string | null;
  message: string | null;
  cash_difference: number | null;
  cash_from: string | null;
  status: string;
  response_message: string | null;
  responded_at: string | null;
  completed_at: string | null;
  expires_at: string | null;
}

export function useTrades() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [proposals, setProposals] = useState<TradeProposal[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProposals = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('trade_proposals')
        .select('*')
        .or(`proposer_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProposals(data || []);
    } catch (error) {
      console.error('Error fetching proposals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, [user]);

  const createProposal = async (data: {
    receiverId: string;
    receiverProductId: string;
    proposerProductId?: string;
    message?: string;
    cashDifference?: number;
    cashFrom?: 'proposer' | 'receiver' | 'none';
  }) => {
    if (!user) return null;

    try {
      const { data: proposal, error } = await supabase
        .from('trade_proposals')
        .insert({
          proposer_id: user.id,
          receiver_id: data.receiverId,
          receiver_product_id: data.receiverProductId,
          proposer_product_id: data.proposerProductId || null,
          message: data.message || null,
          cash_difference: data.cashDifference || 0,
          cash_from: data.cashFrom || 'none',
        })
        .select()
        .single();

      if (error) throw error;

      // Create notification for receiver
      await supabase.from('notifications').insert({
        user_id: data.receiverId,
        type: 'trade_proposal',
        title: '¡Nueva propuesta de trueque!',
        message: 'Has recibido una nueva propuesta de trueque.',
        reference_id: proposal.id,
        reference_type: 'trade_proposal',
      });

      toast({
        title: '¡Propuesta enviada!',
        description: 'Tu propuesta de trueque ha sido enviada.',
      });

      await fetchProposals();
      return proposal;
    } catch (error) {
      console.error('Error creating proposal:', error);
      toast({
        title: 'Error',
        description: 'No se pudo enviar la propuesta.',
        variant: 'destructive',
      });
      return null;
    }
  };

  const respondToProposal = async (
    proposalId: string,
    response: 'accepted' | 'rejected',
    message?: string
  ) => {
    if (!user) return false;

    try {
      const { data: proposal, error } = await supabase
        .from('trade_proposals')
        .update({
          status: response,
          response_message: message || null,
          responded_at: new Date().toISOString(),
        })
        .eq('id', proposalId)
        .select()
        .single();

      if (error) throw error;

      // Notify proposer
      await supabase.from('notifications').insert({
        user_id: proposal.proposer_id,
        type: response === 'accepted' ? 'trade_accepted' : 'trade_rejected',
        title: response === 'accepted' 
          ? '¡Tu propuesta fue aceptada!' 
          : 'Propuesta rechazada',
        message: response === 'accepted'
          ? 'Tu propuesta de trueque ha sido aceptada. ¡Coordina el intercambio!'
          : 'Tu propuesta de trueque fue rechazada.',
        reference_id: proposalId,
        reference_type: 'trade_proposal',
      });

      toast({
        title: response === 'accepted' ? '¡Trueque aceptado!' : 'Propuesta rechazada',
        description: response === 'accepted' 
          ? 'Has aceptado el trueque. Coordina el intercambio.'
          : 'Has rechazado la propuesta.',
      });

      await fetchProposals();
      return true;
    } catch (error) {
      console.error('Error responding to proposal:', error);
      toast({
        title: 'Error',
        description: 'No se pudo procesar la respuesta.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const cancelProposal = async (proposalId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('trade_proposals')
        .update({ status: 'cancelled' })
        .eq('id', proposalId)
        .eq('proposer_id', user.id);

      if (error) throw error;

      toast({
        title: 'Propuesta cancelada',
        description: 'Tu propuesta ha sido cancelada.',
      });

      await fetchProposals();
      return true;
    } catch (error) {
      console.error('Error cancelling proposal:', error);
      return false;
    }
  };

  const completeProposal = async (proposalId: string) => {
    if (!user) return false;

    try {
      const { data: proposal, error } = await supabase
        .from('trade_proposals')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        .eq('id', proposalId)
        .select()
        .single();

      if (error) throw error;

      // Notify both parties
      const notifyBoth = [proposal.proposer_id, proposal.receiver_id].map((userId) =>
        supabase.from('notifications').insert({
          user_id: userId,
          type: 'trade_completed',
          title: '¡Trueque completado!',
          message: 'El trueque se ha marcado como completado. ¡Gracias por usar Alamexa!',
          reference_id: proposalId,
          reference_type: 'trade_proposal',
        })
      );
      await Promise.all(notifyBoth);

      toast({
        title: '¡Trueque completado!',
        description: 'El trueque ha sido marcado como completado.',
      });

      await fetchProposals();
      return true;
    } catch (error) {
      console.error('Error completing proposal:', error);
      return false;
    }
  };

  const pendingReceived = proposals.filter(
    (p) => p.receiver_id === user?.id && p.status === 'pending'
  );

  const pendingSent = proposals.filter(
    (p) => p.proposer_id === user?.id && p.status === 'pending'
  );

  const accepted = proposals.filter((p) => p.status === 'accepted');
  const completed = proposals.filter((p) => p.status === 'completed');

  return {
    proposals,
    loading,
    pendingReceived,
    pendingSent,
    accepted,
    completed,
    createProposal,
    respondToProposal,
    cancelProposal,
    completeProposal,
    refetch: fetchProposals,
  };
}
