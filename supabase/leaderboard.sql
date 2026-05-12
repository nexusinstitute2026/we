-- ═══ Leaderboard: student_points Table ═══

-- Drop if rebuilding
DROP TABLE IF EXISTS student_points CASCADE;

CREATE TABLE student_points (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  source_id UUID NOT NULL,  -- Quiz/Assignment/Activity ID
  category_type TEXT CHECK (category_type IN ('quiz', 'assignment', 'activity')),
  points_earned NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_sp_course ON student_points (course_id);
CREATE INDEX idx_sp_subject ON student_points (subject_id);
CREATE INDEX idx_sp_student ON student_points (student_id);
CREATE INDEX idx_sp_created ON student_points (created_at);
CREATE INDEX idx_sp_lookup ON student_points (course_id, subject_id, created_at);

-- RLS
ALTER TABLE student_points ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read for authenticated" ON student_points FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Insert for authenticated" ON student_points FOR INSERT WITH CHECK (auth.role() = 'authenticated');
-- Students cannot UPDATE or DELETE — only backend can

-- ═══ Prevent duplicate points for same source ═══
ALTER TABLE student_points ADD CONSTRAINT unique_student_source UNIQUE (student_id, source_id);


-- ═══ RPC 1: Overall Leaderboard ═══
CREATE OR REPLACE FUNCTION get_leaderboard_overall(p_limit INT DEFAULT 50)
RETURNS TABLE (
  student_id UUID,
  full_name TEXT,
  total_points NUMERIC,
  rank BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    sp.student_id,
    p.full_name,
    SUM(sp.points_earned) AS total_points,
    DENSE_RANK() OVER (ORDER BY SUM(sp.points_earned) DESC) AS rank
  FROM student_points sp
  JOIN profiles p ON p.id = sp.student_id
  GROUP BY sp.student_id, p.full_name
  ORDER BY total_points DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ═══ RPC 2: Course Leaderboard ═══
CREATE OR REPLACE FUNCTION get_leaderboard_course(p_course_id UUID, p_limit INT DEFAULT 50)
RETURNS TABLE (
  student_id UUID,
  full_name TEXT,
  total_points NUMERIC,
  rank BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    sp.student_id,
    p.full_name,
    SUM(sp.points_earned) AS total_points,
    DENSE_RANK() OVER (ORDER BY SUM(sp.points_earned) DESC) AS rank
  FROM student_points sp
  JOIN profiles p ON p.id = sp.student_id
  WHERE sp.course_id = p_course_id
  GROUP BY sp.student_id, p.full_name
  ORDER BY total_points DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ═══ RPC 3: Subject Leaderboard ═══
CREATE OR REPLACE FUNCTION get_leaderboard_subject(p_subject_id UUID, p_limit INT DEFAULT 50)
RETURNS TABLE (
  student_id UUID,
  full_name TEXT,
  total_points NUMERIC,
  rank BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    sp.student_id,
    p.full_name,
    SUM(sp.points_earned) AS total_points,
    DENSE_RANK() OVER (ORDER BY SUM(sp.points_earned) DESC) AS rank
  FROM student_points sp
  JOIN profiles p ON p.id = sp.student_id
  WHERE sp.subject_id = p_subject_id
  GROUP BY sp.student_id, p.full_name
  ORDER BY total_points DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ═══ RPC 4: Monthly Leaderboard ═══
CREATE OR REPLACE FUNCTION get_leaderboard_monthly(p_year INT, p_month INT, p_limit INT DEFAULT 50)
RETURNS TABLE (
  student_id UUID,
  full_name TEXT,
  total_points NUMERIC,
  rank BIGINT
) AS $$
DECLARE
  v_start TIMESTAMPTZ;
  v_end   TIMESTAMPTZ;
BEGIN
  v_start := make_timestamptz(p_year, p_month, 1, 0, 0, 0, 'UTC');
  v_end   := v_start + INTERVAL '1 month';

  RETURN QUERY
  SELECT
    sp.student_id,
    p.full_name,
    SUM(sp.points_earned) AS total_points,
    DENSE_RANK() OVER (ORDER BY SUM(sp.points_earned) DESC) AS rank
  FROM student_points sp
  JOIN profiles p ON p.id = sp.student_id
  WHERE sp.created_at >= v_start AND sp.created_at < v_end
  GROUP BY sp.student_id, p.full_name
  ORDER BY total_points DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ═══ RPC 5: My Rank (any scope) ═══
CREATE OR REPLACE FUNCTION get_my_rank_overall(p_student_id UUID)
RETURNS TABLE (rank BIGINT, total_points NUMERIC) AS $$
BEGIN
  RETURN QUERY
  WITH ranked AS (
    SELECT
      sp.student_id,
      SUM(sp.points_earned) AS total_points,
      DENSE_RANK() OVER (ORDER BY SUM(sp.points_earned) DESC) AS rank
    FROM student_points sp
    GROUP BY sp.student_id
  )
  SELECT r.rank, r.total_points FROM ranked r WHERE r.student_id = p_student_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
