# Riot RSO / WR Forge

Set these Vercel environment variables for the Riot account connection:

- `RIOT_RSO_CLIENT_ID`
- `RIOT_RSO_CLIENT_SECRET` **or** `RIOT_RSO_CLIENT_ASSERTION`
- `RIOT_RSO_REDIRECT_URI` = `https://YOUR-DOMAIN/api/riot/callback`
- `RIOT_SESSION_SECRET` = long random secret

The Riot Developer Portal must have the exact callback URL registered. RSO requires an approved production application and RSO client. Never put the Riot client secret in `VITE_*` variables or browser code.

Wild Rift match monitoring remains behind the Riot-approved data access layer; the current public Riot API catalog exposes League of Legends RSO match endpoints, not a documented public Wild Rift match-history endpoint. The frontend therefore shows the connection status without pretending that Wild Rift match data is available when it is not.
