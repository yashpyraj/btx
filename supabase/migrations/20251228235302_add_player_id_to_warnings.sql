/*
  # Add Player ID to Warnings Table

  1. Changes
    - Add `player_id` column to `hr_warnings` table
    - This allows tracking players by their in-game ID

  2. Notes
    - Column is nullable for backwards compatibility with existing records
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'hr_warnings' AND column_name = 'player_id'
  ) THEN
    ALTER TABLE hr_warnings ADD COLUMN player_id text;
  END IF;
END $$;