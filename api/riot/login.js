import crypto from 'node:crypto'

export default function handler(req,res){
  const clientId=process.env.RIOT_RSO_CLIENT_ID||process.env.VITE_RIOT_CLIENT_ID
  const baseUrl=(process.env.RIOT_RSO_REDIRECT_URI||'').replace(/\\/riot\\/callback$/,'')
  if(!clientId){
    return res.status(500).json({error:'RIOT_RSO_CLIENT_ID nincs beállítva a Vercel környezetben.'})
  }
  const redirectUri=process.env.RIOT_RSO_REDIRECT_URI||((baseUrl||'https://wild-rift-build-forge.vercel.app')+'/riot/callback')
  const state=crypto.randomBytes(32).toString('hex')
  res.setHeader('Set-Cookie',`riot_oauth_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`)
  const url=new URL('https://auth.riotgames.com/authorize')
  url.searchParams.set('client_id',clientId)
  url.searchParams.set('redirect_uri',redirectUri)
  url.searchParams.set('response_type','code')
  url.searchParams.set('scope','openid offline_access')
  url.searchParams.set('state',state)
  res.writeHead(302,{Location:url.toString()})
  res.end()
}
