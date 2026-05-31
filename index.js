/* ═══════════════════════════════════════
   AUDIO ENGINE
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
    const step=steps[stepIdx];
    sub.textContent=step.label;
    const iv=setInterval(()=>{
      progress++;
      fill.style.width=progress+'%';
      pct.textContent=progress+'%';
      if(progress>=step.target){
        clearInterval(iv); stepIdx++;
        if(progress<100) setTimeout(runStep,200);
        else setTimeout(showMain,500);
      }
    }, step.delay);
  }
  function showMain(){
    loader.style.transition='opacity 0.8s ease';
    loader.style.opacity='0';
    setTimeout(()=>{ loader.style.display='none'; main.classList.add('visible'); }, 800);
  }
  runStep();
});

/* ═══════════════════════════════════════
   NODE SYSTEM WITH DRAG & DROP
═══════════════════════════════════════ */
let mainActive=false, socialsActive=false;
const SOCIAL_IDS=['soc-insta','soc-discord','soc-github','soc-spotify','soc-steam','soc-roblox'];

// Store original positions for reset
let originalPositions = {};

function getC(el){
  const r=el.getBoundingClientRect();
  return { x: r.left+r.width/2, y: r.top+r.height/2 };
}

// Make a node draggable
function makeDraggable(node) {
  let isDragging = false;
  let startX, startY, originalLeft, originalTop;
  
  node.addEventListener('mousedown', startDrag);
  node.addEventListener('touchstart', startDrag, { passive: false });
  
  function startDrag(e) {
    if (!mainActive) return;
    if (e.target === node || node.contains(e.target)) {
      e.preventDefault();
      isDragging = true;
      
      // Get starting positions
      if (e.type === 'mousedown') {
        startX = e.clientX;
        startY = e.clientY;
      } else {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      }
      
      const rect = node.getBoundingClientRect();
      originalLeft = rect.left;
      originalTop = rect.top;
      
      node.style.cursor = 'grabbing';
      node.style.transition = 'none';
      
      document.addEventListener('mousemove', onDrag);
      document.addEventListener('mouseup', stopDrag);
      document.addEventListener('touchmove', onDrag, { passive: false });
      document.addEventListener('touchend', stopDrag);
    }
  }
  
  function onDrag(e) {
    if (!isDragging) return;
    e.preventDefault();
    
    let clientX, clientY;
    if (e.type === 'mousemove') {
      clientX = e.clientX;
      clientY = e.clientY;
    } else {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }
    
    const deltaX = clientX - startX;
    const deltaY = clientY - startY;
    
    let newLeft = originalLeft + deltaX;
    let newTop = originalTop + deltaY;
    
    // Keep within window bounds with padding
    const maxX = window.innerWidth - node.offsetWidth;
    const maxY = window.innerHeight - node.offsetHeight;
    newLeft = Math.min(maxX, Math.max(0, newLeft));
    newTop = Math.min(maxY, Math.max(0, newTop));
    
    node.style.left = newLeft + 'px';
    node.style.top = newTop + 'px';
    
    // Update strings in real-time
    drawStrings();
  }
  
  function stopDrag() {
    if (!isDragging) return;
    isDragging = false;
    node.style.cursor = '';
    node.style.transition = '';
    
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mouseup', stopDrag);
    document.removeEventListener('touchmove', onDrag);
    document.removeEventListener('touchend', stopDrag);
  }
}

// Position BIO, MSG, SOCIALS around the center START node (initial placement)
function positionMain(){
  const W=window.innerWidth, H=window.innerHeight, cx=W/2, cy=H/2;
  const sp=Math.min(210, W*0.28);
  const bio = document.getElementById('bio-node');
  const msg = document.getElementById('msg-node');
  const socials = document.getElementById('socials-node');
  
  if (!originalPositions['bio-node']) {
    originalPositions['bio-node'] = { left: cx-sp, top: cy-sp*0.45 };
    originalPositions['msg-node'] = { left: cx+sp, top: cy-sp*0.45 };
    originalPositions['socials-node'] = { left: cx, top: cy+sp*0.7 };
  }
  
  // Only set positions if they haven't been moved by drag
  if (bio.style.left === '' || bio.style.left === 'auto') {
    bio.style.cssText = `left:${cx-sp}px;top:${cy-sp*0.45}px`;
  }
  if (msg.style.left === '' || msg.style.left === 'auto') {
    msg.style.cssText = `left:${cx+sp}px;top:${cy-sp*0.45}px`;
  }
  if (socials.style.left === '' || socials.style.left === 'auto') {
    socials.style.cssText = `left:${cx}px;top:${cy+sp*0.7}px`;
  }
}

