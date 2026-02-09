
-- Event Outbox for domain events (federation pattern)
CREATE TABLE public.event_outbox (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  origin TEXT NOT NULL DEFAULT 'alamexa',
  payload JSONB NOT NULL DEFAULT '{}',
  published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_event_outbox_unpublished ON public.event_outbox (published, created_at) WHERE published = false;
CREATE INDEX idx_event_outbox_type ON public.event_outbox (event_type);

ALTER TABLE public.event_outbox ENABLE ROW LEVEL SECURITY;

-- Only admins can read events
CREATE POLICY "Admins can manage events"
ON public.event_outbox
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Federation Links table
CREATE TABLE public.federation_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  local_user_id UUID NOT NULL,
  global_subject_id UUID,
  issuer TEXT NOT NULL DEFAULT 'alamexa',
  linked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}',
  UNIQUE(local_user_id, issuer)
);

ALTER TABLE public.federation_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own federation links"
ON public.federation_links
FOR SELECT
TO authenticated
USING (local_user_id = auth.uid());

CREATE POLICY "Admins can manage federation links"
ON public.federation_links
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Add global_subject_id to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS global_subject_id UUID;

-- Domain event trigger function
CREATE OR REPLACE FUNCTION public.emit_domain_event()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.event_outbox (event_type, payload)
  VALUES (
    TG_ARGV[0],
    jsonb_build_object(
      'table', TG_TABLE_NAME,
      'operation', TG_OP,
      'record_id', NEW.id,
      'timestamp', now()
    )
  );
  RETURN NEW;
END;
$$;

-- Emit events for key tables
CREATE TRIGGER emit_product_event
AFTER INSERT ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.emit_domain_event('PRODUCT_CREATED');

CREATE TRIGGER emit_trade_event
AFTER INSERT ON public.trade_proposals
FOR EACH ROW
EXECUTE FUNCTION public.emit_domain_event('TRADE_PROPOSED');

CREATE TRIGGER emit_escrow_event
AFTER INSERT ON public.escrow_transactions
FOR EACH ROW
EXECUTE FUNCTION public.emit_domain_event('ESCROW_CREATED');

CREATE TRIGGER emit_kyc_event
AFTER UPDATE ON public.kyc_verifications
FOR EACH ROW
WHEN (NEW.verification_level = 'verified' AND OLD.verification_level != 'verified')
EXECUTE FUNCTION public.emit_domain_event('USER_VERIFIED');
