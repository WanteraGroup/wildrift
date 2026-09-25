import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const champions = [
  { id:'ahri', name:'Ahri', role:'Mid', type:'AP', tags:['Mage','Burst'], c1:'#d95cff', c2:'#4936b8' },
  { id:'zed', name:'Zed', role:'Mid', type:'AD', tags:['Assassin','Burst'], c1:'#ef476f', c2:'#24242e' },
  { id:'lee', name:'Lee Sin', role:'Jungle', type:'AD', tags:['Fighter','Assassin'], c1:'#d68b39', c2:'#5c261b' },
  { id:'darius', name:'Darius', role:'Baron', type:'AD', tags:['Fighter','Tank'], c1:'#d83c49', c2:'#41131a' },
  { id:'malphite', name:'Malphite', role:'Baron', type:'AP/Tank', tags:['Tank','Mage'], c1:'#75879c', c2:'#273240' },
  { id:'jinx', name:'Jinx', role:'Dragon', type:'AD', tags:['Marksman'], c1:'#36d5ff', c2:'#c43d9c' },
  { id:'thresh', name:'Thresh', role:'Support', type:'Tank', tags:['Support','Tank'], c1:'#50e4aa', c2:'#163f47' },
  { id:'lux', name:'Lux', role:'Support', type:'AP', tags:['Mage','Support'], c1:'#ffe37b', c2:'#6f72dd' },
  { id:'vayne', name:'Vayne', role:'Dragon', type:'AD', tags:['Marksman'], c1:'#7e89ff', c2:'#252b5e' },
  { id:'morgana', name:'Morgana', role:'Support', type:'AP', tags:['Mage','Support'], c1:'#8d5ce6', c2:'#24103e' },
  { id:'hwei', name:'Hwei', role:'Mid', type:'AP', tags:['Mage','Burst'], c1:'#f35d6d', c2:'#28206e' },
  { id:'sylas', name:'Sylas', role:'Mid', type:'AP', tags:['Mage','Fighter'], c1:'#cf9b55', c2:'#2a2b3e' },
  { id:'reksai', name:'Rek’Sai', role:'Jungle', type:'AD', tags:['Fighter','Assassin'], c1:'#e2675d', c2:'#3a1a25' },
  { id:'yunara', name:'Yunara', role:'Dragon', type:'AD', tags:['Marksman'], c1:'#7bd7ff', c2:'#3d2c82' },
  { id:'chogath', name:'Cho’Gath', role:'Baron', type:'Tank', tags:['Tank','Fighter'], c1:'#8b5b9b', c2:'#201323' },
  { id:'kaisa', name:'Kai’Sa', role:'Dragon', type:'AD', tags:['Marksman'], c1:'#8b70ff', c2:'#292047' },
  { id:'xin', name:'Xin Zhao', role:'Jungle', type:'AD', tags:['Fighter'], c1:'#e7a34a', c2:'#44311b' }
]

const itemPools = {
  AD:['Fiendhunter Bolts','Yun Tal Wildarrows','Infinity Edge','Mortal Reminder','Guardian Angel','Gluttonous Greaves'],
  AP:['Luden’s Echo','Infinity Orb','Rabadon’s Deathcap','Void Staff','Zhonya’s Hourglass','Mana Boots'],
  Tank:['Sunfire Aegis','Thornmail','Amaranth’s Twinguard','Force of Nature','Randuin’s Omen','Plated Steelcaps']
}

const itemMeta = {
  'Fiendhunter Bolts':{ tags:['crit','as','ad'], counters:['squishy','tank'] },
  'Yun Tal Wildarrows':{ tags:['crit','ad','bleed'], counters:['squishy'] },
  'Infinity Edge':{ tags:['crit','ad','crit-damage'], counters:['squishy'] },
  'Mortal Reminder':{ tags:['anti-heal','armor-pen','ad'], counters:['heal','tank'] },
  'Guardian Angel':{ tags:['ad','defense','revive'], counters:['assassin','burst'] },
  'Gluttonous Greaves':{ tags:['ad','lifesteal'], counters:['poke'] },
  'Luden’s Echo':{ tags:['ap','burst'], counters:['squishy'] },
  'Infinity Orb':{ tags:['ap','magic-pen','execute'], counters:['squishy'] },
  'Rabadon’s Deathcap':{ tags:['ap','scaling'], counters:['squishy'] },
  'Void Staff':{ tags:['ap','magic-pen'], counters:['mr','tank'] },
  'Zhonya’s Hourglass':{ tags:['ap','stasis','defense'], counters:['assassin','burst'] },
  'Mana Boots':{ tags:['ap','mana'], counters:['poke'] },
  'Sunfire Aegis':{ tags:['tank','hp','armor'], counters:['ad','melee'] },
  'Thornmail':{ tags:['tank','armor','anti-heal'], counters:['ad','heal'] },
  'Amaranth’s Twinguard':{ tags:['tank','resist'], counters:['burst'] },
  'Force of Nature':{ tags:['tank','mr'], counters:['ap','poke'] },
  'Randuin’s Omen':{ tags:['tank','armor','crit-defense'], counters:['crit'] },
  'Plated Steelcaps':{ tags:['armor','basic-attack-defense'], counters:['ad'] }
}

