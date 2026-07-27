-- ═══ Nexus LMS Triggers & Functions ═══

-- 1. Function to calculate and update ranks for a quiz attempt
CREATE OR REPLACE FUNCTION calculate_quiz_rank()
RETURNS TRIGGER AS $$
BEGIN
  -- We recalculate ranks for ALL attempts of this specific quiz_id
  -- Rank is based on: Score (descending), then Time Taken (ascending)
  
  WITH RankedAttempts AS (
    SELECT id,
           RANK() OVER (
             PARTITION BY quiz_id 
             ORDER BY score DESC, time_taken ASC
           ) as new_rank
    FROM quiz_attempts
    WHERE quiz_id = NEW.quiz_id
  )
  UPDATE quiz_attempts qa
  SET rank = ra.new_rank
  FROM RankedAttempts ra
  WHERE qa.id = ra.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to run rank calculation after every new attempt
DROP TRIGGER IF EXISTS update_quiz_rank_trigger ON quiz_attempts;
CREATE TRIGGER update_quiz_rank_trigger
AFTER INSERT OR UPDATE ON quiz_attempts
FOR EACH ROW
EXECUTE FUNCTION calculate_quiz_rank();


-- 2. Cron Job equivalent via pg_cron (Optional depending on Supabase tier)
-- Set enrollments to 'expired' if expiry_date has passed
-- Since pg_cron might require specific Supabase setup, a simpler approach 
-- is validating expiry on the frontend or via Edge Functions, but here is the SQL:

/*
SELECT cron.schedule('expire_enrollments', '0 0 * * *', $$
  UPDATE enrollments
  SET status = 'expired'
  WHERE status IN ('temp', 'active') 
    AND expiry_date < NOW();
$$);
*/
