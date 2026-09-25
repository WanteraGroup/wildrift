import crypto from 'node:crypto'

const DEFAULT_ORIGIN='https://wild-rift-build-forge.vercel.app'

export default function handler(req,res){
  const clientId=process.env.RIOT_RSO_CLIENT_ID
  const redirectUri=process.env.RIOT_RSO_REDIRECT_URI || DEFAULT_ORIGIN+'/api/riot/callback'
  if(!clientId){
    return res.status(500).json({ok:false,error:'RIOT_RSO_CLIENT_ID nincs beállítva a Vercel környezetben.'})
  }
  if(!/^https:\/\//.test(redirectUri)){
    return res.status(500).json({ok:false,error:'RIOT_RSO_REDIRECT_URI érvénytelen.'})
  }
  const state=crypto.randomBytes(32).toString('hex')
  const cookie=[
    'riot_oauth_state='+state,
    'Path=/api/riot',
    'HttpOnly',
    'Secure',
    'SameSite=Lax',
    'Max-Age=600'
  ].join('; ')
  res.setHeader('Set-Cookie',cookie)
  const url=new URL('https://auth.riotgames.com/authorize')
  url.searchParams.set('client_id',clientId)
  url.searchParams.set('redirect_uri',redirectUri)
  url.searchParams.set('response_type','code')
  url.searchParams.set('scope','openid offline_access')
  url.searchParams.set('state',state)
  res.redirect(302,url.toString())
}
