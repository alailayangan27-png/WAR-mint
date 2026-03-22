import { RPC, RECEIVER } from "./config.js";

export async function verifyTx(signature){

  const res = await fetch(RPC,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      jsonrpc:"2.0",
      id:1,
      method:"getTransaction",
      params:[signature,"jsonParsed"]
    })
  });

  const data = await res.json();

  if(!data.result) return { ok:false, error:"tx not found" };

  const instructions = data.result.transaction.message.instructions;

  let lamports = 0;
  let valid = false;

  for(const ix of instructions){
    if(ix.parsed && ix.parsed.type === "transfer"){
      const info = ix.parsed.info;

      if(info.destination === RECEIVER){
        lamports = info.lamports;
        valid = true;
      }
    }
  }

  if(!valid) return { ok:false, error:"wrong receiver" };

  return {
    ok:true,
    sol: lamports / 1e9
  };
}
