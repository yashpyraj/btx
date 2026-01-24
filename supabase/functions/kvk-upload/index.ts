import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (req.method === "GET") {
      const { data: uploads, error } = await supabase
        .from("kvk_uploads")
        .select("*")
        .order("upload_date", { ascending: false });

      if (error) throw error;

      return new Response(JSON.stringify({ uploads }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (req.method === "DELETE") {
      const { uploadId } = await req.json();

      const { error } = await supabase
        .from("kvk_uploads")
        .delete()
        .eq("id", uploadId);

      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (req.method === "POST") {
      const { csvData, uploadDate, filename } = await req.json();

      if (!csvData || !uploadDate) {
        return new Response(
          JSON.stringify({ error: "Missing csvData or uploadDate" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const lines = csvData.split("\n");
      const headers = lines[0].split(",").map((h: string) => h.trim());

      const columnIndexes: Record<string, number> = {};
      headers.forEach((header: string, index: number) => {
        columnIndexes[header] = index;
      });

      const { data: uploadData, error: uploadError } = await supabase
        .from("kvk_uploads")
        .insert({
          filename: filename || `kvk_${uploadDate}.csv`,
          upload_date: uploadDate,
          record_count: 0,
        })
        .select()
        .single();

      if (uploadError) throw uploadError;

      const players: Record<string, unknown>[] = [];

      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;

        const values = lines[i].split(",");
        const lordId = parseInt(values[columnIndexes["lord_id"]]) || 0;
        if (!lordId) continue;

        players.push({
          upload_id: uploadData.id,
          lord_id: lordId,
          name: values[columnIndexes["name"]] || "",
          alliance_id: parseInt(values[columnIndexes["alliance_id"]]) || null,
          alliance_tag: values[columnIndexes["alliance_tag"]] || "",
          town_center: parseInt(values[columnIndexes["town_center"]]) || 0,
          home_server: values[columnIndexes["home_server"]] || "",
          power: parseInt(values[columnIndexes["power"]]) || 0,
          highest_power: parseInt(values[columnIndexes["highest_power"]]) || 0,
          units_killed: parseInt(values[columnIndexes["units_killed"]]) || 0,
          faction: values[columnIndexes["faction"]] || "",
          merits: parseInt(values[columnIndexes["merits"]]) || 0,
          legion_power: parseInt(values[columnIndexes["legion_power"]]) || 0,
          tech_power: parseInt(values[columnIndexes["tech_power"]]) || 0,
          building_power: parseInt(values[columnIndexes["building_power"]]) || 0,
          hero_power: parseInt(values[columnIndexes["hero_power"]]) || 0,
          units_dead: parseInt(values[columnIndexes["units_dead"]]) || 0,
          units_healed: parseInt(values[columnIndexes["units_healed"]]) || 0,
          city_sieges: parseInt(values[columnIndexes["city_sieges"]]) || 0,
          defeats: parseInt(values[columnIndexes["defeats"]]) || 0,
          victories: parseInt(values[columnIndexes["victories"]]) || 0,
          gold_spent: parseInt(values[columnIndexes["gold_spent"]]) || 0,
          wood_spent: parseInt(values[columnIndexes["wood_spent"]]) || 0,
          stone_spent: parseInt(values[columnIndexes["stone_spent"]]) || 0,
          mana_spent: parseInt(values[columnIndexes["mana_spent"]]) || 0,
          gems_spent: parseInt(values[columnIndexes["gems_spent"]]) || 0,
          killcount_t5: parseInt(values[columnIndexes["killcount_t5"]]) || 0,
          killcount_t4: parseInt(values[columnIndexes["killcount_t4"]]) || 0,
          killcount_t3: parseInt(values[columnIndexes["killcount_t3"]]) || 0,
          killcount_t2: parseInt(values[columnIndexes["killcount_t2"]]) || 0,
          killcount_t1: parseInt(values[columnIndexes["killcount_t1"]]) || 0,
          resources_given: parseInt(values[columnIndexes["resources_given"]]) || 0,
          helps_given: parseInt(values[columnIndexes["helps_given"]]) || 0,
        });
      }

      const batchSize = 500;
      for (let i = 0; i < players.length; i += batchSize) {
        const batch = players.slice(i, i + batchSize);
        const { error: insertError } = await supabase
          .from("kvk_player_stats")
          .insert(batch);

        if (insertError) throw insertError;
      }

      await supabase
        .from("kvk_uploads")
        .update({ record_count: players.length })
        .eq("id", uploadData.id);

      return new Response(
        JSON.stringify({
          success: true,
          uploadId: uploadData.id,
          recordCount: players.length,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
