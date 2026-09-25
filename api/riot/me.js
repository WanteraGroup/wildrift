import crypto from 'node:crypto'

const DEFAULT_ORIGIN='https://wild-rift-build-forge.vercel.app'

function getCookie(req,name){
  const row=(req.headers.cookie||'').split(';').map(x=>x.trim()).find(x=>x.startsWith(name+'='))
  return row?decodeURIComponent(row.slice(name.length+1)):null
}
function sessionKey(){
  const secret=process.env.RIOT_SESSION_SECRET
  if(!secret||secret.length<32)throw new Error('RIOT_SESSION_SECRET_MISSING_OR_TOO_SHORT')
  return crypto.createHash('sha256').update(secret).digest()
}
function open(value){
  const [ivB,tagB,bodyB]=String(value||'').split('.')
  if(!ivB||!tagB||!bodyB)throw new Error('INVALID_SESSION')
  const decipher=crypto.createDecipheriv('aes-256-gcm',sessionKey(),Buffer.from(ivB,'base64url'))
  decipher.setAuthTag(Buffer.from(tagB,'base64url'))
  return JSON.parse(Buffer.concat([decipher.update(Buffer.from(bodyB,'base64url')),decipher.final()]).toString('utf8'))
}
function seal(value){
  const iv=crypto.randomBytes(12)
  const cipher=crypto.createCipheriv('aes-256-gcm',sessionKey(),iv)
  const body=Buffer.concat([cipher.update(JSON.stringify(value),'utf8'),cipher.final()])
  const tag=cipher.getAuthTag()
  return [iv,tag,body].map(x=>x.toString('base64url')).join('.')
}
async function refreshSession(session){
  if(!session.refreshToken)return null
  const clientId=process.env.RIOT_RSO_CLIENT_ID
  const clientSecret=process.env.RIOT_RSO_CLIENT_SECRET
  if(!clientId||!clientSecret)return null
  const headers={'Content-Type':'application/x-www-form-urlencoded',Authorization:'Basic '+Buffer.from(clientId+':'+clientSecret).toString('base64')}
  const form=new URLSearchParams({grant_type:'refresh_token',refresh_token:session.refreshToken})
  const r=await fetch('https://auth.riotgames.com/token',{method:'POST',headers,body:form})
  const raw=await r.text()
  let data={}
  try{data=JSON.parse(raw)}catch{}
  if(!r.ok||!data.access_token)return null
  return {accessToken:data.access_token,refreshToken:data.refresh_token||session.refreshToken,expiresAt:Date.now()+((data.expires_in||600)*1000)}
}
async function account(accessToken){
  const r=await fetch('https://europe.api.riotgames.com/riot/account/v1/accounts/me',{headers:{Authorization:'Bearer '+accessToken}})
  const raw=await r.text()
  let data={}
  try{data=JSON.parse(raw)}catch{}
  return {r,data}
}
export default async function handler(req,res){
  try{
    const raw=getCookie(req,'riot_session')
    if(!raw)return res.status(401).json({connected:false,status:'not_connected'})
    let session=open(raw)
    if(!session.accessToken)return res.status(401).json({connected:false,status:'invalid_session'})
    let result=await account(session.accessToken)
    if((result.r.status===401||result.r.status===403)&&session.refreshToken){
      const refreshed=await refreshSession(session)
      if(refreshed){
        session=refreshed
        result=await account(session.accessToken)
        if(result.r.ok){
          const cookie='riot_session='+seal(session)+'; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000'
          res.setHeader('Set-Cookie',cookie)
        }
      }
    }
    if(!result.r.ok){
      return res.status(result.r.status===429?429:401).json({connected:false,status:'riot_api_error',riotStatus:result.r.status,riotError:result.data?.status?.message||result.data?.message||'Riot session unavailable'})
    }
    const a=result.data
    return res.status(200).json({
      connected:true,
      status:'connected',
      account:{gameName:a.gameName||'',tagLine:a.tagLine||'',puuid:a.puuid||''},
      monitor:{status:'connected',wildRiftMatchFeed:'not_available_via_public_riot_api',lastSync:new Date().toISOString()}
    })
  }catch(e){
    return res.status(500).json({connected:false,status:'server_error',error:e?.message||'unknown_error'})
  }
}
