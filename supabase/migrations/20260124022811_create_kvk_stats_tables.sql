/*
  # KvK Stats Database Schema

  1. New Tables
    - `kvk_uploads` - Stores metadata about each uploaded CSV file
      - `id` (uuid, primary key)
      - `filename` (text) - Original filename
      - `upload_date` (date) - The date the data represents
      - `record_count` (integer) - Number of records in the upload
      - `created_at` (timestamptz) - When the upload was created
    
    - `kvk_player_stats` - Stores individual player statistics
      - `id` (uuid, primary key)
      - `upload_id` (uuid, foreign key) - References kvk_uploads
      - `lord_id` (bigint) - Player's lord ID
      - `name` (text) - Player name
      - `alliance_id` (bigint) - Alliance ID
      - `alliance_tag` (text) - Alliance tag
      - `town_center` (integer) - Town center level
      - `home_server` (text) - Home server number
      - `power` (bigint) - Current power
      - `highest_power` (bigint) - Highest power achieved
      - `units_killed` (bigint) - Total units killed
      - `faction` (text) - Player faction
      - `merits` (bigint) - Merits earned
      - `legion_power` (bigint) - Legion power
      - `tech_power` (bigint) - Tech power
      - `building_power` (bigint) - Building power
      - `hero_power` (bigint) - Hero power
      - `units_dead` (bigint) - Units dead
      - `units_healed` (bigint) - Units healed
      - `city_sieges` (integer) - City sieges
      - `defeats` (integer) - Defeats
      - `victories` (integer) - Victories
      - `gold_spent` (bigint) - Gold spent
      - `wood_spent` (bigint) - Wood spent
      - `stone_spent` (bigint) - Stone spent
      - `mana_spent` (bigint) - Mana spent
      - `gems_spent` (bigint) - Gems spent
      - `killcount_t5` (bigint) - T5 kills
      - `killcount_t4` (bigint) - T4 kills
      - `killcount_t3` (bigint) - T3 kills
      - `killcount_t2` (bigint) - T2 kills
      - `killcount_t1` (bigint) - T1 kills
      - `resources_given` (bigint) - Resources given
      - `helps_given` (integer) - Helps given
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access
    - Admin write access handled via service role
*/

CREATE TABLE IF NOT EXISTS kvk_uploads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  upload_date date NOT NULL,
  record_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS kvk_player_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  upload_id uuid NOT NULL REFERENCES kvk_uploads(id) ON DELETE CASCADE,
  lord_id bigint NOT NULL,
  name text NOT NULL,
  alliance_id bigint,
  alliance_tag text,
  town_center integer,
  home_server text NOT NULL,
  power bigint DEFAULT 0,
  highest_power bigint DEFAULT 0,
  units_killed bigint DEFAULT 0,
  faction text,
  merits bigint DEFAULT 0,
  legion_power bigint DEFAULT 0,
  tech_power bigint DEFAULT 0,
  building_power bigint DEFAULT 0,
  hero_power bigint DEFAULT 0,
  units_dead bigint DEFAULT 0,
  units_healed bigint DEFAULT 0,
  city_sieges integer DEFAULT 0,
  defeats integer DEFAULT 0,
  victories integer DEFAULT 0,
  gold_spent bigint DEFAULT 0,
  wood_spent bigint DEFAULT 0,
  stone_spent bigint DEFAULT 0,
  mana_spent bigint DEFAULT 0,
  gems_spent bigint DEFAULT 0,
  killcount_t5 bigint DEFAULT 0,
  killcount_t4 bigint DEFAULT 0,
  killcount_t3 bigint DEFAULT 0,
  killcount_t2 bigint DEFAULT 0,
  killcount_t1 bigint DEFAULT 0,
  resources_given bigint DEFAULT 0,
  helps_given integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_kvk_player_stats_upload_id ON kvk_player_stats(upload_id);
CREATE INDEX IF NOT EXISTS idx_kvk_player_stats_lord_id ON kvk_player_stats(lord_id);
CREATE INDEX IF NOT EXISTS idx_kvk_player_stats_home_server ON kvk_player_stats(home_server);
CREATE INDEX IF NOT EXISTS idx_kvk_player_stats_name ON kvk_player_stats(name);
CREATE INDEX IF NOT EXISTS idx_kvk_uploads_upload_date ON kvk_uploads(upload_date);

ALTER TABLE kvk_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE kvk_player_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read kvk uploads"
  ON kvk_uploads
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can read kvk player stats"
  ON kvk_player_stats
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Service role can insert kvk uploads"
  ON kvk_uploads
  FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can insert kvk player stats"
  ON kvk_player_stats
  FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can delete kvk uploads"
  ON kvk_uploads
  FOR DELETE
  TO service_role
  USING (true);

CREATE POLICY "Service role can delete kvk player stats"
  ON kvk_player_stats
  FOR DELETE
  TO service_role
  USING (true);
