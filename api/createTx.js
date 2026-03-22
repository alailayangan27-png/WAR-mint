import { supabase } from "../lib/db.js";

export default async function handler(req, res){

  const { wallet, amount } = req.body;

  if(!wallet || !amount){
    return res.json({ error:"Invalid request" });
  }

  if(amount < 0.1 || amount > 1){
    return res.json({ error:"Invalid amount" });
  }

  const { data } = await supabase
    .from("mints")
    .select("*")
    .eq("wallet", wallet)
    .single();

  let total = data?.total_sol || 0;

  if(total + amount > 1){
    return res.json({
      error:"Max 1 SOL per wallet reached"
    });
  }

  return res.json({
    to: process.env.RECEIVER
  });
}
