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
const itemDetails={
  'Fiendhunter Bolts':{price:3000,stats:'AD · Crit · Attack Speed',passive:'First-hit pressure for marksmen; strongest when you can maintain range and repeated attacks.',build:'Core marksman opener',when:'Early power spike vs squishy targets.'},
  'Yun Tal Wildarrows':{price:3200,stats:'AD · Crit',passive:'Bleed-oriented critical damage profile for extended fights.',build:'AD + crit path',when:'Use when sustained physical damage is the win condition.'},
  'Infinity Edge':{price:3400,stats:'AD · Crit · Crit Damage',passive:'High-end critical strike capstone for champions that scale with critical damage.',build:'B. F. Sword + crit path',when:'Late-game damage spike after crit investment.'},
  'Mortal Reminder':{price:3000,stats:'AD · 30% Armor Penetration',passive:'Physical damage applies 50% Grievous Wounds for 3 seconds.',build:'Last Whisper + anti-heal path',when:'Against meaningful healing or armor stacking.'},
  'Guardian Angel':{price:3200,stats:'AD · Armor',passive:'Revive effect provides a second life after a lethal fight.',build:'AD + defensive path',when:'When preserving a shutdown or surviving engage matters.'},
  'Gluttonous Greaves':{price:1000,stats:'Lifesteal · Movement Speed',passive:'Boot upgrade focused on sustain and mobility.',build:'Boot upgrade',when:'For lane sustain and physical damage patterns.'},
  'Luden’s Echo':{price:3000,stats:'AP · Ability Haste · Mana',passive:'Burst-oriented spell damage profile with extra poke pressure.',build:'AP burst path',when:'For short trades and burst-focused mages.'},
  'Infinity Orb':{price:2900,stats:'AP · Magic Penetration',passive:'Inevitable Demise critical threshold is 40% in patch 7.3.',build:'AP penetration path',when:'Against low-to-medium durability targets.'},
  'Rabadon’s Deathcap':{price:3300,stats:'AP · High AP',passive:'Large ability-power multiplier that amplifies a completed AP build.',build:'AP capstone',when:'After core AP items when raw spell scaling is valuable.'},
  'Void Staff':{price:3000,stats:'AP · Magic Penetration',passive:'Percentage magic penetration for cutting through magic resistance.',build:'AP penetration path',when:'Against substantial magic resistance.'},
  'Zhonya’s Hourglass':{price:3150,stats:'AP · Armor',passive:'Stasis active can deny lethal burst and buy time for cooldowns.',build:'AP defensive path',when:'Against assassins, dive or unavoidable burst.'},
  'Mana Boots':{price:1400,stats:'Mana · Movement Speed',passive:'Mana-focused boot option for spell-heavy champions.',build:'Boot upgrade',when:'When mana economy is limiting your lane or rotations.'},
  'Sunfire Aegis':{price:2700,stats:'Health · Armor',passive:'Immolate deals 20 + 1.5% bonus Health magic damage each second while in combat.',build:'Tank core',when:'Against melee-heavy fights where you can stay in range.'},
  'Thornmail':{price:2800,stats:'Health · Armor',passive:'Anti-basic-attack and anti-healing profile for physical threats.',build:'Armor defensive path',when:'Against attack-heavy champions and healing.'},
  'Amaranth’s Twinguard':{price:3200,stats:'Health · Armor · Magic Resist',passive:'Endurance builds stacks while fighting champions, creating a major tank durability spike.',build:'Tank capstone',when:'Late game when sustained frontline durability matters.'},
  'Force of Nature':{price:2850,stats:'Health · Magic Resist · Movement',passive:'Magic-resistance focused defense for repeated spell pressure.',build:'MR defensive path',when:'Against AP-heavy or poke-heavy teams.'},
  'Randuin’s Omen':{price:2700,stats:'Health · Armor',passive:'Crit-focused defensive profile that reduces the impact of repeated critical attacks.',build:'Armor + anti-crit path',when:'Against crit marksmen or multiple critical-strike threats.'},
  'Plated Steelcaps':{price:1000,stats:'Armor · Movement Speed',passive:'Basic-attack defense boot profile.',build:'Boot upgrade',when:'Against physical auto-attack pressure.'}
}
const itemCombatStats={
  'Fiendhunter Bolts':{as:45,crit:25},
  'Yun Tal Wildarrows':{ad:50,as:25,crit:0,critMax:25},
  'Infinity Edge':{ad:75,crit:25,critDamage:2.3},
  'Mortal Reminder':{ad:35,physPenPct:30},
  'Guardian Angel':{ad:50,armor:40},
  'Gluttonous Greaves':{lifesteal:8},
  'Luden’s Echo':{ap:100,ah:10,mana:500,magicPenPct:7,luden:true},
  'Infinity Orb':{ap:110,magicPenPct:7,magicPenFlat:15,orb:true},
  'Rabadon’s Deathcap':{ap:130,magicPenPct:7,deathcap:true},
  'Void Staff':{ap:95,magicPenPct:40},
  'Zhonya’s Hourglass':{ap:75,armor:45},
  'Mana Boots':{mana:350},
  'Sunfire Aegis':{hp:400,armor:50,sunfire:true},
  'Thornmail':{hp:200,armor:75},
  'Amaranth’s Twinguard':{hp:300,armor:50,mr:50},
  'Force of Nature':{hp:350,mr:50},
  'Randuin’s Omen':{hp:350,armor:55},
  'Plated Steelcaps':{armor:40}
}
const championBaseAD={Ahri:53,Zed:64,'Lee Sin':64,Darius:64,Malphite:62,Jinx:58,Thresh:56,Lux:54,Vayne:58,Morgana:60,Hwei:52,Sylas:64,'Rek’Sai':64,Yunara:58,'Cho’Gath':69,'Kai’Sa':59,'Xin Zhao':66}

const championFallbackStats={Ahri:{hp:590,mp:345,ad:53,armor:30,mr:32,as:.72,ms:335},Zed:{hp:650,mp:200,ad:64,armor:35,mr:32,as:.67,ms:345},'Lee Sin':{hp:650,mp:200,ad:64,armor:36,mr:32,as:.80,ms:345},Darius:{hp:680,mp:320,ad:64,armor:40,mr:32,as:.68,ms:340},Malphite:{hp:645,mp:330,ad:62,armor:35,mr:32,as:.64,ms:335},Jinx:{hp:610,mp:345,ad:58,armor:30,mr:32,as:.62,ms:325},Thresh:{hp:630,mp:290,ad:56,armor:33,mr:32,as:.62,ms:335},Lux:{hp:590,mp:350,ad:54,armor:30,mr:32,as:.64,ms:335},Vayne:{hp:610,mp:345,ad:58,armor:30,mr:32,as:.69,ms:330},Morgana:{hp:620,mp:340,ad:60,armor:30,mr:32,as:.72,ms:335},Hwei:{hp:600,mp:340,ad:52,armor:30,mr:32,as:.66,ms:330},Sylas:{hp:645,mp:320,ad:64,armor:35,mr:32,as:.67,ms:340},'Rek’Sai':{hp:650,mp:0,ad:64,armor:36,mr:32,as:.72,ms:340},Yunara:{hp:610,mp:320,ad:58,armor:30,mr:32,as:.68,ms:330},'Cho’Gath':{hp:700,mp:360,ad:69,armor:42,mr:32,as:.64,ms:330},'Kai’Sa':{hp:610,mp:330,ad:59,armor:30,mr:32,as:.68,ms:335},'Xin Zhao':{hp:650,mp:300,ad:66,armor:35,mr:32,as:.76,ms:340}}

