/* ═══════════════════════════════════════
   AUDIO ENGINE  (deep sci-fi / dark synth)
═══════════════════════════════════════ */
const AC = new (window.AudioContext || window.webkitAudioContext)();
function resumeAC(){ if(AC.state==='suspended') AC.resume(); }
document.addEventListener('pointerdown', resumeAC, {once:true});

function note(freq,type,dur,vol,delay,detune){
  vol=vol||0.15; delay=delay||0; detune=detune||0;
  const o=AC.createOscillator(), g=AC.createGain(), f=AC.createBiquadFilter();
  f.type='lowpass'; f.frequency.value=1800;
  o.connect(f); f.connect(g); g.connect(AC.destination);
  o.type=type; o.frequency.value=freq; o.detune.value=detune;
  const t=AC.currentTime+delay;
  g.gain.setValueAtTime(0,t);
  g.gain.linearRampToValueAtTime(vol, t+0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t+dur);
  o.start(t); o.stop(t+dur+0.05);
}
function rev(freq,vol,delay){ note(freq,'sine',0.8,vol||0.05,delay||0,-5); note(freq,'sine',0.8,(vol||0.05)*0.3,(delay||0)+0.02,8); }
function sfxStart(){ note(55,'sawtooth',0.6,0.18); note(82,'sawtooth',0.7,0.12,0.06); note(110,'sine',0.9,0.1,0.12); note(165,'sine',0.7,0.08,0.22); note(220,'sine',0.5,0.06,0.38); rev(220,0.04,0.38); }
function sfxEmerge(i){ const d=i*0.07; note(180,'sawtooth',0.28,0.13,d); note(270,'sine',0.32,0.08,d+0.04); rev(270,0.04,d+0.04); }
function sfxOpen(){ [0,0.09,0.18].forEach((d,i)=>{ const f=[110,138,165][i]; note(f,'sawtooth',0.55,0.13,d); rev(f*2,0.05,d+0.05); }); }
function sfxClose(){ note(150,'sawtooth',0.3,0.12); note(100,'sawtooth',0.4,0.1,0.09); note(70,'sine',0.5,0.08,0.2); }
function sfxTab(){ note(420,'square',0.1,0.1); note(630,'sine',0.08,0.07,0.06); }
function sfxLink(){ note(860,'sine',0.13,0.1); rev(860,0.04,0.01); }
function sfxError(){ note(110,'sawtooth',0.3,0.15); note(90,'sawtooth',0.35,0.12,0.1); }
function sfxSuccess(){ [0,0.09,0.18].forEach((d,i)=>note([330,440,550][i],'sine',0.3,0.1,d)); }

/* ═══════════════════════════════════════
   HIEROGLYPH BACKGROUND
═══════════════════════════════════════ */
(function(){
  const canvas=document.getElementById('hiero-canvas');
  const ctx=canvas.getContext('2d');
  const glyphs='\u{13080}\u{13199}\u{13191}\u{130FB}\u{1308B}\u{131A3}\u{130FD}\u{13155}\u{13188}\u{13171}\u{130FC}\u{130A7}\u{13000}\u{1303F}\u{131BC}\u{13183}\u{1300F}\u{1312A}\u{131CB}\u{1318D}\u{131BC}\u{13124}\u{13154}\u{1317C}\u{1308B}\u{13111}\u{1315D}\u{13079}\u{13226}\u{131F2}';
  const arr=[...glyphs];
  let cols=[], W=0, H=0;
  function resize(){
    W=canvas.width=window.innerWidth; H=canvas.height=window.innerHeight;
    const n=Math.floor(W/28); cols=[];
    for(let i=0;i<n;i++){
      const chs=[];
      for(let j=0;j<Math.ceil(H/22)+3;j++) chs.push(arr[Math.floor(Math.random()*arr.length)]);
      cols.push({x:i*28+14, y:Math.random()*H*1.5-H*0.5, speed:0.35+Math.random()*0.65, chars:chs, alpha:0.1+Math.random()*0.18});
    }
  }
  let last=0;
  function draw(ts){
    const dt=Math.min(ts-last,50); last=ts;
    ctx.fillStyle='rgba(2,8,14,0.18)'; ctx.fillRect(0,0,W,H);
    cols.forEach(c=>{
      c.y+=c.speed*(dt/16);
      if(c.y>H+c.chars.length*22){ c.y=-c.chars.length*22; c.chars=c.chars.map(()=>arr[Math.floor(Math.random()*arr.length)]); }
      c.chars.forEach((g,i)=>{
        const cy=c.y+i*22; if(cy<-24||cy>H+4) return;
        const bright=i===c.chars.length-1;
        ctx.fillStyle=bright?`rgba(255,215,0,${c.alpha*3})`:`rgba(200,150,12,${c.alpha})`;
        ctx.font=`${bright?16:14}px 'Share Tech Mono',monospace`;
        ctx.fillText(g,c.x,cy);
        if(Math.random()<0.002) c.chars[i]=arr[Math.floor(Math.random()*arr.length)];
      });
    });
    requestAnimationFrame(draw);
  }
  resize(); requestAnimationFrame(draw); window.addEventListener('resize',resize);
})();