function positionSocials(){
  const sn=document.getElementById('socials-node');
  const r=sn.getBoundingClientRect();
  const cx=r.left+r.width/2, cy=r.top+r.height/2;
  const radius=Math.min(148, window.innerWidth*0.20);
  const count=SOCIAL_IDS.length;
  const startAngle = 30 * Math.PI/180;
  const endAngle = 150 * Math.PI/180;
  
  SOCIAL_IDS.forEach((id,i)=>{
    const t=i/(count-1);
    const angle=startAngle + t*(endAngle-startAngle);
    const x=cx + radius*Math.cos(angle);
    const y=cy + radius*Math.sin(angle);
    const el = document.getElementById(id);
    
    if (!originalPositions[id]) {
      originalPositions[id] = { left: x, top: y };
    }
    
    if (el.style.left === '' || el.style.left === 'auto') {
      el.style.cssText = `left:${x}px;top:${y}px`;
    }
  });
}

// Draw glowing strings between nodes
function drawStrings(){
  const svg=document.getElementById('string-svg');
  if(!mainActive){ svg.innerHTML=''; return; }

  const sn  = getC(document.getElementById('start-node'));
  const bn  = getC(document.getElementById('bio-node'));
  const mn  = getC(document.getElementById('msg-node'));
  const soN = getC(document.getElementById('socials-node'));

  let d=`<defs>
    <filter id="sg"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <linearGradient id="gG" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#ffd700"/><stop offset="100%" stop-color="#c8960c"/></linearGradient>
    <linearGradient id="cG" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#ffd700"/><stop offset="100%" stop-color="#00e5ff"/></linearGradient>
  </defs>
  <path d="M${sn.x},${sn.y} Q${(sn.x+bn.x)/2-40},${(sn.y+bn.y)/2-50} ${bn.x},${bn.y}" fill="none" stroke="url(#gG)" stroke-width="1.5" opacity=".8" filter="url(#sg)"/>
  <path d="M${sn.x},${sn.y} Q${(sn.x+mn.x)/2+40},${(sn.y+mn.y)/2-50} ${mn.x},${mn.y}" fill="none" stroke="url(#cG)" stroke-width="1.5" opacity=".8" filter="url(#sg)"/>
  <path d="M${sn.x},${sn.y} Q${(sn.x+soN.x)/2},${(sn.y+soN.y)/2+20} ${soN.x},${soN.y}" fill="none" stroke="#c8960c" stroke-width="2" opacity=".9" filter="url(#sg)"/>`;

  if(socialsActive){
    SOCIAL_IDS.forEach(id=>{
      const el=document.getElementById(id);
      if(el && el.classList.contains('visible')){
        const sc=getC(el);
        d+=`<path d="M${soN.x},${soN.y} Q${(soN.x+sc.x)/2},${(soN.y+sc.y)/2+10} ${sc.x},${sc.y}" fill="none" stroke="#c8960c" stroke-width="1" opacity=".55" filter="url(#sg)" stroke-dasharray="4 3"/>`;
      }
    });
  }
  svg.innerHTML=d;
}

// Reset all nodes to original positions
function resetPositions() {
  for (const [id, pos] of Object.entries(originalPositions)) {
    const el = document.getElementById(id);
    if (el) {
      el.style.left = pos.left + 'px';
      el.style.top = pos.top + 'px';
    }
  }
  drawStrings();
}

