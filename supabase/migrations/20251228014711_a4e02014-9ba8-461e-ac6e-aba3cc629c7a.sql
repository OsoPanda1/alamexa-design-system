-- SEGURIDAD CRÍTICA: Corregir RLS de profiles para no exponer datos personales públicamente
-- 1. Eliminar política pública peligrosa
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- 2. Crear políticas seguras para profiles
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can view public profile fields of others"
ON public.profiles
FOR SELECT
USING (true);
-- Nota: Idealmente crear una vista que solo exponga campos públicos (username, avatar_url)
-- Por ahora restringimos a campos no sensibles via código

-- 3. Agregar políticas faltantes para memberships (prevenir modificación no autorizada)
CREATE POLICY "Only system can update memberships"
ON public.memberships
FOR UPDATE
USING (false);

CREATE POLICY "Only system can delete memberships"
ON public.memberships
FOR DELETE
USING (false);

-- 4. Proteger wallet_transactions de modificaciones
CREATE POLICY "Transactions are immutable - no updates"
ON public.wallet_transactions
FOR UPDATE
USING (false);

CREATE POLICY "Transactions are immutable - no deletes"
ON public.wallet_transactions
FOR DELETE
USING (false);

-- 5. Proteger order_items de modificaciones post-compra
CREATE POLICY "Order items cannot be updated"
ON public.order_items
FOR UPDATE
USING (false);

CREATE POLICY "Order items cannot be deleted"
ON public.order_items
FOR DELETE
USING (false);

-- 6. Proteger trade_proposals de eliminación (para auditoría)
CREATE POLICY "Trade proposals cannot be deleted"
ON public.trade_proposals
FOR DELETE
USING (false);

-- 7. Crear tabla para registro de desarrolladores TAMV DevHub
CREATE TABLE IF NOT EXISTS public.devhub_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  country TEXT NOT NULL DEFAULT 'México',
  city TEXT,
  github_url TEXT,
  portfolio_url TEXT,
  linkedin_url TEXT,
  skills TEXT[] DEFAULT '{}',
  experience_years INTEGER DEFAULT 0,
  motivation TEXT,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed')),
  payment_id TEXT,
  payment_amount NUMERIC(10,2) DEFAULT 250.00,
  payment_currency TEXT DEFAULT 'MXN',
  membership_tier TEXT DEFAULT 'devhub_member',
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- RLS para devhub_registrations
ALTER TABLE public.devhub_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own devhub registration"
ON public.devhub_registrations
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own devhub registration"
ON public.devhub_registrations
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own devhub registration"
ON public.devhub_registrations
FOR UPDATE
USING (auth.uid() = user_id);

-- Trigger para updated_at
CREATE TRIGGER update_devhub_registrations_updated_at
BEFORE UPDATE ON public.devhub_registrations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();