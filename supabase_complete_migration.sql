-- =====================================================
-- Complete Database Migration for Auto Parts Finder
-- =====================================================

-- Create base function for updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 1. PROFILES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE INDEX IF NOT EXISTS idx_profiles_id ON public.profiles(id);

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 2. VEHICLES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL CHECK (year >= 1900 AND year <= 2100),
  mileage INTEGER NOT NULL CHECK (mileage >= 0),
  vin TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own vehicles" ON public.vehicles;
CREATE POLICY "Users can view own vehicles" ON public.vehicles FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own vehicles" ON public.vehicles;
CREATE POLICY "Users can insert own vehicles" ON public.vehicles FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own vehicles" ON public.vehicles;
CREATE POLICY "Users can update own vehicles" ON public.vehicles FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own vehicles" ON public.vehicles;
CREATE POLICY "Users can delete own vehicles" ON public.vehicles FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_vehicles_user_id ON public.vehicles(user_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_created_at ON public.vehicles(created_at DESC);

DROP TRIGGER IF EXISTS update_vehicles_updated_at ON public.vehicles;
CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON public.vehicles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 3. PARTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.parts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  rating DECIMAL(3, 2) CHECK (rating >= 0 AND rating <= 5),
  review_count INTEGER DEFAULT 0 CHECK (review_count >= 0),
  image_url TEXT,
  in_stock BOOLEAN DEFAULT true,
  description TEXT,
  manufacturer TEXT,
  part_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.parts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view parts" ON public.parts;
CREATE POLICY "Anyone can view parts" ON public.parts FOR SELECT TO public USING (true);

CREATE INDEX IF NOT EXISTS idx_parts_category ON public.parts(category);
CREATE INDEX IF NOT EXISTS idx_parts_in_stock ON public.parts(in_stock);
CREATE INDEX IF NOT EXISTS idx_parts_price ON public.parts(price);
CREATE INDEX IF NOT EXISTS idx_parts_name ON public.parts USING gin(to_tsvector('spanish', name));

DROP TRIGGER IF EXISTS update_parts_updated_at ON public.parts;
CREATE TRIGGER update_parts_updated_at BEFORE UPDATE ON public.parts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 4. SERVICE PROVIDERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.service_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  rating DECIMAL(3, 2) CHECK (rating >= 0 AND rating <= 5),
  review_count INTEGER DEFAULT 0 CHECK (review_count >= 0),
  distance_km DECIMAL(10, 2),
  address TEXT,
  phone TEXT,
  image_url TEXT,
  open_now BOOLEAN DEFAULT false,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.service_providers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view service providers" ON public.service_providers;
CREATE POLICY "Anyone can view service providers" ON public.service_providers FOR SELECT TO public USING (true);

CREATE INDEX IF NOT EXISTS idx_service_providers_type ON public.service_providers(type);
CREATE INDEX IF NOT EXISTS idx_service_providers_rating ON public.service_providers(rating DESC);
CREATE INDEX IF NOT EXISTS idx_service_providers_open_now ON public.service_providers(open_now);

DROP TRIGGER IF EXISTS update_service_providers_updated_at ON public.service_providers;
CREATE TRIGGER update_service_providers_updated_at BEFORE UPDATE ON public.service_providers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 5. SERVICE OFFERINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.service_offerings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_provider_id UUID NOT NULL REFERENCES public.service_providers(id) ON DELETE CASCADE,
  service_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.service_offerings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view service offerings" ON public.service_offerings;
CREATE POLICY "Anyone can view service offerings" ON public.service_offerings FOR SELECT TO public USING (true);

CREATE INDEX IF NOT EXISTS idx_service_offerings_provider_id ON public.service_offerings(service_provider_id);
CREATE INDEX IF NOT EXISTS idx_service_offerings_service_name ON public.service_offerings(service_name);

-- =====================================================
-- 6. MAINTENANCE RECOMMENDATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.maintenance_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT NOT NULL CHECK (priority IN ('high', 'medium', 'low')),
  category TEXT NOT NULL CHECK (category IN ('maintenance', 'repair', 'upgrade')),
  estimated_cost TEXT,
  due_date DATE,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.maintenance_recommendations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view recommendations for own vehicles" ON public.maintenance_recommendations;
CREATE POLICY "Users can view recommendations for own vehicles" ON public.maintenance_recommendations FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.vehicles 
    WHERE vehicles.id = maintenance_recommendations.vehicle_id 
    AND vehicles.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can insert recommendations for own vehicles" ON public.maintenance_recommendations;
CREATE POLICY "Users can insert recommendations for own vehicles" ON public.maintenance_recommendations FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.vehicles 
    WHERE vehicles.id = vehicle_id 
    AND vehicles.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can update recommendations for own vehicles" ON public.maintenance_recommendations;
CREATE POLICY "Users can update recommendations for own vehicles" ON public.maintenance_recommendations FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.vehicles 
    WHERE vehicles.id = maintenance_recommendations.vehicle_id 
    AND vehicles.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can delete recommendations for own vehicles" ON public.maintenance_recommendations;
CREATE POLICY "Users can delete recommendations for own vehicles" ON public.maintenance_recommendations FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.vehicles 
    WHERE vehicles.id = maintenance_recommendations.vehicle_id 
    AND vehicles.user_id = auth.uid()
  )
);

CREATE INDEX IF NOT EXISTS idx_maintenance_recommendations_vehicle_id ON public.maintenance_recommendations(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_recommendations_priority ON public.maintenance_recommendations(priority);
CREATE INDEX IF NOT EXISTS idx_maintenance_recommendations_completed ON public.maintenance_recommendations(completed);
CREATE INDEX IF NOT EXISTS idx_maintenance_recommendations_due_date ON public.maintenance_recommendations(due_date);

DROP TRIGGER IF EXISTS update_maintenance_recommendations_updated_at ON public.maintenance_recommendations;
CREATE TRIGGER update_maintenance_recommendations_updated_at BEFORE UPDATE ON public.maintenance_recommendations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 7. CART ITEMS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  part_id UUID NOT NULL REFERENCES public.parts(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, part_id)
);

ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own cart items" ON public.cart_items;
CREATE POLICY "Users can view own cart items" ON public.cart_items FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own cart items" ON public.cart_items;
CREATE POLICY "Users can insert own cart items" ON public.cart_items FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own cart items" ON public.cart_items;
CREATE POLICY "Users can update own cart items" ON public.cart_items FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own cart items" ON public.cart_items;
CREATE POLICY "Users can delete own cart items" ON public.cart_items FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON public.cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_part_id ON public.cart_items(part_id);

DROP TRIGGER IF EXISTS update_cart_items_updated_at ON public.cart_items;
CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON public.cart_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Migration Complete!
-- =====================================================
-- All tables created with:
-- ✓ Row Level Security (RLS) enabled
-- ✓ Proper foreign key relationships
-- ✓ Indexes for performance
-- ✓ Automatic timestamp updates
-- ✓ Data validation constraints
-- =====================================================

