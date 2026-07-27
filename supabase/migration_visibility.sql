-- Migration: Add Visibility and Payment Controls

-- Add is_hidden to sections
ALTER TABLE sections ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN DEFAULT false;

-- Add is_hidden to categories
ALTER TABLE categories ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN DEFAULT false;

-- Add is_hidden to subjects
ALTER TABLE subjects ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN DEFAULT false;

-- Add is_hidden and payments_paused to courses
ALTER TABLE courses ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN DEFAULT false;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS payments_paused BOOLEAN DEFAULT false;

-- Add is_closed to quizzes
ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS is_closed BOOLEAN DEFAULT false;