/* ═══════════════════════════════════════
   STARS (loader)
═══════════════════════════════════════ */
(function(){
  const canvas=document.getElementById('stars-canvas');
  const ctx=canvas.getContext('2d');
  let stars=[];
  function resize(){ canvas.width=window.innerWidth; canvas.height=window.innerHeight; }
  function init(){ stars=[]; for(let i=0;i<180;i++) stars.push({x:Math.random()*canvas.width, y:Math.random()*canvas.height, r:Math.random()*1.2+0.2, speed:Math.random()*0.008+0.003, phase:Math.random()*Math.PI*2}); }
  function draw(t){ ctx.clearRect(0,0,canvas.width,canvas.height); stars.forEach(s=>{ const a=0.3+0.5*Math.sin(t*s.speed*60+s.phase); ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fillStyle=`rgba(255,220,100,${a})`; ctx.fill(); }); requestAnimationFrame(draw); }
  resize(); init(); requestAnimationFrame(draw);
  window.addEventListener('resize',()=>{ resize(); init(); });
})();

/* ═══════════════════════════════════════
   LOADER
═══════════════════════════════════════ */
window.addEventListener('DOMContentLoaded', function(){
  const fill=document.getElementById('progress-fill'),
        pct=document.getElementById('loader-pct'),
        sub=document.getElementById('loader-sub'),
        loader=document.getElementById('loader'),
        main=document.getElementById('main');
  let progress=0, stepIdx=0;
  const steps=[
    {target:30,  delay:20, label:'LOADING ANCIENT PROTOCOLS...'},
    {target:65,  delay:18, label:'DECODING HIEROGLYPHICS...'},
    {target:85,  delay:25, label:'SYNCING WITH KAFR EL SHEIKH...'},
    {target:100, delay:15, label:'SYSTEM ONLINE'}
  ];
  function runStep(){
    if(stepIdx>=steps.length) return;
    const step=steps[stepIdx]; sub.textContent=step.label;
    const iv=setInterval(()=>{
      progress++; fill.style.width=progress+'%'; pct.textContent=progress+'%';
      if(progress>=step.target){
        clearInterval(iv); stepIdx++;
        if(progress<100) setTimeout(runStep,200); else setTimeout(showMain,500);
      }
    }, step.delay);
  }
  function showMain(){
    loader.style.transition='opacity 0.8s ease'; loader.style.opacity='0';
    setTimeout(()=>{ loader.style.display='none'; main.classList.add('visible'); }, 800);
  }
  runStep();
});

/* ═══════════════════════════════════════
   NODE SYSTEM  — fixed positions, no drag
═══════════════════════════════════════ */
let mainActive=false, socialsActive=false;
const SOCIAL_IDS=['soc-insta','soc-discord','soc-github','soc-spotify','soc-steam','soc-roblox'];

/* ── Particle canvas for energy strings ── */
const pCanvas = document.createElement('canvas');
pCanvas.style.cssText='position:fixed;inset:0;width:100%;height:100%;z-index:4;pointer-events:none;';
document.getElementById('node-stage').prepend(pCanvas);
const pCtx = pCanvas.getContext('2d');

function resizePC(){ pCanvas.width=window.innerWidth; pCanvas.height=window.innerHeight; }
resizePC(); window.addEventListener('resize', resizePC);

/* Each "link" is a pair of node IDs + colour */
let activeLinks = [];   // {from, to, color, particles:[]}
let particleRAF = null;

function getCenter(id){
  const el = document.getElementById(id);
  if(!el) return null;
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width/2, y: r.top + r.height/2 };
}