const runes = {
  Burst:['Electrocute','Sudden Impact','Mark of the Weak','Eyeball Collector'],
  DPS:['Conqueror','Brutal','Coup de Grace','Legend: Alacrity'],
  Tank:['Aftershock','Courage of the Colossus','Bone Plating','Overgrowth'],
  Safe:['Fleet Footwork','Brutal','Second Wind','Sweet Tooth'],
  Utility:['Summon Aery','Weakness','Bone Plating','Manaflow Band']
}

const roles = ['All','Baron','Jungle','Mid','Dragon','Support']
const playstyles = ['Burst','DPS','Tank','Safe','Utility']
const championDataUrl = 'https://ry2x.github.io/WildRift-Merged-Champion-Data/data_en_US.json'

function scoreItem(name, threats, playstyle) {
  const meta = itemMeta[name]
  if (!meta) return 0
  let score = 0
  threats.forEach(function(threat) {
    if (meta.tags.indexOf(threat) >= 0) score += 3
    if (meta.counters.indexOf(threat) >= 0) score += 2
  })
  if (playstyle === 'Burst' && meta.tags.indexOf('burst') >= 0) score += 3
  if (playstyle === 'DPS' && meta.tags.some(function(t){ return ['as','crit','ad','scaling'].indexOf(t) >= 0 })) score += 2
  if (playstyle === 'Tank' && meta.tags.some(function(t){ return ['tank','hp','armor','mr','resist'].indexOf(t) >= 0 })) score += 3
  return score
}

function initials(name) {
  return name.split(' ').slice(0,2).map(function(x){ return x[0] }).join('').toUpperCase()
}

function normalizeChampion(raw, index) {
  const rolesRaw = Array.isArray(raw.roles) ? raw.roles : []
  let role = 'Mid'
  const lanes = Array.isArray(raw.lanes) ? raw.lanes : []
  if (lanes[0] === 'Jungle') role = 'Jungle'
  else if (lanes[0] === 'Top') role = 'Baron'
  else if (lanes[0] === 'Support') role = 'Support'
  else if (lanes[0] === 'AD') role = 'Dragon'
  const type = raw.type === 'AP' ? 'AP' : rolesRaw.indexOf('Tank') >= 0 ? 'Tank' : 'AD'
  return {
    id: raw.id || 'live-' + index,
    name: raw.name || raw.id || 'Champion',
    role: role,
    type: type,
    tags: rolesRaw,
    c1:'#36d8ff',
    c2:'#172d46',
    live:true,
    difficulty:raw.difficult,
    damage:raw.damage,
    survive:raw.survive,
    utility:raw.utility
  }
}

