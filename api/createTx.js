import { CONFIG } from "../lib/config.js";
import { checkLimit } from "../lib/rateLimit.js";
import { verifyCaptcha } from "../lib/captcha.js";

export default async function handler(req, res){

  const ip = req.headers["x-forwarded-for"] || "unknown";

  if(!checkLimit(ip)){
    return res.json({ error:"Too many requests" });
  }

  const { wallet, amount, captcha } = req.body;

  if(!wallet || !amount || !captcha){
    return res.json({ error:"Invalid request" });
  }

  const human = await verifyCaptcha(captcha);

  if(!human){
    return res.json({ error:"Captcha failed" });
  }

  if(amount < CONFIG.MIN_SOL || amount > CONFIG.MAX_SOL){
    return res.json({ error:"Invalid amount" });
  }

  return res.json({
    to: CONFIG.RECEIVER,
    amount
  });
}