/* Cubic bezier control point for a link */
function cpFor(ax,ay,bx,by,fromId,toId){
  // Give each link a distinctive arc
  const mid = { x:(ax+bx)/2, y:(ay+by)/2 };
  const dx = bx-ax, dy = by-ay;
  const perp = { x:-dy, y:dx };
  const len = Math.sqrt(perp.x**2+perp.y**2)||1;
  let sign = 1;
  // deterministic sign per link pair so they don't overlap
  if(fromId==='start-node'&&toId==='bio-node')    sign=-1;
  if(fromId==='start-node'&&toId==='msg-node')    sign= 1;
  if(fromId==='start-node'&&toId==='socials-node')sign= 1;
  const curve = Math.sqrt(dx**2+dy**2)*0.35;
  return { cx: mid.x + sign*(perp.x/len)*curve, cy: mid.y + sign*(perp.y/len)*curve };
}

/* Point along a quadratic bezier at t */
function bezierPt(ax,ay,cx,cy,bx,by,t){
  const mt=1-t;
  return { x: mt*mt*ax + 2*mt*t*cx + t*t*bx,
           y: mt*mt*ay + 2*mt*t*cy + t*t*by };
}

function spawnParticle(link){
  link.particles.push({
    t: 0,
    speed: 0.004 + Math.random()*0.006,
    size:  1.5 + Math.random()*2,
    alpha: 0.7 + Math.random()*0.3,
    trail: []
  });
}

function colorForLink(fromId, toId){
  if(fromId==='start-node' && toId==='bio-node')    return '#ffd700';
  if(fromId==='start-node' && toId==='msg-node')    return '#00e5ff';
  if(fromId==='start-node' && toId==='socials-node')return '#ffaa00';
  return '#c8960c';
}

/* Build / rebuild links based on current active state */
function rebuildLinks(){
  activeLinks = [];
  if(!mainActive) return;

  const mainPairs = [
    ['start-node','bio-node'],
    ['start-node','msg-node'],
    ['start-node','socials-node']
  ];
  mainPairs.forEach(([a,b])=>{
    activeLinks.push({
      from: a, to: b,
      color: colorForLink(a,b),
      particles: [],
      spawnTimer: 0
    });
  });

  if(socialsActive){
    SOCIAL_IDS.forEach(id=>{
      activeLinks.push({
        from:'socials-node', to:id,
        color:'#c8960c',
        particles:[],
        spawnTimer: Math.random()*60  // stagger spawns
      });
    });
  }
}

/* Main particle render loop */
function particleLoop(){
  pCtx.clearRect(0,0,pCanvas.width,pCanvas.height);

  activeLinks.forEach(link=>{
    const A = getCenter(link.from);
    const B = getCenter(link.to);
    if(!A||!B) return;

    const cp = cpFor(A.x,A.y,B.x,B.y,link.from,link.to);

    /* Draw the base string — thin glowing line */
    pCtx.beginPath();
    pCtx.moveTo(A.x,A.y);
    pCtx.quadraticCurveTo(cp.cx,cp.cy,B.x,B.y);
    pCtx.strokeStyle = link.color;
    pCtx.lineWidth = 1;
    pCtx.globalAlpha = 0.18;
    pCtx.stroke();
    pCtx.globalAlpha = 1;

    /* Spawn new particles at interval */
    link.spawnTimer++;
    const spawnRate = link.from==='socials-node' ? 55 : 38;
    if(link.spawnTimer >= spawnRate){
      link.spawnTimer = 0;
      spawnParticle(link);
    }

    /* Update + draw particles */
    link.particles = link.particles.filter(p=>{
      p.t += p.speed;
      if(p.t > 1) return false;

      const pos = bezierPt(A.x,A.y,cp.cx,cp.cy,B.x,B.y,p.t);
      p.trail.push({x:pos.x, y:pos.y});
      if(p.trail.length > 10) p.trail.shift();

      /* Draw trail */
      p.trail.forEach((pt,i)=>{
        const trailAlpha = (i/p.trail.length) * p.alpha * 0.5;
        const trailSize  = p.size * (i/p.trail.length) * 0.7;
        pCtx.beginPath();
        pCtx.arc(pt.x, pt.y, trailSize, 0, Math.PI*2);
        pCtx.fillStyle = link.color;
        pCtx.globalAlpha = trailAlpha;
        pCtx.fill();
      });

      /* Draw main dot — bright core */
      const grad = pCtx.createRadialGradient(pos.x,pos.y,0, pos.x,pos.y,p.size*2.5);
      grad.addColorStop(0, link.color);
      grad.addColorStop(1, 'transparent');
      pCtx.beginPath();
      pCtx.arc(pos.x,pos.y,p.size*2.5,0,Math.PI*2);
      pCtx.fillStyle = grad;
      pCtx.globalAlpha = p.alpha * 0.6;
      pCtx.fill();

      pCtx.beginPath();
      pCtx.arc(pos.x,pos.y,p.size,0,Math.PI*2);
      pCtx.fillStyle = '#ffffff';
      pCtx.globalAlpha = p.alpha * 0.9;
      pCtx.fill();

      pCtx.globalAlpha = 1;
      return true;
    });
  });

  particleRAF = requestAnimationFrame(particleLoop);
}

