export async function verifyCaptcha(token){

  const secret = process.env.TURNSTILE_SECRET;

  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify",{
    method:"POST",
    headers:{ "Content-Type":"application/x-www-form-urlencoded" },
    body: `secret=${secret}&response=${token}`
  });

  const data = await res.json();

  return data.success;
}
