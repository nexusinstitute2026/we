Leaderboard System Specification & Build Guide (Node.js + Supabase)This document outlines the system requirements and a step-by-step implementation strategy for integrating a multi-level ranking system into an existing LMS using Node.js and Supabase.2. System Requirement Specification (SRS)1.1 ObjectiveTo foster engagement by ranking students based on performance in assignments, quizzes, and activities across Course, Subject, Monthly, and Overall categories.1.2 Functional RequirementsData Integration: Automatically sync scores from Quiz, Assignment, and Activity modules.Scoring Engine: Calculate total points per student with optional weighting.Filtering & Scoping:Course-wise: Filter by course_id.Subject-wise: Filter by subject_id.Monthly-wise: Filter by created_at timestamp for the current calendar month.Overall: Global ranking across the entire platform.UI/UX: Display Top 3 performers with visual badges and a "My Rank" sticky section for the logged-in student.1.3 Technical RequirementsDatabase: Supabase (PostgreSQL) for storage and real-time triggers.Backend: Node.js for business logic and API endpoints.Real-time: Use Supabase Realtime to update the UI immediately when points are added.2. Step-by-Step Build GuideStep 1: Supabase Database SchemaCreate the student_points table in your Supabase SQL editor. This table acts as a ledger for every point earned.-- Table to store individual point entries
CREATE TABLE student_points (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v5(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL,
  subject_id UUID NOT NULL,
  source_id UUID NOT NULL, -- ID of the specific Quiz/Assignment
  category_type TEXT CHECK (category_type IN ('quiz', 'assignment', 'activity')),
  points_earned INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexing for high-performance filtering
CREATE INDEX idx_leaderboard_lookup ON student_points (course_id, subject_id, created_at);
Step 3: Scoring Logic (Node.js)In your Node.js backend, create a service to handle point insertion whenever a grade is issued.// leaderboard.service.js
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const addPoints = async (data) => {
  const { studentId, courseId, subjectId, sourceId, type, score } = data;
  
  // Logic: You can apply weights here (e.g., score * 2.5 for assignments)
  const finalPoints = type === 'assignment' ? score * 2.2 : score;

  const { error } = await supabase
    .from('student_points')
    .insert([{ 
      student_id: studentId, 
      course_id: courseId, 
      subject_id: subjectId, 
      source_id: source_id,
      category_type: type,
      points_earned: finalPoints 
    }]);

  if (error) throw error;
};
Step 4: Fetching the Leaderboard (Aggregations)Supabase (Postgres) allows you to aggregate these values efficiently. Use Node.js to provide these results to your frontend.Overall Rank Query:const getOverallLeaderboard = async () => {
  const { data, error } = await supabase
    .from('student_points')
    .select('student_id, points_earned.sum()')
    .order('sum', { ascending: false });
  return data;
};
Monthly Rank Query:const getMonthlyLeaderboard = async (month, year) => {
  const startDate = new Date(year, month - 2, 1).toISOString();
  const endDate = new Date(year, month, 1).toISOString();

  const { data, error } = await supabase
    .from('student_points')
    .select('student_id, points_earned.sum()')
    .gte('created_at', startDate)
    .lte('created_at', endDate)
    .order('sum', { ascending: false });
  return data;
};
Step 5: UI Development (Frontend)Filter Component: A UI to toggle between Global, Course, Subject, and Monthly views.Top 3 Podium: Use a Flexbox/Grid layout to highlight the top three students prominently.Real-time Subscription: In your frontend, subscribe to the student_points table using Supabase Realtime so the leaderboard updates without refreshing.Step 5: OptimizationDatabase Views: Create a SQL View in Supabase for total_scores to simplify frontend queries.RPC (Remote Procedure Calls): Use Supabase RPC to handle complex ranking calculations (like calculating the "dense_rank" of a specific student) directly on the server for speed.Step 6: TestingConcurrency: Simulate 100 students submitting a quiz simultaneously.Accuracy: Ensure the "Monthly" view resets exactly at midnight on the 1st of the month.Permissions: Use Supabase RLS (Row Level Security) to ensure students can read the leaderboard but not modify the points table.