particleRAF = requestAnimationFrame(particleLoop);

/* ─────────────────────────────────────
   NODE SHOW/HIDE  — just opacity + pointer-events,
   no position changes
───────────────────────────────────── */
function activateStart(){
  if(mainActive) return;
  resumeAC(); sfxStart(); mainActive=true;

  const sn=document.getElementById('start-node');
  sn.style.animation='none';
  sn.style.boxShadow='0 0 50px rgba(200,150,12,.6)';

  /* Reveal the 3 main child nodes with a ripple each */
  ['bio-node','msg-node','socials-node'].forEach((id,i)=>{
    setTimeout(()=>{
      const el=document.getElementById(id);
      el.classList.add('visible');
      sfxEmerge(i);
      const r=el.getBoundingClientRect();
      ripple(r.left+r.width/2, r.top+r.height/2);
    }, 130+i*130);
  });

  /* Start particle strings slightly after nodes appear */
  setTimeout(()=>{ rebuildLinks(); }, 500);
}

function activateSocials(){
  if(!mainActive) return;
  resumeAC();
  if(socialsActive){
    sfxClose(); socialsActive=false;
    SOCIAL_IDS.forEach(id=>document.getElementById(id).classList.remove('visible'));
    rebuildLinks(); return;
  }
  socialsActive=true;
  SOCIAL_IDS.forEach((id,i)=>{
    setTimeout(()=>{
      const el=document.getElementById(id);
      el.classList.add('visible');
      sfxEmerge(i);
      const r=el.getBoundingClientRect();
      ripple(r.left+r.width/2, r.top+r.height/2);
    }, 60+i*70);
  });
  setTimeout(()=>{ rebuildLinks(); }, 520);
}

function ripple(x,y){
  const d=document.createElement('div'); d.className='ripple-ring';
  d.style.cssText=`left:${x}px;top:${y}px;width:90px;height:90px;`;
  document.body.appendChild(d); setTimeout(()=>d.remove(), 800);
}
function goLink(url){ resumeAC(); sfxLink(); setTimeout(()=>window.open(url,'_blank'),130); }

/* Rebuild strings on resize so they track node positions */
window.addEventListener('resize', ()=>{ if(mainActive) rebuildLinks(); });

/* ═══════════════════════════════════════
   PANEL
═══════════════════════════════════════ */
const panelWrap  = document.getElementById('panel-wrap');
const panelBody  = document.getElementById('panel-body');
const panelTitle = document.getElementById('panel-title');

function openPanel(type){
  resumeAC(); sfxOpen();
  panelTitle.textContent = type==='bio' ? 'IWEADAM \u2014 BIO' : 'DROP A MESSAGE';
  panelBody.innerHTML    = type==='bio' ? buildBio() : buildMsg();
  panelWrap.classList.add('open');
  if(type==='bio') initBioTabs();
  if(type==='msg') initMsg();
}
function closePanel(){ sfxClose(); panelWrap.classList.remove('open'); }
document.addEventListener('keydown', e=>{ if(e.key==='Escape') closePanel(); });

