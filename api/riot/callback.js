import crypto from 'node:crypto'

const DEFAULT_ORIGIN='https://wild-rift-build-forge.vercel.app'

function cookies(req){
  return Object.fromEntries((req.headers.cookie||'').split(';').filter(Boolean).map(x=>{
    const i=x.indexOf('=')
    return [x.slice(0,i).trim(),decodeURIComponent(x.slice(i+1))]
  }))
}
function sessionKey(){
  const secret=process.env.RIOT_SESSION_SECRET
  if(!secret||secret.length<32)throw new Error('RIOT_SESSION_SECRET_MISSING_OR_TOO_SHORT')
  return crypto.createHash('sha256').update(secret).digest()
}
function seal(value){
  const iv=crypto.randomBytes(12)
  const cipher=crypto.createCipheriv('aes-256-gcm',sessionKey(),iv)
  const body=Buffer.concat([cipher.update(JSON.stringify(value),'utf8'),cipher.final()])
  const tag=cipher.getAuthTag()
  return [iv,tag,body].map(x=>x.toString('base64url')).join('.')
}
function safeMessage(value){
  const s=String(value||'').replace(/[\r\n]/g,' ').trim()
  return s.slice(0,500)
}
export default async function handler(req,res){
  try{
    const {code,state,error,error_description}=req.query||{}
    if(error){
      return res.status(400).send('Riot RSO hiba: '+safeMessage(error_description||error))
    }
    const c=cookies(req)
    if(!code||!state||state!==c.riot_oauth_state){
      return res.status(400).send('Érvénytelen Riot OAuth állapot. Indítsd újra a csatlakozást.')
    }
    const clientId=process.env.RIOT_RSO_CLIENT_ID
    const clientSecret=process.env.RIOT_RSO_CLIENT_SECRET
    const clientAssertion=process.env.RIOT_RSO_CLIENT_ASSERTION
    const redirectUri=process.env.RIOT_RSO_REDIRECT_URI || DEFAULT_ORIGIN+'/api/riot/callback'
    if(!clientId||(!clientSecret&&!clientAssertion))return res.status(500).send('A Riot RSO backend környezeti változói hiányosak: client ID + secret/assertion szükséges.')
    if(!process.env.RIOT_SESSION_SECRET||process.env.RIOT_SESSION_SECRET.length<32)return res.status(500).send('RIOT_SESSION_SECRET hiányzik vagy túl rövid. Állíts be legalább 32 karakteres titkot Vercelben.')
    const form=new URLSearchParams({grant_type:'authorization_code',code:String(code),redirect_uri:redirectUri})
    const headers={'Content-Type':'application/x-www-form-urlencoded'}
    if(clientAssertion){
      form.set('client_assertion_type','urn:ietf:params:oauth:client-assertion-type:jwt-bearer')
      form.set('client_assertion',clientAssertion)
    }else{
      headers.Authorization='Basic '+Buffer.from(clientId+':'+clientSecret).toString('base64')
    }
    const tokenResponse=await fetch('https://auth.riotgames.com/token',{method:'POST',headers,body:form})
    const raw=await tokenResponse.text()
    let tokens={}
    try{tokens=JSON.parse(raw)}catch{}
    if(!tokenResponse.ok){
      const detail=tokens.error_description||tokens.error||'ismeretlen Riot token hiba'
      return res.status(502).send('Riot token exchange sikertelen: '+safeMessage(detail))
    }
    if(!tokens.access_token)return res.status(502).send('Riot nem adott access tokent.')
    const session=seal({accessToken:tokens.access_token,refreshToken:tokens.refresh_token||null,expiresAt:Date.now()+((tokens.expires_in||600)*1000)})
    const secure='riot_session='+session+'; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000'
    const cleared='riot_oauth_state=; Path=/api/riot; HttpOnly; Secure; SameSite=Lax; Max-Age=0'
    res.setHeader('Set-Cookie',[secure,cleared])
    res.redirect(302,'/?riot=connected')
  }catch(e){
    res.status(500).send('Riot RSO callback hiba: '+safeMessage(e?.message||e))
  }
}
