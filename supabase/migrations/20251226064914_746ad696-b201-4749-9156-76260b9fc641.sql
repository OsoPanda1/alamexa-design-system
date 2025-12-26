-- Trade Proposals Table
CREATE TABLE public.trade_proposals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Proposer (who makes the offer)
  proposer_id UUID NOT NULL,
  proposer_product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  
  -- Receiver (who receives the offer)
  receiver_id UUID NOT NULL,
  receiver_product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  
  -- Trade details
  message TEXT,
  cash_difference NUMERIC DEFAULT 0,
  cash_from TEXT CHECK (cash_from IN ('proposer', 'receiver', 'none')),
  
  -- Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'cancelled', 'expired', 'completed')),
  
  -- Response
  response_message TEXT,
  responded_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Expiration (72 hours by default)
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '72 hours')
);

-- Enable RLS
ALTER TABLE public.trade_proposals ENABLE ROW LEVEL SECURITY;

-- Policies for trade_proposals
CREATE POLICY "Users can view own proposals"
ON public.trade_proposals FOR SELECT
USING (auth.uid() = proposer_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can create proposals"
ON public.trade_proposals FOR INSERT
WITH CHECK (auth.uid() = proposer_id);

CREATE POLICY "Participants can update proposals"
ON public.trade_proposals FOR UPDATE
USING (auth.uid() = proposer_id OR auth.uid() = receiver_id);

-- Trigger for updated_at
CREATE TRIGGER update_trade_proposals_updated_at
BEFORE UPDATE ON public.trade_proposals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Notifications Table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID NOT NULL,
  
  -- Notification details
  type TEXT NOT NULL CHECK (type IN ('trade_proposal', 'trade_accepted', 'trade_rejected', 'trade_completed', 'message', 'system')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  
  -- Reference to related entity
  reference_id UUID,
  reference_type TEXT,
  
  -- Status
  read BOOLEAN NOT NULL DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Policies for notifications
CREATE POLICY "Users can view own notifications"
ON public.notifications FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications"
ON public.notifications FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
ON public.notifications FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notifications"
ON public.notifications FOR DELETE
USING (auth.uid() = user_id);

-- Add indexes for performance
CREATE INDEX idx_trade_proposals_proposer ON public.trade_proposals(proposer_id);
CREATE INDEX idx_trade_proposals_receiver ON public.trade_proposals(receiver_id);
CREATE INDEX idx_trade_proposals_status ON public.trade_proposals(status);
CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_notifications_unread ON public.notifications(user_id, read) WHERE read = false;