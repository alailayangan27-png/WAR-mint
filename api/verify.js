import { supabase } from "../lib/db.js";
import { verifyTx } from "../lib/verifyTx.js";

export default async function handler(req, res){

  const { wallet, signature } = req.body;

  const tx = await verifyTx(signature, wallet);

  if(!tx.ok){
    return res.json({ error:"Invalid tx" });
  }

  const sol = tx.sol;

  const { data } = await supabase
    .from("mints")
    .select("*")
    .eq("wallet", wallet)
    .single();

  const total = data?.total_sol || 0;

  if(total + sol > 1){
    return res.json({ error:"Limit exceeded" });
  }

  await supabase.from("mints").upsert({
    wallet,
    total_sol: total + sol
  });

  return res.json({
    success:true,
    sol
  });
}
