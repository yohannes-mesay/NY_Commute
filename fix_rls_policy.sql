-- Drop any existing policies on the LOWERCASE table name
DROP POLICY IF EXISTS "Allow anonymous insert" ON ccccommuteforminputs;
DROP POLICY IF EXISTS "Allow anonymous inserts" ON ccccommuteforminputs;
DROP POLICY IF EXISTS "Allow inserts from postgres" ON ccccommuteforminputs;

-- Create new policies on the lowercase table name
CREATE POLICY "Allow anonymous insert" 
ON ccccommuteforminputs 
FOR INSERT 
TO anon 
WITH CHECK (true);

CREATE POLICY "Allow authenticated insert" 
ON ccccommuteforminputs 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Also allow SELECT for anonymous users
CREATE POLICY "Allow anonymous select" 
ON ccccommuteforminputs 
FOR SELECT 
TO anon 
USING (true);
