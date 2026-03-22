import { createClient } from "@supabase/supabase-js";
import { verifyTx } from "../lib/verifyTx.js";
import {
  MIN_SOL,
  MAX_SOL,
  SOL_TO_WAR,
  MAX_SUPPLY
} from "../lib/config.js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

export default async function handler(req, res){

  try{

    const { wallet, signature } = req.body;

    if(!wallet || !signature){
      return res.json({ error:"data tidak lengkap" });
    }

    const { data:exist } = await supabase
      .from("presale")
      .select("*")
      .eq("signature", signature)
      .single();

    if(exist){
      return res.json({ error:"tx sudah digunakan" });
    }

    const check = await verifyTx(signature);

    if(!check.ok){
      return res.json({ error:"tx tidak valid" });
    }

    const sol = check.sol;

    if(sol < MIN_SOL) return res.json({ error:"Min 0.1 SOL" });
    if(sol > MAX_SOL) return res.json({ error:"Max 1 SOL" });

    const war = Math.floor(sol * SOL_TO_WAR);

    const { data:all } = await supabase
      .from("presale")
      .select("war");

    const totalWar = all.reduce((a,b)=>a+(b.war||0),0);

    if(totalWar + war > MAX_SUPPLY){
      return res.json({ error:"SOLD OUT" });
    }

    await supabase.from("presale").insert([
      { wallet, sol, war, signature }
    ]);

    res.json({
      success:true,
      war,
      totalWar: totalWar + war
    });

  }catch(err){
    res.json({ error: err.message });
  }
}
