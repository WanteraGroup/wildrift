import crypto from 'node:crypto'

function cookies(req){
  return Object.fromEntries((req.headers.cookie||'').split(';').filter(Boolean).map(x=>{
    const i=x.indexOf('=')
    return [x.slice(0,i).trim(),decodeURIComponent(x.slice(i+1))]
  }))
}
function seal(value){
  const key=crypto.createHash('sha256').update(process.env.RIOT_SESSION_SECRET||'CHANGE_ME_RIOT_SESSION_SECRET').digest()
  const iv=crypto.randomBytes(12)
  const cipher=crypto.createCipheriv('aes-256-gcm',key,iv)
  const body=Buffer.concat([cipher.update(JSON.stringify(value),'utf8'),cipher.final()])
  const tag=cipher.getAuthTag()
  return [iv,tag,body].map(x=>x.toString('base64url')).join('.')
}
export default async function handler(req,res){
  try{
    const {code,state,error}=req.query||{}
    if(error)return res.status(400).send(`Riot RSO hiba: ${error}`)
    const c=cookies(req)
    if(!code||!state||state!==c.riot_oauth_state)return res.status(400).send('Érvénytelen Riot OAuth állapot. Indítsd újra a csatlakozást.')
    const clientId=process.env.RIOT_RSO_CLIENT_ID
    const clientSecret=process.env.RIOT_RSO_CLIENT_SECRET
    const clientAssertion=process.env.RIOT_RSO_CLIENT_ASSERTION
    const redirectUri=process.env.RIOT_RSO_REDIRECT_URI
    if(!clientId||!redirectUri||(!clientSecret&&!clientAssertion))return res.status(500).send('A Riot RSO backend környezeti változói hiányosak.')
    const form=new URLSearchParams({grant_type:'authorization_code',code:String(code),redirect_uri:redirectUri})
    const headers={'Content-Type':'application/x-www-form-urlencoded'}
    if(clientAssertion){
      form.set('client_assertion_type','urn:ietf:params:oauth:client-assertion-type:jwt-bearer')
      form.set('client_assertion',clientAssertion)
    }else{
      headers.Authorization='Basic '+Buffer.from(clientId+':'+clientSecret).toString('base64')
    }
    const tokenResponse=await fetch('https://auth.riotgames.com/token',{method:'POST',headers,body:form})
    const tokens=await tokenResponse.json()
    if(!tokenResponse.ok)return res.status(502).send('Riot token exchange sikertelen.')
    const session=seal({accessToken:tokens.access_token,refreshToken:tokens.refresh_token||null,expiresAt:Date.now()+((tokens.expires_in||600)*1000)})
    const secure=`riot_session=${session}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000`
    res.setHeader('Set-Cookie',[secure,'riot_oauth_state=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0'])
    res.writeHead(302,{Location:'/riot/callback'})
    res.end()
  }catch(e){res.status(500).send('Riot RSO callback hiba.')}
}
