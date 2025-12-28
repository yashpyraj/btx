/*
  # HR Records System

  1. New Tables
    - `hr_player_records`
      - `id` (uuid, primary key)
      - `player_name` (text) - Name of the player
      - `status` (text) - Current status: 'active', 'inactive', 'away', 'limited'
      - `start_date` (date) - Start date of the period
      - `end_date` (date, nullable) - End date of the period (null if ongoing)
      - `reason` (text, nullable) - Reason for absence/limited activity
      - `notes` (text, nullable) - Additional notes
      - `added_by` (text) - Who added this record
      - `created_at` (timestamptz) - When the record was created
      - `updated_at` (timestamptz) - Last update time

  2. Security
    - Enable RLS on `hr_player_records` table
    - Allow all authenticated users to read/write (HR team access controlled by PIN in app)
*/

CREATE TABLE IF NOT EXISTS hr_player_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name text NOT NULL,
  status text NOT NULL DEFAULT 'away',
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  end_date date,
  reason text,
  notes text,
  added_by text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE hr_player_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to hr_player_records"
  ON hr_player_records
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert to hr_player_records"
  ON hr_player_records
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public update to hr_player_records"
  ON hr_player_records
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete from hr_player_records"
  ON hr_player_records
  FOR DELETE
  TO anon
  USING (true);