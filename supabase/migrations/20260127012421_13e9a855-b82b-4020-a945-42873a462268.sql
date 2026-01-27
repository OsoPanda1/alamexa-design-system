-- =============================================
-- SISTEMA DE RESEÑAS Y CALIFICACIONES
-- =============================================
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewer_id UUID NOT NULL,
  reviewed_user_id UUID NOT NULL,
  trade_proposal_id UUID REFERENCES public.trade_proposals(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_seller_review BOOLEAN DEFAULT false,
  helpful_count INTEGER DEFAULT 0,
  UNIQUE(reviewer_id, trade_proposal_id, is_seller_review)
);

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- RLS policies for reviews
CREATE POLICY "Reviews are viewable by everyone"
  ON public.reviews FOR SELECT
  USING (true);

CREATE POLICY "Users can create reviews for completed trades"
  ON public.reviews FOR INSERT
  WITH CHECK (
    auth.uid() = reviewer_id AND
    EXISTS (
      SELECT 1 FROM trade_proposals tp
      WHERE tp.id = trade_proposal_id
      AND tp.status = 'completed'
      AND (tp.proposer_id = auth.uid() OR tp.receiver_id = auth.uid())
    )
  );

CREATE POLICY "Users cannot update reviews"
  ON public.reviews FOR UPDATE
  USING (false);

CREATE POLICY "Users cannot delete reviews"
  ON public.reviews FOR DELETE
  USING (false);

-- Index for faster queries
CREATE INDEX idx_reviews_reviewed_user ON public.reviews(reviewed_user_id);
CREATE INDEX idx_reviews_trade_proposal ON public.reviews(trade_proposal_id);

-- =============================================
-- SISTEMA DE NOTIFICACIONES PUSH
-- =============================================
-- Add push subscription fields to notifications
ALTER TABLE public.notifications
ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'normal',
ADD COLUMN IF NOT EXISTS action_url TEXT,
ADD COLUMN IF NOT EXISTS icon TEXT;

-- Create push subscriptions table
CREATE TABLE public.push_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, endpoint)
);

-- Enable RLS
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own push subscriptions"
  ON public.push_subscriptions FOR ALL
  USING (auth.uid() = user_id);

-- =============================================
-- VISTAS PÚBLICAS LIMITADAS PARA PERFILES
-- =============================================
CREATE OR REPLACE VIEW public.public_profiles
WITH (security_invoker=on) AS
SELECT 
  id,
  user_id,
  username,
  avatar_url,
  reputation_score,
  total_trades,
  membership_tier,
  bio,
  city,
  created_at
FROM public.profiles;

-- =============================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- =============================================
-- Índices para mensajes
CREATE INDEX IF NOT EXISTS idx_messages_sender ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON public.messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);

-- Índices para productos
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_trade_type ON public.products(trade_type);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_seller ON public.products(seller_id);

-- Índices para trade_proposals
CREATE INDEX IF NOT EXISTS idx_trade_proposals_proposer ON public.trade_proposals(proposer_id);
CREATE INDEX IF NOT EXISTS idx_trade_proposals_receiver ON public.trade_proposals(receiver_id);
CREATE INDEX IF NOT EXISTS idx_trade_proposals_status ON public.trade_proposals(status);

-- Índices para notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(user_id, read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON public.notifications(created_at DESC);

-- =============================================
-- FUNCIÓN PARA CALCULAR RATING PROMEDIO
-- =============================================
CREATE OR REPLACE FUNCTION public.get_user_rating(target_user_id UUID)
RETURNS TABLE (
  average_rating NUMERIC,
  total_reviews INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(ROUND(AVG(rating)::numeric, 1), 0) as average_rating,
    COUNT(*)::integer as total_reviews
  FROM reviews
  WHERE reviewed_user_id = target_user_id;
END;
$$;

-- =============================================
-- FUNCIÓN PARA ACTUALIZAR REPUTACIÓN
-- =============================================
CREATE OR REPLACE FUNCTION public.update_user_reputation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  avg_rating NUMERIC;
  review_count INTEGER;
BEGIN
  -- Calculate new reputation
  SELECT 
    COALESCE(AVG(rating), 0),
    COUNT(*)
  INTO avg_rating, review_count
  FROM reviews
  WHERE reviewed_user_id = NEW.reviewed_user_id;
  
  -- Update profile reputation (rating * 20 to convert 5-star to 100-point scale)
  UPDATE profiles
  SET reputation_score = GREATEST(0, LEAST(100, (avg_rating * 20)::integer))
  WHERE user_id = NEW.reviewed_user_id;
  
  RETURN NEW;
END;
$$;

-- Trigger to update reputation on new review
CREATE TRIGGER trigger_update_reputation
AFTER INSERT ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_user_reputation();

-- =============================================
-- SAMPLE PRODUCTS PARA TESTING
-- =============================================
-- Only insert if products table is empty
DO $$
DECLARE
  product_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO product_count FROM products;
  
  IF product_count = 0 THEN
    -- We'll insert sample products via the application
    NULL;
  END IF;
END $$;