function App() {
  const [role, setRole] = useState('Mid')
  const [mine, setMine] = useState(champions[0])
  const [enemies, setEnemies] = useState([])
  const [playstyle, setPlaystyle] = useState('Burst')
  const [search, setSearch] = useState('')
  const [built, setBuilt] = useState(false)
  const [saved, setSaved] = useState([])
  const [liveChampions, setLiveChampions] = useState([])
  const [dataStatus, setDataStatus] = useState('loading')

  useEffect(function(){
    let active = true
    fetch(championDataUrl)
      .then(function(response){
        if (!response.ok) throw new Error('data')
        return response.json()
      })
      .then(function(data){
        if (!active || !Array.isArray(data)) return
        const normalized = data.filter(function(c){ return c.is_wr !== false }).map(normalizeChampion)
        if (normalized.length) {
          setLiveChampions(normalized)
          setDataStatus('live')
        } else {
          setDataStatus('fallback')
        }
      })
      .catch(function(){
        if (active) setDataStatus('fallback')
      })
    return function(){ active = false }
  },[])

  const roster = liveChampions.length ? liveChampions : champions
  const filtered = roster.filter(function(c){
    return (role === 'All' || c.role === role) && c.name.toLowerCase().indexOf(search.toLowerCase()) >= 0
  })

  useEffect(function(){
    if (!liveChampions.length) return
    const exact = liveChampions.find(function(c){ return c.name.toLowerCase() === mine.name.toLowerCase() })
    if (exact) setMine(exact)
    else {
      const sameRole = liveChampions.find(function(c){ return c.role === role })
      if (sameRole) setMine(sameRole)
    }
    setEnemies([])
  },[liveChampions])

  const build = useMemo(function(){
    const type = mine.type.indexOf('AP') >= 0 ? 'AP' : mine.type.indexOf('Tank') >= 0 ? 'Tank' : 'AD'
    let pool = itemPools[type].slice()
    const threats = []
    const hasHeal = enemies.some(function(e){ return ['Darius','Aatrox','Morgana','Soraka'].indexOf(e.name) >= 0 })
    const hasCrit = enemies.some(function(e){ return ['Jinx','Yunara','Vayne','Kai’Sa'].indexOf(e.name) >= 0 })
    const apCount = enemies.filter(function(e){ return e.type.indexOf('AP') >= 0 }).length
    const tankCount = enemies.filter(function(e){ return e.tags.indexOf('Tank') >= 0 }).length
    const assassin = enemies.some(function(e){ return e.tags.indexOf('Assassin') >= 0 })

    if (hasHeal) threats.push('heal','anti-heal')
    if (hasCrit) threats.push('crit','basic-attack-defense')
    if (apCount) threats.push('ap','mr')
    if (tankCount) threats.push('tank','armor-pen')
    if (assassin) threats.push('assassin','burst')

    enemies.forEach(function(e){
      e.tags.forEach(function(tag){
        if (tag === 'Marksman') threats.push('armor','basic-attack-defense')
        if (tag === 'Assassin') threats.push('defense','stasis','revive')
        if (tag === 'Tank') threats.push('armor-pen','magic-pen','anti-heal')
        if (tag === 'Mage') threats.push('mr','defense','stasis')
        if (tag === 'Support') threats.push('anti-heal','defense')
        if (tag === 'Fighter') threats.push('anti-heal','armor-pen')
      })
    })

    const ranked = Object.keys(itemMeta)
      .map(function(name){ return {name:name, score:scoreItem(name, threats, playstyle)} })
      .sort(function(a,b){ return b.score-a.score })

    if (ranked[0]) pool[4] = ranked[0].name
    if (ranked[1]) pool[3] = ranked[1].name
    if (type === 'AD' && (hasHeal || tankCount > 0)) pool[1] = 'Mortal Reminder'
    if (type === 'AP' && tankCount >= 2) pool[3] = 'Void Staff'
    if (type === 'Tank' && apCount >= 2) pool[3] = 'Force of Nature'
    if (playstyle === 'Tank' && type !== 'Tank') pool[4] = 'Guardian Angel'

    const stats = {
      Damage: Math.min(99,(type === 'AP' ? 91 : 89) + (playstyle === 'Burst' ? 4 : playstyle === 'DPS' ? 3 : 0) + tankCount * 2),
      DPS: Math.min(99,playstyle === 'DPS' ? 95 : (type === 'AD' ? 86 : 82) + tankCount * 3),
      Survival: Math.min(99,playstyle === 'Tank' ? 94 : (apCount >= 2 ? 82 : 72) + (assassin ? 6 : 0)),
      Utility: Math.min(99,playstyle === 'Utility' ? 92 + (hasHeal ? 2 : 0) : (tankCount ? 74 : 68))
    }

    return {
      type:type,
      items:pool,
      runes:runes[playstyle],
      stats:stats,
      score:Math.round((stats.Damage + stats.DPS + stats.Survival + stats.Utility) / 4),
      threats:[
        apCount ? apCount + ' AP threat' : 'No major AP stack',
        tankCount ? tankCount + ' tank threat' : 'Low tank pressure',
        hasCrit ? 'Crit threat detected' : 'No major crit threat',
        assassin ? 'Assassin / burst threat' : 'No assassin threat'
      ]
    }
  },[mine,enemies,playstyle])

  function toggleEnemy(champion) {
    if (champion.id === mine.id) return
    const exists = enemies.some(function(e){ return e.id === champion.id })
    if (exists) {
      setEnemies(enemies.filter(function(e){ return e.id !== champion.id }))
    } else if (enemies.length < 5) {
      setEnemies(enemies.concat(champion))
    }
  }

  function reset() {
    setBuilt(false)
    setEnemies([])
    setSaved([])
    setPlaystyle('Burst')
  }

  function saveBuild() {
    setSaved(saved.concat([{champion:mine.name, role:role, playstyle:playstyle, items:build.items}]))
  }

  return (
    <div className="app">
      <header className="top">
        <div className="brand">
          <div className="brandmark">WR</div>
          <div><b>WR FORGE</b><small>WILD RIFT BUILD BUILDER</small></div>
        </div>
        <div className="actions">
          <div className="select">PATCH 7.3</div>
          <button className="ghost" onClick={reset}>↻ Reset</button>
        </div>
      </header>

      <main className="container">
        <section className="hero">
          <div className="heroCard">
            <div className="kicker">MATCH-ADAPTIVE BUILD ENGINE</div>
            <h1>BUILD YOUR<br/><span>GAME.</span></h1>
            <p>Válaszd ki a championedet, a szerepkört és az ellenfél csapatát. A Forge ezek alapján összeállít egy adaptív item-, rune- és buildirányt.</p>
            <button className="forgeBtn" onClick={function(){ setBuilt(true) }}>⚔ BUILD MY GAME →</button>
          </div>
          <div className="heroCard patch">
            <div>
              <div className="kicker">CURRENT DATA LAYER</div>
              <div className="note">
                {dataStatus === 'live' ? <span className="good">● KÖZÖSSÉGI ADAT ONLINE</span> : dataStatus === 'fallback' ? <span className="danger">● LOKÁLIS FALLBACK</span> : <span>● ADAT BETÖLTÉSE...</span>}
                <br/>Champion roster + adaptive rules
              </div>
            </div>
            <strong>7.3</strong>
          </div>
        </section>

        <section className="layout">
          <aside className="panel">
            <div className="panelTitle"><h2>01 / MATCH SETUP</h2><span className="muted">{enemies.length}/5 ENEMY</span></div>

            <div className="field">
              <div className="label">ROLE</div>
              <div className="roles">{roles.map(function(r){
                return <button key={r} className={'chip '+(role === r ? 'active':'')} onClick={function(){setRole(r)}}>{r}</button>
              })}</div>
            </div>

            <div className="field">
              <div className="label">MY CHAMPION</div>
              <input className="search" placeholder="Champion keresés..." value={search} onChange={function(e){setSearch(e.target.value)}}/>
            </div>

            <div className="champGrid">{filtered.slice(0,18).map(function(c){
              return (
                <button key={c.id} className={'champ '+(mine.id === c.id ? 'active':'')} onClick={function(){setMine(c)}}>
                  <div className="portrait" style={{'--c1':c.c1,'--c2':c.c2}}>{initials(c.name)}</div>
                  <span>{c.name}</span>
                </button>
              )
            })}</div>

            <div className="field">
              <div className="label">ENEMY TEAM <span className="muted">({enemies.length}/5)</span></div>
              <div className="enemyGrid">{[0,1,2,3,4].map(function(index){
                const enemy = enemies[index]
                return <div className={'enemySlot '+(enemy ? 'filled':'')} key={index} onClick={function(){ if(enemy) toggleEnemy(enemy) }}>
                  {enemy ? <div><div className="portrait small" style={{'--c1':enemy.c1,'--c2':enemy.c2}}>{initials(enemy.name)}</div>{enemy.name}</div> : <span>+ enemy</span>}
                </div>
              })}</div>
            </div>

            <div className="field">
              <div className="label">ADD / REMOVE ENEMY</div>
              <div className="enemyPicker">{roster.filter(function(c){return c.id !== mine.id}).slice(0,12).map(function(c){
                return <button key={c.id} className={'miniChamp '+(enemies.some(function(e){return e.id===c.id}) ? 'active':'')} onClick={function(){toggleEnemy(c)}}>{initials(c.name)}</button>
              })}</div>
            </div>

            <div className="field">
              <div className="label">PLAYSTYLE</div>
              <div className="styles">{playstyles.map(function(s){
                return <button key={s} className={'chip '+(playstyle === s ? 'active':'')} onClick={function(){setPlaystyle(s)}}>{s}</button>
              })}</div>
            </div>
          </aside>

          <section className="results">
            <div className="panel">
              <div className="buildHeader">
                <div><div className="kicker">02 / GENERATED BUILD</div><h2>{mine.name} · {role}</h2><span className="muted">{playstyle} profile · {enemies.length} enemy</span></div>
                <div className="score">BUILD SCORE {build.score}</div>
              </div>

              {!built ? (
                <div className="emptyState">Állítsd be a meccset, majd nyomd meg a <b>BUILD MY GAME</b> gombot.</div>
              ) : (
                <div>
                  <div className="items" style={{marginTop:18}}>{build.items.map(function(item,index){
                    return <div className="item" key={index}><div className="itemIcon">{index === 5 ? 'BOOT' : index+1}</div><b>{item}</b><small>{index < 2 ? 'CORE ITEM' : index === 5 ? 'BOOTS' : 'SITUATIONAL'}</small></div>
                  })}</div>
                  <div className="metric" style={{marginTop:12}}>{Object.entries(build.stats).map(function(pair){
                    return <div className="metricBox" key={pair[0]}><span>{pair[0]}</span><strong>{pair[1]}</strong></div>
                  })}</div>
                </div>
              )}
            </div>

            {built && <div className="cols">
              <div className="panel">
                <div className="panelTitle"><h2>RUNES</h2></div>
                {build.runes.map(function(rune,index){return <div className="rune" key={rune}><div className="runeDot">{index+1}</div><b>{rune}</b></div>})}
                <div className="muted">SUMMONER: Flash + Ignite</div>
              </div>
              <div className="panel">
                <div className="panelTitle"><h2>COUNTER LOGIC</h2></div>
                <p className="explain">Az engine az ellenfél-kompozícióból threat tageket képez, majd ezek alapján pontozza a situational item slotokat.</p>
                <div className="saved">{build.threats.map(function(t){return <span className="chip active" key={t}>{t}</span>})}</div>
                <p className="explain"><span className="good">✓</span> {playstyle} prioritás<br/><span className="good">✓</span> {enemies.length} ellenfél figyelembe véve<br/><span className="danger">!</span> A build engine nem hivatalos Riot adatforrás.</p>
              </div>
            </div>}

            {built && <div className="panel">
              <div className="panelTitle"><h2>SKILL ORDER</h2><span className="muted">1 → 15</span></div>
              <div className="skillRow">{['1','2','3','1','4','1','2','1','2','3','4','2','2','3','3'].map(function(x,i){return <div className="chip active" key={i}>{x}</div>})}</div>
              <p className="explain">A skill order külön champion- és patch-adatból finomítható a következő engine rétegben.</p>
            </div>}

            {built && <div className="panel">
              <div className="panelTitle"><h2>WHY THIS BUILD</h2><button className="primary" onClick={saveBuild}>＋ MENTÉS</button></div>
              <p className="explain">A jelenlegi build a <b>{mine.name}</b> sebzéstípusára, a <b>{playstyle}</b> profilra és a kiválasztott ellenfélcsapatra reagál. A situational slotok dinamikusan újrasúlyozódnak.</p>
            </div>}

            {saved.length > 0 && <div className="panel">
              <div className="panelTitle"><h2>SAVED BUILDS</h2></div>
              <div className="saved">{saved.map(function(s,index){return <span className="chip active" key={index}>{s.champion} · {s.role} · {s.playstyle}</span>})}</div>
            </div>}
          </section>
        </section>

        <div className="panel" style={{marginTop:18}}>
          <div className="panelTitle"><h2>PATCH INTELLIGENCE · 7.3</h2><span className="muted">2026-09-21</span></div>
          <div className="metric">
            <div className="metricBox"><span>NEW CHAMPION LAYER</span><strong style={{fontSize:18}}>PATCH DATA</strong></div>
            <div className="metricBox"><span>BUILD ENGINE</span><strong style={{fontSize:18}}>ADAPTIVE</strong></div>
            <div className="metricBox"><span>ENEMY SLOTS</span><strong style={{fontSize:18}}>5</strong></div>
            <div className="metricBox"><span>ROLE MODES</span><strong style={{fontSize:18}}>5</strong></div>
          </div>
          <p className="explain" style={{marginBottom:0}}>A Forge külön kezeli a champion-, role-, matchup- és item-szabályokat, ezért az adatforrás később cserélhető anélkül, hogy a teljes felületet újra kellene írni.</p>
        </div>

        <div className="footer">WR FORGE is an unofficial fan-made tool and is not endorsed by Riot Games.</div>
      </main>
    </div>
  )
}

createRoot(document.getElementById('root')).render(<App />)
