import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const champions = [
  {id:'ahri',name:'Ahri',role:'Mid',type:'AP',tags:['Mage','Burst'],c1:'#d95cff',c2:'#4936b8'},
  {id:'zed',name:'Zed',role:'Mid',type:'AD',tags:['Assassin','Burst'],c1:'#ef476f',c2:'#24242e'},
  {id:'lee',name:'Lee Sin',role:'Jungle',type:'AD',tags:['Fighter','Assassin'],c1:'#d68b39',c2:'#5c261b'},
  {id:'darius',name:'Darius',role:'Baron',type:'AD',tags:['Fighter','Tank'],c1:'#d83c49',c2:'#41131a'},
  {id:'malphite',name:'Malphite',role:'Baron',type:'AP/Tank',tags:['Tank','Mage'],c1:'#75879c',c2:'#273240'},
  {id:'jinx',name:'Jinx',role:'Dragon',type:'AD',tags:['Marksman'],c1:'#36d5ff',c2:'#c43d9c'},
  {id:'thresh',name:'Thresh',role:'Support',type:'Tank',tags:['Support','Tank'],c1:'#50e4aa',c2:'#163f47'},
  {id:'lux',name:'Lux',role:'Support',type:'AP',tags:['Mage','Support'],c1:'#ffe37b',c2:'#6f72dd'},
  {id:'vayne',name:'Vayne',role:'Dragon',type:'AD',tags:['Marksman'],c1:'#7e89ff',c2:'#252b5e'},
  {id:'morgana',name:'Morgana',role:'Support',type:'AP',tags:['Mage','Support'],c1:'#8d5ce6',c2:'#24103e'},
  {id:'hwei',name:'Hwei',role:'Mid',type:'AP',tags:['Mage','Burst'],c1:'#f35d6d',c2:'#28206e'},
  {id:'sylas',name:'Sylas',role:'Mid',type:'AP',tags:['Mage','Fighter'],c1:'#cf9b55',c2:'#2a2b3e'},
  {id:'reksai',name:'Rek’Sai',role:'Jungle',type:'AD',tags:['Fighter','Assassin'],c1:'#e2675d',c2:'#3a1a25'},
  {id:'yunara',name:'Yunara',role:'Dragon',type:'AD',tags:['Marksman'],c1:'#7bd7ff',c2:'#3d2c82'},
  {id:'chogath',name:'Cho’Gath',role:'Baron',type:'Tank',tags:['Tank','Fighter'],c1:'#8b5b9b',c2:'#201323'},
  {id:'kaisa',name:'Kai’Sa',role:'Dragon',type:'AD',tags:['Marksman'],c1:'#8b70ff',c2:'#292047'},
  {id:'xin',name:'Xin Zhao',role:'Jungle',type:'AD',tags:['Fighter'],c1:'#e7a34a',c2:'#44311b'}
]

