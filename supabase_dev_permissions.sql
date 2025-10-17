-- =====================================================
-- DESARROLLO: Permitir operaciones sin autenticación
-- =====================================================
-- ⚠️ ADVERTENCIA: Solo para desarrollo/testing
-- NO usar en producción
-- =====================================================

-- Hacer user_id opcional en vehicles
ALTER TABLE public.vehicles 
  ALTER COLUMN user_id DROP NOT NULL;

-- Permitir lectura pública de vehículos
DROP POLICY IF EXISTS "Allow public read access" ON public.vehicles;
CREATE POLICY "Allow public read access" 
  ON public.vehicles 
  FOR SELECT 
  USING (true);

-- Permitir inserción pública
DROP POLICY IF EXISTS "Allow public insert" ON public.vehicles;
CREATE POLICY "Allow public insert" 
  ON public.vehicles 
  FOR INSERT 
  WITH CHECK (true);

-- Permitir actualización pública
DROP POLICY IF EXISTS "Allow public update" ON public.vehicles;
CREATE POLICY "Allow public update" 
  ON public.vehicles 
  FOR UPDATE 
  USING (true);

-- Permitir eliminación pública
DROP POLICY IF EXISTS "Allow public delete" ON public.vehicles;
CREATE POLICY "Allow public delete" 
  ON public.vehicles 
  FOR DELETE 
  USING (true);

-- =====================================================
-- Para revertir (cuando implementes autenticación):
-- =====================================================
-- ALTER TABLE public.vehicles 
--   ALTER COLUMN user_id SET NOT NULL;
-- 
-- DROP POLICY IF EXISTS "Allow public read access" ON public.vehicles;
-- DROP POLICY IF EXISTS "Allow public insert" ON public.vehicles;
-- DROP POLICY IF EXISTS "Allow public update" ON public.vehicles;
-- DROP POLICY IF EXISTS "Allow public delete" ON public.vehicles;
-- 
-- Luego volver a crear las políticas con auth.uid()
-- =====================================================

