/*
  # Create Calendar Events Table

  1. New Tables
    - `calendar_events`
      - `id` (uuid, primary key)
      - `title` (text, required) - Event title
      - `description` (text) - Event description
      - `start_date` (timestamptz, required) - Event start date/time
      - `end_date` (timestamptz) - Event end date/time
      - `all_day` (boolean) - Whether event is all-day
      - `color` (text) - Event color for display
      - `category` (text) - Event category (meeting, event, reminder, deadline)
      - `location` (text) - Event location
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `calendar_events` table
    - Add policy for public read access (events are visible to all)
    - Admin operations handled via service role
*/

CREATE TABLE IF NOT EXISTS calendar_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  start_date timestamptz NOT NULL,
  end_date timestamptz,
  all_day boolean DEFAULT false,
  color text DEFAULT '#3b82f6',
  category text DEFAULT 'event',
  location text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view calendar events"
  ON calendar_events
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Service role can manage events"
  ON calendar_events
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);