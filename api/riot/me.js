import crypto from 'node:crypto'

function getCookie(req,name){
  const row=(req.headers.cookie||'').split(';').map(x=>x.trim()).find(x=>x.startsWith(name+'='))
  return row?decodeURIComponent(row.slice(name.length+1)):null
}
function open(value){
  const [ivB,tagB,bodyB]=String(value||'').split('.')
  if(!ivB||!tagB||!bodyB)throw Error()
  const key=crypto.createHash('sha256').update(process.env.RIOT_SESSION_SECRET||'CHANGE_ME_RIOT_SESSION_SECRET').digest()
  const decipher=crypto.createDecipheriv('aes-256-gcm',key,Buffer.from(ivB,'base64url'))
  decipher.setAuthTag(Buffer.from(tagB,'base64url'))
  return JSON.parse(Buffer.concat([decipher.update(Buffer.from(bodyB,'base64url')),decipher.final()]).toString('utf8'))
}
export default async function handler(req,res){
  try{
    const raw=getCookie(req,'riot_session')
    if(!raw)return res.status(401).json({connected:false})
    const session=open(raw)
    if(!session.accessToken)return res.status(401).json({connected:false})
    const r=await fetch('https://europe.api.riotgames.com/riot/account/v1/accounts/me',{headers:{Authorization:'Bearer '+session.accessToken}})
    const account=await r.json()
    if(!r.ok)return res.status(401).json({connected:false,error:'Riot session expired or unavailable'})
    return res.status(200).json({connected:true,account:{gameName:account.gameName||'',tagLine:account.tagLine||'',puuid:account.puuid||''},monitor:{status:'connected',wildRiftMatchFeed:'not_available_via_public_riot_api',lastSync:new Date().toISOString()}})
  }catch(e){return res.status(401).json({connected:false})}
}
