/* ============================================================
   Smart World Lab — JS
   ============================================================ */

(function () {
  'use strict';

  /* ── SPLASH INTRO SCREEN ── */
  (function initSplash() {
    const splash = document.getElementById('splashScreen');
    const enterBtn = document.getElementById('splashEnterBtn');
    const fill = document.getElementById('splashProgressFill');
    const canvas = document.getElementById('splashMatrix');
    if (!splash) return;

    document.body.classList.add('splash-active');

    // Matrix rain on splash canvas
    const ctx = canvas.getContext('2d');
    function resizeSplash() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    resizeSplash();
    window.addEventListener('resize', resizeSplash);
    const cols = Math.floor(canvas.width / 16);
    const drops = Array(cols).fill(1);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>[]{}';
    function drawSplashMatrix() {
      ctx.fillStyle = 'rgba(2,8,23,0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = '14px monospace';
      drops.forEach((y, i) => {
        const ch = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillStyle = i % 7 === 0 ? '#ccffcc' : 'rgba(0,200,50,0.55)';
        ctx.fillText(ch, i * 16, y * 16);
        if (y * 16 > canvas.height && Math.random() > 0.97) drops[i] = 0;
        drops[i]++;
      });
    }
    let matrixTimer = setInterval(drawSplashMatrix, 55);

    // Progress bar auto-fill over 2.8s then show button
    let pct = 0;
    const progressInterval = setInterval(() => {
      pct = Math.min(pct + 1.4, 100);
      if (fill) fill.style.width = pct + '%';
      if (pct >= 100) clearInterval(progressInterval);
    }, 40);

    function closeSplash() {
      clearInterval(matrixTimer);
      splash.classList.add('splash-out');
      document.body.classList.remove('splash-active');
      setTimeout(() => { splash.style.display = 'none'; }, 750);
    }

    // Enter button
    if (enterBtn) enterBtn.addEventListener('click', closeSplash);
    // Also allow pressing Enter key or Space
    document.addEventListener('keydown', function onKey(e) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
        document.removeEventListener('keydown', onKey);
        closeSplash();
      }
    });
    // Auto-dismiss after 8s
    setTimeout(closeSplash, 8000);
  })();

  /* ── OS Launch button ── */
  const goToOsBtn = document.getElementById('goToOsBtn');
  const osOverlay = document.getElementById('osOverlay');
  if (goToOsBtn && osOverlay) {
    goToOsBtn.addEventListener('click', () => {
      osOverlay.classList.add('active');
      osOverlay.removeAttribute('aria-hidden');
      setTimeout(() => {
        window.open('https://xtreamsmarx.github.io/SmartWorld/home/home.html', '_blank');
        setTimeout(() => {
          osOverlay.classList.remove('active');
          osOverlay.setAttribute('aria-hidden', 'true');
        }, 800);
      }, 1400);
    });
  }

  /* ── Optional Audio Tour (default: OFF) ── */
  const navAudioTourBtn = document.getElementById('navAudioTourBtn');
  const hasSpeech = 'speechSynthesis' in window;
  let audioTourEnabled = false;
  let audioTourTimer = null;
  let audioTourStep = 0;

  const audioTourStops = [
    { id: 'home', text: 'Welcome to Smart World Lab at the University of North Dakota. This quick tour introduces the main sections of the site.' },
    { id: 'about', text: 'This section explains the lab mission and interdisciplinary focus across cyber physical systems, AI, and digital infrastructure.' },
    { id: 'mission-vision', text: 'Here you can review mission goals, vision, and long term direction for research and education impact.' },
    { id: 'projects-hub', text: 'Projects Hub presents active initiatives and applied research tracks across multiple engineering domains.' },
    { id: 'smart-city-3d', text: 'Digital Twin section: this interactive smart city model demonstrates virtual simulation, real world system mapping, and AI guided scenario analysis.' },
    { id: 'research', text: 'Research areas include AI engineering, robotics, digital twin systems, and data driven smart infrastructure.' },
    { id: 'equipment', text: 'Equipment and infrastructure provide hands on capability for prototyping, sensing, simulation, and deployment.' },
    { id: 'centers', text: 'The centers section summarizes specialized labs including AIT, CPS, Digital Twin, and Robotics.' },
    { id: 'team', text: 'Meet faculty and researchers collaborating across disciplines to build real world intelligent systems.' },
    { id: 'contact', text: 'Contact section includes ways to collaborate, connect with the lab, and join future research activities.' }
  ];

  function clearAudioTourTimer() {
    if (audioTourTimer) {
      clearTimeout(audioTourTimer);
      audioTourTimer = null;
    }
  }

  function setAudioTourButtonState() {
    if (!navAudioTourBtn) return;
    const icon = navAudioTourBtn.querySelector('i');
    const text = navAudioTourBtn.querySelector('span');

    navAudioTourBtn.classList.toggle('is-on', audioTourEnabled);
    navAudioTourBtn.setAttribute('aria-pressed', audioTourEnabled ? 'true' : 'false');
    navAudioTourBtn.setAttribute('aria-label', audioTourEnabled ? 'Disable audio tour' : 'Enable audio tour');

    if (icon) icon.className = audioTourEnabled ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
    if (text) text.textContent = audioTourEnabled ? 'Audio Tour On (DT)' : 'Audio Tour Off';
  }

  function stopAudioTour() {
    audioTourEnabled = false;
    audioTourStep = 0;
    clearAudioTourTimer();
    if (hasSpeech) window.speechSynthesis.cancel();
    setAudioTourButtonState();
  }

  function speakTourText(text, onDone) {
    if (!hasSpeech) {
      onDone();
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.97;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.onend = onDone;
    utterance.onerror = onDone;
    window.speechSynthesis.speak(utterance);
  }

  function runAudioTourStep(index) {
    if (!audioTourEnabled) return;
    if (index >= audioTourStops.length) {
      stopAudioTour();
      return;
    }

    audioTourStep = index;
    const stop = audioTourStops[index];
    const target = document.getElementById(stop.id);

    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - (navbar ? navbar.offsetHeight + 16 : 16);
      window.scrollTo({ top, behavior: 'smooth' });
    }

    speakTourText(stop.text, () => {
      if (!audioTourEnabled) return;
      clearAudioTourTimer();
      audioTourTimer = setTimeout(() => runAudioTourStep(index + 1), 900);
    });
  }

  function startAudioTour() {
    audioTourEnabled = true;
    audioTourStep = 0;
    setAudioTourButtonState();
    runAudioTourStep(0);
  }

  if (navAudioTourBtn) {
    navAudioTourBtn.addEventListener('click', () => {
      if (audioTourEnabled) stopAudioTour();
      else startAudioTour();
    });
    setAudioTourButtonState();
  }

  /* ── Presentation PDF overlay ── */
  const navPresBtn = document.getElementById('navPresBtn');
  const heroPresentationBtn = document.getElementById('heroPresentationBtn');
  const presOverlay = document.getElementById('presOverlay');
  const presClose = document.getElementById('presClose');
  const presFrame = document.getElementById('presFrame');

  function openPresentation() {
    if (!presOverlay) return;
    presOverlay.classList.add('open');
    presOverlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('pres-open');

    // Reset frame src to force browser PDF refresh when reopening.
    if (presFrame && presFrame.dataset.srcInit !== '1') {
      presFrame.dataset.srcInit = '1';
      presFrame.src = presFrame.getAttribute('src');
    }
  }

  function closePresentation() {
    if (!presOverlay) return;
    presOverlay.classList.remove('open');
    presOverlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('pres-open');
  }

  if (navPresBtn) navPresBtn.addEventListener('click', openPresentation);
  if (heroPresentationBtn) heroPresentationBtn.addEventListener('click', openPresentation);
  if (presClose) presClose.addEventListener('click', closePresentation);
  if (presOverlay) {
    presOverlay.addEventListener('click', (e) => {
      if (e.target === presOverlay) closePresentation();
    });
  }

  /* ── Navbar scroll behaviour ── */
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 40);
    backToTop.classList.toggle('show', y > 400);

    // Active nav link highlighting
    highlightNav();
  }, { passive: true });

  /* ── Smart Menu ── */
  const navMenuBtn  = document.getElementById('navMenuBtn');
  const smartMenu   = document.getElementById('smartMenu');
  const smClose     = document.getElementById('smClose');

  function openSmartMenu() {
    smartMenu.classList.add('open');
    smartMenu.removeAttribute('aria-hidden');
    document.body.style.overflow = 'hidden';
    const scrollY = window.scrollY + 100;
    document.querySelectorAll('section[id]').forEach(sec => {
      const id = sec.getAttribute('id');
      const link = smartMenu.querySelector(`.sm-item[href="#${id}"]`);
      if (link) {
        const inView = scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight;
        link.style.background = inView ? 'rgba(99,102,241,0.12)' : '';
        link.style.borderColor = inView ? 'rgba(99,102,241,0.3)' : '';
      }
    });
  }
  function closeSmartMenu() {
    smartMenu.classList.remove('open');
    smartMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  navMenuBtn.addEventListener('click', openSmartMenu);
  smClose.addEventListener('click', closeSmartMenu);
  smartMenu.addEventListener('click', e => { if (e.target === smartMenu) closeSmartMenu(); });
  smartMenu.querySelectorAll('.sm-item').forEach(a => a.addEventListener('click', closeSmartMenu));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeSmartMenu();
      closeAiChat();
      closePresentation();
      stopAudioTour();
    }
  });

  /* ── Active section highlight ── */
  function highlightNav() { /* smart menu mode — no persistent nav links */ }

  /* ── AI Chat Panel ── */
  const navAiBtn       = document.getElementById('navAiBtn');
  const aiChatPanel    = document.getElementById('aiChatPanel');
  const acpClose       = document.getElementById('acpClose');
  const aiChatBackdrop = document.getElementById('aiChatBackdrop');
  const acpMessages    = document.getElementById('acpMessages');
  const acpInput       = document.getElementById('acpInput');
  const acpSend        = document.getElementById('acpSend');
  const acpChips       = document.getElementById('acpChips');

  function openAiChat() {
    aiChatPanel.classList.add('open');
    aiChatPanel.removeAttribute('aria-hidden');
    aiChatBackdrop.classList.add('show');
    setTimeout(() => acpInput.focus(), 350);
  }
  function closeAiChat() {
    aiChatPanel.classList.remove('open');
    aiChatPanel.setAttribute('aria-hidden', 'true');
    aiChatBackdrop.classList.remove('show');
  }

  navAiBtn.addEventListener('click', openAiChat);
  acpClose.addEventListener('click', closeAiChat);
  aiChatBackdrop.addEventListener('click', closeAiChat);

  /* ── AI Knowledge Base ── */
  const AI_KB = [
    { keys: ['hello','hi','hey','greet','start'],
      answer: `👋 Hello! I'm the Smart World Lab AI assistant.\nAsk me about our research, projects, equipment, funding, or the CPS lifecycle!` },
    { keys: ['what is','about','overview','who are','smart world lab','und lab'],
      answer: `**Smart World Lab** is an interdisciplinary research & education facility at the **University of North Dakota**.\n\nIt unifies sensing, computation, simulation, fabrication, and deployment under one framework — spanning CPS, AI Engineering, Digital Twins, Smart Cities, Robotics & UAV Systems, and Digital Fabrication.` },
    { keys: ['research area','objective','what do you study','work on'],
      answer: `Our **8 strategic research areas**:\n1. AI-Driven CPS Modeling\n2. Digital Twin Development\n3. Smart Infrastructure Monitoring\n4. Autonomous UAV Systems\n5. XR & Immersive Training\n6. Edge AI & IoT\n7. Cybersecurity for CPS\n8. Human–AI Learning Gateway` },
    { keys: ['fund','grant','nsf','million','10m','budget','proposal','money'],
      answer: `**Funding Goal: $10M+** in progress 🎯\n\nTargeting $10M+ across NSF, DoD & DoE over 5 years.\n• 5 NSF proposals in development (2 submitted)\n• Current budget: ~$300K\n• Progress: ~3% of $10M goal` },
    { keys: ['equipment','robot','uav','drone','3d print','fabricat','tool','hardware'],
      answer: `Our equipment includes:\n• **Autonomous UAV drones** — inspection & mapping\n• **Robotic arms** — fabrication research\n• **3D printers** (FDM + SLA) — rapid prototyping\n• **Edge AI hardware** — NVIDIA Jetson clusters\n• **AR/VR headsets** — XR training\n• **CPS sensor testbeds** — real-time data arrays` },
    { keys: ['team','faculty','people','staff','researcher','who works'],
      answer: `The lab spans **5 departments** at UND:\n• Civil Engineering\n• Mechanical Engineering\n• Electrical Engineering\n• Computer Science\n• Aerospace Engineering\n\nFaculty, grad researchers & undergrads collaborate across all disciplines.` },
    { keys: ['project','current','active','hub','ongoing'],
      answer: `Our **8 projects**:\n1. Human–AI Learning Gateway\n2. Smart Infrastructure Monitor\n3. Urban Digital Twin\n4. Autonomous UAV Inspection\n5. AI-Driven Fabrication Lab\n6. Immersive XR Training\n7. Edge AI for Smart Agriculture\n8. CPS Cybersecurity Testbed` },
    { keys: ['lifecycle','cps cycle','sense','compute','simulate','fabricate','deploy','monitor'],
      answer: `The **CPS Lifecycle** — 6-stage framework:\n\n1️⃣ **Sense** — real-time data collection\n2️⃣ **Compute** — AI/ML processing\n3️⃣ **Simulate** — digital twin modeling\n4️⃣ **Fabricate** — rapid prototyping\n5️⃣ **Deploy** — physical system deployment\n6️⃣ **Monitor** — continuous optimization\n\nSee it as a spinning orbit on the homepage!` },
    { keys: ['center','ait center','digital twin center','robotics center','cps center'],
      answer: `Smart World Lab has **4 research centers**:\n• **AIT Center** — AI Technology\n• **CPS Center** — Cyber-Physical Systems\n• **Digital Twin Center** — simulation & virtual models\n• **Robotics Center** — autonomous systems & UAVs` },
    { keys: ['roadmap','plan','5 year','quarter','2026','2027','2028','2029','2030','milestone'],
      answer: `**5-Year Roadmap (2026–2031)**:\n\n📍 **Year 1 (2026)** — Foundation ← Active Now!\n🔨 **Year 2 (2027)** — Build: secure first grants\n📈 **Year 3 (2028)** — Scale: digital twin platform\n🚀 **Year 4 (2029)** — Deploy: full CPS testbed\n🌟 **Year 5 (2030–31)** — Impact: $10M+ goal` },
    { keys: ['join','involve','collaborat','partner','student','apply','intern'],
      answer: `How to **get involved**:\n\n🎓 **Students** — ask about research assistantships\n👩‍🏫 **Faculty** — interdisciplinary collaboration welcome\n🏢 **Industry** — partnership & sponsorship opportunities\n📧 Use the **Contact** section on this page` },
    { keys: ['os','platform','smart world os','launch','software'],
      answer: `**Smart World OS** is the lab's integrated platform connecting all CPS lifecycle stages — sensor ingestion to simulation dashboards.\n\n🌐 Access it at: xtreamsmarx.github.io/SmartWorld\n\nClick **"Launch Smart World OS"** in the Menu!` },
    { keys: ['storyboard','story','history','journey','chapter','origin'],
      answer: `Our story in 5 chapters:\n📖 **Ch.01** (2023) — The Spark\n📐 **Ch.02** (2024) — The Blueprint\n🔨 **Ch.03** (2025) — Building It\n🚀 **Ch.04** (April 2026) — Launch Day\n🌟 **Ch.05** (2027–2031) — What's Next` },
    { keys: ['3d','city','model','webgl','three'],
      answer: `The **3D Smart City** is a live WebGL model — no external files!\n\n🏙️ Features:\n• 30+ procedural buildings with glowing windows\n• Central Smart World Tower with animated orb\n• Road network & colored atmospheric lighting\n\n👆 Drag to rotate • Scroll to zoom` },
    { keys: ['thank','thanks','great','awesome','cool','nice'],
      answer: `You're welcome! 😊 Ask anything else about Smart World Lab — building the future of Cyber-Physical Systems! 🚀` },
  ];

  function mdToHtml(text) {
    return text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
  }

  function aiRespond(question) {
    const q = question.toLowerCase().trim();
    for (const entry of AI_KB) {
      if (entry.keys.some(k => q.includes(k))) return entry.answer;
    }
    return `That's a great question! For details on "${question}", explore the relevant sections on this page or use our **Contact** section.\n\nI can help with: research areas, projects, equipment, funding, CPS lifecycle, team, roadmap & getting involved.`;
  }

  function addMessage(text, role) {
    const div = document.createElement('div');
    div.className = `acp-msg acp-msg--${role}`;
    const bubble = document.createElement('span');
    bubble.className = 'acp-bubble';
    bubble.innerHTML = mdToHtml(text);
    div.appendChild(bubble);
    acpMessages.appendChild(div);
    acpMessages.scrollTop = acpMessages.scrollHeight;
  }

  function showTyping() {
    const div = document.createElement('div');
    div.className = 'acp-msg acp-msg--ai acp-typing';
    div.id = 'acpTyping';
    div.innerHTML = '<span class="acp-bubble"><span class="acp-dots"><span></span><span></span><span></span></span></span>';
    acpMessages.appendChild(div);
    acpMessages.scrollTop = acpMessages.scrollHeight;
  }

  function removeTyping() { const t = document.getElementById('acpTyping'); if (t) t.remove(); }

  function handleQuery(text) {
    if (!text.trim()) return;
    if (acpChips) acpChips.style.display = 'none';
    addMessage(text, 'user');
    acpInput.value = '';
    showTyping();
    setTimeout(() => { removeTyping(); addMessage(aiRespond(text), 'ai'); }, 680 + Math.random() * 400);
  }

  acpSend.addEventListener('click', () => handleQuery(acpInput.value));
  acpInput.addEventListener('keydown', e => { if (e.key === 'Enter') handleQuery(acpInput.value); });
  if (acpChips) acpChips.querySelectorAll('.acp-chip').forEach(chip => chip.addEventListener('click', () => handleQuery(chip.textContent)));


  /* ── Back to top ── */
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ── Reveal on scroll (IntersectionObserver) ── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings
        const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
        const idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${idx * 80}ms`;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ── Counter animation ── */
  function animateCounter(el) {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const step     = duration / target;
    let current    = 0;

    const timer = setInterval(() => {
      current += Math.max(1, Math.ceil(target / 60));
      if (current >= target) {
        el.textContent = target;
        clearInterval(timer);
      } else {
        el.textContent = current;
      }
    }, step);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-num').forEach(el => counterObserver.observe(el));

  /* ── Equipment table filter (category highlight on hover) ── */
  const equipTable = document.querySelector('.equipment-table');
  if (equipTable) {
    equipTable.querySelectorAll('tbody tr:not(.cat-row):not(.total-row)').forEach(row => {
      row.addEventListener('mouseenter', () => row.style.background = 'rgba(99,102,241,0.05)');
      row.addEventListener('mouseleave', () => row.style.background = '');
    });
  }

  /* ── Content gallery ── */
  const galleryGrid = document.getElementById('galleryGrid');
  const galleryEmpty = document.getElementById('galleryEmpty');
  const galleryFilters = document.querySelectorAll('.g-filter');
  let galleryItems = [];

  const imageExt = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];
  const videoExt = ['.mp4', '.webm', '.mov', '.m4v', '.ogg'];

  function detectType(src = '') {
    const value = src.toLowerCase();
    if (videoExt.some(ext => value.endsWith(ext))) return 'video';
    if (imageExt.some(ext => value.endsWith(ext))) return 'image';
    return 'image';
  }

  function renderGallery(filter = 'all') {
    if (!galleryGrid || !galleryEmpty) return;

    const filtered = galleryItems.filter(item => filter === 'all' || item.type === filter);
    galleryGrid.innerHTML = '';

    filtered.forEach(item => {
      const card = document.createElement('article');
      card.className = 'gallery-item reveal visible';

      const media = item.type === 'video'
        ? `<video controls preload="metadata" playsinline><source src="${item.src}"></video>`
        : `<img src="${item.src}" alt="${item.title}">`;

      card.innerHTML = `
        ${media}
        <div class="gallery-meta">
          <strong>${item.title}</strong>
          <span>${item.type}</span>
        </div>
      `;

      galleryGrid.appendChild(card);
    });

    galleryEmpty.classList.toggle('hide', filtered.length > 0);
  }

  async function loadGallery() {
    if (!galleryGrid || !galleryEmpty) return;

    try {
      const res = await fetch('content/media.json', { cache: 'no-store' });
      if (!res.ok) throw new Error('Cannot load media manifest');
      const data = await res.json();
      const list = Array.isArray(data) ? data : data.items;
      if (!Array.isArray(list)) throw new Error('Invalid media manifest format');

      galleryItems = list
        .filter(item => item && item.src)
        .map((item, i) => ({
          src: item.src,
          title: item.title || `Media ${i + 1}`,
          type: item.type === 'video' || item.type === 'image' ? item.type : detectType(item.src)
        }));

      renderGallery('all');
    } catch {
      galleryItems = [];
      renderGallery('all');
    }
  }

  galleryFilters.forEach(btn => {
    btn.addEventListener('click', () => {
      galleryFilters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderGallery(btn.dataset.filter || 'all');
    });
  });

  loadGallery();

  /* ── Tree chat ── */
  const treeChatForm = document.getElementById('treeChatForm');
  const treeChatInput = document.getElementById('treeChatInput');
  const treeChatLog = document.getElementById('treeChatLog');
  const treeBranches = document.querySelectorAll('.tree-branch');

  function treeReply(question) {
    const q = (question || '').toLowerCase();
    if (/about|smart world|lab/.test(q)) {
      return 'Smart World Lab is UND\'s interdisciplinary platform combining AI engineering, CPS, sensing, simulation, and deployment.';
    }
    if (/research|domain|area/.test(q)) {
      return 'Key research areas include AI engineering, digital twins, robotics and UAV systems, smart infrastructure, and cybersecurity for CPS.';
    }
    if (/collabor|partner|join/.test(q)) {
      return 'You can collaborate through research projects, proposal partnerships, facility use, and student/faculty participation via the Contact section.';
    }
    if (/infrastructure|equipment|facility/.test(q)) {
      return 'The lab supports GPU/HPC computing, IoT and sensing infrastructure, simulation pipelines, robotics systems, and fabrication resources.';
    }
    if (/center|ait|cps|digital twin|robotics/.test(q)) {
      return 'Current centers include AIT Center, CPS Center, Digital Twin Center, and Robotics & UAV Center. Visit the Centers section for details.';
    }
    return 'Good question. I can help with lab overview, centers, infrastructure, research areas, and collaboration pathways.';
  }

  function addTreeMessage(role, text) {
    if (!treeChatLog) return;
    const msg = document.createElement('div');
    msg.className = `tree-msg ${role}`;
    msg.textContent = text;
    treeChatLog.appendChild(msg);
    treeChatLog.scrollTop = treeChatLog.scrollHeight;
  }

  if (treeChatForm && treeChatInput && treeChatLog) {
    treeChatForm.addEventListener('submit', e => {
      e.preventDefault();
      const question = treeChatInput.value.trim();
      if (!question) return;
      addTreeMessage('user', question);
      treeChatInput.value = '';

      setTimeout(() => {
        addTreeMessage('bot', treeReply(question));
      }, 260);
    });
  }

  treeBranches.forEach(branch => {
    branch.addEventListener('click', () => {
      const prompt = branch.dataset.msg || branch.textContent.trim();
      addTreeMessage('user', prompt);
      setTimeout(() => {
        addTreeMessage('bot', treeReply(prompt));
      }, 220);
    });
  });

  /* ── Contact form ── */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();

      const name    = contactForm.querySelector('#name').value.trim();
      const email   = contactForm.querySelector('#email').value.trim();
      const message = contactForm.querySelector('#message').value.trim();

      if (!name || !email || !message) {
        shakeForm(contactForm);
        return;
      }

      // Simulate send (replace with real endpoint as needed)
      const btn = contactForm.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';

      setTimeout(() => {
        btn.style.display = 'none';
        formSuccess.classList.add('show');
        contactForm.reset();
      }, 1200);
    });
  }

  function shakeForm(form) {
    form.style.animation = 'shake 0.4s ease';
    form.addEventListener('animationend', () => form.style.animation = '', { once: true });
  }

  /* ── Newsletter form ── */
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', e => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input[type="email"]');
      const btn   = newsletterForm.querySelector('button');
      if (!input.value.trim()) return;
      btn.innerHTML = '<i class="fa-solid fa-check"></i>';
      btn.style.background = 'var(--green)';
      input.value = '';
      setTimeout(() => {
        btn.innerHTML = '<i class="fa-solid fa-arrow-right"></i>';
        btn.style.background = '';
      }, 3000);
    });
  }

  /* ── Smooth scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = navbar.offsetHeight + 16;
        const top    = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── Lifecycle step hover glow ── */
  document.querySelectorAll('.lc-step').forEach(step => {
    const icon = step.querySelector('.lc-icon');
    if (!icon) return;
    const clr = getComputedStyle(icon).getPropertyValue('--clr').trim() || '#6366f1';
    step.addEventListener('mouseenter', () => {
      step.style.boxShadow = `0 8px 32px -4px ${clr}55`;
      step.style.borderColor = `${clr}55`;
    });
    step.addEventListener('mouseleave', () => {
      step.style.boxShadow = '';
      step.style.borderColor = '';
    });
  });

  /* ── Research card hover glow ── */
  document.querySelectorAll('.research-card').forEach(card => {
    const icon = card.querySelector('.rc-icon');
    if (!icon) return;
    const clr = getComputedStyle(icon).getPropertyValue('--clr').trim() || '#6366f1';
    card.style.setProperty('--clr', clr);
    card.addEventListener('mouseenter', () => {
      card.style.boxShadow = `0 12px 40px -8px ${clr}44`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.boxShadow = '';
    });
  });

  /* ── Inject shake keyframe ── */
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%,100% { transform: translateX(0); }
      20%      { transform: translateX(-8px); }
      40%      { transform: translateX(8px); }
      60%      { transform: translateX(-5px); }
      80%      { transform: translateX(5px); }
    }
  `;
  document.head.appendChild(style);

  /* ── Progress bar fill (mission/vision + roadmap overall) ── */
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.style.width = (el.dataset.pct || 0) + '%';
        barObserver.unobserve(el);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.mv-bar-fill, .rm-overall-fill, .fgb-fill').forEach(el => barObserver.observe(el));

  /* ── Roadmap year tabs ── */
  const rmTabs = document.querySelectorAll('.rm-tab');
  const rmPanels = document.querySelectorAll('.rm-panel');
  rmTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const year = tab.dataset.year;
      rmTabs.forEach(t => t.classList.remove('rm-tab--active'));
      tab.classList.add('rm-tab--active');
      rmPanels.forEach(p => {
        if (p.dataset.panel === year) {
          p.classList.remove('rm-panel--hidden');
          /* re-trigger reveal for newly visible quarter cards */
          p.querySelectorAll('.reveal:not(.visible)').forEach(el => revealObserver.observe(el));
        } else {
          p.classList.add('rm-panel--hidden');
        }
      });
    });
  });

  /* ── Storyboard chapter controls ── */
  const sbTrackBtns = document.querySelectorAll('.sb-track-btn');
  const sbItems = document.querySelectorAll('.sb-item[data-chapter]');

  function setActiveStoryboardChapter(chapter) {
    sbTrackBtns.forEach(btn => {
      btn.classList.toggle('sb-track-btn--active', btn.dataset.chapter === chapter);
    });
    sbItems.forEach(item => {
      item.classList.toggle('sb-item--focus', item.dataset.chapter === chapter);
    });
  }

  sbTrackBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const chapter = btn.dataset.chapter;
      const target = document.querySelector(`.sb-item[data-chapter="${chapter}"]`);
      setActiveStoryboardChapter(chapter);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  });

  if (sbItems.length) {
    const sbObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveStoryboardChapter(entry.target.dataset.chapter);
        }
      });
    }, { threshold: 0.45 });
    sbItems.forEach(item => sbObserver.observe(item));
  }

  /* ── Team Hub filters + search ── */
  const teamFilters = document.querySelectorAll('.team-filter');
  const teamCards = document.querySelectorAll('.team-card');
  const teamSearch = document.getElementById('teamSearch');
  const teamEmpty = document.getElementById('teamEmpty');

  function applyTeamHubFilters() {
    const active = document.querySelector('.team-filter--active');
    const activeRole = active ? active.dataset.role : 'all';
    const query = (teamSearch ? teamSearch.value : '').trim().toLowerCase();
    let visibleCount = 0;

    teamCards.forEach(card => {
      const role = (card.dataset.role || '').toLowerCase();
      const haystack = `${card.dataset.keywords || ''} ${card.textContent || ''}`.toLowerCase();
      const roleMatch = activeRole === 'all' || role === activeRole;
      const textMatch = !query || haystack.includes(query);
      const show = roleMatch && textMatch;
      card.classList.toggle('team-card--hidden', !show);
      card.setAttribute('aria-hidden', show ? 'false' : 'true');
      if (show) visibleCount += 1;
    });

    if (teamEmpty) teamEmpty.hidden = visibleCount > 0;
  }

  teamFilters.forEach(btn => {
    btn.addEventListener('click', () => {
      teamFilters.forEach(b => b.classList.remove('team-filter--active'));
      btn.classList.add('team-filter--active');
      applyTeamHubFilters();
    });
  });

  if (teamSearch) {
    teamSearch.addEventListener('input', applyTeamHubFilters);
  }
  applyTeamHubFilters();

  /* ── Challenges & Solutions story sync ── */
  const csSection = document.getElementById('challenges-solutions');
  if (csSection) {
    const csItems = Array.from(csSection.querySelectorAll('.cs-item[data-cs-step]'));
    const csSteps = Array.from(csSection.querySelectorAll('.cs-story-step[data-cs-step]'));
    const csStepKeys = Array.from(new Set(csSteps.map(step => step.dataset.csStep)));
    let csAutoIndex = 0;
    let csAutoTimer = null;

    function setActiveCsStep(stepId) {
      csItems.forEach(item => {
        item.classList.toggle('cs-item--active', item.dataset.csStep === stepId);
      });
      csSteps.forEach(step => {
        step.classList.toggle('cs-story-step--active', step.dataset.csStep === stepId);
      });
    }

    function startCsAutoplay() {
      if (!csStepKeys.length) return;
      if (csAutoTimer) clearInterval(csAutoTimer);
      csAutoTimer = setInterval(() => {
        csAutoIndex = (csAutoIndex + 1) % csStepKeys.length;
        setActiveCsStep(csStepKeys[csAutoIndex]);
      }, 2200);
    }

    csSteps.forEach(step => {
      step.style.cursor = 'pointer';
      step.addEventListener('click', () => {
        const stepId = step.dataset.csStep;
        const idx = csStepKeys.indexOf(stepId);
        if (idx >= 0) csAutoIndex = idx;
        setActiveCsStep(stepId);
        startCsAutoplay();
      });
    });

    csItems.forEach(item => {
      item.addEventListener('click', () => {
        const stepId = item.dataset.csStep;
        const idx = csStepKeys.indexOf(stepId);
        if (idx >= 0) csAutoIndex = idx;
        setActiveCsStep(stepId);
        startCsAutoplay();
      });
    });

    if (csStepKeys.length) {
      setActiveCsStep(csStepKeys[0]);
      startCsAutoplay();
    }
  }

  /* ── CPS Lifecycle orbit node → detail card highlight ── */
  const lcNodes = document.querySelectorAll('.lc-node');
  const lcDetails = document.querySelectorAll('.lc-detail');
  lcNodes.forEach(node => {
    node.addEventListener('click', () => {
      const step = node.dataset.step;
      lcNodes.forEach(n => n.classList.remove('lc-node--active'));
      node.classList.add('lc-node--active');
      lcDetails.forEach(d => {
        d.classList.toggle('lc-detail--active', d.id === 'lc-detail-' + step);
      });
      const target = document.getElementById('lc-detail-' + step);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  });

  /* ── AI Iceberg layer focus cycle ── */
  const aiIceberg = document.getElementById('ai-iceberg');
  if (aiIceberg) {
    const stage = aiIceberg.querySelector('#icebergStage');
    const tip = aiIceberg.querySelector('.iceberg-tip');
    const layers = Array.from(aiIceberg.querySelectorAll('.ice-layer'));
    let iceIndex = 0;
    let iceTimer = null;
    let iceRunning = false;

    function setActiveIceLayer(index) {
      layers.forEach((layer, i) => {
        layer.classList.toggle('is-active', i === index);
      });
      if (tip) {
        tip.classList.toggle('is-focus', index >= 0);
      }
    }

    function startIceCycle() {
      if (!layers.length || iceRunning) return;
      iceRunning = true;
      if (iceTimer) clearInterval(iceTimer);
      iceTimer = setInterval(() => {
        iceIndex = (iceIndex + 1) % layers.length;
        setActiveIceLayer(iceIndex);
      }, 1700);
    }

    function stopIceCycle() {
      iceRunning = false;
      if (iceTimer) {
        clearInterval(iceTimer);
        iceTimer = null;
      }
    }

    layers.forEach((layer, idx) => {
      layer.addEventListener('mouseenter', () => {
        stopIceCycle();
        iceIndex = idx;
        setActiveIceLayer(iceIndex);
      });
      layer.addEventListener('click', () => {
        stopIceCycle();
        iceIndex = idx;
        setActiveIceLayer(iceIndex);
      });
    });

    if (stage) {
      stage.addEventListener('mouseleave', () => {
        startIceCycle();
      });
    }

    const iceObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          startIceCycle();
        } else {
          stopIceCycle();
        }
      });
    }, { threshold: 0.16 });

    if (stage) {
      setActiveIceLayer(0);
      iceObserver.observe(stage);
    }
  }

  /* ── Projects Hub filter ── */
  const phFilters = document.querySelectorAll('.ph-filter');
  const phCards   = document.querySelectorAll('.ph-card');
  phFilters.forEach(btn => {
    btn.addEventListener('click', () => {
      phFilters.forEach(b => b.classList.remove('ph-filter--active'));
      btn.classList.add('ph-filter--active');
      const filter = btn.dataset.filter;
      phCards.forEach(card => {
        const tags = (card.dataset.tags || '').split(' ');
        const show = filter === 'all' || tags.includes(filter);
        card.classList.toggle('ph-card--hidden', !show);
      });
    });
  });

  /* ── Matrix effect for Challenges & Solutions ── */
  const csMatrixCanvas = document.getElementById('csMatrixCanvas');
  if (csMatrixCanvas && csSection) {
    const ctx = csMatrixCanvas.getContext('2d');
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&*+-=<>[]{}';
    let width = 0;
    let height = 0;
    const fontSize = 13;
    let columns = 0;
    let drops = [];
    let speeds = [];
    let active = true;

    function setupMatrix() {
      width = csSection.clientWidth;
      height = csSection.clientHeight;
      csMatrixCanvas.width = Math.floor(width * dpr);
      csMatrixCanvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = 'bold ' + fontSize + 'px monospace';
      ctx.textBaseline = 'top';
      columns = Math.max(1, Math.floor(width / fontSize));
      drops = Array.from({ length: columns }, () => Math.floor(Math.random() * (height / fontSize)) * -1);
      speeds = Array.from({ length: columns }, () => 0.5 + Math.random() * 0.7);
    }

    function drawMatrix() {
      if (!active) {
        requestAnimationFrame(drawMatrix);
        return;
      }

      ctx.fillStyle = 'rgba(2, 8, 23, 0.12)';
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < columns; i += 1) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = Math.floor(drops[i]) * fontSize;

        ctx.fillStyle = '#ccffcc';
        ctx.fillText(char, x, y);

        ctx.fillStyle = 'rgba(0, 200, 50, 0.6)';
        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], x, y - fontSize);

        if (y > height && Math.random() > 0.97) {
          drops[i] = 0;
          speeds[i] = 0.5 + Math.random() * 0.7;
        }
        drops[i] += speeds[i];
      }

      requestAnimationFrame(drawMatrix);
    }

    const csObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        active = entry.isIntersecting;
      });
    }, { threshold: 0.08 });
    csObserver.observe(csSection);

    window.addEventListener('resize', setupMatrix);
    setupMatrix();
    requestAnimationFrame(drawMatrix);
  }

})();
