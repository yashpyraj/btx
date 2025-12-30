/*
  # HR Player Notes System

  1. New Tables
    - `hr_player_notes`
      - `id` (uuid, primary key)
      - `player_name` (text) - Name of the player
      - `player_id` (text, nullable) - Optional player ID
      - `note` (text) - The note content
      - `category` (text) - Note category: 'general', 'performance', 'behavior', 'positive', 'concern'
      - `added_by` (text) - Who added this note
      - `created_at` (timestamptz) - When the note was created
      - `updated_at` (timestamptz) - Last update time

  2. Security
    - Enable RLS on `hr_player_notes` table
    - Allow public access (PIN protected in app)

  3. Important Notes
    - Notes are for general tracking and documentation
    - Can be categorized for better organization
    - Includes timestamp for audit trail
*/

CREATE TABLE IF NOT EXISTS hr_player_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name text NOT NULL,
  player_id text,
  note text NOT NULL,
  category text NOT NULL DEFAULT 'general',
  added_by text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE hr_player_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to hr_player_notes"
  ON hr_player_notes
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert to hr_player_notes"
  ON hr_player_notes
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public update to hr_player_notes"
  ON hr_player_notes
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete from hr_player_notes"
  ON hr_player_notes
  FOR DELETE
  TO anon
  USING (true);