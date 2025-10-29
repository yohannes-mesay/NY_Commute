
-- First, let's see what policies currently exist on the table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'CCCCommuteFormInputs';

-- Check if RLS is enabled on the table
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'CCCCommuteFormInputs';

-- Drop any existing restrictive policies that might be blocking inserts
DROP POLICY IF EXISTS "Allow anonymous inserts to CCCCommuteFormInputs" ON "CCCCommuteFormInputs";

-- Create a proper policy for anonymous inserts
CREATE POLICY "Enable anonymous inserts for CCCCommuteFormInputs" 
ON "CCCCommuteFormInputs" 
FOR INSERT 
TO anon 
WITH CHECK (true);

-- Also allow authenticated users to insert (in case someone is logged in)
CREATE POLICY "Enable authenticated inserts for CCCCommuteFormInputs" 
ON "CCCCommuteFormInputs" 
FOR INSERT 
TO authenticated 
WITH CHECK (true);
