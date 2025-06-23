
-- Enable RLS on tables that don't have it yet
ALTER TABLE public.dynamic_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_exercises ENABLE ROW LEVEL SECURITY;

-- 1. Policies for user_achievements
-- Users can view their own achievements
CREATE POLICY "Users can view their own achievements" 
ON public.user_achievements 
FOR SELECT 
USING (auth.uid() = user_id);

-- Only system/backend can insert achievements (no user INSERT policy)
-- This prevents users from giving themselves achievements

-- Users can view achievement details by joining
CREATE POLICY "Users can view achievement details" 
ON public.dynamic_achievements 
FOR SELECT 
TO authenticated 
USING (true);

-- Only admins can manage dynamic achievements
CREATE POLICY "Only admins can manage dynamic achievements" 
ON public.dynamic_achievements 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND is_admin = true
  )
);

-- 2. Policies for friendships
-- Users can view friendships where they participate
CREATE POLICY "Users can view their friendships" 
ON public.friendships 
FOR SELECT 
USING (auth.uid() = user_a OR auth.uid() = user_b);

-- Users can create friendship requests
CREATE POLICY "Users can create friendship requests" 
ON public.friendships 
FOR INSERT 
WITH CHECK (auth.uid() = user_a);

-- Users can update friendships where they participate (to accept/reject)
CREATE POLICY "Users can update their friendships" 
ON public.friendships 
FOR UPDATE 
USING (auth.uid() = user_a OR auth.uid() = user_b);

-- Users can delete friendships where they participate
CREATE POLICY "Users can delete their friendships" 
ON public.friendships 
FOR DELETE 
USING (auth.uid() = user_a OR auth.uid() = user_b);

-- 3. Policies for user_metrics
-- Users can view their own metrics
CREATE POLICY "Users can view their own metrics" 
ON public.user_metrics 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can insert their own metrics
CREATE POLICY "Users can insert their own metrics" 
ON public.user_metrics 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can update their own metrics
CREATE POLICY "Users can update their own metrics" 
ON public.user_metrics 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Users can delete their own metrics
CREATE POLICY "Users can delete their own metrics" 
ON public.user_metrics 
FOR DELETE 
USING (auth.uid() = user_id);

-- 4. Policies for workout_exercises
-- Users can view exercises from their own workouts
CREATE POLICY "Users can view their workout exercises" 
ON public.workout_exercises 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.workouts 
    WHERE id = workout_exercises.workout_id 
    AND user_id = auth.uid()
  )
);

-- Users can insert exercises to their own workouts
CREATE POLICY "Users can insert their workout exercises" 
ON public.workout_exercises 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.workouts 
    WHERE id = workout_exercises.workout_id 
    AND user_id = auth.uid()
  )
);

-- Users can update exercises from their own workouts
CREATE POLICY "Users can update their workout exercises" 
ON public.workout_exercises 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.workouts 
    WHERE id = workout_exercises.workout_id 
    AND user_id = auth.uid()
  )
);

-- Users can delete exercises from their own workouts
CREATE POLICY "Users can delete their workout exercises" 
ON public.workout_exercises 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.workouts 
    WHERE id = workout_exercises.workout_id 
    AND user_id = auth.uid()
  )
);

-- 5. Complete RLS for user_recommendations (missing INSERT, UPDATE, DELETE)
-- Users can insert their own recommendations (though typically system-generated)
CREATE POLICY "Users can insert their own recommendations" 
ON public.user_recommendations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can update their own recommendations (e.g., mark as read)
CREATE POLICY "Users can update their own recommendations" 
ON public.user_recommendations 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Users can delete their own recommendations
CREATE POLICY "Users can delete their own recommendations" 
ON public.user_recommendations 
FOR DELETE 
USING (auth.uid() = user_id);

-- Admins can manage all recommendations
CREATE POLICY "Admins can manage all recommendations" 
ON public.user_recommendations 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND is_admin = true
  )
);
