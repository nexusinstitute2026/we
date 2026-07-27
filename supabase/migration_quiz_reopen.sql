-- ─────────────────────────────────────────────────────────────────────────────
-- Migration: Add is_reopened column to quizzes table
-- Run this in the Supabase SQL Editor
-- ─────────────────────────────────────────────────────────────────────────────

-- Add is_reopened column (defaults to false for all existing quizzes)
ALTER TABLE public.quizzes
  ADD COLUMN IF NOT EXISTS is_reopened BOOLEAN NOT NULL DEFAULT FALSE;

-- Optional index for faster lookup
CREATE INDEX IF NOT EXISTS idx_quizzes_is_reopened ON public.quizzes (is_reopened);