const championAbilityData={
Morgana:[{key:'P',name:'SOUL SIPHON',kind:'PASSIVE',effect:'Sebzéskor gyógyul a hősökből, nagy minionokból és közepes/nagy dzsungelszörnyekből.',damage:'Gyógyítás a kiosztott képességsebzés alapján.'},{key:'Q',name:'DARK BINDING',kind:'CONTROL',effect:'Előre küldött sötét lövedék, amely gyökerezi a célpontot.',damage:'Mágikus sebzés · AP skálázás.'},{key:'W',name:'TORMENTED SHADOW',kind:'AOE',effect:'Területre helyezhető sötét zóna, amely folyamatosan sebzi az ellenfeleket.',damage:'Folyamatos mágikus sebzés · AP skálázás.'},{key:'E',name:'BLACK SHIELD',kind:'SHIELD',effect:'Pajzsot ad egy szövetségesnek és véd a kontrollhatásoktól.',damage:'Nincs közvetlen sebzés.'},{key:'R',name:'SOUL SHACKLES',kind:'ULTIMATE',effect:'Közeli ellenfeleket láncol, lassít, majd kábít, ha a lánc megmarad.',damage:'Kétszakaszos mágikus sebzés · AP skálázás.'}],
Ahri:[{key:'P',name:'ESSENCE THEFT',kind:'PASSIVE',effect:'A képességek találatai a passzív gyógyítást és erőforrás-kezelést támogatják.',damage:'Passzív, képességfüggő.'},{key:'Q',name:'ORB OF DECEPTION',kind:'POKE',effect:'Előre és visszafelé haladó gömb.',damage:'Mágikus + valódi komponens.'},{key:'W',name:'FOX-FIRE',kind:'BURST',effect:'Célpontkereső lángok rövid cserehelyzetekhez.',damage:'Mágikus sebzés.'},{key:'E',name:'CHARM',kind:'CONTROL',effect:'Elbűvöli a célpontot.',damage:'Mágikus sebzés.'},{key:'R',name:'SPIRIT RUSH',kind:'MOBILITY',effect:'Többszörös dash és harci pozicionálás.',damage:'Ismételt mágikus sebzés.'}],
Zed:[{key:'P',name:'CONTEMPT FOR THE WEAK',kind:'PASSIVE',effect:'Alacsony életerejű célpontok ellen erősebb alap támadás.',damage:'Fizikai bónusz.'},{key:'Q',name:'RAZOR SHURIKEN',kind:'POKE',effect:'Shurikeneket dob egyenes vonalban.',damage:'Fizikai sebzés · AD.'},{key:'W',name:'LIVING SHADOW',kind:'MOBILITY',effect:'Árnyékot idéz és helycserét tesz lehetővé.',damage:'Képességfüggő.'},{key:'E',name:'SHADOW SLASH',kind:'AOE',effect:'Körkörös vágás lassítással.',damage:'Fizikai sebzés.'},{key:'R',name:'DEATH MARK',kind:'ULTIMATE',effect:'Megjelöl egy célpontot és a felhalmozott sebzést detonálja.',damage:'Fizikai burst · AD.'}]
}

const runeDetails={Electrocute:{category:'Domination',stats:'Adaptive damage',effect:'Három külön támadás vagy képesség rövid időn belül adaptív burst sebzést vált ki.',when:'Burst mage/assassin.'},'Sudden Impact':{category:'Domination',stats:'Penetration',effect:'Mobilitási képesség után ideiglenesen erősíti a penetrációt.',when:'Dash / engage.'},'Mark of the Weak':{category:'Domination',stats:'Damage amp',effect:'Kontrollált célpont ellen növeli a következő sebzési ablak erejét.',when:'CC-heavy setup.'},'Eyeball Collector':{category:'Domination',stats:'Adaptive power',effect:'Takedownokból fokozatos adaptív erőt épít.',when:'Snowball / scaling.'},Conqueror:{category:'Precision',stats:'AD / AP stacks',effect:'Harci találatokkal halmozható adaptív erő hosszú fightokra.',when:'DPS / extended fights.'},Brutal:{category:'Precision',stats:'Early damage',effect:'Korai adaptív támadóerőt ad.',when:'Lane pressure.'},'Coup de Grace':{category:'Precision',stats:'Low-health damage',effect:'Alacsony életerejű célpontok ellen növeli a befejező sebzést.',when:'Execution.'},'Legend: Alacrity':{category:'Precision',stats:'Attack Speed',effect:'Halmozódó támadási sebességet ad.',when:'Auto-attack DPS.'},Aftershock:{category:'Resolve',stats:'Defense + burst',effect:'CC indítása után ellenállóbbá tesz és visszasebzést ad.',when:'Engage tank.'},'Courage of the Colossus':{category:'Resolve',stats:'Shield',effect:'Kontrollhatás után védelmi pajzsot támogat.',when:'Frontline.'},'Bone Plating':{category:'Resolve',stats:'Trade defense',effect:'Az első beérkező trade után csökkenti a következő sebzéseket.',when:'Burst / poke ellen.'},Overgrowth:{category:'Resolve',stats:'Max Health',effect:'Közelben eleső egységekből maximális életerőt gyűjt.',when:'Tank scaling.'},'Fleet Footwork':{category:'Precision',stats:'Heal + speed',effect:'Feltöltve gyógyít és mozgási gyorsítást ad.',when:'Safe lane.'},'Second Wind':{category:'Resolve',stats:'Lane sustain',effect:'Ellenséges sebzés után regenerációt segít.',when:'Poke lane.'},'Sweet Tooth':{category:'Inspiration',stats:'Gold + heal',effect:'A Honeyfruit hatékonyabb gyógyítást és extra aranyat ad.',when:'Lane economy.'},'Summon Aery':{category:'Sorcery',stats:'Damage / shield',effect:'Poke-kor sebzést, támogató képességnél pajzsot segít.',when:'Poke / utility.'},Weakness:{category:'Domination',stats:'Damage amp',effect:'CC-vel eltalált célpont elleni sebzési ablakot erősíti.',when:'CC composition.'},'Manaflow Band':{category:'Sorcery',stats:'Max Mana',effect:'Képességtalálatokkal növeli a maximális manát.',when:'Mana-heavy mage.'}}

const spellDetails={FLASH:{icon:'FLASH',stats:'Mobility · reposition',effect:'Rövid irányított teleport.',when:'Menekülés, engage, dodge, reposition.'},IGNITE:{icon:'IGNITE',stats:'Damage · kill pressure',effect:'Időszakos célpontsebzés, amely kill pressure-t ad.',when:'Burst / kill lane.'},EXHAUST:{icon:'EXHAUST',stats:'Slow · damage reduction',effect:'Lassítja és gyengíti a célpont harci erejét.',when:'Assassin / hypercarry ellen.'}}

