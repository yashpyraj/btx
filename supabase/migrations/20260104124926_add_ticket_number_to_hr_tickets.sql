/*
  # Add Ticket Number to HR Tickets

  1. Changes
    - Add `ticket_number` column to `hr_tickets` table for user-friendly ticket identification
    - Add sequence to auto-generate ticket numbers in format HR-XXXXX
    - Add index on ticket_number for fast lookups

  2. Purpose
    - Allows users to easily reference their tickets with a readable ID
    - Enables ticket status lookup by ticket number
*/

CREATE SEQUENCE IF NOT EXISTS hr_ticket_number_seq START WITH 10001;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'hr_tickets' AND column_name = 'ticket_number'
  ) THEN
    ALTER TABLE hr_tickets ADD COLUMN ticket_number text UNIQUE DEFAULT 'HR-' || nextval('hr_ticket_number_seq')::text;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_hr_tickets_ticket_number ON hr_tickets(ticket_number);
