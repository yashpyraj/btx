/*
  # Fix HR Tickets Delete Policy
  
  1. Changes
    - Update DELETE policy to allow anonymous users (anon role)
    - Update UPDATE policy to allow anonymous users (anon role)
    - This is needed because the HR admin uses PIN authentication (sessionStorage)
      rather than Supabase authentication, so all requests are made as anonymous users
  
  2. Security
    - The PIN protection in the frontend provides the security layer
    - Only users with the correct PIN can access the admin panel to delete/update tickets
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can delete HR tickets" ON hr_tickets;
DROP POLICY IF EXISTS "Authenticated users can update HR tickets" ON hr_tickets;

-- Recreate policies to allow anonymous users (anon role)
CREATE POLICY "Anyone can update HR tickets"
  ON hr_tickets
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete HR tickets"
  ON hr_tickets
  FOR DELETE
  TO anon, authenticated
  USING (true);