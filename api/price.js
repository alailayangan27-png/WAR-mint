export default async function handler(req, res){
  const r = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
  );
  const data = await r.json();

  res.json({ price: data.solana.usd });
}
