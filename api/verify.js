import { createClient } from "@supabase/supabase-js";
import { verifyTx } from "../lib/verifyTx.js";
import {
  USD_TO_WAR,
  MIN_USD,
  MAX_USD,
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

    // anti double
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
      return res.json({ error:check.error });
    }

    // ambil harga SOL
    const r = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
    );

    const priceData = await r.json();
    const solPrice = priceData.solana.usd;

    const usd = check.sol * solPrice;

    if(usd < MIN_USD) return res.json({ error:"min $0.5" });
    if(usd > MAX_USD) return res.json({ error:"max $50" });

    const war = Math.floor(usd * USD_TO_WAR);

    // cek supply
    const { data:all } = await supabase
      .from("presale")
      .select("war");

    const totalWar = all.reduce((a,b)=>a+(b.war||0),0);

    if(totalWar + war > MAX_SUPPLY){
      return res.json({ error:"SOLD OUT" });
    }

    await supabase.from("presale").insert([
      { wallet, usd, war, signature }
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
