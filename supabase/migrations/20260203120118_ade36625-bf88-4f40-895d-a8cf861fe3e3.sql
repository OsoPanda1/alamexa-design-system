
-- =============================================
-- ALAMEXA: Escrow, Shipping & KYC System
-- =============================================

-- 1. ESCROW TRANSACTIONS TABLE
CREATE TABLE public.escrow_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trade_proposal_id UUID REFERENCES public.trade_proposals(id) ON DELETE CASCADE,
  payer_id UUID NOT NULL,
  receiver_id UUID NOT NULL,
  amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'MXN',
  status TEXT NOT NULL DEFAULT 'pending',
  payment_method TEXT,
  payment_reference TEXT,
  released_at TIMESTAMPTZ,
  refunded_at TIMESTAMPTZ,
  dispute_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT valid_escrow_status CHECK (status IN ('pending', 'funded', 'released', 'refunded', 'disputed'))
);

-- 2. SHIPPING ORDERS TABLE
CREATE TABLE public.shipping_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trade_proposal_id UUID REFERENCES public.trade_proposals(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  sender_id UUID NOT NULL,
  receiver_id UUID NOT NULL,
  carrier TEXT NOT NULL DEFAULT 'fedex',
  tracking_number TEXT,
  label_url TEXT,
  shipping_cost NUMERIC(10,2),
  estimated_delivery DATE,
  actual_delivery DATE,
  origin_address JSONB,
  destination_address JSONB,
  package_weight NUMERIC(8,2),
  package_dimensions JSONB,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT valid_carrier CHECK (carrier IN ('fedex', 'dhl', 'estafeta', 'ups', 'redpack', 'pickup')),
  CONSTRAINT valid_shipping_status CHECK (status IN ('pending', 'label_created', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'returned', 'cancelled'))
);

-- 3. KYC VERIFICATIONS TABLE
CREATE TABLE public.kyc_verifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  verification_level TEXT NOT NULL DEFAULT 'none',
  full_name TEXT,
  date_of_birth DATE,
  nationality TEXT,
  document_type TEXT,
  document_number TEXT,
  document_front_url TEXT,
  document_back_url TEXT,
  selfie_url TEXT,
  address_proof_url TEXT,
  verified_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  rejection_reason TEXT,
  verified_by UUID,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT valid_verification_level CHECK (verification_level IN ('none', 'basic', 'verified', 'premium')),
  CONSTRAINT valid_document_type CHECK (document_type IS NULL OR document_type IN ('ine', 'passport', 'license', 'cedula'))
);

-- Enable RLS
ALTER TABLE public.escrow_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyc_verifications ENABLE ROW LEVEL SECURITY;

-- Escrow Policies
CREATE POLICY "Users can view own escrow transactions"
ON public.escrow_transactions FOR SELECT
USING (auth.uid() = payer_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can create escrow transactions"
ON public.escrow_transactions FOR INSERT
WITH CHECK (auth.uid() = payer_id);

CREATE POLICY "Participants can update escrow"
ON public.escrow_transactions FOR UPDATE
USING (auth.uid() = payer_id OR auth.uid() = receiver_id);

-- Shipping Policies
CREATE POLICY "Users can view own shipping orders"
ON public.shipping_orders FOR SELECT
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can create shipping orders"
ON public.shipping_orders FOR INSERT
WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Participants can update shipping"
ON public.shipping_orders FOR UPDATE
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- KYC Policies
CREATE POLICY "Users can view own KYC"
ON public.kyc_verifications FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own KYC"
ON public.kyc_verifications FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own KYC"
ON public.kyc_verifications FOR UPDATE
USING (auth.uid() = user_id);

-- Add is_verified column to profiles if not exists
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS kyc_level TEXT DEFAULT 'none';

-- Create indexes for performance
CREATE INDEX idx_escrow_trade ON public.escrow_transactions(trade_proposal_id);
CREATE INDEX idx_escrow_status ON public.escrow_transactions(status);
CREATE INDEX idx_shipping_trade ON public.shipping_orders(trade_proposal_id);
CREATE INDEX idx_shipping_tracking ON public.shipping_orders(tracking_number);
CREATE INDEX idx_kyc_user ON public.kyc_verifications(user_id);
CREATE INDEX idx_kyc_level ON public.kyc_verifications(verification_level);

-- Updated at triggers
CREATE TRIGGER update_escrow_updated_at
BEFORE UPDATE ON public.escrow_transactions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_shipping_updated_at
BEFORE UPDATE ON public.shipping_orders
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_kyc_updated_at
BEFORE UPDATE ON public.kyc_verifications
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
