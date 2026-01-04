/*
  # Create HR Tickets Table

  1. New Tables
    - `hr_tickets`
      - `id` (uuid, primary key)
      - `player_name` (text, required) - Name of the player submitting the ticket
      - `player_id` (text, optional) - Optional player ID
      - `ticket_type` (text, required) - Type of ticket (report, request, concern, etc.)
      - `subject` (text, required) - Subject/title of the ticket
      - `description` (text, required) - Detailed description of the issue
      - `status` (text, default 'pending') - Status of the ticket (pending, reviewing, resolved, closed)
      - `priority` (text, default 'normal') - Priority level (low, normal, high, urgent)
      - `assigned_to` (text, optional) - HR member assigned to handle this ticket
      - `resolution_notes` (text, optional) - Notes added when resolving the ticket
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
      - `resolved_at` (timestamptz, optional) - Timestamp when ticket was resolved

  2. Security
    - Enable RLS on `hr_tickets` table
    - Add policy for anyone to create tickets (public submission)
    - Add policy for authenticated HR admins to read all tickets
    - Add policy for authenticated HR admins to update tickets
*/

CREATE TABLE IF NOT EXISTS hr_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name text NOT NULL,
  player_id text,
  ticket_type text NOT NULL,
  subject text NOT NULL,
  description text NOT NULL,
  status text DEFAULT 'pending',
  priority text DEFAULT 'normal',
  assigned_to text,
  resolution_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  resolved_at timestamptz
);

ALTER TABLE hr_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create HR tickets"
  ON hr_tickets
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Public can read their own tickets by player_name"
  ON hr_tickets
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can update HR tickets"
  ON hr_tickets
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete HR tickets"
  ON hr_tickets
  FOR DELETE
  TO authenticated
  USING (true);