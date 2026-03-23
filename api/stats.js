import { supabase } from "../lib/db.js";

export default async function handler(req, res){

  const { data } = await supabase
    .from("mints")
    .select("total_sol");

  let total = 0;

  for(const row of data || []){
    total += row.total_sol;
  }

  const war = total * 100000;

  res.json({
    total: war
  });
}
