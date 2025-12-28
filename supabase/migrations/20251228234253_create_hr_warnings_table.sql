/*
  # HR Warnings System

  1. New Tables
    - `hr_warnings`
      - `id` (uuid, primary key)
      - `player_name` (text) - Name of the player
      - `warning_type` (text) - Type: 'verbal', 'written', 'final'
      - `warning_date` (date) - Date of warning
      - `reason` (text) - Reason for warning
      - `notes` (text, nullable) - Additional notes
      - `issued_by` (text) - Who issued the warning
      - `created_at` (timestamptz) - When the record was created

  2. Security
    - Enable RLS on `hr_warnings` table
    - Allow public access (PIN protected in app)
*/

CREATE TABLE IF NOT EXISTS hr_warnings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name text NOT NULL,
  warning_type text NOT NULL DEFAULT 'verbal',
  warning_date date NOT NULL DEFAULT CURRENT_DATE,
  reason text NOT NULL,
  notes text,
  issued_by text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE hr_warnings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to hr_warnings"
  ON hr_warnings
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert to hr_warnings"
  ON hr_warnings
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public update to hr_warnings"
  ON hr_warnings
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete from hr_warnings"
  ON hr_warnings
  FOR DELETE
  TO anon
  USING (true);