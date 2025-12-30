/*
  # Add write policies for calendar events

  1. Security Changes
    - Add INSERT policy for anonymous users to create events
    - Add UPDATE policy for anonymous users to update events
    - Add DELETE policy for anonymous users to delete events
    
  Note: The admin panel has PIN protection at the application level.
  These policies allow the frontend to perform CRUD operations.
*/

CREATE POLICY "Anyone can insert calendar events"
  ON calendar_events
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update calendar events"
  ON calendar_events
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete calendar events"
  ON calendar_events
  FOR DELETE
  TO anon, authenticated
  USING (true);
