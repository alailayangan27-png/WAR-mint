import { verifyTx } from "../lib/verifyTx.js";
import { CONFIG } from "../lib/config.js";

const used = new Set();
let total = 0;

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
      return res.json({ error:"Invalid tx" });
    }

    if(result.sol < CONFIG.MIN_SOL || result.sol > CONFIG.MAX_SOL){
      return res.json({ error:"Invalid amount" });
    }

    used.add(signature);

    const war = result.sol * CONFIG.RATE;
    total += war;

    res.json({
      success:true,
      war,
      total
    });

  }catch(e){
    res.json({ error:e.message });
  }
}