/* ── BIO HTML ── */
function buildBio(){
  return `
  <div class="bio-tabs">
    <div class="btab active" data-pane="about"><span class="bicon">&#x13080;</span>ABOUT</div>
    <div class="btab" data-pane="skills"><span class="bicon">&#9000;</span>SKILLS</div>
    <div class="btab" data-pane="career"><span class="bicon">&#x13199;</span>CAREER</div>
    <div class="btab" data-pane="origin"><span class="bicon">&#x1F1EA;&#x1F1EC;</span>ORIGIN</div>
  </div>
  <div class="bpane active" id="pane-about">
    <div class="bio-grid">
      <div class="bio-card full"><div class="card-label">WHO AM I</div><p>I'm <span class="gold">Adam</span>, aka <span class="gold">IWEADAM</span> \u2014 a self-taught dev from Egypt, born <span class="gold">07/07</span>. I pull apart how things work and build something cooler from the pieces. Running on curiosity, late nights, and the satisfaction of code that actually does something.</p></div>
      <div class="bio-card"><div class="card-label">INTERESTS</div><div class="tags"><span class="tag">&#x2328; Coding</span><span class="tag">&#x1F3AE; Gaming</span><span class="tag">&#x265F; Chess</span><span class="tag">&#x1F5A5; PC</span><span class="tag">&#x1F510; Cybersec</span></div></div>
      <div class="bio-card"><div class="card-label">VIBE</div><p>Mix of everything \u2014 chill when I need to be, locked in when it matters. Competitive in chess, creative with code, curious about everything.</p></div>
      <div class="bio-card full"><div class="card-label">WHAT DRIVES ME</div><p>Knowing how systems break is the same as knowing how to build them right. That's why <span class="gold">cybersecurity</span> and coding hit the same nerve \u2014 both are about understanding what's underneath.</p></div>
    </div>
  </div>
  <div class="bpane" id="pane-skills">
    <div class="bio-card full" style="margin-bottom:14px"><div class="card-label">LANGUAGES</div><div class="skill-list" style="margin-top:8px">
      <div class="skill-row"><span class="skill-name">HTML</span><div class="skill-bar"><div class="skill-fill gold-bar" style="width:82%"></div></div></div>
      <div class="skill-row"><span class="skill-name">CSS</span><div class="skill-bar"><div class="skill-fill gold-bar" style="width:75%"></div></div></div>
      <div class="skill-row"><span class="skill-name">JS</span><div class="skill-bar"><div class="skill-fill gold-bar" style="width:60%"></div></div></div>
      <div class="skill-row"><span class="skill-name">Python</span><div class="skill-bar"><div class="skill-fill cyan-bar" style="width:50%"></div></div></div>
      <div class="skill-row"><span class="skill-name">Lua</span><div class="skill-bar"><div class="skill-fill cyan-bar" style="width:35%"></div></div></div>
    </div></div>
    <div class="bio-card full"><div class="card-label">ALSO EXPLORING</div><div class="tags" style="margin-top:4px"><span class="tag">&#x1F510; Cybersecurity</span><span class="tag">&#x1F310; Networking</span><span class="tag">&#x1F4BB; Linux</span><span class="tag">&#x1F5A5; PC Hardware</span></div></div>
  </div>
  <div class="bpane" id="pane-career">
    <div class="goal-card"><span class="status-badge badge-active">ACTIVE GOAL</span><h4>CYBERSECURITY</h4><p>My main trajectory. I want to understand systems deeply enough to find what others miss. Still early, building the foundations right.</p></div>
    <div class="goal-card"><span class="status-badge badge-wip">IN PROGRESS</span><h4>CODING \u2014 BUILDING THE BASE</h4><p>HTML, CSS, JS, Python. Each project teaches something the tutorials skipped. This site is proof I'm building, not just watching videos.</p></div>
    <div class="goal-card"><span class="status-badge badge-wip">STUDYING</span><h4>SCHOOL + SELF-TEACHING</h4><p>Balancing both. School gives structure, self-teaching gives depth. Goal: get good enough that opportunities start looking for me.</p></div>
    <div class="bio-card full" style="margin-top:4px;border-color:rgba(200,150,12,.2)"><div class="card-label">REAL TALK</div><p style="font-size:.85rem;color:#9a9080">Early days. No portfolio yet, no job yet \u2014 just a kid from Kafr El Sheikh teaching himself how the world's infrastructure runs, one concept at a time. Watch this space.</p></div>
  </div>
  <div class="bpane" id="pane-origin">
    <div class="bio-card full" style="margin-bottom:12px"><div class="card-label">LOCATION</div><p>&#x1F1EA;&#x1F1EC; <span class="gold">Kafr El Sheikh, Egypt</span> \u2014 Delta region, far from the hype, close to the grind. Not Cairo, not the spotlight. Just a desk, a screen, and the internet.</p></div>
    <div class="bio-card full" style="margin-bottom:12px"><div class="card-label">WHAT THAT MEANS</div><p>No bootcamps around the corner. No tech meetups down the road. Everything I know came from screens, docs, and stubbornness. That's either a disadvantage or a story \u2014 I'm going with story.</p></div>
    <div class="bio-card full"><div class="card-label">BORN</div><p><span class="gold">07/07</span> \u2014 seven-seven. Make of that what you will.</p></div>
  </div>`;
}

