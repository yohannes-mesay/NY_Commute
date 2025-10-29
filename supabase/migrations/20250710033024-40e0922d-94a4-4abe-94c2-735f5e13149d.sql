
-- First, let's see what policies exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'CCCCommuteFormInputs';

-- If there are restrictive policies, we need to either:
-- 1. Allow anonymous inserts (since this appears to be a public form)
-- 2. Or disable RLS entirely if this table should be publicly writable

-- Option 1: Allow anonymous users to insert data
CREATE POLICY "Allow anonymous inserts to CCCCommuteFormInputs" 
ON "CCCCommuteFormInputs" 
FOR INSERT 
TO anon 
WITH CHECK (true);

-- Option 2: Or if you prefer to disable RLS entirely for this table:
-- ALTER TABLE "CCCCommuteFormInputs" DISABLE ROW LEVEL SECURITY;
