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

  if(!data.result) return { ok:false };

  let lamports = 0;
  let valid = false;

  for(const ix of data.result.transaction.message.instructions){
    if(ix.parsed && ix.parsed.type === "transfer"){
      if(ix.parsed.info.destination === RECEIVER){
        lamports = ix.parsed.info.lamports;
        valid = true;
      }
    }
  }

  if(!valid) return { ok:false };

  return { ok:true, sol: lamports / 1e9 };
}