const itemCategory={'Fiendhunter Bolts':'Marksman','Yun Tal Wildarrows':'Marksman','Infinity Edge':'Marksman','Mortal Reminder':'Anti-Heal / Pen','Guardian Angel':'Defense','Gluttonous Greaves':'Boots','Luden’s Echo':'Mage / Burst','Infinity Orb':'Mage / Pen','Rabadon’s Deathcap':'Mage / AP','Void Staff':'Mage / Pen','Zhonya’s Hourglass':'Mage / Defense','Mana Boots':'Boots','Sunfire Aegis':'Tank / Frontline','Thornmail':'Tank / Anti-Heal','Amaranth’s Twinguard':'Tank / Scaling','Force of Nature':'Tank / MR','Randuin’s Omen':'Tank / Anti-Crit','Plated Steelcaps':'Boots / Armor'}
const statLabel={ad:'Attack Damage',ap:'Ability Power',as:'Attack Speed',crit:'Critical Strike',hp:'Health',armor:'Armor',mr:'Magic Resist',physPenPct:'Physical Pen %',physPenFlat:'Physical Pen',magicPenPct:'Magic Pen %',magicPenFlat:'Magic Pen',lifesteal:'Lifesteal',ah:'Ability Haste',mana:'Mana'}
function mitigation(raw,resist){return raw*(100/Math.max(100,100+resist))}
function calcBuildCombat(items,champion,level,targetArmor,targetMR){
  const totals={ad:0,ap:0,as:0,crit:0,hp:0,armor:0,mr:0,physPenPct:0,physPenFlat:0,magicPenPct:0,magicPenFlat:0,lifesteal:0,ah:0,mana:0}
  let hasIE=false,hasDeathcap=false,luden=false,sunfire=false,orb=false
  items.forEach(name=>{
    const s=itemCombatStats[name]||{}
    totals.ad+=(s.ad||0);totals.ap+=(s.ap||0);totals.as+=(s.as||0);totals.crit+=(s.crit||0);totals.hp+=(s.hp||0)
    totals.armor+=(s.armor||0);totals.mr+=(s.mr||0);totals.physPenPct=Math.max(totals.physPenPct,s.physPenPct||0)
    totals.physPenFlat+=(s.physPenFlat||0);totals.magicPenPct=Math.max(totals.magicPenPct,s.magicPenPct||0)
    totals.magicPenFlat+=(s.magicPenFlat||0);totals.lifesteal+=(s.lifesteal||0);totals.ah+=(s.ah||0);totals.mana+=(s.mana||0)
    hasIE=hasIE||!!s.critDamage;hasDeathcap=hasDeathcap||!!s.deathcap;luden=luden||!!s.luden;sunfire=sunfire||!!s.sunfire;orb=orb||!!s.orb
    if(s.critMax)totals.crit+=s.critMax
  })
  const ap=hasDeathcap?Math.round(totals.ap*1.3):totals.ap
  const baseAD=championBaseAD[champion.name]||60
  const totalAD=Math.round(baseAD+totals.ad+Math.max(0,level-1)*3.4)
  const critDamage=hasIE?2.3:2
  const avgAutoRaw=totalAD*(1+(Math.min(100,totals.crit)/100)*(critDamage-1))
  const effectiveArmor=Math.max(0,targetArmor*(1-totals.physPenPct/100)-totals.physPenFlat)
  const effectiveMR=Math.max(0,targetMR*(1-totals.magicPenPct/100)-totals.magicPenFlat)
  const auto=mitigation(avgAutoRaw,effectiveArmor)
  const attacksPerSecond=Math.min(3,0.625+totals.as/100)
  const sustainedDps=auto*attacksPerSecond
  const ludenRaw=luden?(75+0.08*ap):0
  const ludenDamage=mitigation(ludenRaw,effectiveMR)
  const sunfireRaw=sunfire?(20+0.015*totals.hp)*3:0
  const sunfireDamage=mitigation(sunfireRaw,effectiveMR)
  const itemProc=ludenDamage+sunfireDamage
  const critAuto=mitigation(totalAD*critDamage,effectiveArmor)
  const burst3s=auto*Math.max(1,Math.floor(attacksPerSecond*3))+itemProc
  const spellRaw=100+ap
  const spellDamage=mitigation(spellRaw,effectiveMR)
  return {totals:{...totals,ap,crit:Math.min(100,totals.crit),totalAD},effectiveArmor,effectiveMR,critDamage,avgAutoRaw,auto,critAuto,attacksPerSecond,sustainedDps,ludenDamage,sunfireDamage,itemProc,burst3s,spellDamage,orb}
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

const runeIconIds={Electrocute:8112,'Sudden Impact':8105,'Mark of the Weak':8126,'Eyeball Collector':8106,Conqueror:8010,Brutal:8305,'Coup de Grace':8200,'Legend: Alacrity':9104,Aftershock:8439,'Courage of the Colossus':8401,'Bone Plating':8473,Overgrowth:8451,'Fleet Footwork':8021,'Second Wind':8234,'Sweet Tooth':8444,'Summon Aery':8214,Weakness:8120,'Manaflow Band':8226}
const spellIconIds={FLASH:4,IGNITE:14,EXHAUST:3}
const runeIcon=(name)=>communityDragonBase+'/v1/perks/'+(runeIconIds[name]||8112)+'.png'
const spellIcon=(name)=>communityDragonBase+'/v1/summoner-spells/'+(spellIconIds[name]||4)+'.png'

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
  const s=raw.stats||raw.baseStats||{}
  return {id:raw.id||'live-'+index,name:raw.name||raw.id||'Champion',role,type,tags:rolesRaw,c1:'#36d8ff',c2:'#172d46',live:true,difficulty:raw.difficult,damage:raw.damage,survive:raw.survive,utility:raw.utility,stats:s,imageUrl:asset(raw.squarePortraitPath||raw.imagePath||'')}
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
function valueFrom(obj,keys,fallback=0){for(const k of keys){const v=obj?.[k];if(v!==undefined&&v!==null&&v!==''&&!Number.isNaN(Number(v)))return Number(v)}return fallback}
function championStats(c,lvl=15){const raw=c?.stats||{},fb=championFallbackStats[c?.name]||{hp:620,mp:300,ad:championBaseAD[c?.name]||60,armor:32,mr:32,as:.68,ms:335};const num=(keys,def)=>valueFrom(raw,keys,def);const hp=num(['health','hp','baseHealth'],fb.hp)+num(['healthPerLevel','hpPerLevel'],0)*(lvl-1);const mp=num(['mana','mp','baseMana'],fb.mp)+num(['manaPerLevel','mpPerLevel'],0)*(lvl-1);const ad=num(['attackDamage','ad','baseAttackDamage'],fb.ad)+num(['attackDamagePerLevel','adPerLevel'],0)*(lvl-1);const armor=num(['armor','baseArmor'],fb.armor)+num(['armorPerLevel'],0)*(lvl-1);const mr=num(['magicResist','mr','baseMagicResist'],fb.mr)+num(['magicResistPerLevel','mrPerLevel'],0)*(lvl-1);const as=num(['attackSpeed','baseAttackSpeed'],fb.as)+num(['attackSpeedPerLevel'],0)*(lvl-1)/100;const ms=num(['moveSpeed','movementSpeed','baseMoveSpeed'],fb.ms);return{level:lvl,health:Math.round(hp),mana:Math.round(mp),attackDamage:Math.round(ad),abilityPower:0,armor:Math.round(armor),magicResist:Math.round(mr),attackSpeed:Number(as.toFixed(2)),moveSpeed:Math.round(ms),source:Object.keys(raw).length?'LIVE DATA':'FORGE MODEL'}}
function abilityList(c){return championAbilityData[c?.name]||[{key:'P',name:'PASSIVE',kind:'PASSIVE',effect:'A hős egyedi passzív mechanikája.',damage:'Képességfüggő.'},{key:'Q',name:'Q ABILITY',kind:'ABILITY',effect:'Elsődleges képesség.',damage:'Képességfüggő.'},{key:'W',name:'W ABILITY',kind:'UTILITY',effect:'Másodlagos képesség.',damage:'Képességfüggő.'},{key:'E',name:'E ABILITY',kind:'CONTROL',effect:'Kontroll vagy utility.',damage:'Képességfüggő.'},{key:'R',name:'ULTIMATE',kind:'ULTIMATE',effect:'Ultimate képesség.',damage:'Képességfüggő.'}]}
function itemStatEntries(item){const s=itemCombatStats[item]||{};return Object.entries(s).filter(([k])=>statLabel[k]).map(([k,v])=>({label:statLabel[k],value:k==='as'||k.includes('Pct')?v+'%':v}))}
function CatalogIcon({src,alt,label}){return <div className="catalogIcon">{src?<img src={src} alt={alt} loading="lazy"/>:<span>{label}</span>}</div>}
function App(){
  const [tab,setTab]=useState('build'),[role,setRole]=useState('Mid'),[mine,setMine]=useState(champions[0]),[enemies,setEnemies]=useState([]),[playstyle,setPlaystyle]=useState('Burst'),[search,setSearch]=useState(''),[built,setBuilt]=useState(false),[selectedItem,setSelectedItem]=useState(null)
  const [liveChampions,setLiveChampions]=useState([]),[dataStatus,setDataStatus]=useState('loading')
  const [saved,setSaved]=useState(()=>readStore('wrforge-saved',[])),[matches,setMatches]=useState(()=>readStore('wrforge-matches',matchSeed))
  const [profile,setProfile]=useState(()=>readStore('wrforge-profile',{connected:false,region:'EU',riotId:'',rank:'Unranked',lastSync:null})),[level,setLevel]=useState(15),[targetArmor,setTargetArmor]=useState(100),[targetMR,setTargetMR]=useState(80)
  const [connectMsg,setConnectMsg]=useState(''),[riotMonitor,setRiotMonitor]=useState({status:'checking',account:null,monitor:null})
  const [catalogSearch,setCatalogSearch]=useState(''),[selectedRune,setSelectedRune]=useState('Electrocute'),[selectedSpell,setSelectedSpell]=useState('FLASH'),[selectedCatalogItem,setSelectedCatalogItem]=useState('Luden’s Echo'),[selectedAbility,setSelectedAbility]=useState('P')
  useEffect(()=>{let active=true;fetch(championDataUrl).then(r=>{if(!r.ok)throw Error();return r.json()}).then(data=>{if(!active)return;const n=Array.isArray(data)?data.filter(c=>c.is_wr!==false).map(normalizeChampion):[];if(n.length){setLiveChampions(n);setDataStatus('live')}else setDataStatus('fallback')}).catch(()=>active&&setDataStatus('fallback'));return()=>{active=false}},[])
  useEffect(()=>{try{localStorage.setItem('wrforge-saved',JSON.stringify(saved))}catch{}},[saved])
  useEffect(()=>{try{localStorage.setItem('wrforge-matches',JSON.stringify(matches))}catch{}},[matches])
  useEffect(()=>{try{localStorage.setItem('wrforge-profile',JSON.stringify(profile))}catch{}},[profile])
  useEffect(()=>{const params=new URLSearchParams(window.location.search);if(params.get('riot')==='connected'){setConnectMsg('Riot RSO sikeres. Profil ellenőrzése folyamatban…');window.history.replaceState({},'',window.location.pathname)}fetch('/api/riot/me').then(async r=>{const d=await r.json();setRiotMonitor(d);if(d.connected&&d.account){setProfile(p=>({...p,connected:true,riotId:d.account.gameName+'#'+d.account.tagLine,lastSync:d.monitor?.lastSync||new Date().toISOString()}));setConnectMsg('Riot-fiók sikeresen csatlakoztatva.')}else if(d.error||d.riotError){setConnectMsg('Riot kapcsolat hiba: '+(d.riotError||d.error))}}).catch(()=>{setRiotMonitor({status:'offline'});setConnectMsg('A Riot backend nem érhető el. Ellenőrizd a Vercel deploymentet és az RSO környezeti változókat.')})},[])
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
  const combat=useMemo(()=>calcBuildCombat(build.items,mine,level,targetArmor,targetMR),[build.items,mine,level,targetArmor,targetMR])
  const profileStats=useMemo(()=>{const total=matches.length,wins=matches.filter(m=>m.result==='WIN').length;return{total,wins,losses:total-wins,winrate:total?Math.round(wins/total*100):0,avgKda:total?(matches.reduce((s,m)=>s+m.kda,0)/total).toFixed(1):'0.0',avgDamage:total?(matches.reduce((s,m)=>s+m.damage,0)/total).toFixed(1):'0.0'}},[matches])
  const currentChampionStats=useMemo(()=>championStats(mine,level),[mine,level])
  const currentAbilities=useMemo(()=>abilityList(mine),[mine])
  const allRunes=[...new Set(Object.values(runes).flat())]
  const allItems=Object.keys(itemDetails)
  const filteredCatalogRunes=allRunes.filter(x=>x.toLowerCase().includes(catalogSearch.toLowerCase().trim()))
  const filteredCatalogSpells=Object.keys(spellDetails).filter(x=>x.toLowerCase().includes(catalogSearch.toLowerCase().trim()))
  const filteredCatalogItems=allItems.filter(x=>x.toLowerCase().includes(catalogSearch.toLowerCase().trim()))
  const filteredCatalogChampions=roster.filter(x=>x.name.toLowerCase().includes(catalogSearch.toLowerCase().trim())&&(role==='All'||x.role===role))
  function toggleEnemy(c){if(c.id===mine.id)return;const exists=enemies.some(e=>e.id===c.id);if(exists)setEnemies(enemies.filter(e=>e.id!==c.id));else if(enemies.length<5)setEnemies(enemies.concat(c))}
  function saveBuild(){setSaved(s=>s.concat({id:Date.now(),champion:mine.name,role,playstyle,items:build.items,score:build.score}))}
  function connectProfile(){window.location.href='/api/riot/login'}
  async function disconnectRiot(){await fetch('/api/riot/logout',{method:'POST'}).catch(()=>{});setRiotMonitor({status:'disconnected'});clearProfile()}
  function demoSync(){setProfile(p=>({...p,connected:true,riotId:'WR Forge Demo#EU',rank:'Diamond IV',lastSync:new Date().toISOString()}));setConnectMsg('Demo szinkron aktív. A valódi mérkőzésadatokhoz hivatalos Riot hozzáférés kell.')}
  function clearProfile(){setProfile({connected:false,region:'EU',riotId:'',rank:'Unranked',lastSync:null});setConnectMsg('Profilkapcsolat törölve erről az eszközről.')}
  function reset(){setBuilt(false);setEnemies([]);setPlaystyle('Burst')}
  return <div className="app">
    <div className="riftAmbient" aria-hidden="true"><i/><i/><i/><span/></div>
    <header className="top"><div className="brand"><div className="brandmark">WR</div><div><b>WR FORGE</b><small>WILD RIFT BUILD & MATCH INTELLIGENCE</small></div></div><div className="actions"><div className="select">PATCH 7.3</div><button className="ghost" onClick={reset}>↻ Reset</button></div></header>
    <nav className="nav">{[['build','⚔ BUILD FORGE'],['champions','♙ CHAMPIONOK'],['runes','◈ RUNÁK'],['spells','✦ SPELLEK'],['items','◇ ITEMEK'],['matches','◈ MATCH MONITOR'],['learn','▣ TANULJ'],['profile','◎ PROFILOM']].map(([id,label])=><button key={id} className={tab===id?'active':''} onClick={()=>{setTab(id);setCatalogSearch('')}}>{label}</button>)}</nav>
    <main className="container">
      <section className="hero">
  <div className="heroCard">
    <div className="heroScan" aria-hidden="true"></div>
    <div className="kicker">MATCH-ADAPTIVE BUILD ENGINE</div>
    <h1>BUILD YOUR<br/><span>GAME.</span></h1>
    <p>Buildet készítünk az ellenfél-kompozíció, a szerep, a playstyle és a matchup alapján. Kezdőtől a profi elemzésig.</p>
    <div className="heroActions">
      <button className="forgeBtn" onClick={()=>{setTab('build');setBuilt(true)}}>⚔ BUILD MY GAME →</button>
      <span className="heroMicro">MATCH READY · <b>01</b></span>
    </div>
    <div className="heroTelemetry" aria-hidden="true">
      <span>ADAPTIVE ENGINE</span><i></i><span>THREAT SCAN</span><i></i><span>BUILD OUTPUT</span>
    </div>
  </div>
  <div className="heroCard patch">
    <div className="patchOrb patchOrbA" aria-hidden="true"></div>
    <div className="patchOrb patchOrbB" aria-hidden="true"></div>
    <div className="patchGridArt" aria-hidden="true"></div>
    <div className="patchTop">
      <div className="kicker">DATA & PROFILE LAYER</div>
      <div className="patchStatus">
        <span className={dataStatus==='live'?'good':''}>{dataStatus==='live'?'● ONLINE':'○ '+(dataStatus==='fallback'?'LOCAL FALLBACK':'DATA LOADING')}</span>
        <span className={profile.connected?'good':''}>{profile.connected?'● RIOT PROFILE':'○ RIOT PROFILE'}</span>
      </div>
    </div>
    <div className="patchCore">
      <div className="patchCoreRing"><span>WR</span></div>
      <div><small>CURRENT PATCH</small><strong>7.3</strong><span>BUILD · MATCH · IMPROVE</span></div>
    </div>
    <div className="patchRail">
      <div><span>CHAMPION DATA</span><b>{dataStatus==='live'?'LIVE':'READY'}</b></div>
      <div><span>BUILD ENGINE</span><b>ADAPTIVE</b></div>
      <div><span>PROFILE LAYER</span><b>{profile.connected?'CONNECTED':'CONNECTABLE'}</b></div>
    </div>
  </div>
</section>

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
          {!built?<div className="emptyState">Állítsd be a meccset, majd nyomd meg a <b>BUILD MY GAME</b> gombot.</div>:<><div className="adviceBanner"><b>COACH ADVICE</b><span>{playstyle==='Burst'?'Keresd a rövid, kontrollált ablakokat; ne pazarold el az escape eszközöd az engage előtt.':playstyle==='DPS'?'Tartsd életben a DPS-ablakot: pozíció, folyamatos auto attack és célpontváltás a kulcs.':playstyle==='Tank'?'Te teremted meg a fight struktúráját. Ne csak sebzést tankolj: vedd el az ellenfél legfontosabb útvonalát.':playstyle==='Safe'?'A túlélés érték: farmolj stabilan, wardolj és csak akkor vállalj kockázatot, ha az előny mérhető.':'A csapat haszna az első: vision, peel, engage és cooldown-kezelés alapján játssz.'}</span></div><div className="items">{build.items.map((item,i)=><button className={'item '+(selectedItem===item?'selected':'')} key={i} onClick={()=>setSelectedItem(item)}><div className="itemIcon">{itemImage(item)?<img src={itemImage(item)} alt={item}/>:<span>{i===5?'BOOT':i+1}</span>}</div><b>{item}</b><small>{i<2?'CORE ITEM':i===5?'BOOTS':'SITUATIONAL'}</small></button>)}</div>{selectedItem&&itemDetails[selectedItem]&&<div className="itemDetail"><div><span className="kicker">ITEM INTELLIGENCE</span><h3>{selectedItem}</h3><p>{itemDetails[selectedItem].stats} · <b>{itemDetails[selectedItem].price} G</b></p></div><button className="ghost" onClick={()=>setSelectedItem(null)}>×</button><div className="itemDetailGrid"><div><span>PASSIVE</span><p>{itemDetails[selectedItem].passive}</p></div><div><span>BUILD PATH</span><p>{itemDetails[selectedItem].build}</p></div><div><span>WHEN TO BUY</span><p>{itemDetails[selectedItem].when}</p></div></div></div>}<div className="damagePanel">
  <div className="damageHead">
    <div><div className="kicker">COMBAT CALCULATOR</div><h3>{mine.name} · BUILD OUTPUT</h3><p>Az itemek statjaiból számolt elméleti sebzés. A champion képességek pontos sebzése skill-rang és találati helyzet nélkül nem kerül kitalálásra.</p></div>
    <div className="damageControls">
      <label>LVL <input type="number" min="1" max="18" value={level} onChange={e=>setLevel(Math.max(1,Math.min(18,Number(e.target.value)||1)))}/></label>
      <label>TARGET ARMOR <input type="number" min="0" max="500" value={targetArmor} onChange={e=>setTargetArmor(Math.max(0,Number(e.target.value)||0))}/></label>
      <label>TARGET MR <input type="number" min="0" max="500" value={targetMR} onChange={e=>setTargetMR(Math.max(0,Number(e.target.value)||0))}/></label>
    </div>
  </div>
  <div className="damageMetrics">
    <div className="damageMetric"><span>+ ATTACK DAMAGE</span><strong>{combat.totals.ad}</strong><small>item bonus</small></div>
    <div className="damageMetric"><span>ABILITY POWER</span><strong>{combat.totals.ap}</strong><small>Deathcap passive included</small></div>
    <div className="damageMetric"><span>CRIT</span><strong>{combat.totals.crit}%</strong><small>{combat.critDamage*100}% crit damage</small></div>
    <div className="damageMetric"><span>ATTACK SPEED</span><strong>{combat.attacksPerSecond.toFixed(2)}</strong><small>attacks / sec estimate</small></div>
    <div className="damageMetric"><span>PHYSICAL PEN</span><strong>{combat.totals.physPenPct}%{combat.totals.physPenFlat ? ' + '+combat.totals.physPenFlat : ''}</strong><small>vs {targetArmor} armor</small></div>
    <div className="damageMetric"><span>MAGIC PEN</span><strong>{combat.totals.magicPenPct}%{combat.totals.magicPenFlat ? ' + '+combat.totals.magicPenFlat : ''}</strong><small>vs {targetMR} MR</small></div>
  </div>
  <div className="damageResults">
    <div className="damageResult"><span>1 AUTO · AVG</span><strong>{Math.round(combat.auto)}</strong><small>post-mitigation physical</small></div>
    <div className="damageResult crit"><span>1 CRIT HIT</span><strong>{Math.round(combat.critAuto)}</strong><small>post-mitigation</small></div>
    <div className="damageResult"><span>SUSTAINED DPS</span><strong>{Math.round(combat.sustainedDps)}</strong><small>auto-based estimate</small></div>
    <div className="damageResult"><span>3 SEC BURST</span><strong>{Math.round(combat.burst3s)}</strong><small>autos + item procs</small></div>
  </div>
  <div className="damageBreakdown">
    <div><b>ITEM PROC DAMAGE</b><span>{Math.round(combat.itemProc)} / 3 sec</span></div>
    <div><b>LUDEN PROC</b><span>{Math.round(combat.ludenDamage)}</span></div>
    <div><b>SUNFIRE · 3 SEC</b><span>{Math.round(combat.sunfireDamage)}</span></div>
    <div><b>GENERIC 100+AP SPELL</b><span>{Math.round(combat.spellDamage)}</span></div>
  </div>
  <div className="damageFoot">Ez a panel build-szintű kalkulátor: armor/MR mitigációt, critet, penet, attack speedet és ismert item-procokat számol. Nem helyettesíti a champion saját Q/W/E/R képletét.</div>
</div>
<div className="metric">{Object.entries(build.stats).map(([k,v])=><div className="metricBox" key={k}><span>{k}</span><strong>{v}</strong><div className="bar"><i style={{width:v+'%'}}/></div></div>)}</div></>}
        </div>
        {built&&<><div className="cols"><div className="panel"><div className="panelTitle"><h2>RUNES & SPELLS</h2></div>{build.runes.map((r,i)=><div className="runeCard" key={r}><div className="runeIcon"><img src={runeIcon(r)} alt={r}/><span>{i+1}</span></div><div><b>{r}</b><small>RECOMMENDED RUNE</small></div><em>✓</em></div>)}<div className="spellRow"><div className="spellCard"><img src={spellIcon('FLASH')} alt="Flash"/><div><b>FLASH</b><small>SUMMONER SPELL</small></div></div><div className="spellCard"><img src={spellIcon(playstyle==='Utility'?'EXHAUST':'IGNITE')} alt={playstyle==='Utility'?'Exhaust':'Ignite'}/><div><b>{playstyle==='Utility'?'EXHAUST':'IGNITE'}</b><small>SUMMONER SPELL</small></div></div></div></div><div className="panel"><div className="panelTitle"><h2>COUNTER LOGIC</h2></div><p className="explain">Az engine threat tageket épít az enemy teamből, majd ezek alapján újrasúlyozza a situational slotokat.</p><div className="saved">{build.threats.map(t=><span className="chip active" key={t}>{t}</span>)}</div><p className="explain"><span className="good">✓</span> {playstyle} prioritás<br/><span className="good">✓</span> {enemies.length} ellenfél figyelembe véve</p></div></div>
        <div className="panel"><div className="panelTitle"><h2>SKILL ORDER & GAMEPLAN</h2><span className="muted">1 → 15</span></div><div className="skillRow">{['1','2','3','1','4','1','2','1','2','3','4','2','2','3','3'].map((x,i)=><div className="chip active" key={i}>{x}</div>)}</div><div className="tipsGrid"><div><b>EARLY GAME</b><p>Biztonságos wave-kezelés, matchup-specifikus trade és első power spike.</p></div><div><b>MID GAME</b><p>Objective előtt 30–45 mp vision, lane priority és cooldown check.</p></div><div><b>LATE GAME</b><p>A carry-k védelme és a fight első 3 másodperce dönti el a legtöbb helyzetet.</p></div></div></div>
        <div className="panel"><div className="panelTitle"><h2>WHY THIS BUILD</h2><button className="primary" onClick={saveBuild}>＋ MENTÉS</button></div><p className="explain">A build a <b>{mine.name}</b> sebzéstípusára, a <b>{playstyle}</b> profilra és a kiválasztott ellenfelekre reagál. A mentett build bekerül a saját build könyvtáradba.</p></div></>}
        </section>
      </section>}


      {tab==='champions'&&<section className="catalogPage">
        <div className="catalogHeader"><div><div className="kicker">CHAMPION DATABASE</div><h2>CHAMPIONOK · STATOK · KÉPESSÉGEK</h2><p>Válassz hőst, állítsd a szintet, és minden fontos harci adatot egy helyen látsz.</p></div><input className="search catalogSearch" placeholder="Champion keresése..." value={catalogSearch} onChange={e=>setCatalogSearch(e.target.value)}/></div>
        <div className="catalogLayout">
          <div className="panel catalogList">{filteredCatalogChampions.map(ch=><button key={ch.id} className={'catalogRow '+(mine.id===ch.id?'active':'')} onClick={()=>{setMine(ch);setRole(ch.role);setSelectedAbility('P')}}><CatalogIcon src={championImage(ch)} alt={ch.name} label={initials(ch.name)}/><span><b>{ch.name}</b><small>{ch.role} · {ch.type}</small></span><em>→</em></button>)}</div>
          <div className="panel championDetail">
            <div className="champHero"><CatalogIcon src={championImage(mine)} alt={mine.name} label={initials(mine.name)}/><div><div className="kicker">CHAMPION OVERVIEW</div><h2>{mine.name}</h2><p>{mine.tags?.join(' · ')||mine.type} · {mine.role}</p></div><div className="champLevel"><span>LEVEL {level}</span><input type="range" min="1" max="18" value={level} onChange={e=>setLevel(Number(e.target.value))}/></div></div>
            <div className="statGrid">
              {[["Életerő",currentChampionStats.health],["Mana",currentChampionStats.mana],["Sebzés",currentChampionStats.attackDamage],["Páncél",currentChampionStats.armor],["Varázsellenállás",currentChampionStats.magicResist],["Támadási sebesség",currentChampionStats.attackSpeed],["Mozgási sebesség",currentChampionStats.moveSpeed],["Ability Power",currentChampionStats.abilityPower]].map(([label,value])=><div className="statCard" key={label}><span>{label}</span><strong>{value}</strong><small>{currentChampionStats.source}</small></div>)}
            </div>
            <div className="abilityGrid">{currentAbilities.map(a=><button key={a.key} className={'abilityCard '+(selectedAbility===a.key?'active':'')} onClick={()=>setSelectedAbility(a.key)}><span>{a.key}</span><b>{a.name}</b><small>{a.kind}</small></button>)}</div>
            {(()=>{const a=currentAbilities.find(x=>x.key===selectedAbility)||currentAbilities[0];return <div className="abilityDetail"><div className="abilityBadge">{a.key}</div><div><div className="detailEyebrow">{a.kind}</div><h3>{a.name}</h3><p>{a.effect}</p><div className="abilityDamage"><b>SEBZÉS / HATÁS</b><span>{a.damage}</span></div></div></div>})()}
          </div>
        </div>
      </section>}

      {tab==='runes'&&<section className="catalogPage">
        <div className="catalogHeader"><div><div className="kicker">RUNE DATABASE</div><h2>RUNÁK · HATÁS · AJÁNLÁS</h2><p>Ikonokkal, funkcióval és használati helyzettel. A 7.3 rendszerhez igazított információs réteg.</p></div><input className="search catalogSearch" placeholder="Rúna keresése..." value={catalogSearch} onChange={e=>setCatalogSearch(e.target.value)}/></div>
        <div className="catalogLayout">
          <div className="panel catalogList">{filteredCatalogRunes.map(r=><button key={r} className={'catalogRow '+(selectedRune===r?'active':'')} onClick={()=>setSelectedRune(r)}><CatalogIcon src={runeIcon(r)} alt={r} label="R"/><span><b>{r}</b><small>{runeDetails[r]?.category||'RUNE'}</small></span><em>→</em></button>)}</div>
          <div className="panel catalogDetail"><div className="detailEyebrow">RUNE INTELLIGENCE · PATCH 7.3</div><div className="detailTitleRow"><CatalogIcon src={runeIcon(selectedRune)} alt={selectedRune} label="R"/><div><h2>{selectedRune}</h2><span>{runeDetails[selectedRune]?.category||'RUNE'}</span></div></div><div className="detailStats"><div><span>STAT / TÍPUS</span><b>{runeDetails[selectedRune]?.stats||'Adaptive'}</b></div><div><span>PATCH</span><b>7.3</b></div></div><div className="longDetail"><span>MIT CSINÁL?</span><p>{runeDetails[selectedRune]?.effect||'A rúna hatása.'}</p></div><div className="longDetail"><span>MIKOR HASZNÁLD?</span><p>{runeDetails[selectedRune]?.when||'Matchup és playstyle alapján.'}</p></div></div>
        </div>
      </section>}

      {tab==='spells'&&<section className="catalogPage">
        <div className="catalogHeader"><div><div className="kicker">SUMMONER SPELL DATABASE</div><h2>SPELLEK · HATÁS · HASZNÁLAT</h2><p>Válaszd ki a spell-t, és rögtön látható a szerepe, hatása és helyzete.</p></div><input className="search catalogSearch" placeholder="Spell keresése..." value={catalogSearch} onChange={e=>setCatalogSearch(e.target.value)}/></div>
        <div className="catalogLayout">
          <div className="panel catalogList">{filteredCatalogSpells.map(s=><button key={s} className={'catalogRow '+(selectedSpell===s?'active':'')} onClick={()=>setSelectedSpell(s)}><CatalogIcon src={spellIcon(s)} alt={s} label="S"/><span><b>{s}</b><small>SUMMONER SPELL</small></span><em>→</em></button>)}</div>
          <div className="panel catalogDetail"><div className="detailTitleRow"><CatalogIcon src={spellIcon(selectedSpell)} alt={selectedSpell} label="S"/><div><div className="detailEyebrow">SPELL INTELLIGENCE</div><h2>{selectedSpell}</h2><span>{spellDetails[selectedSpell].stats}</span></div></div><div className="longDetail"><span>MIT AD?</span><p>{spellDetails[selectedSpell].effect}</p></div><div className="longDetail"><span>MIKOR HASZNÁLD?</span><p>{spellDetails[selectedSpell].when}</p></div></div>
        </div>
      </section>}

      {tab==='items'&&<section className="catalogPage">
        <div className="catalogHeader"><div><div className="kicker">ITEM DATABASE</div><h2>ITEMEK · STATOK · PASSIVE · SEBZÉS</h2><p>Ár, statok, passzív, build path és a szituációs használat egy helyen.</p></div><input className="search catalogSearch" placeholder="Item keresése..." value={catalogSearch} onChange={e=>setCatalogSearch(e.target.value)}/></div>
        <div className="catalogLayout">
          <div className="panel catalogList">{filteredCatalogItems.map(item=><button key={item} className={'catalogRow '+(selectedCatalogItem===item?'active':'')} onClick={()=>setSelectedCatalogItem(item)}><CatalogIcon src={itemImage(item)} alt={item} label="I"/><span><b>{item}</b><small>{itemCategory[item]||'ITEM'}</small></span><em>{itemDetails[item].price} G</em></button>)}</div>
          <div className="panel catalogDetail">{(()=>{const d=itemDetails[selectedCatalogItem],stats=itemStatEntries(selectedCatalogItem);return <><div className="detailTitleRow"><CatalogIcon src={itemImage(selectedCatalogItem)} alt={selectedCatalogItem} label="I"/><div><div className="detailEyebrow">ITEM INTELLIGENCE · PATCH 7.3</div><h2>{selectedCatalogItem}</h2><span>{itemCategory[selectedCatalogItem]||'ITEM'} · {d.price} G</span></div></div><div className="itemStatGrid">{stats.length?stats.map(x=><div key={x.label}><span>{x.label}</span><b>{x.value}</b></div>):<div><span>STATOK</span><b>{d.stats}</b></div>}</div><div className="longDetail"><span>PASSIVE / KÉPESSÉG</span><p>{d.passive}</p></div><div className="longDetail"><span>BUILD PATH</span><p>{d.build}</p></div><div className="longDetail"><span>MIKOR VEDD?</span><p>{d.when}</p></div></>})()}</div>
        </div>
      </section>}

      {tab==='matches'&&<section className="dashboard"><div className="sectionHead"><div><div className="kicker">MATCH MONITOR</div><h2>Saját meccseid és trendjeid</h2><p>Csatlakoztatott profil esetén ezt a nézetet a hivatalos adatforrásból érkező mérkőzésekkel lehet feltölteni.</p></div><button className="primary" onClick={()=>setTab('profile')}>PROFIL CSATLAKOZTATÁSA</button></div><div className="metric"><div className="metricBox"><span>MATCHES</span><strong>{profileStats.total}</strong></div><div className="metricBox"><span>WIN RATE</span><strong>{profileStats.winrate}%</strong></div><div className="metricBox"><span>AVG KDA</span><strong>{profileStats.avgKda}</strong></div><div className="metricBox"><span>AVG DAMAGE</span><strong>{profileStats.avgDamage}k</strong></div></div><div className="panel"><div className="panelTitle"><h2>RECENT MATCHES</h2><span className="muted">{profile.connected?'PROFILE SYNC':'DEMO DATA'}</span></div><div className="matchList">{matches.map(m=><div className="matchRow" key={m.id}><div className={'result '+(m.result==='WIN'?'win':'loss')}>{m.result}</div><div className="matchChamp"><div className="miniPortrait">{initials(m.champion)}</div><div><b>{m.champion}</b><small>{m.role} · {m.date}</small></div></div><div><span>KDA</span><b>{m.score}</b></div><div><span>DAMAGE</span><b>{m.damage}k</b></div><div><span>GOLD</span><b>{m.gold}k</b></div><div><span>TIME</span><b>{m.duration}</b></div><div className="buildMini">{m.build.map(x=><span key={x}>{x}</span>)}</div></div>)}</div></div><div className="cols"><div className="panel"><div className="panelTitle"><h2>COACH FLAGS</h2></div><ul className="coachList"><li><b>Deaths 5–10 perc között:</b> figyeld a wave állapotát és a river visiont.</li><li><b>Build consistency:</b> csak indokolt esetben térj el a core itemektől.</li><li><b>Objective timing:</b> 30–45 mp-cel korábban kezdd a setupot.</li><li><b>Damage vs. survival:</b> ha sok a halál, a stat önmagában nem elég.</li></ul></div><div className="panel"><div className="panelTitle"><h2>BUILD HISTORY</h2></div><p className="explain">A rendszer összeveti a használt itemeket az ajánlott builddel, és megmutatja: <b>mit vettél</b>, <b>mit javasolt a Forge</b>, és <b>miért tértek el</b>.</p><button className="ghost" onClick={()=>setTab('build')}>ÚJ BUILD ELEMZÉSE →</button></div></div></section>}

      {tab==='profile'&&<section className="dashboard"><div className="profileHero panel"><div className="profileAvatar">WR</div><div><div className="kicker">RIOT ACCOUNT MONITOR</div><h2>{profile.connected?profile.riotId:'Riot profil nincs csatlakoztatva'}</h2><p>{profile.connected?'A Riot-fiók RSO-val kapcsolódik. A rendszer a saját profilodhoz engedélyezett adatokat használja; jelszót a WR FORGE nem kezel.':'Csatlakoztasd a Riot-fiókod biztonságos Riot Sign On átirányítással.'}</p></div><div className="profileActions">{profile.connected?<><span className="connected">● CONNECTED</span><button className="ghost" onClick={disconnectRiot}>LEVÁLASZTÁS</button></>:<><button className="primary" onClick={connectProfile}>RIOT ACCOUNT CSATLAKOZTATÁS</button><button className="ghost" onClick={demoSync}>DEMO SYNC</button></>}</div></div>{connectMsg&&<div className="notice">{connectMsg}</div>}<div className="metric"><div className="metricBox"><span>RANK</span><strong style={{fontSize:20}}>{profile.rank}</strong></div><div className="metricBox"><span>WIN RATE</span><strong>{profileStats.winrate}%</strong></div><div className="metricBox"><span>MATCHES</span><strong>{profileStats.total}</strong></div><div className="metricBox"><span>LAST SYNC</span><strong style={{fontSize:15}}>{profile.lastSync?new Date(profile.lastSync).toLocaleTimeString('hu-HU'):'—'}</strong></div></div><div className="cols"><div className="panel"><div className="panelTitle"><h2>MONITOR STATUS</h2><span className={riotMonitor.status==='connected'?'good':'muted'}>● {riotMonitor.status==='connected'?'LIVE CONNECTION':'WAITING'}</span></div><div className="checkRows">{[['Riot account','connected'],['OAuth session','connected'],['Player identity','connected'],['Wild Rift match feed',riotMonitor.monitor?.wildRiftMatchFeed==='not_available_via_public_riot_api'?'Riot approval / data source required':'ready'],['KDA / damage / gold','adapter ready'],['Build / rune history','adapter ready'],['Trend analysis','ready'],['Coaching flags','ready']].map(x=><div key={x[0]}><span className={x[1]==='connected'||x[1]==='ready'?'good':'muted'}>{x[1]==='connected'||x[1]==='ready'?'✓':'○'}</span>{x[0]}<span className="muted">{x[1]}</span></div>)}</div></div><div className="panel"><div className="panelTitle"><h2>LIVE MONITOR</h2><span className="muted">{riotMonitor.monitor?.lastSync?'SYNCED':'NOT SYNCED'}</span></div><div className="monitorHero"><strong>{profile.connected?'RIOT ACCOUNT CONNECTED':'CONNECT RIOT ACCOUNT'}</strong><span>{profile.connected?'A profilazonosítás működik. A Wild Rift mérkőzésadatok automatikus monitorozásához Riot által engedélyezett Wild Rift adatforrás kell.':'A gombbal közvetlenül a Riot Sign On oldalára kerülsz.'}</span></div><p className="explain"><b>Következő réteg:</b> amint a Riot az alkalmazásnak Wild Rift mérkőzésadat-hozzáférést ad, a monitor ide fogja tölteni a meccseket, KDA-t, sebzést, aranyat, item-időzítést, build-eltérést és fejlődési trendeket.</p></div></div></section>}

      {tab==='learn'&&<section className="dashboard"><div className="sectionHead"><div><div className="kicker">LEARN & IMPROVE</div><h2>Kezdőtől a profi szintig</h2><p>A Forge nem csak itemet ad: elmagyarázza, mit csinálj a következő meccsen és miért.</p></div></div><div className="levelGrid">{[['01','KEZDŐ','Alapok','Role, lane, farm, vision, itemek és egyszerű matchup szabályok.'],['02','HALADÓ','Döntések','Wave management, reset timing, objective setup, trade ablakok.'],['03','VERSENYZŐ','Makró','Tempo, cross-map játék, win condition, resource trade és draft gondolkodás.'],['04','PRO','Elemzés','Match-by-match review, build deviation, death patterns, power spike és ellenfél-adaptáció.']].map(x=><div className="levelCard" key={x[0]}><span>{x[0]}</span><div className="kicker">{x[1]}</div><h3>{x[2]}</h3><p>{x[3]}</p><button className="ghost" onClick={()=>setTab('build')}>GYAKORLÁS →</button></div>)}</div><div className="cols"><div className="panel"><div className="panelTitle"><h2>MECCS ELŐTT</h2></div><ul className="coachList"><li>Azonosítsd az ellenfél fő sebzésforrását.</li><li>Jelöld ki a saját win conditiont.</li><li>Válaszd ki a playstyle-t a csapatodhoz, ne csak a championedhez.</li><li>Legyen előre megtervezve legalább 1 situational item.</li></ul></div><div className="panel"><div className="panelTitle"><h2>MECCS UTÁN</h2></div><ul className="coachList"><li>Mi okozta a legtöbb halált?</li><li>Melyik item vásárlás késett?</li><li>Mikor vesztettél tempo-t?</li><li>Az ajánlott buildtől való eltérés javított vagy rontott?</li></ul></div></div></section>}

      <div className="panel bottomInfo"><div className="panelTitle"><h2>PATCH INTELLIGENCE · 7.3</h2><span className="muted">DATA LAYER</span></div><div className="metric"><div className="metricBox"><span>BUILD ENGINE</span><strong style={{fontSize:18}}>ADAPTIVE</strong></div><div className="metricBox"><span>MATCH MONITOR</span><strong style={{fontSize:18}}>READY</strong></div><div className="metricBox"><span>PROFILE</span><strong style={{fontSize:18}}>{profile.connected?'CONNECTED':'CONNECTABLE'}</strong></div><div className="metricBox"><span>LEARNING</span><strong style={{fontSize:18}}>4 LEVELS</strong></div></div></div>
      <div className="footer">WR FORGE is an unofficial fan-made tool and is not endorsed by Riot Games.</div>
    </main>
  </div>
}
createRoot(document.getElementById('root')).render(<App />)
