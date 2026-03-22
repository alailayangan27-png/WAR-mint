import { CONFIG } from "../lib/config.js";

export default async function handler(req, res){

  try{

    const { wallet, amount } = req.body;

    if(!wallet || !amount){
      return res.json({ error:"Invalid request" });
    }

    if(amount < CONFIG.MIN_SOL || amount > CONFIG.MAX_SOL){
      return res.json({ error:"Invalid amount" });
    }

    return res.json({
      to: CONFIG.RECEIVER,
      amount
    });

  }catch(e){
    res.json({ error:e.message });
  }
}
