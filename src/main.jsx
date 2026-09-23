
import React,{useEffect,useMemo,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Swords,Search,Save,RotateCcw,Shield,Flame,Footprints,ScrollText,ChevronRight} from 'lucide-react';
import './styles.css';

const champions=[
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
];
const items={
 AD:['Fiendhunter Bolts','Yun Tal Wildarrows','Infinity Edge','Mortal Reminder','Guardian Angel','Gluttonous Greaves'],
 AP:['Luden’s Echo','Infinity Orb','Rabadon’s Deathcap','Void Staff','Zhonya’s Hourglass','Mana Boots'],
 Tank:['Sunfire Aegis','Thornmail','Amaranth’s Twinguard','Force of Nature','Randuin’s Omen','Plated Steelcaps']
};

const itemMeta={
 'Fiendhunter Bolts':{tags:['crit','as','ad'],counter:['squishy','tank']},
 'Yun Tal Wildarrows':{tags:['crit','ad','bleed'],counter:['squishy']},
 'Infinity Edge':{tags:['crit','ad','crit-damage'],counter:['squishy']},
 'Mortal Reminder':{tags:['anti-heal','armor-pen','ad'],counter:['heal','tank']},
 'Guardian Angel':{tags:['ad','defense','revive'],counter:['assassin','burst']},
 'Gluttonous Greaves':{tags:['ad','lifesteal'],counter:['poke']},
 'Luden’s Echo':{tags:['ap','burst'],counter:['squishy']},
 'Infinity Orb':{tags:['ap','magic-pen','execute'],counter:['squishy']},
 'Rabadon’s Deathcap':{tags:['ap','scaling'],counter:['squishy']},
 'Void Staff':{tags:['ap','magic-pen'],counter:['mr','tank']},
 'Zhonya’s Hourglass':{tags:['ap','stasis','defense'],counter:['assassin','burst']},
 'Mana Boots':{tags:['ap','mana'],counter:['poke']},
 'Sunfire Aegis':{tags:['tank','hp','armor'],counter:['ad','melee']},
 'Thornmail':{tags:['tank','armor','anti-heal'],counter:['ad','heal']},
 'Amaranth’s Twinguard':{tags:['tank','resist'],counter:['burst']},
 'Force of Nature':{tags:['tank','mr'],counter:['ap','poke']},
 'Randuin’s Omen':{tags:['tank','armor','crit-defense'],counter:['crit']},
 'Plated Steelcaps':{tags:['armor','basic-attack-defense'],counter:['ad']}
};

const matchupMatrix={
  Assassin:{vs:['Marksman','Mage'],priority:['defense','stasis','revive'],weight:9},
  Marksman:{vs:['Tank','Fighter'],priority:['armor-pen','anti-heal','crit'],weight:8},
  Mage:{vs:['Assassin','Marksman'],priority:['stasis','magic-pen','burst'],weight:8},
  Tank:{vs:['Marksman','Fighter'],priority:['armor','anti-heal','hp'],weight:7},
  Fighter:{vs:['Tank','Mage'],priority:['anti-heal','armor-pen','mr'],weight:7},
  Support:{vs:['Assassin','Tank'],priority:['utility','anti-heal','defense'],weight:6}
};
function scoreItem(item, threats, play){
 const meta=itemMeta[item]; if(!meta)return 0;
 let score=0;
 threats.forEach(t=>{ if(meta.tags.includes(t))score+=3; if(meta.counter.includes(t))score+=2; });
 if(play==='Burst'&&meta.tags.includes('burst'))score+=3;
 if(play==='DPS'&&meta.tags.some(x=>['as','crit','ad','scaling'].includes(x)))score+=2;
 if(play==='Tank'&&meta.tags.some(x=>['tank','hp','armor','mr','resist'].includes(x)))score+=3;
 return score;
}
const matchupRules=[
 {when:e=>e.tags.includes('Marksman'), prefer:['armor','basic-attack-defense','burst']},
 {when:e=>e.tags.includes('Assassin'), prefer:['defense','stasis','revive']},
 {when:e=>e.tags.includes('Tank'), prefer:['armor-pen','magic-pen','anti-heal']},
 {when:e=>e.tags.includes('Mage'), prefer:['mr','defense','stasis']},
 {when:e=>e.tags.includes('Support'), prefer:['anti-heal','burst']},
 {when:e=>e.tags.includes('Fighter'), prefer:['anti-heal','armor-pen']}
];
const runes={
 Burst:['Electrocute','Sudden Impact','Mark of the Weak','Eyeball Collector'],
 DPS:['Conqueror','Brutal','Coup de Grace','Legend: Alacrity'],
 Tank:['Aftershock','Courage of the Colossus','Bone Plating','Overgrowth'],
 Safe:['Fleet Footwork','Brutal','Second Wind','Sweet Tooth'],
 Utility:['Summon Aery','Weakness','Bone Plating','Manaflow Band']
};
const patch73={
  name:'7.3', date:'2026-09-21',
  newChampions:['Hwei'],
  newItems:['Fiendhunter Bolts','Yun Tal Wildarrows','Hexoptics C44','Stormrazor','Endless Hunger','Profane Hydra','Elixir of Iron','Elixir of Sorcery','Elixir of Wrath'],
  removedItems:['Magnetic Blaster','Soul Transfer','Nashor’s Talon'],
  changedRunes:['Lethal Tempo','Conqueror','Legend: Haste','Demolish'],
  keyChanges:['Crit damage 175% → 200%','Attack speed cap 2.5 → 3','Legend: Tenacity replaced by Legend: Haste','Marksman item system overhauled']
};
const skillOrders={
 Ahri:['1','2','3','1','4','1','2','1','2','3','4','2','2','3','3'],
 Zed:['1','2','3','1','4','1','2','1','2','3','4','2','2','3','3'],
 Hwei:['1','2','3','1','4','1','2','1','2','3','4','2','2','3','3'],
 Jinx:['1','2','3','1','4','1','2','1','2','3','4','2','2','3','3'],
 default:['1','2','3','1','4','1','2','1','2','3','4','2','2','3','3']
};
const roles=['All','Baron','Jungle','Mid','Dragon','Support'];
const styles=['Burst','DPS','Tank','Safe','Utility'];

