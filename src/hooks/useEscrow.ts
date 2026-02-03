import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface EscrowTransaction {
  id: string;
  trade_proposal_id: string | null;
  payer_id: string;
  receiver_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'funded' | 'released' | 'refunded' | 'disputed';
  payment_method: string | null;
  payment_reference: string | null;
  released_at: string | null;
  refunded_at: string | null;
  dispute_reason: string | null;
  created_at: string;
  updated_at: string;
}

export function useEscrow() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<EscrowTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('escrow_transactions')
        .select('*')
        .or(`payer_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTransactions((data || []) as EscrowTransaction[]);
    } catch (error) {
      console.error('Error fetching escrow transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  const createEscrow = async (data: {
    tradeProposalId: string;
    receiverId: string;
    amount: number;
    paymentMethod?: string;
  }) => {
    if (!user) return null;

    try {
      const { data: escrow, error } = await supabase
        .from('escrow_transactions')
        .insert({
          trade_proposal_id: data.tradeProposalId,
          payer_id: user.id,
          receiver_id: data.receiverId,
          amount: data.amount,
          payment_method: data.paymentMethod || 'wallet',
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Escrow creado',
        description: `Se ha creado una custodia de $${data.amount} MXN`,
      });

      await fetchTransactions();
      return escrow as EscrowTransaction;
    } catch (error) {
      console.error('Error creating escrow:', error);
      toast({
        title: 'Error',
        description: 'No se pudo crear la custodia',
        variant: 'destructive',
      });
      return null;
    }
  };

  const fundEscrow = async (escrowId: string, paymentReference: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('escrow_transactions')
        .update({
          status: 'funded',
          payment_reference: paymentReference,
        })
        .eq('id', escrowId)
        .eq('payer_id', user.id);

      if (error) throw error;

      toast({
        title: 'Fondos depositados',
        description: 'Los fondos están ahora en custodia',
      });

      await fetchTransactions();
      return true;
    } catch (error) {
      console.error('Error funding escrow:', error);
      return false;
    }
  };

  const releaseEscrow = async (escrowId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('escrow_transactions')
        .update({
          status: 'released',
          released_at: new Date().toISOString(),
        })
        .eq('id', escrowId);

      if (error) throw error;

      toast({
        title: 'Fondos liberados',
        description: 'Los fondos han sido transferidos al vendedor',
      });

      await fetchTransactions();
      return true;
    } catch (error) {
      console.error('Error releasing escrow:', error);
      return false;
    }
  };

  const disputeEscrow = async (escrowId: string, reason: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('escrow_transactions')
        .update({
          status: 'disputed',
          dispute_reason: reason,
        })
        .eq('id', escrowId);

      if (error) throw error;

      toast({
        title: 'Disputa abierta',
        description: 'Nuestro equipo revisará el caso',
      });

      await fetchTransactions();
      return true;
    } catch (error) {
      console.error('Error disputing escrow:', error);
      return false;
    }
  };

  const pending = transactions.filter((t) => t.status === 'pending');
  const funded = transactions.filter((t) => t.status === 'funded');
  const completed = transactions.filter((t) => t.status === 'released');
  const disputed = transactions.filter((t) => t.status === 'disputed');

  return {
    transactions,
    loading,
    pending,
    funded,
    completed,
    disputed,
    createEscrow,
    fundEscrow,
    releaseEscrow,
    disputeEscrow,
    refetch: fetchTransactions,
  };
}