const itemPools={
  AD:['Fiendhunter Bolts','Yun Tal Wildarrows','Infinity Edge','Mortal Reminder','Guardian Angel','Gluttonous Greaves'],
  AP:['Luden’s Echo','Infinity Orb','Rabadon’s Deathcap','Void Staff','Zhonya’s Hourglass','Mana Boots'],
  Tank:['Sunfire Aegis','Thornmail','Amaranth’s Twinguard','Force of Nature','Randuin’s Omen','Plated Steelcaps']
}
const itemMeta={
  'Fiendhunter Bolts':{tags:['crit','as','ad'],counters:['squishy','tank']},
  'Yun Tal Wildarrows':{tags:['crit','ad','bleed'],counters:['squishy']},
  'Infinity Edge':{tags:['crit','ad','crit-damage'],counters:['squishy']},
  'Mortal Reminder':{tags:['anti-heal','armor-pen','ad'],counters:['heal','tank']},
  'Guardian Angel':{tags:['ad','defense','revive'],counters:['assassin','burst']},
  'Gluttonous Greaves':{tags:['ad','lifesteal'],counters:['poke']},
  'Luden’s Echo':{tags:['ap','burst'],counters:['squishy']},
  'Infinity Orb':{tags:['ap','magic-pen','execute'],counters:['squishy']},
  'Rabadon’s Deathcap':{tags:['ap','scaling'],counters:['squishy']},
  'Void Staff':{tags:['ap','magic-pen'],counters:['mr','tank']},
  'Zhonya’s Hourglass':{tags:['ap','stasis','defense'],counters:['assassin','burst']},
  'Mana Boots':{tags:['ap','mana'],counters:['poke']},
  'Sunfire Aegis':{tags:['tank','hp','armor'],counters:['ad','melee']},
  'Thornmail':{tags:['tank','armor','anti-heal'],counters:['ad','heal']},
  'Amaranth’s Twinguard':{tags:['tank','resist'],counters:['burst']},
  'Force of Nature':{tags:['tank','mr'],counters:['ap','poke']},
  'Randuin’s Omen':{tags:['tank','armor','crit-defense'],counters:['crit']},
  'Plated Steelcaps':{tags:['armor','basic-attack-defense'],counters:['ad']}
}
const runes={
  Burst:['Electrocute','Sudden Impact','Mark of the Weak','Eyeball Collector'],
  DPS:['Conqueror','Brutal','Coup de Grace','Legend: Alacrity'],
  Tank:['Aftershock','Courage of the Colossus','Bone Plating','Overgrowth'],
  Safe:['Fleet Footwork','Brutal','Second Wind','Sweet Tooth'],
  Utility:['Summon Aery','Weakness','Bone Plating','Manaflow Band']
}
const roles=['All','Baron','Jungle','Mid','Dragon','Support']
const playstyles=['Burst','DPS','Tank','Safe','Utility']
const championDataUrl='https://ry2x.github.io/WildRift-Merged-Champion-Data/data_en_US.json'
const communityDragonBase='https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default'
const championIconIds={Ahri:103,Zed:238,'Lee Sin':64,Darius:122,Malphite:54,Jinx:222,Thresh:412,Lux:99,Vayne:67,Morgana:25,Hwei:910,Sylas:517,'Rek’Sai':421,Yunara:166,'Cho’Gath':31,'Kai’Sa':145,'Xin Zhao':5}
const itemIconUrls={'Fiendhunter Bolts':communityDragonBase+'/assets/items/icons2d/2512_adcallin.png','Yun Tal Wildarrows':communityDragonBase+'/assets/items/icons2d/3032_yuntalwildarrows.png','Infinity Edge':communityDragonBase+'/assets/items/icons2d/3031_marksman_t3_infinityedge.png','Mortal Reminder':communityDragonBase+'/assets/items/icons2d/3033_marksman_t3_mortalreminder.png','Guardian Angel':communityDragonBase+'/assets/items/icons2d/3026_fighter_t3_guardianangel.png','Gluttonous Greaves':communityDragonBase+'/assets/items/icons2d/3008_gluttonousgreaves.png','Luden’s Echo':communityDragonBase+'/assets/items/icons2d/6655_mage_t4_ludenstempest.png','Infinity Orb':communityDragonBase+'/assets/items/icons2d/3916_mage_t2_oblivionorb.png','Rabadon’s Deathcap':communityDragonBase+'/assets/items/icons2d/3089_mage_t3_deathcap.png','Void Staff':communityDragonBase+'/assets/items/icons2d/3135_mage_t3_voidstaff.png','Zhonya’s Hourglass':communityDragonBase+'/assets/items/icons2d/3157_mage_t3_zhonyashourglass.png','Mana Boots':'https://ddragon.leagueoflegends.com/cdn/15.18.1/img/item/3020.png','Sunfire Aegis':communityDragonBase+'/assets/items/icons2d/3068_tank_t4_sunfireaegis.png','Thornmail':communityDragonBase+'/assets/items/icons2d/3075_tank_t3_thornmail.png','Amaranth’s Twinguard':'https://ddragon.leagueoflegends.com/cdn/15.18.1/img/item/2362.png','Force of Nature':communityDragonBase+'/assets/items/icons2d/4401_tank_t3_forceofnature.png','Randuin’s Omen':communityDragonBase+'/assets/items/icons2d/3143_tank_t3_randuinsomen.png','Plated Steelcaps':communityDragonBase+'/assets/items/icons2d/3047_class_t2_ninjatabi.png'}
const matchSeed=[
  {id:1,result:'WIN',champion:'Morgana',role:'Support',score:'8/3/14',kda:7.3,damage:18.4,gold:11.2,build:['Luden’s Echo','Infinity Orb','Zhonya’s Hourglass'],duration:'19:42',date:'Today'},
  {id:2,result:'WIN',champion:'Ahri',role:'Mid',score:'12/5/9',kda:4.2,damage:26.1,gold:13.7,build:['Luden’s Echo','Infinity Orb','Rabadon’s Deathcap'],duration:'22:18',date:'Yesterday'},
  {id:3,result:'LOSS',champion:'Jinx',role:'Dragon',score:'5/8/11',kda:2.0,damage:24.8,gold:12.1,build:['Fiendhunter Bolts','Yun Tal Wildarrows','Infinity Edge'],duration:'27:05',date:'Yesterday'},
  {id:4,result:'WIN',champion:'Lee Sin',role:'Jungle',score:'9/4/10',kda:4.8,damage:21.7,gold:11.9,build:['Fiendhunter Bolts','Yun Tal Wildarrows','Guardian Angel'],duration:'20:31',date:'2 days ago'},
  {id:5,result:'LOSS',champion:'Morgana',role:'Support',score:'2/7/18',kda:2.9,damage:13.2,gold:8.4,build:['Luden’s Echo','Zhonya’s Hourglass','Void Staff'],duration:'25:11',date:'3 days ago'}
]

