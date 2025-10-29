
-- Remove the public read access policy we just created
DROP POLICY IF EXISTS "Allow public read access to CommutingData" ON public."CommutingData";
DROP POLICY IF EXISTS "Allow public read access to RouteIDs" ON public."RouteIDs";

-- Allow access through the service role (this is the role Lovable uses)
CREATE POLICY "Allow service role access to CommutingData" 
  ON public."CommutingData" 
  FOR SELECT 
  TO service_role
  USING (true);

CREATE POLICY "Allow service role access to RouteIDs" 
  ON public."RouteIDs" 
  FOR SELECT 
  TO service_role
  USING (true);

-- Also allow access through the authenticated role for when we might add user auth later
CREATE POLICY "Allow authenticated access to CommutingData" 
  ON public."CommutingData" 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated access to RouteIDs" 
  ON public."RouteIDs" 
  FOR SELECT 
  TO authenticated
  USING (true);
