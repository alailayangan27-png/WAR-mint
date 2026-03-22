const rateLimit = new Map();

export function checkLimit(ip){

  const now = Date.now();

  if(!rateLimit.has(ip)){
    rateLimit.set(ip, []);
  }

  const logs = rateLimit.get(ip).filter(t => now - t < 10000);

  if(logs.length > 15){
    return false;
  }

  logs.push(now);
  rateLimit.set(ip, logs);

  return true;
}