// Add reset button
function addResetButton() {
  const btn = document.createElement('button');
  btn.textContent = '⟳ RESET POSITIONS';
  btn.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
    padding: 8px 16px;
    background: rgba(2,8,14,.9);
    border: 1px solid var(--gold-dim);
    color: var(--gold);
    font-family: var(--font-mono);
    font-size: 0.7rem;
    cursor: pointer;
    border-radius: 4px;
    transition: all 0.2s;
  `;
  btn.onmouseover = () => btn.style.background = 'rgba(200,150,12,.2)';
  btn.onmouseout = () => btn.style.background = 'rgba(2,8,14,.9)';
  btn.onclick = resetPositions;
  document.body.appendChild(btn);
}

function ripple(x,y){
  const d=document.createElement('div');
  d.className='ripple-ring';
  d.style.cssText=`left:${x}px;top:${y}px;width:90px;height:90px;`;
  document.body.appendChild(d);
  setTimeout(()=>d.remove(), 800);
}

function goLink(url){ resumeAC(); sfxLink(); setTimeout(()=>window.open(url,'_blank'), 130); }

// Activate the whole node map on first click
function activateStart(){
  if(mainActive) return;
  resumeAC(); sfxStart();
  mainActive=true;
  const sn=document.getElementById('start-node');
  sn.style.animation='none';
  sn.style.boxShadow='0 0 50px rgba(200,150,12,.6)';
  positionMain();
  ripple(window.innerWidth/2, window.innerHeight/2);
  
  // Make all nodes draggable
  const allNodes = ['bio-node', 'msg-node', 'socials-node', ...SOCIAL_IDS];
  allNodes.forEach(id => {
    const el = document.getElementById(id);
    if (el) makeDraggable(el);
  });
  makeDraggable(sn);
  
  ['bio-node','msg-node','socials-node'].forEach((id,i)=>{
    setTimeout(()=>{
      const el=document.getElementById(id);
      el.classList.add('visible');
      sfxEmerge(i);
      const r=el.getBoundingClientRect();
      ripple(r.left+r.width/2, r.top+r.height/2);
    }, 130+i*130);
  });
  setTimeout(drawStrings, 520);
  addResetButton();

  window.addEventListener('resize',()=>{
    drawStrings();
  });
}

// Toggle social sub-nodes
function activateSocials(){
  if(!mainActive) return;
  resumeAC();
  if(socialsActive){
    sfxClose();
    socialsActive=false;
    SOCIAL_IDS.forEach(id=>document.getElementById(id).classList.remove('visible'));
    drawStrings();
    return;
  }
  socialsActive=true;
  positionSocials();
  SOCIAL_IDS.forEach((id,i)=>{
    setTimeout(()=>{
      const el=document.getElementById(id);
      el.classList.add('visible');
      sfxEmerge(i);
      const r=el.getBoundingClientRect();
      ripple(r.left+r.width/2, r.top+r.height/2);
    }, 60+i*70);
  });
  setTimeout(drawStrings, 560);
}

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
    <div class="btab" data-pane="origin"><span class="bicon">🇪🇬</span>ORIGIN</div>
  </div>

  <div class="bpane active" id="pane-about">
    <div class="bio-grid">
      <div class="bio-card full"><div class="card-label">WHO AM I</div><p>I'm <span class="gold">Adam</span>, aka <span class="gold">IWEADAM</span> — a self-taught dev from Egypt, born <span class="gold">07/07</span>. I pull apart how things work and build something cooler from the pieces. Running on curiosity, late nights, and the satisfaction of code that actually does something.</p></div>
      <div class="bio-card"><div class="card-label">INTERESTS</div><div class="tags"><span class="tag">⌨ Coding</span><span class="tag">🎮 Gaming</span><span class="tag">♟ Chess</span><span class="tag">🖥 PC</span><span class="tag">🔐 Cybersec</span></div></div>
      <div class="bio-card"><div class="card-label">VIBE</div><p>Mix of everything — chill when I need to be, locked in when it matters. Competitive in chess, creative with code, curious about everything.</p></div>
      <div class="bio-card full"><div class="card-label">WHAT DRIVES ME</div><p>Knowing how systems break is the same as knowing how to build them right. That's why <span class="gold">cybersecurity</span> and coding hit the same nerve — both are about understanding what's underneath.</p></div>
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
    <div class="bio-card full"><div class="card-label">ALSO EXPLORING</div><div class="tags" style="margin-top:4px"><span class="tag">🔐 Cybersecurity</span><span class="tag">🌐 Networking</span><span class="tag">💻 Linux</span><span class="tag">🖥 PC Hardware</span></div></div>
  </div>

  <div class="bpane" id="pane-career">
    <div class="goal-card"><span class="status-badge badge-active">ACTIVE GOAL</span><h4>CYBERSECURITY</h4><p>My main trajectory. I want to understand systems deeply enough to find what others miss. Still early, building the foundations right.</p></div>
    <div class="goal-card"><span class="status-badge badge-wip">IN PROGRESS</span><h4>CODING — BUILDING THE BASE</h4><p>HTML, CSS, JS, Python. Each project teaches something the tutorials skipped. This site is proof I'm building, not just watching videos.</p></div>
    <div class="goal-card"><span class="status-badge badge-wip">STUDYING</span><h4>SCHOOL + SELF-TEACHING</h4><p>Balancing both. School gives structure, self-teaching gives depth. Goal: get good enough that opportunities start looking for me.</p></div>
    <div class="bio-card full" style="margin-top:4px;border-color:rgba(200,150,12,.2)"><div class="card-label">REAL TALK</div><p style="font-size:.85rem;color:#9a9080">Early days. No portfolio yet, no job yet — just a kid from Kafr El Sheikh teaching himself how the world's infrastructure runs, one concept at a time. Watch this space.</p></div>
  </div>

  <div class="bpane" id="pane-origin">
    <div class="bio-card full" style="margin-bottom:12px"><div class="card-label">LOCATION</div><p>🇪🇬 <span class="gold">Kafr El Sheikh, Egypt</span> — Delta region, far from the hype, close to the grind. Not Cairo, not the spotlight. Just a desk, a screen, and the internet.</p></div>
    <div class="bio-card full" style="margin-bottom:12px"><div class="card-label">WHAT THAT MEANS</div><p>No bootcamps around the corner. No tech meetups down the road. Everything I know came from screens, docs, and stubbornness. That's either a disadvantage or a story — I'm going with story.</p></div>
    <div class="bio-card full"><div class="card-label">BORN</div><p><span class="gold">07/07</span> — seven-seven. Make of that what you will.</p></div>
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