function asset(path){return path && path.indexOf('/lol-game-data/assets')===0 ? communityDragonBase+path.replace('/lol-game-data/assets','') : path||''}
function championImage(c){return c.imageUrl||(championIconIds[c.name]?communityDragonBase+'/v1/champion-icons/'+championIconIds[c.name]+'.png':'')}
function itemImage(item){return itemIconUrls[item]||''}
function initials(name){return name.split(' ').slice(0,2).map(x=>x[0]).join('').toUpperCase()}
function normalizeChampion(raw,index){
  const rolesRaw=Array.isArray(raw.roles)?raw.roles:[], lanes=Array.isArray(raw.lanes)?raw.lanes:[]
  let role='Mid'
  if(lanes[0]==='Jungle')role='Jungle';else if(lanes[0]==='Top')role='Baron';else if(lanes[0]==='Support')role='Support';else if(lanes[0]==='AD')role='Dragon'
  const type=raw.type==='AP'?'AP':rolesRaw.indexOf('Tank')>=0?'Tank':'AD'
  return {id:raw.id||'live-'+index,name:raw.name||raw.id||'Champion',role,type,tags:rolesRaw,c1:'#36d8ff',c2:'#172d46',live:true,difficulty:raw.difficult,damage:raw.damage,survive:raw.survive,utility:raw.utility,imageUrl:asset(raw.squarePortraitPath||raw.imagePath||'')}
}
function scoreItem(name,threats,style){
  const meta=itemMeta[name];if(!meta)return 0
  let score=0
  threats.forEach(t=>{if(meta.tags.includes(t))score+=3;if(meta.counters.includes(t))score+=2})
  if(style==='Burst'&&meta.tags.includes('burst'))score+=3
  if(style==='DPS'&&meta.tags.some(t=>['as','crit','ad','scaling'].includes(t)))score+=2
  if(style==='Tank'&&meta.tags.some(t=>['tank','hp','armor','mr','resist'].includes(t)))score+=3
  return score
}
function readStore(key,fallback){try{const v=localStorage.getItem(key);return v?JSON.parse(v):fallback}catch{return fallback}}
function App(){
  const [tab,setTab]=useState('build'),[role,setRole]=useState('Mid'),[mine,setMine]=useState(champions[0]),[enemies,setEnemies]=useState([]),[playstyle,setPlaystyle]=useState('Burst'),[search,setSearch]=useState(''),[built,setBuilt]=useState(false)
  const [liveChampions,setLiveChampions]=useState([]),[dataStatus,setDataStatus]=useState('loading')
  const [saved,setSaved]=useState(()=>readStore('wrforge-saved',[])),[matches,setMatches]=useState(()=>readStore('wrforge-matches',matchSeed))
  const [profile,setProfile]=useState(()=>readStore('wrforge-profile',{connected:false,region:'EU',riotId:'',rank:'Unranked',lastSync:null}))
  const [connectMsg,setConnectMsg]=useState('')
  useEffect(()=>{let active=true;fetch(championDataUrl).then(r=>{if(!r.ok)throw Error();return r.json()}).then(data=>{if(!active)return;const n=Array.isArray(data)?data.filter(c=>c.is_wr!==false).map(normalizeChampion):[];if(n.length){setLiveChampions(n);setDataStatus('live')}else setDataStatus('fallback')}).catch(()=>active&&setDataStatus('fallback'));return()=>{active=false}},[])
  useEffect(()=>{try{localStorage.setItem('wrforge-saved',JSON.stringify(saved))}catch{}},[saved])
  useEffect(()=>{try{localStorage.setItem('wrforge-matches',JSON.stringify(matches))}catch{}},[matches])
  useEffect(()=>{try{localStorage.setItem('wrforge-profile',JSON.stringify(profile))}catch{}},[profile])
  const roster=liveChampions.length?liveChampions:champions
  const filtered=roster.filter(c=>{const q=search.trim().toLowerCase();return(role==='All'||c.role===role)&&(!q||c.name.toLowerCase().includes(q))})
  useEffect(()=>{if(!liveChampions.length)return;const exact=liveChampions.find(c=>c.name.toLowerCase()===mine.name.toLowerCase());if(exact)setMine(exact);else{const same=liveChampions.find(c=>c.role===role);if(same)setMine(same)}setEnemies([])},[liveChampions])
  const build=useMemo(()=>{
    const type=mine.type.includes('AP')?'AP':mine.type.includes('Tank')?'Tank':'AD',pool=itemPools[type].slice(),threats=[]
    const hasHeal=enemies.some(e=>['Darius','Aatrox','Morgana','Soraka'].includes(e.name)),hasCrit=enemies.some(e=>['Jinx','Yunara','Vayne','Kai’Sa'].includes(e.name))
    const apCount=enemies.filter(e=>e.type.includes('AP')).length,tankCount=enemies.filter(e=>e.tags.includes('Tank')).length,assassin=enemies.some(e=>e.tags.includes('Assassin'))
    if(hasHeal)threats.push('heal','anti-heal');if(hasCrit)threats.push('crit','basic-attack-defense');if(apCount)threats.push('ap','mr');if(tankCount)threats.push('tank','armor-pen');if(assassin)threats.push('assassin','burst')
    enemies.forEach(e=>e.tags.forEach(t=>{if(t==='Marksman')threats.push('armor','basic-attack-defense');if(t==='Assassin')threats.push('defense','stasis','revive');if(t==='Tank')threats.push('armor-pen','magic-pen','anti-heal');if(t==='Mage')threats.push('mr','defense','stasis');if(t==='Support')threats.push('anti-heal','defense');if(t==='Fighter')threats.push('anti-heal','armor-pen')}))
    const ranked=Object.keys(itemMeta).map(name=>({name,score:scoreItem(name,threats,playstyle)})).sort((a,b)=>b.score-a.score)
    if(ranked[0])pool[4]=ranked[0].name;if(ranked[1])pool[3]=ranked[1].name
    if(type==='AD'&&(hasHeal||tankCount>0))pool[1]='Mortal Reminder';if(type==='AP'&&tankCount>=2)pool[3]='Void Staff';if(type==='Tank'&&apCount>=2)pool[3]='Force of Nature';if(playstyle==='Tank'&&type!=='Tank')pool[4]='Guardian Angel'
    const stats={Damage:Math.min(99,(type==='AP'?91:89)+(playstyle==='Burst'?4:playstyle==='DPS'?3:0)+tankCount*2),DPS:Math.min(99,playstyle==='DPS'?95:(type==='AD'?86:82)+tankCount*3),Survival:Math.min(99,playstyle==='Tank'?94:(apCount>=2?82:72)+(assassin?6:0)),Utility:Math.min(99,playstyle==='Utility'?92+(hasHeal?2:0):(tankCount?74:68))}
    return {type,items:pool,runes:runes[playstyle],stats,score:Math.round(Object.values(stats).reduce((a,b)=>a+b,0)/4),threats:[apCount?apCount+' AP threat':'No major AP stack',tankCount?tankCount+' tank threat':'Low tank pressure',hasCrit?'Crit threat detected':'No major crit threat',assassin?'Assassin / burst threat':'No assassin threat']}
  },[mine,enemies,playstyle])
  const profileStats=useMemo(()=>{const total=matches.length,wins=matches.filter(m=>m.result==='WIN').length;return{total,wins,losses:total-wins,winrate:total?Math.round(wins/total*100):0,avgKda:total?(matches.reduce((s,m)=>s+m.kda,0)/total).toFixed(1):'0.0',avgDamage:total?(matches.reduce((s,m)=>s+m.damage,0)/total).toFixed(1):'0.0'}},[matches])
  function toggleEnemy(c){if(c.id===mine.id)return;const exists=enemies.some(e=>e.id===c.id);if(exists)setEnemies(enemies.filter(e=>e.id!==c.id));else if(enemies.length<5)setEnemies(enemies.concat(c))}
  function saveBuild(){setSaved(s=>s.concat({id:Date.now(),champion:mine.name,role,playstyle,items:build.items,score:build.score}))}
  function connectProfile(){
    const clientId=import.meta.env.VITE_RIOT_CLIENT_ID
    if(clientId){const redirect=encodeURIComponent(window.location.origin+'/riot/callback');window.location.href='https://auth.riotgames.com/authorize?client_id='+encodeURIComponent(clientId)+'&redirect_uri='+redirect+'&response_type=code&scope=openid%20offline_access'}
    else setConnectMsg('A felület kész az RSO-hoz, de a Riot Client ID még nincs konfigurálva. Jelszót ide soha ne írj be.')
  }
  function demoSync(){setProfile(p=>({...p,connected:true,riotId:'WR Forge Demo#EU',rank:'Diamond IV',lastSync:new Date().toISOString()}));setConnectMsg('Demo szinkron aktív. A valódi mérkőzésadatokhoz hivatalos Riot hozzáférés kell.')}
  function clearProfile(){setProfile({connected:false,region:'EU',riotId:'',rank:'Unranked',lastSync:null});setConnectMsg('Profilkapcsolat törölve erről az eszközről.')}
  function reset(){setBuilt(false);setEnemies([]);setPlaystyle('Burst')}
  return <div className="app">
    <header className="top"><div className="brand"><div className="brandmark">WR</div><div><b>WR FORGE</b><small>WILD RIFT BUILD & MATCH INTELLIGENCE</small></div></div><div className="actions"><div className="select">PATCH 7.3</div><button className="ghost" onClick={reset}>↻ Reset</button></div></header>
    <nav className="nav"><button className={tab==='build'?'active':''} onClick={()=>setTab('build')}>⚔ BUILD FORGE</button><button className={tab==='matches'?'active':''} onClick={()=>setTab('matches')}>◈ MATCH MONITOR</button><button className={tab==='profile'?'active':''} onClick={()=>setTab('profile')}>◎ MY PROFILE</button><button className={tab==='learn'?'active':''} onClick={()=>setTab('learn')}>▣ LEARN & IMPROVE</button></nav>
    <main className="container">
      <section className="hero"><div className="heroCard"><div className="kicker">MATCH-ADAPTIVE BUILD ENGINE</div><h1>BUILD YOUR<br/><span>GAME.</span></h1><p>Buildet készítünk az ellenfél-kompozíció, a szerep, a playstyle és a matchup alapján. Kezdőtől a profi elemzésig.</p><button className="forgeBtn" onClick={()=>{setTab('build');setBuilt(true)}}>⚔ BUILD MY GAME →</button></div><div className="heroCard patch"><div><div className="kicker">DATA & PROFILE LAYER</div><div className="note">{dataStatus==='live'?<span className="good">● CHAMPION DATA ONLINE</span>:dataStatus==='fallback'?<span className="danger">● LOCAL FALLBACK</span>:<span>● DATA LOADING...</span>}<br/>{profile.connected?<span className="good">● RIOT PROFILE CONNECTED</span>:<span>○ RIOT PROFILE NOT CONNECTED</span>}<br/>Builds · matches · improvement</div></div><strong>7.3</strong></div></section>

      {tab==='build'&&<section className="layout">
        <aside className="panel"><div className="panelTitle"><h2>01 / MATCH SETUP</h2><span className="muted">{enemies.length}/5 ENEMY</span></div>
          <div className="field"><div className="label">ROLE</div><div className="roles">{roles.map(r=><button key={r} className={'chip '+(role===r?'active':'')} onClick={()=>setRole(r)}>{r}</button>)}</div></div>
          <div className="field"><div className="label">MY CHAMPION</div><input className="search" placeholder="Champion keresés — pl. Morgana" value={search} onChange={e=>{const q=e.target.value;setSearch(q);const exact=roster.find(c=>c.name.toLowerCase()===q.trim().toLowerCase());if(exact)setMine(exact)}}/></div>
          <div className="selectedChampion" style={{borderColor:mine.c1||'#18c8ff'}}>
            <div className="portrait selectedPortrait" style={{'--c1':mine.c1,'--c2':mine.c2}}>{championImage(mine)?<img src={championImage(mine)} alt={mine.name}/>:<span>{initials(mine.name)}</span>}</div>
            <div><span className="selectedLabel">KIVÁLASZTVA</span><strong>{mine.name}</strong><small>{mine.role} · {mine.type}</small></div>
            <span className="selectedCheck">✓</span>
          </div>
          <div className="champGrid">{filtered.map(c=><button key={c.id} className={'champ '+(mine.id===c.id?'active':'')} onClick={()=>{setMine(c);setSearch(c.name)}}><div className="portrait" style={{'--c1':c.c1,'--c2':c.c2}}>{championImage(c)?<img src={championImage(c)} alt={c.name} loading="lazy"/>:<span>{initials(c.name)}</span>}</div><span>{c.name}</span></button>)}{!filtered.length&&<div className="noResults">Nincs találat: <b>{search}</b></div>}</div>
          <div className="field"><div className="label">ENEMY TEAM <span className="muted">({enemies.length}/5)</span></div><div className="enemyGrid">{[0,1,2,3,4].map(i=>{const e=enemies[i];return <div className={'enemySlot '+(e?'filled':'')} key={i} onClick={()=>e&&toggleEnemy(e)}>{e?<div><div className="portrait small" style={{'--c1':e.c1,'--c2':e.c2}}>{championImage(e)?<img src={championImage(e)} alt={e.name}/>:initials(e.name)}</div>{e.name}</div>:<span>+ enemy</span>}</div>})}</div></div>
          <div className="field"><div className="label">ADD / REMOVE ENEMY</div><div className="enemyPicker">{roster.filter(c=>c.id!==mine.id).map(c=><button key={c.id} title={c.name} className={'miniChamp '+(enemies.some(e=>e.id===c.id)?'active':'')} onClick={()=>toggleEnemy(c)}>{championImage(c)?<img src={championImage(c)} alt={c.name}/>:initials(c.name)}</button>)}</div></div>
          <div className="field"><div className="label">PLAYSTYLE</div><div className="styles">{playstyles.map(s=><button key={s} className={'chip '+(playstyle===s?'active':'')} onClick={()=>setPlaystyle(s)}>{s}</button>)}</div></div>
        </aside>
        <section className="results"><div className="panel"><div className="buildHeader"><div><div className="kicker">02 / GENERATED BUILD</div><h2>{mine.name} · {role}</h2><span className="muted">{playstyle} profile · {enemies.length} enemy</span></div><div className="score">BUILD SCORE {build.score}</div></div>
          {!built?<div className="emptyState">Állítsd be a meccset, majd nyomd meg a <b>BUILD MY GAME</b> gombot.</div>:<><div className="adviceBanner"><b>COACH ADVICE</b><span>{playstyle==='Burst'?'Keresd a rövid, kontrollált ablakokat; ne pazarold el az escape eszközöd az engage előtt.':playstyle==='DPS'?'Tartsd életben a DPS-ablakot: pozíció, folyamatos auto attack és célpontváltás a kulcs.':playstyle==='Tank'?'Te teremted meg a fight struktúráját. Ne csak sebzést tankolj: vedd el az ellenfél legfontosabb útvonalát.':playstyle==='Safe'?'A túlélés érték: farmolj stabilan, wardolj és csak akkor vállalj kockázatot, ha az előny mérhető.':'A csapat haszna az első: vision, peel, engage és cooldown-kezelés alapján játssz.'}</span></div><div className="items">{build.items.map((item,i)=><div className="item" key={i}><div className="itemIcon">{itemImage(item)?<img src={itemImage(item)} alt={item}/>:<span>{i===5?'BOOT':i+1}</span>}</div><b>{item}</b><small>{i<2?'CORE ITEM':i===5?'BOOTS':'SITUATIONAL'}</small></div>)}</div><div className="metric">{Object.entries(build.stats).map(([k,v])=><div className="metricBox" key={k}><span>{k}</span><strong>{v}</strong><div className="bar"><i style={{width:v+'%'}}/></div></div>)}</div></>}
        </div>
        {built&&<><div className="cols"><div className="panel"><div className="panelTitle"><h2>RUNES & SPELLS</h2></div>{build.runes.map((r,i)=><div className="rune" key={r}><div className="runeDot">{i+1}</div><b>{r}</b><span className="muted">recommended</span></div>)}<div className="spellRow"><span>FLASH</span><span>{playstyle==='Utility'?'EXHAUST':'IGNITE'}</span></div></div><div className="panel"><div className="panelTitle"><h2>COUNTER LOGIC</h2></div><p className="explain">Az engine threat tageket épít az enemy teamből, majd ezek alapján újrasúlyozza a situational slotokat.</p><div className="saved">{build.threats.map(t=><span className="chip active" key={t}>{t}</span>)}</div><p className="explain"><span className="good">✓</span> {playstyle} prioritás<br/><span className="good">✓</span> {enemies.length} ellenfél figyelembe véve</p></div></div>
        <div className="panel"><div className="panelTitle"><h2>SKILL ORDER & GAMEPLAN</h2><span className="muted">1 → 15</span></div><div className="skillRow">{['1','2','3','1','4','1','2','1','2','3','4','2','2','3','3'].map((x,i)=><div className="chip active" key={i}>{x}</div>)}</div><div className="tipsGrid"><div><b>EARLY GAME</b><p>Biztonságos wave-kezelés, matchup-specifikus trade és első power spike.</p></div><div><b>MID GAME</b><p>Objective előtt 30–45 mp vision, lane priority és cooldown check.</p></div><div><b>LATE GAME</b><p>A carry-k védelme és a fight első 3 másodperce dönti el a legtöbb helyzetet.</p></div></div></div>
        <div className="panel"><div className="panelTitle"><h2>WHY THIS BUILD</h2><button className="primary" onClick={saveBuild}>＋ MENTÉS</button></div><p className="explain">A build a <b>{mine.name}</b> sebzéstípusára, a <b>{playstyle}</b> profilra és a kiválasztott ellenfelekre reagál. A mentett build bekerül a saját build könyvtáradba.</p></div></>}
        </section>
      </section>}

      {tab==='matches'&&<section className="dashboard"><div className="sectionHead"><div><div className="kicker">MATCH MONITOR</div><h2>Saját meccseid és trendjeid</h2><p>Csatlakoztatott profil esetén ezt a nézetet a hivatalos adatforrásból érkező mérkőzésekkel lehet feltölteni.</p></div><button className="primary" onClick={()=>setTab('profile')}>PROFIL CSATLAKOZTATÁSA</button></div><div className="metric"><div className="metricBox"><span>MATCHES</span><strong>{profileStats.total}</strong></div><div className="metricBox"><span>WIN RATE</span><strong>{profileStats.winrate}%</strong></div><div className="metricBox"><span>AVG KDA</span><strong>{profileStats.avgKda}</strong></div><div className="metricBox"><span>AVG DAMAGE</span><strong>{profileStats.avgDamage}k</strong></div></div><div className="panel"><div className="panelTitle"><h2>RECENT MATCHES</h2><span className="muted">{profile.connected?'PROFILE SYNC':'DEMO DATA'}</span></div><div className="matchList">{matches.map(m=><div className="matchRow" key={m.id}><div className={'result '+(m.result==='WIN'?'win':'loss')}>{m.result}</div><div className="matchChamp"><div className="miniPortrait">{initials(m.champion)}</div><div><b>{m.champion}</b><small>{m.role} · {m.date}</small></div></div><div><span>KDA</span><b>{m.score}</b></div><div><span>DAMAGE</span><b>{m.damage}k</b></div><div><span>GOLD</span><b>{m.gold}k</b></div><div><span>TIME</span><b>{m.duration}</b></div><div className="buildMini">{m.build.map(x=><span key={x}>{x}</span>)}</div></div>)}</div></div><div className="cols"><div className="panel"><div className="panelTitle"><h2>COACH FLAGS</h2></div><ul className="coachList"><li><b>Deaths 5–10 perc között:</b> figyeld a wave állapotát és a river visiont.</li><li><b>Build consistency:</b> csak indokolt esetben térj el a core itemektől.</li><li><b>Objective timing:</b> 30–45 mp-cel korábban kezdd a setupot.</li><li><b>Damage vs. survival:</b> ha sok a halál, a stat önmagában nem elég.</li></ul></div><div className="panel"><div className="panelTitle"><h2>BUILD HISTORY</h2></div><p className="explain">A rendszer összeveti a használt itemeket az ajánlott builddel, és megmutatja: <b>mit vettél</b>, <b>mit javasolt a Forge</b>, és <b>miért tértek el</b>.</p><button className="ghost" onClick={()=>setTab('build')}>ÚJ BUILD ELEMZÉSE →</button></div></div></section>}

      {tab==='profile'&&<section className="dashboard"><div className="profileHero panel"><div className="profileAvatar">WR</div><div><div className="kicker">PLAYER PROFILE</div><h2>{profile.connected?profile.riotId:'Riot profil nincs csatlakoztatva'}</h2><p>{profile.connected?'A profil szinkronizálható a mérkőzés-, build- és fejlődési réteggel.':'Csatlakozás után a rendszer egy helyen kezeli a meccselőzményeket, buildjeidet és trendjeidet.'}</p></div><div className="profileActions">{profile.connected?<><span className="connected">● CONNECTED</span><button className="ghost" onClick={clearProfile}>LEVÁLASZTÁS</button></>:<><button className="primary" onClick={connectProfile}>RIOT ACCOUNT CSATLAKOZTATÁS</button><button className="ghost" onClick={demoSync}>DEMO SYNC</button></>}</div></div>{connectMsg&&<div className="notice">{connectMsg}</div>}<div className="metric"><div className="metricBox"><span>RANK</span><strong style={{fontSize:20}}>{profile.rank}</strong></div><div className="metricBox"><span>WIN RATE</span><strong>{profileStats.winrate}%</strong></div><div className="metricBox"><span>MATCHES</span><strong>{profileStats.total}</strong></div><div className="metricBox"><span>LAST SYNC</span><strong style={{fontSize:15}}>{profile.lastSync?new Date(profile.lastSync).toLocaleTimeString('hu-HU'):'—'}</strong></div></div><div className="cols"><div className="panel"><div className="panelTitle"><h2>MONITORED DATA</h2></div><div className="checkRows">{['Match history','Champions & roles','Items / build paths','Runes & spells','KDA / damage / gold','Win-loss trends','Build deviations','Improvement flags'].map(x=><div key={x}><span className="good">✓</span>{x}<span className="muted">ready</span></div>)}</div></div><div className="panel"><div className="panelTitle"><h2>RIOT CONNECTION</h2></div><p className="explain">A belépés OAuth/RSO elven készül: a jelszavadat nem a WR Forge kezeli. A Riot dokumentáció szerint az RSO hozzáféréshez jóváhagyott production alkalmazás és RSO client szükséges.</p><p className="explain"><b>Technikai állapot:</b> frontend connector kész · secure backend/token exchange szükséges · Wild Rift adatjogosultságot Riot oldalán kell engedélyezni.</p></div></div></section>}

      {tab==='learn'&&<section className="dashboard"><div className="sectionHead"><div><div className="kicker">LEARN & IMPROVE</div><h2>Kezdőtől a profi szintig</h2><p>A Forge nem csak itemet ad: elmagyarázza, mit csinálj a következő meccsen és miért.</p></div></div><div className="levelGrid">{[['01','KEZDŐ','Alapok','Role, lane, farm, vision, itemek és egyszerű matchup szabályok.'],['02','HALADÓ','Döntések','Wave management, reset timing, objective setup, trade ablakok.'],['03','VERSENYZŐ','Makró','Tempo, cross-map játék, win condition, resource trade és draft gondolkodás.'],['04','PRO','Elemzés','Match-by-match review, build deviation, death patterns, power spike és ellenfél-adaptáció.']].map(x=><div className="levelCard" key={x[0]}><span>{x[0]}</span><div className="kicker">{x[1]}</div><h3>{x[2]}</h3><p>{x[3]}</p><button className="ghost" onClick={()=>setTab('build')}>GYAKORLÁS →</button></div>)}</div><div className="cols"><div className="panel"><div className="panelTitle"><h2>MECCS ELŐTT</h2></div><ul className="coachList"><li>Azonosítsd az ellenfél fő sebzésforrását.</li><li>Jelöld ki a saját win conditiont.</li><li>Válaszd ki a playstyle-t a csapatodhoz, ne csak a championedhez.</li><li>Legyen előre megtervezve legalább 1 situational item.</li></ul></div><div className="panel"><div className="panelTitle"><h2>MECCS UTÁN</h2></div><ul className="coachList"><li>Mi okozta a legtöbb halált?</li><li>Melyik item vásárlás késett?</li><li>Mikor vesztettél tempo-t?</li><li>Az ajánlott buildtől való eltérés javított vagy rontott?</li></ul></div></div></section>}

      <div className="panel bottomInfo"><div className="panelTitle"><h2>PATCH INTELLIGENCE · 7.3</h2><span className="muted">DATA LAYER</span></div><div className="metric"><div className="metricBox"><span>BUILD ENGINE</span><strong style={{fontSize:18}}>ADAPTIVE</strong></div><div className="metricBox"><span>MATCH MONITOR</span><strong style={{fontSize:18}}>READY</strong></div><div className="metricBox"><span>PROFILE</span><strong style={{fontSize:18}}>{profile.connected?'CONNECTED':'CONNECTABLE'}</strong></div><div className="metricBox"><span>LEARNING</span><strong style={{fontSize:18}}>4 LEVELS</strong></div></div></div>
      <div className="footer">WR FORGE is an unofficial fan-made tool and is not endorsed by Riot Games.</div>
    </main>
  </div>
}
createRoot(document.getElementById('root')).render(<App />)
