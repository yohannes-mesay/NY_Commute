    -- Fix RLS policies for Cost Comparison Tool
    -- This allows anonymous users to:
    -- 1. INSERT into ccccommuteforminputs (form submissions)
    -- 2. SELECT from reference tables needed for calculations

    -- ============================================
    -- 1. ccccommuteforminputs (form submissions)
    -- ============================================
    -- Drop all existing policies first
    DO $$ 
    DECLARE
        r RECORD;
    BEGIN
        FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'ccccommuteforminputs' AND schemaname = 'public') LOOP
            EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.ccccommuteforminputs';
        END LOOP;
    END $$;

    CREATE POLICY "Allow anonymous insert" 
    ON public.ccccommuteforminputs 
    FOR INSERT 
    TO anon 
    WITH CHECK (true);

    CREATE POLICY "Allow authenticated insert" 
    ON public.ccccommuteforminputs 
    FOR INSERT 
    TO authenticated 
    WITH CHECK (true);

    CREATE POLICY "Allow anonymous select" 
    ON public.ccccommuteforminputs 
    FOR SELECT 
    TO anon 
    USING (true);

    -- ============================================
    -- 2. cccdrivingcostreference (driving costs)
    -- ============================================
    DO $$ 
    DECLARE
        r RECORD;
    BEGIN
        FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'cccdrivingcostreference' AND schemaname = 'public') LOOP
            EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.cccdrivingcostreference';
        END LOOP;
    END $$;

    CREATE POLICY "Allow anonymous select driving costs" 
    ON public.cccdrivingcostreference 
    FOR SELECT 
    TO anon 
    USING (true);

    CREATE POLICY "Allow authenticated select driving costs" 
    ON public.cccdrivingcostreference 
    FOR SELECT 
    TO authenticated 
    USING (true);

    -- ============================================
    -- 3. cccnjtransitfares (transit fares)
    -- ============================================
    DO $$ 
    DECLARE
        r RECORD;
    BEGIN
        FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'cccnjtransitfares' AND schemaname = 'public') LOOP
            EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.cccnjtransitfares';
        END LOOP;
    END $$;

    CREATE POLICY "Allow anonymous select transit fares" 
    ON public.cccnjtransitfares 
    FOR SELECT 
    TO anon 
    USING (true);

    CREATE POLICY "Allow authenticated select transit fares" 
    ON public.cccnjtransitfares 
    FOR SELECT 
    TO authenticated 
    USING (true);

    -- ============================================
    -- 4. cccboxcarfares (boxcar fares)
    -- ============================================
    DO $$ 
    DECLARE
        r RECORD;
    BEGIN
        FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'cccboxcarfares' AND schemaname = 'public') LOOP
            EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.cccboxcarfares';
        END LOOP;
    END $$;

    CREATE POLICY "Allow anonymous select boxcar fares" 
    ON public.cccboxcarfares 
    FOR SELECT 
    TO anon 
    USING (true);

    CREATE POLICY "Allow authenticated select boxcar fares" 
    ON public.cccboxcarfares 
    FOR SELECT 
    TO authenticated 
    USING (true);
