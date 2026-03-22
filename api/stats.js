import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

export default async function handler(req, res){

  const { data } = await supabase
    .from("presale")
    .select("wallet, war");

  const totalWar = data.reduce((a,b)=>a+(b.war||0),0);

  const uniqueWallets = new Set(data.map(i=>i.wallet));

  res.json({
    totalWar,
    totalMinters: uniqueWallets.size
  });
}
