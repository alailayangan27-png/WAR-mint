import { CONFIG } from "./config.js";

export async function verifyTx(signature, wallet){

  const res = await fetch(CONFIG.RPC,{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({
      jsonrpc:"2.0",
      id:1,
      method:"getTransaction",
      params:[signature, "jsonParsed"]
    })
  });

  const data = await res.json();

  if(!data.result) return { ok:false };

  if(data.result.meta?.err !== null){
    return { ok:false };
  }

  let valid = false;
  let lamports = 0;

  for(const ix of data.result.transaction.message.instructions){

    if(ix.parsed?.type === "transfer"){

      const info = ix.parsed.info;

      if(
        info.destination === CONFIG.RECEIVER &&
        info.source === wallet
      ){
        lamports = info.lamports;
        valid = true;
      }
    }
  }

  if(!valid) return { ok:false };

  return {
    ok:true,
    sol: lamports / 1e9
  };
}