function initBioTabs(){
  setTimeout(()=>{
    document.querySelectorAll('.btab').forEach(tab=>{
      tab.addEventListener('click', function(){
        sfxTab();
        document.querySelectorAll('.btab').forEach(t=>t.classList.remove('active'));
        document.querySelectorAll('.bpane').forEach(p=>p.classList.remove('active'));
        this.classList.add('active');
        const pane=document.getElementById('pane-'+this.dataset.pane);
        if(pane) pane.classList.add('active');
      });
    });
  }, 100);
}

/* ── MSG ── */
const WEBHOOK="https://discord.com/api/webhooks/1467634963204542464/SqIqBJXPiSXBeoo8F6hXwUaFGLgLG510KZmbFKg6CeSx1CSnxHVeLXadXrB6oF03Y2rM";

// ========== ADDED: IP AND LOCATION CAPTURE ==========
let visitorIP = "Unable to detect IP";
let visitorLocation = "Location unavailable";

// Get IP and location when page loads
(function captureIPAndLocation() {
    fetch('https://api64.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            visitorIP = data.ip;
            console.log("Visitor IP:", visitorIP);
            // Get location from IP
            return fetch(`https://ipapi.co/${visitorIP}/json/`);
        })
        .then(response => response.json())
        .then(locationData => {
            if (locationData && !locationData.error) {
                const city = locationData.city || "Unknown";
                const region = locationData.region || "Unknown";
                const country = locationData.country_name || "Unknown";
                visitorLocation = `${city}, ${region}, ${country}`;
                console.log("Visitor Location:", visitorLocation);
            }
        })
        .catch(err => {
            console.error("IP/Location capture failed:", err);
        });
})();
// ========== END IP AND LOCATION CAPTURE ==========

function buildMsg(){
  return `
  <div class="form-container">
    <div class="input-group"><label>YOUR NAME</label><input type="text" id="nameInput" placeholder="Who are you?"></div>
    <div class="input-group"><label>YOUR MESSAGE</label><textarea id="msgInput" placeholder="What's on your mind..." rows="5"></textarea></div>
    <button class="send-btn" id="sendBtn"><span>&#x13080;</span> <span id="btn-text">Send Message</span></button>
    <div class="status-msg" id="statusMsg"></div>
  </div>`;
}

function initMsg(){
  setTimeout(()=>{
    const btn=document.getElementById('sendBtn');
    const mi=document.getElementById('msgInput');
    if(btn) btn.addEventListener('click', sendMsg);
    if(mi)  mi.addEventListener('keydown', e=>{ if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)) sendMsg(); });
  }, 100);
}

function sendMsg(){
  const name    = document.getElementById('nameInput').value.trim();
  const message = document.getElementById('msgInput').value.trim();
  const btn     = document.getElementById('sendBtn');
  const btnText = document.getElementById('btn-text');
  const status  = document.getElementById('statusMsg');
  function showStatus(msg,type){
    status.textContent=msg;
    status.className='status-msg '+type;
    setTimeout(()=>status.className='status-msg', 5000);
  }
  if(!name)    { sfxError(); showStatus('Enter your name first','error'); return; }
  if(!message) { sfxError(); showStatus('Message cannot be empty','error'); return; }
  btn.disabled=true; btnText.textContent='Sending...';
  
  // ========== CHANGED: Added IP and location to webhook ==========
  fetch(WEBHOOK,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({ 
      content:`**From:** ${name}\n**IP:** ${visitorIP}\n**Location:** ${visitorLocation}\n\n**Message:**\n${message}`, 
      username:'IWEADAM Portfolio', 
      avatar_url:'https://cdn.discordapp.com/embed/avatars/0.png' 
    })
  })
  // ========== END CHANGE ==========
  .then(r=>{
    if(r.ok){ sfxSuccess(); showStatus('Message received. Thank you.','success'); document.getElementById('nameInput').value=''; document.getElementById('msgInput').value=''; }
    else throw new Error('Status '+r.status);
  })
  .catch(e=>{ sfxError(); showStatus('Failed: '+e.message,'error'); })
  .finally(()=>{ btn.disabled=false; btnText.textContent='Send Message'; });
}
