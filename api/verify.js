import { verifyTx } from "../lib/verifyTx.js";
import { CONFIG } from "../lib/config.js";
import { checkLimit } from "../lib/rateLimit.js";

const used = new Set();

export default async function handler(req, res){

  const ip = req.headers["x-forwarded-for"] || "unknown";

  if(!checkLimit(ip)){
    return res.json({ error:"Too many requests" });
  }

  const { signature, wallet } = req.body;

  if(used.has(signature)){
    return res.json({ error:"Already used" });
  }

  const result = await verifyTx(signature, wallet);

  if(!result.ok){
    return res.json({ error:"Invalid tx" });
  }

  if(result.sol < CONFIG.MIN_SOL || result.sol > CONFIG.MAX_SOL){
    return res.json({ error:"Invalid amount" });
  }

  used.add(signature);

  const war = result.sol * CONFIG.RATE;

  res.json({ success:true, war });
}