const LIVE_CHAMP_URL='https://ry2x.github.io/WildRift-Merged-Champion-Data/data_en_US.json';
const LIVE_STATS_URL='https://ry2x.github.io/WildRift-Merged-Stats-Data/heroStats.json';

function normalizeLiveChampion(c,i){
 const laneMap={Mid:'Mid',Jungle:'Jungle',Top:'Baron',Support:'Support',AD:'Dragon'};
 const roles=c.roles||[];
 const type=c.type==='AP'?'AP':roles.includes('Tank')?'Tank':'AD';
 return {
   id:c.id||`live-${i}`, name:c.name||c.id, role:laneMap[c.lanes?.[0]]||'Mid',
   type, tags:roles, c1:'#36d8ff', c2:'#172d46',
   live:true, difficulty:c.difficult, damage:c.damage, survive:c.survive, utility:c.utility
 };
}

function App(){
 const [role,setRole]=useState('Mid'),[mine,setMine]=useState(champions[0]),[enemies,setEnemies]=useState([]),[play,setPlay]=useState('Burst');
 const [search,setSearch]=useState(''),[built,setBuilt]=useState(false),[saved,setSaved]=useState([]);
 const [liveChampions,setLiveChampions]=useState([]),[liveStats,setLiveStats]=useState(null),[dataStatus,setDataStatus]=useState('loading');
 useEffect(()=>{
   let active=true;
   Promise.all([
     fetch(LIVE_CHAMP_URL).then(r=>{if(!r.ok)throw Error('champions');return r.json()}),
     fetch(LIVE_STATS_URL).then(r=>{if(!r.ok)throw Error('stats');return r.json()})
   ]).then(([cs,st])=>{
     if(!active)return;
     const arr=Array.isArray(cs)?cs.filter(c=>c.is_wr!==false).map(normalizeLiveChampion):[];
     setLiveChampions(arr); setLiveStats(st); setDataStatus('live');
   }).catch(()=>active&&setDataStatus('fallback'));
   return()=>{active=false};
 },[]);
 const roster=liveChampions.length?liveChampions:champions;

 const filtered=roster.filter(c=>(role==='All'||c.role===role)&&c.name.toLowerCase().includes(search.toLowerCase()));
useEffect(()=>{
 if(liveChampions.length){
   const same=liveChampions.find(c=>c.name.toLowerCase()===mine.name.toLowerCase());
   if(same) setMine(same);
   else setMine(liveChampions.find(c=>c.role===role)||liveChampions[0]);
   setEnemies([]);
 }
},[liveChampions,role]);

 const build=useMemo(()=>{
   const type=mine.type.includes('AP')?'AP':mine.type.includes('Tank')?'Tank':'AD';
   let pool=[...items[type]];
   const tags=new Set();
   enemies.forEach(e=>matchupRules.forEach(rule=>rule.when(e)&&rule.prefer.forEach(t=>tags.add(t))));
   const hasHeal=enemies.some(e=>['Darius','Aatrox','Morgana','Soraka'].includes(e.name));
   const hasCrit=enemies.some(e=>['Jinx','Yunara','Vayne','Kai’Sa'].includes(e.name));
   const hasAP=enemies.filter(e=>e.type.includes('AP')).length;
   const hasTank=enemies.filter(e=>e.tags.includes('Tank')).length;
   const hasAssassin=enemies.some(e=>e.tags.includes('Assassin'));
   const threats=[];
   if(hasHeal)threats.push('heal');
   if(hasTank)threats.push('tank','armor-pen');
   if(hasCrit)threats.push('crit','basic-attack-defense');
   if(hasAP)threats.push('ap','mr');
   if(hasAssassin)threats.push('assassin','burst');
   enemies.forEach(e=>{
     e.tags.forEach(t=>{
       const m=matchupMatrix[t];
       if(m) m.priority.forEach(x=>threats.push(x));
     });
   });
   const candidates=[...new Set(Object.keys(itemMeta))].filter(x=>!pool.slice(0,2).includes(x));
   const ranked=candidates.map(x=>({x,score:scoreItem(x,threats,play)})).sort((a,b)=>b.score-a.score);
   if(ranked[0]){
      pool[4]=ranked[0].x;
      const second=ranked.find(x=>x.x!==pool[4]);
      if(second&&pool.length>3) pool[3]=second.x;
   }
   if(type==='AD'&&(hasHeal||hasTank)) pool[1]='Mortal Reminder';
   if(type==='AP'&&hasTank>=2) pool[3]='Void Staff';
   if(type==='Tank'&&hasAP>=2) pool[3]='Force of Nature';
   if(play==='Tank'&&type!=='Tank') pool[4]='Guardian Angel';
   const stats={
    Damage:Math.min(99,(type==='AP'?91:89)+(play==='Burst'?4:play==='DPS'?3:0)+(hasTank?4:0)),
    DPS:Math.min(99,play==='DPS'?95:(type==='AD'?86:82)+(hasTank*3)),
    Survival:Math.min(99,play==='Tank'?94:(hasAP>=2?82:72)+(hasAssassin?6:0)),
    Utility:Math.min(99,play==='Utility'?92+(hasHeal?2:0):(hasTank?74:68))
   };
   const threatSummary=[
      hasAP?`${hasAP} AP threat`:'No major AP stack',
      hasTank?`${hasTank} tank threat`:'Low tank pressure',
      hasCrit?'Crit threat detected':'No major crit threat',
      hasAssassin?'Burst/assassin threat':'No assassin threat'
   ];
   const buildScore=Math.round((stats.Damage+stats.DPS+stats.Survival+stats.Utility)/4);
   return {arr:pool,runes:runes[play],stats,type,enemyAP:hasAP,enemyTank:hasTank,threatSummary,tags:[...new Set([...tags,...threats])],buildScore};
 },[mine,enemies,play]);
 const chooseEnemy=(c)=>{
   if(c.id===mine.id)return;
   setEnemies(prev=>prev.find(x=>x.id===c.id)?prev.filter(x=>x.id!==c.id):prev.length<5?[...prev,c]:prev);
 };
 const generate=()=>setBuilt(true);
 const save=()=>setSaved(p=>[...p,{mine:mine.name,role,play,items:build.arr}]);
 return <div className="app">
  <header className="top"><div className="brand"><div className="brandmark">WR</div><div><b>WR FORGE</b><small>WILD RIFT BUILD BUILDER</small></div></div>
   <div className="actions"><select className="select"><option>Patch 7.3</option><option>Demo data</option></select><button className="ghost" onClick={()=>{setBuilt(false);setEnemies([])}}><RotateCcw size={15}/> Reset</button></div>
  </header>
  <main className="container">
   <section className="hero"><div className="heroCard"><div className="kicker">MATCH-ADAPTIVE BUILD ENGINE</div><h1>BUILD YOUR<br/><span style={{color:'var(--cyan)'}}>GAME.</span></h1><p>Válaszd ki a championedet, a szerepkört és az ellenfél csapatát. A Forge ezután egy meccsre szabott item-, rune- és skill-irányt állít össze.</p><button className="forgeBtn" onClick={generate}><Swords size={17}/> BUILD MY GAME <ChevronRight size={17}/></button></div>
    <div className="heroCard patch"><div><div className="kicker">CURRENT DATA LAYER</div><div className="note">
 {dataStatus==='live'?<>Élő, naponta frissülő közösségi WR champion/stat adat<br/><span className="good">● ONLINE</span></>:<>Lokális fallback adatkészlet<br/><span className="danger">● OFFLINE</span></>}
 </div></div><strong>7.3</strong></div>
   </section>
   <section className="layout">
    <aside className="panel"><div className="panelTitle"><h2>01 / MATCH SETUP</h2><span className="muted">5 ENEMY SLOT</span></div>
      <div className="field"><div className="label">Role</div><div className="roles">{roles.map(r=><button className={'chip '+(role===r?'active':'')} onClick={()=>setRole(r)} key={r}>{r}</button>)}</div></div>
      <div className="field"><div className="label">My champion</div><div style={{position:'relative'}}><Search size={15} style={{position:'absolute',left:10,top:12,color:'#697989'}}/><input className="search" style={{paddingLeft:32}} placeholder="Champion keresés..." value={search} onChange={e=>setSearch(e.target.value)}/></div></div>
      <div className="champGrid">{filtered.map(c=><button className={'champ '+(mine.id===c.id?'active':'')} onClick={()=>setMine(c)} key={c.id}><div className="portrait" style={{'--c1':c.c1,'--c2':c.c2}}>{c.name.slice(0,2).toUpperCase()}</div><span>{c.name}</span></button>)}</div>
      <div className="field"><div className="label">Enemy team <span className="muted">({enemies.length}/5)</span></div><div className="enemyGrid">{[0,1,2,3,4].map(i=>{let e=enemies[i];return <button className={'enemySlot '+(e?'filled':'')} key={i} onClick={()=>e&&chooseEnemy(e)}>{e?<><div className="portrait" style={{'--c1':e.c1,'--c2':e.c2}}>{e.name.slice(0,2).toUpperCase()}</div>{e.name}</>:<span>+ enemy</span>}</button>})}</div></div>
      <div className="field"><div className="label">Add/remove enemy</div><div className="champGrid">{roster.filter(c=>c.id!==mine.id).slice(0,6).map(c=><button className={'champ '+(enemies.some(e=>e.id===c.id)?'active':'')} onClick={()=>chooseEnemy(c)} key={c.id}><div className="portrait" style={{'--c1':c.c1,'--c2':c.c2}}>{c.name.slice(0,2).toUpperCase()}</div><span>{c.name}</span></button>)}</div></div>
      <div className="field"><div className="label">Playstyle</div><div className="styles">{styles.map(s=><button className={'chip '+(play===s?'active':'')} onClick={()=>setPlay(s)} key={s}>{s}</button>)}</div></div>
    </aside>
    <section className="results">
      <div className="panel"><div className="buildHeader"><div><div className="kicker">02 / GENERATED BUILD</div><h2>{mine.name} · {role}</h2><span className="muted">{play} profile · {enemies.length} enemy detected {mine.live&&liveStats?<span className="good"> · LIVE DATA</span>:''}</span></div><div className="score">BUILD SCORE {build.buildScore}</div></div>
       {!built?<div style={{padding:'42px 10px',textAlign:'center',color:'#758393'}}>Állítsd be a meccset, majd nyomd meg a <b>BUILD MY GAME</b> gombot.</div>:
       <><div className="items" style={{marginTop:18}}>{build.arr.map((it,i)=><div className="item" key={i}><div className="itemIcon">{i===5?<Footprints size={20}/>:i+1}</div><b>{it}</b><small>{i<2?'CORE ITEM':i===5?'BOOTS':'LATE / SITUATIONAL'}</small></div>)}</div>
       <div className="metric" style={{marginTop:12}}>{Object.entries(build.stats).map(([k,v])=><div className="metricBox" key={k}><span>{k}</span><strong>{v}</strong></div>)}</div>
       {mine.live&&liveStats&&<div style={{marginTop:12}} className="explain">Champion adat: nehézség {mine.difficulty||'-'}/3 · sebzés {mine.damage||'-'}/3 · túlélés {mine.survive||'-'}/3 · utility {mine.utility||'-'}/3</div>}
       </div></>}
      </div>
      {built&&<><div className="cols">
       <div className="panel"><div className="panelTitle"><h2><ScrollText size={18}/> RUNES</h2></div>{build.runes.map((r,i)=><div className="rune" key={r}><div className="runeDot">{i+1}</div><b>{r}</b></div>)}<div className="muted">Summoner: Flash + Ignite</div></div>
       <div className="panel"><div className="panelTitle"><h2><Shield size={18}/> COUNTER LOGIC</h2></div><p className="explain">Az engine a teljes ellenfél-kompozíciót elemzi, majd a legfontosabb threat tagekhez igazítja a situational slotokat.</p>
 <div className="saved">{build.threatSummary.map((t,i)=><span className="chip active" key={i}>{t}</span>)}</div><p className="explain"><span className="good">✓</span> {play} játékstílus prioritás<br/><span className="good">✓</span> Ellenfél-kompozíció figyelembe véve<br/><span className="danger">!</span> Demo adatkészlet — nem élő Riot adat</p></div>
      </div>
      <div className="panel"><div className="panelTitle"><h2><Swords size={18}/> SKILL ORDER</h2><span className="muted">1 → 15</span></div>
 <div style={{display:'flex',gap:7,flexWrap:'wrap'}}>{(skillOrders[mine.name]||skillOrders.default).map((x,i)=><div className="chip active" key={i} style={{minWidth:34,textAlign:'center'}}>{x}</div>)}</div>
 <p className="explain">A skill sorrend a champion és a választott játékstílus alapján később külön patch-adatból finomítható.</p>
</div>
<div className="panel"><div className="panelTitle"><h2><Flame size={18}/> WHY THIS BUILD</h2><button className="primary" onClick={save}><Save size={15}/> Mentés</button></div><p className="explain">Ez a build a <b>{mine.name}</b> alapvető sebzéstípusára, a választott <b>{play}</b> profilra és az aktuálisan megadott ellenfélcsapatra reagál. A build engine külön kezeli a core és situational itemeket, így a későbbi patch-adatok cseréje nem igényli a felület újraírását.</p></div></>}
      {saved.length>0&&<div className="panel"><div className="panelTitle"><h2>SAVED BUILDS</h2></div><div className="saved">{saved.map((s,i)=><button className="chip active" key={i}>{s.mine} · {s.role} · {s.play}</button>)}</div></div>}
    </section>
   </section>
   <div className="panel" style={{marginTop:18}}>
 <div className="panelTitle"><h2>PATCH INTELLIGENCE · 7.3</h2><span className="muted">2026-09-21</span></div>
 <div className="metric">
   <div className="metricBox"><span>NEW CHAMPIONS</span><strong style={{fontSize:18}}>Hwei · Sylas · Rek’Sai</strong></div>
   <div className="metricBox"><span>CRIT DAMAGE</span><strong style={{fontSize:18}}>200%</strong></div>
   <div className="metricBox"><span>AS CAP</span><strong style={{fontSize:18}}>3.0</strong></div>
   <div className="metricBox"><span>RUNE UPDATE</span><strong style={{fontSize:18}}>4+</strong></div>
 </div>
 <p className="explain" style={{marginBottom:0}}>A Forge a champion/statisztikákat élő, naponta frissülő közösségi Wild Rift adatforrásból tölti, és külön patch-rétegben kezeli a buildszabályokat. A Forge ezért a patch-adatot külön rétegként kezeli: champion → role → ellenfél-kompozíció → item/rune/skill döntés.</p>
</div>
<div className="panel" style={{marginTop:18}}>
 <div className="panelTitle"><h2>ENGINE PIPELINE</h2><span className="muted">V3.2</span></div>
 <div className="metric">
  <div className="metricBox"><span>CHAMPION</span><strong style={{fontSize:16}}>LIVE</strong></div>
  <div className="metricBox"><span>STATS</span><strong style={{fontSize:16}}>LIVE</strong></div>
  <div className="metricBox"><span>MATCHUP</span><strong style={{fontSize:16}}>RULE MATRIX</strong></div>
  <div className="metricBox"><span>BUILD</span><strong style={{fontSize:16}}>SCORING</strong></div>
 </div>
 <p className="explain" style={{marginBottom:0}}>A Build Engine először threat tageket képez, majd item-jelölteket pontoz, és a választott játékstílus súlyozásával állítja össze a situational slotokat. Így a build nem fix lista.</p>
</div>
<div className="footer">WR FORGE is an unofficial fan-made tool and is not endorsed by Riot Games. Demo data only.</div>
  </main>
 </div>
}
createRoot(document.getElementById('root')).render(<App/>)
