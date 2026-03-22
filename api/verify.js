import { verifyTx } from "../lib/verifyTx.js";
import { CONFIG } from "../lib/config.js";

const used = new Set();

export default async function handler(req, res){

  try{

    const { signature, wallet } = req.body;

    if(!signature || !wallet){
      return res.json({ error:"Invalid request" });
    }

    if(used.has(signature)){
      return res.json({ error:"Already used" });
    }

    const result = await verifyTx(signature, wallet);

    if(!result.ok){
      return res.json({ error:"Invalid transaction" });
    }

    if(result.sol < CONFIG.MIN_SOL || result.sol > CONFIG.MAX_SOL){
      return res.json({ error:"Invalid amount" });
    }

    used.add(signature);

    const war = result.sol * CONFIG.RATE;

    return res.json({
      success:true,
      war
    });

  }catch(e){
    return res.json({ error:e.message });
  }
}
