/* ═══════════════════════════════════════════════════
   Smart World Lab — Interactive Lab Tour
   lab-tour/lab-tour.js
═══════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── ZONE DATA ─────────────────────────────────── */
  /* x/y = % of image width/height from top-left      */
  const ZONES = [
    {
      id: 1,
      title: 'AI Supercomputing Server Racks',
      zone: 'Compute Infrastructure',
      icon: 'fa-solid fa-server',
      color: '#6366f1',
      x: 12, y: 10,
      desc: 'NVIDIA H100 and A100 GPU-powered server racks delivering petaflop-scale AI training, real-time inference, and large-scale digital twin simulation without cloud dependency.',
      tags: ['NVIDIA H100', 'A100', 'HPC', 'AI Training', 'On-Premise'],
      specs: [
        { k: 'GPUs', v: 'NVIDIA H100 / A100' },
        { k: 'Capacity', v: '4× racks, 40U each' },
        { k: 'Networking', v: 'InfiniBand 400Gb/s' },
        { k: 'Storage', v: '2 PB NVMe array' },
      ],
    },
    {
      id: 2,
      title: 'Video Wall & Display Screens',
      zone: 'Visualization Center',
      icon: 'fa-solid fa-tv',
      color: '#06b6d4',
      x: 47, y: 6,
      desc: 'High-resolution multi-display wall for live dashboard monitoring, digital twin visualization, research presentations, and multi-stream data playback.',
      tags: ['4K Displays', 'Live Dashboard', 'Multi-stream', 'Research Viz'],
      specs: [
        { k: 'Screens', v: '6× 86″ 4K panels' },
        { k: 'Signal', v: 'HDMI 2.1 + NDI' },
        { k: 'Input', v: 'Any workstation on LAN' },
        { k: 'Use Case', v: 'Real-time monitoring' },
      ],
    },
    {
      id: 3,
      title: 'Collaboration & Research Workstations',
      zone: 'Research Workspace',
      icon: 'fa-solid fa-desktop',
      color: '#10b981',
      x: 77, y: 10,
      desc: 'High-performance GPU workstations for AI model development, digital twin authoring, sensor data analysis, and multi-disciplinary research collaboration.',
      tags: ['RTX 4090', 'Dual 4K', 'AI Dev', 'Research', 'Collaboration'],
      specs: [
        { k: 'Workstations', v: '12 × RTX 4090' },
        { k: 'RAM', v: '128 GB DDR5 each' },
        { k: 'OS', v: 'Ubuntu 22.04 / Win11' },
        { k: 'Access', v: 'Faculty & Students' },
      ],
    },
    {
      id: 4,
      title: '3D Printing Station',
      zone: 'Fabrication Lab',
      icon: 'fa-solid fa-cube',
      color: '#f59e0b',
      x: 8, y: 30,
      desc: 'Builder Extreme 2000 PRO large-format FDM printer plus PCB milling tools for AI-optimised generative design and simulation-validated rapid prototyping.',
      tags: ['FDM', 'Builder Extreme', 'PCB Milling', 'Rapid Proto', 'Generative Design'],
      specs: [
        { k: 'Printer', v: 'Builder Extreme 2000 PRO' },
        { k: 'Build Vol.', v: '700×700×820 mm' },
        { k: 'Materials', v: 'PLA, ABS, PETG, CF' },
        { k: 'PCB Mill', v: 'Roland MDX-50' },
      ],
    },
    {
      id: 5,
      title: 'IoT Device Testing Bench',
      zone: 'Sensing & Edge',
      icon: 'fa-solid fa-microchip',
      color: '#ec4899',
      x: 10, y: 55,
      desc: 'Dedicated bench for prototyping, flashing, and stress-testing IoT edge nodes — including LIDAR, RADAR, multispectral cameras, and environmental sensor arrays.',
      tags: ['IoT', 'Edge AI', 'LIDAR', 'RADAR', 'Multispectral', 'LoRa'],
      specs: [
        { k: 'Platforms', v: 'Jetson Orin / Pi 5' },
        { k: 'Protocols', v: 'MQTT, LoRa, Zigbee' },
        { k: 'Sensors', v: 'LIDAR, RADAR, Thermal' },
        { k: 'Power', v: 'USB-PD + bench supply' },
      ],
    },
    {
      id: 6,
      title: 'Digital Twin Simulation Table',
      zone: 'Digital Twin Center',
      icon: 'fa-solid fa-city',
      color: '#6366f1',
      x: 47, y: 38,
      desc: 'Interactive touchscreen simulation table running a live digital twin of UND campus and surrounding urban infrastructure — updated from real sensors and used to test smart city scenarios.',
      tags: ['Digital Twin', 'Urban Sim', 'Live Data', 'Touch Interface', 'AI Prediction'],
      specs: [
        { k: 'Display', v: '85″ 4K Touch Table' },
        { k: 'Engine', v: 'Unreal Engine 5 + NVIDIA Omniverse' },
        { k: 'Data Feeds', v: 'Live IoT + weather + traffic' },
        { k: 'Scenarios', v: 'Energy, Safety, Mobility' },
      ],
    },
    {
      id: 7,
      title: 'Industrial Robotic Arm',
      zone: 'Robotics Center',
      icon: 'fa-solid fa-robot',
      color: '#8b5cf6',
      x: 74, y: 38,
      desc: 'Six-axis industrial robotic arm for AI-guided manipulation, automated assembly tasks, precision inspection, and real-world CPS validation experiments.',
      tags: ['6-Axis', 'AI Guidance', 'Manipulation', 'Inspection', 'CPS'],
      specs: [
        { k: 'Model', v: 'KUKA KR 10 R1420' },
        { k: 'Payload', v: '10 kg' },
        { k: 'Reach', v: '1420 mm' },
        { k: 'Control', v: 'ROS2 + Moveit 2' },
      ],
    },
    {
      id: 8,
      title: 'Drone Testing Zone',
      zone: 'UAV & Aerial Systems',
      icon: 'fa-solid fa-helicopter',
      color: '#06b6d4',
      x: 88, y: 36,
      desc: 'Indoor flight-capable UAV testing zone with safety netting, motion-capture tracking, and autonomous navigation benchmarks for drone-based sensing and inspection.',
      tags: ['UAV', 'Indoor Flight', 'Motion Capture', 'Autonomous Nav', 'LiDAR Mapping'],
      specs: [
        { k: 'Drones', v: 'DJI Matrice 350 + custom' },
        { k: 'Tracking', v: 'OptiTrack 12-cam MoCap' },
        { k: 'Net dim.', v: '8m × 6m × 4m' },
        { k: 'Control', v: 'PX4 + ROS2' },
      ],
    },
    {
      id: 9,
      title: 'Mobile Robot Platform',
      zone: 'Robotics Center',
      icon: 'fa-solid fa-car-side',
      color: '#10b981',
      x: 75, y: 58,
      desc: 'Autonomous mobile ground platform for indoor and outdoor navigation experiments, AI perception testing, and CPS field deployment validation.',
      tags: ['AMR', 'SLAM', 'Outdoor Nav', 'Perception', 'ROS2'],
      specs: [
        { k: 'Platform', v: 'Clearpath Husky A200' },
        { k: 'Sensors', v: 'LIDAR + stereo cam + IMU' },
        { k: 'Runtime', v: '8 hours per charge' },
        { k: 'Software', v: 'ROS2 Humble + Nav2' },
      ],
    },
    {
      id: 10,
      title: 'Networking & Storage Equipment',
      zone: 'Infrastructure',
      icon: 'fa-solid fa-network-wired',
      color: '#f59e0b',
      x: 12, y: 75,
      desc: 'Core campus networking backbone for the Smart World Lab — 400Gb spine switching, fiber distribution, SD-WAN edge routers, and petabyte-scale NAS for research data.',
      tags: ['400Gb Spine', 'SD-WAN', 'NAS', 'Fiber', 'Zero Trust'],
      specs: [
        { k: 'Switching', v: 'Arista 7280 400GbE' },
        { k: 'Wireless', v: 'Wi-Fi 7 mesh (Cisco)' },
        { k: 'NAS', v: '2 PB Quantum StorNext' },
        { k: 'Security', v: 'Zero Trust / ZTNA' },
      ],
    },
    {
      id: 11,
      title: 'Hardware Prototyping & Dev Bench',
      zone: 'Fabrication Lab',
      icon: 'fa-solid fa-screwdriver-wrench',
      color: '#ec4899',
      x: 38, y: 78,
      desc: 'Electronics design and prototyping bench with oscilloscopes, logic analyzers, PCB soldering stations, and a full suite of embedded development tools.',
      tags: ['PCB Design', 'Embedded Dev', 'FPGA', 'Soldering', 'Debug'],
      specs: [
        { k: 'Scopes', v: 'Keysight DSOX3054T' },
        { k: 'FPGA', v: 'Xilinx Zynq UltraScale+' },
        { k: 'EDA', v: 'Altium + KiCad' },
        { k: 'Platforms', v: 'STM32 / ESP32 / RPi' },
      ],
    },
    {
      id: 12,
      title: 'XR/VR Development Zone',
      zone: 'Immersive Technology',
      icon: 'fa-solid fa-vr-cardboard',
      color: '#8b5cf6',
      x: 57, y: 78,
      desc: 'Meta Quest 3 and custom XR platforms for immersive training, emergency response rehearsal, and digital twin walkthroughs in photorealistic simulated environments.',
      tags: ['Meta Quest 3', 'XR Dev', 'VR Training', 'Unreal Engine', 'Haptics'],
      specs: [
        { k: 'HMDs', v: 'Meta Quest 3 × 8' },
        { k: 'Tracking', v: 'Full-body + hand' },
        { k: 'Engine', v: 'Unreal 5 / Unity XR' },
        { k: 'Use Case', v: 'Safety training, Digital Twin nav' },
      ],
    },
    {
      id: 13,
      title: 'Projector & Presentation Area',
      zone: 'Meeting & Outreach',
      icon: 'fa-solid fa-person-chalkboard',
      color: '#06b6d4',
      x: 82, y: 75,
      desc: 'Professional presentation and outreach space with 4K laser projection, conference A/V system, and flexible seating for demos, stakeholder meetings, and student briefings.',
      tags: ['4K Laser', 'Conference', 'Demo Space', 'Outreach', 'Hybrid'],
      specs: [
        { k: 'Projector', v: 'Epson LS800 4K Laser' },
        { k: 'Screen', v: '140″ motorized UST' },
        { k: 'Capacity', v: '30 seated' },
        { k: 'A/V', v: 'Crestron NVX hybrid' },
      ],
    },
  ];

  const PROCESS_STEPS = [
    { id: 1, key: 'sense',    title: 'Sense',               sub: 'Sensors & real-world capture', icon: 'fa-solid fa-satellite-dish', color: '#06b6d4', zones: [4, 7] },
    { id: 2, key: 'ingest',   title: 'Ingest & Connect',    sub: 'Network and data backbone', icon: 'fa-solid fa-network-wired', color: '#10b981', zones: [9, 0] },
    { id: 3, key: 'process',  title: 'Process & Analyze',   sub: 'AI/ML data processing', icon: 'fa-solid fa-brain', color: '#22c55e', zones: [1, 2] },
    { id: 4, key: 'design',   title: 'Design & Simulate',   sub: 'Digital twin scenario modeling', icon: 'fa-solid fa-cube', color: '#eab308', zones: [5, 11] },
    { id: 5, key: 'fabricate',title: 'Build & Fabricate',   sub: '3D print and prototyping', icon: 'fa-solid fa-screwdriver-wrench', color: '#f59e0b', zones: [3, 10] },
    { id: 6, key: 'test',     title: 'Test & Validate',     sub: 'Functional and safety checks', icon: 'fa-solid fa-vial-circle-check', color: '#a78bfa', zones: [6, 8] },
    { id: 7, key: 'deploy',   title: 'Deploy',              sub: 'Field and cloud deployment', icon: 'fa-solid fa-rocket', color: '#60a5fa', zones: [8, 12] },
    { id: 8, key: 'monitor',  title: 'Monitor & Manage',    sub: 'Live monitoring and analytics', icon: 'fa-solid fa-chart-line', color: '#0ea5e9', zones: [0, 1, 9] },
  ];

  /* ── DOM REFS ─────────────────────────────────── */
  const mapWrap    = document.getElementById('mapWrap');
  const mapInner   = document.getElementById('mapInner');
  const floorImg   = document.getElementById('floorplanImg');
  const pinsLayer  = document.getElementById('pinsLayer');
  const legendList = document.getElementById('legendList');
  const detailPanel= document.getElementById('detailPanel');
  const detailClose= document.getElementById('detailClose');
  const dIcon      = document.getElementById('dIcon');
  const dZone      = document.getElementById('dZone');
  const dTitle     = document.getElementById('dTitle');
  const dDesc      = document.getElementById('dDesc');
  const dTags      = document.getElementById('dTags');
  const dSpecs     = document.getElementById('dSpecs');
  const dCount     = document.getElementById('dCount');
  const dPrev      = document.getElementById('dPrev');
  const dNext      = document.getElementById('dNext');
  const mapHint    = document.getElementById('mapHint');
  const zoneFlash  = document.getElementById('zoneFlash');
  const btnReset   = document.getElementById('btnResetView');
  const btnPins    = document.getElementById('btnTogglePins');
  const btnAutoTour= document.getElementById('btnAutoTour');
  const processSteps = document.getElementById('processSteps');
  const processStatus = document.getElementById('processStatus');

  /* ── STATE ─────────────────────────────────────── */
  let activeIdx    = -1;
  let pinsVisible  = true;
  let scale        = 1;
  let panX         = 0;
  let panY         = 0;
  let imgW         = 0;
  let imgH         = 0;
  let autoTourOn   = true;
  let autoTourTimer = null;
  let autoTourIndex = 0;

  const MIN_SCALE  = 0.3;
  const MAX_SCALE  = 4;

  /* ── BUILD LEGEND ───────────────────────────────── */
  ZONES.forEach((z, i) => {
    const li = document.createElement('li');
    li.className = 'lt-legend-item';
    li.dataset.idx = i;
    li.innerHTML = `
      <span class="lt-legend-dot" style="--dot-clr:${z.color}"></span>
      <span>${z.title}</span>
      <span class="lt-legend-num">${z.id}</span>
    `;
    li.addEventListener('click', () => openZone(i));
    legendList.appendChild(li);
  });

  function buildProcessMenu() {
    if (!processSteps) return;
    processSteps.innerHTML = '';
    PROCESS_STEPS.forEach((step, idx) => {
      const el = document.createElement('button');
      el.className = 'lt-step';
      el.style.setProperty('--step-clr', step.color);
      el.type = 'button';
      el.dataset.step = step.key;
      el.innerHTML = `
        <span class="lt-step-num">${step.id}</span>
        <span class="lt-step-title"><i class="${step.icon}"></i> ${step.title}</span>
        <span class="lt-step-sub">${step.sub}</span>
      `;
      el.addEventListener('click', () => {
        setActiveStep(step.key);
        openZone(step.zones[0]);
        autoTourIndex = step.zones[0];
      });
      processSteps.appendChild(el);
      if (idx === 0) el.classList.add('is-active');
    });
  }

  function setActiveStep(stepKey) {
    const stepEls = processSteps ? processSteps.querySelectorAll('.lt-step') : [];
    stepEls.forEach(el => el.classList.toggle('is-active', el.dataset.step === stepKey));
  }

  function stepForZone(zoneIdx) {
    for (let i = 0; i < PROCESS_STEPS.length; i += 1) {
      if (PROCESS_STEPS[i].zones.includes(zoneIdx)) return PROCESS_STEPS[i];
    }
    return PROCESS_STEPS[0];
  }

  /* ── BUILD PINS ─────────────────────────────────── */
  function buildPins() {
    pinsLayer.innerHTML = '';
    ZONES.forEach((z, i) => {
      const pin = document.createElement('div');
      pin.className = 'lt-pin';
      pin.dataset.idx = i;
      pin.style.left = z.x + '%';
      pin.style.top  = z.y + '%';
      pin.style.setProperty('--pin-clr', z.color);
      pin.innerHTML = `
        <div class="lt-pin-inner">
          <span class="lt-pin-bubble">${z.title}</span>
          <div class="lt-pin-icon"><i class="${z.icon}"></i></div>
          <div class="lt-pin-tip"></div>
        </div>
      `;
      pin.addEventListener('click', (e) => {
        e.stopPropagation();
        openZone(i);
      });
      pinsLayer.appendChild(pin);
    });
  }

  /* ── OPEN ZONE ──────────────────────────────────── */
  function openZone(idx) {
    activeIdx = idx;
    const z = ZONES[idx];

    /* flash */
    zoneFlash.style.background = z.color;
    zoneFlash.classList.remove('flash');
    void zoneFlash.offsetWidth;
    zoneFlash.classList.add('flash');

    /* update pins */
    document.querySelectorAll('.lt-pin').forEach((p, i) => {
      p.classList.toggle('active', i === idx);
    });

    /* update legend */
    document.querySelectorAll('.lt-legend-item').forEach((l, i) => {
      l.classList.toggle('active', i === idx);
    });

    /* fill detail */
    dIcon.innerHTML  = `<i class="${z.icon}"></i>`;
    dIcon.style.background = `linear-gradient(135deg, ${z.color}, color-mix(in srgb, ${z.color} 60%, #000))`;
    dZone.textContent  = z.zone;
    dTitle.textContent = z.title;
    dDesc.textContent  = z.desc;
    dCount.textContent = `${idx + 1} / ${ZONES.length}`;

    dTags.innerHTML = z.tags.map(t =>
      `<span class="lt-tag-chip" style="--chip-clr:${z.color}">${t}</span>`
    ).join('');

    dSpecs.innerHTML = z.specs.map(s =>
      `<div class="lt-spec-row"><span class="lt-spec-key">${s.k}</span><span class="lt-spec-val">${s.v}</span></div>`
    ).join('');

    /* trigger re-animation */
    [dTitle, dDesc, dTags, dSpecs, dIcon].forEach(el => {
      el.style.animation = 'none';
      void el.offsetWidth;
      el.style.animation = '';
    });

    detailPanel.classList.add('open');
    hideHint();

    const mappedStep = stepForZone(idx);
    if (mappedStep) setActiveStep(mappedStep.key);

    /* pan map to pin */
    panToPin(z);
  }

  function closeDetail() {
    detailPanel.classList.remove('open');
    activeIdx = -1;
    document.querySelectorAll('.lt-pin').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.lt-legend-item').forEach(l => l.classList.remove('active'));
  }

  /* ── NAV ────────────────────────────────────────── */
  dPrev.addEventListener('click', () => {
    const next = (activeIdx - 1 + ZONES.length) % ZONES.length;
    openZone(next);
  });
  dNext.addEventListener('click', () => {
    const next = (activeIdx + 1) % ZONES.length;
    openZone(next);
  });
  detailClose.addEventListener('click', closeDetail);

  /* ── PAN TO PIN ─────────────────────────────────── */
  function panToPin(z) {
    const wrapW = mapWrap.clientWidth;
    const wrapH = mapWrap.clientHeight;
    const pinXpx = (z.x / 100) * imgW * scale;
    const pinYpx = (z.y / 100) * imgH * scale;
    panX = wrapW / 2 - pinXpx;
    panY = wrapH / 2 - pinYpx;
    applyTransform(true);
  }

  /* ── PAN & ZOOM ──────────────────────────────────── */
  let isDragging = false;
  let dragStart  = { x: 0, y: 0 };
  let panStart   = { x: 0, y: 0 };

  mapWrap.addEventListener('mousedown', e => {
    if (e.button !== 0) return;
    isDragging = true;
    dragStart  = { x: e.clientX, y: e.clientY };
    panStart   = { x: panX, y: panY };
  });
  window.addEventListener('mousemove', e => {
    if (!isDragging) return;
    panX = panStart.x + (e.clientX - dragStart.x);
    panY = panStart.y + (e.clientY - dragStart.y);
    applyTransform(false);
  });
  window.addEventListener('mouseup', () => { isDragging = false; });

  /* Touch pan */
  let touchStart = null;
  mapWrap.addEventListener('touchstart', e => {
    if (e.touches.length === 1) {
      touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY, px: panX, py: panY };
    }
  }, { passive: true });
  mapWrap.addEventListener('touchmove', e => {
    if (!touchStart || e.touches.length !== 1) return;
    panX = touchStart.px + e.touches[0].clientX - touchStart.x;
    panY = touchStart.py + e.touches[0].clientY - touchStart.y;
    applyTransform(false);
  }, { passive: true });

  /* Scroll zoom */
  mapWrap.addEventListener('wheel', e => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.1 : 0.9;
    const rect   = mapWrap.getBoundingClientRect();
    const mx     = e.clientX - rect.left;
    const my     = e.clientY - rect.top;
    zoomAt(mx, my, factor);
  }, { passive: false });

  function zoomAt(mx, my, factor) {
    const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale * factor));
    panX = mx - (mx - panX) * (newScale / scale);
    panY = my - (my - panY) * (newScale / scale);
    scale = newScale;
    applyTransform(false);
  }

  function applyTransform(animate) {
    mapInner.style.transition = animate ? 'transform 0.45s cubic-bezier(0.4,0,0.2,1)' : 'none';
    mapInner.style.transform  = `translate(${panX}px,${panY}px) scale(${scale})`;
  }

  /* Zoom buttons */
  document.getElementById('zoomIn').addEventListener('click',  () => zoomAt(mapWrap.clientWidth/2, mapWrap.clientHeight/2, 1.25));
  document.getElementById('zoomOut').addEventListener('click', () => zoomAt(mapWrap.clientWidth/2, mapWrap.clientHeight/2, 0.8));

  /* Reset */
  btnReset.addEventListener('click', resetView);
  function resetView() {
    const wrapW = mapWrap.clientWidth;
    const wrapH = mapWrap.clientHeight;
    scale = Math.min(wrapW / imgW, wrapH / imgH, 1);
    panX  = (wrapW - imgW * scale) / 2;
    panY  = (wrapH - imgH * scale) / 2;
    applyTransform(true);
  }

  /* Toggle pins */
  btnPins.addEventListener('click', () => {
    pinsVisible = !pinsVisible;
    pinsLayer.style.display = pinsVisible ? '' : 'none';
    btnPins.classList.toggle('lt-btn--active', pinsVisible);
  });

  function setAutoTourButtonState() {
    if (!btnAutoTour) return;
    btnAutoTour.classList.toggle('lt-btn--active', autoTourOn);
    btnAutoTour.innerHTML = autoTourOn
      ? '<i class="fa-solid fa-circle-pause"></i> Auto Tour'
      : '<i class="fa-solid fa-circle-play"></i> Auto Tour';
    if (processStatus) {
      processStatus.textContent = autoTourOn ? 'Auto touring areas...' : 'Auto tour paused';
    }
  }

  function startAutoTour() {
    if (autoTourTimer) clearInterval(autoTourTimer);
    setAutoTourButtonState();
    autoTourTimer = setInterval(() => {
      if (!autoTourOn) return;
      openZone(autoTourIndex);
      autoTourIndex = (autoTourIndex + 1) % ZONES.length;
    }, 2600);
  }

  function toggleAutoTour() {
    autoTourOn = !autoTourOn;
    setAutoTourButtonState();
  }

  if (btnAutoTour) {
    btnAutoTour.addEventListener('click', toggleAutoTour);
  }

  /* ── HINT HIDE ───────────────────────────────────── */
  let hintTimer = null;
  function hideHint() {
    clearTimeout(hintTimer);
    mapHint.classList.add('hidden');
  }
  mapWrap.addEventListener('mousedown', () => {
    hintTimer = setTimeout(hideHint, 1200);
  });

  /* ── IMAGE LOAD → INIT ───────────────────────────── */
  function init() {
    imgW = floorImg.naturalWidth  || floorImg.clientWidth;
    imgH = floorImg.naturalHeight || floorImg.clientHeight;
    buildProcessMenu();
    buildPins();
    resetView();
    openZone(0);
    autoTourIndex = 1;
    startAutoTour();
  }

  if (floorImg.complete && floorImg.naturalWidth > 0) {
    init();
  } else {
    floorImg.addEventListener('load', init);
    floorImg.addEventListener('error', () => {
      /* fallback placeholder if image missing */
      floorImg.style.cssText = 'width:1200px;height:800px;background:linear-gradient(135deg,#0e1628,#1a2035);display:block;';
      imgW = 1200; imgH = 800;
      buildPins();
      resetView();
    });
  }

  /* ── KEYBOARD NAV ────────────────────────────────── */
  window.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeDetail();
    if (e.key === 'ArrowRight' && activeIdx >= 0) openZone((activeIdx + 1) % ZONES.length);
    if (e.key === 'ArrowLeft'  && activeIdx >= 0) openZone((activeIdx - 1 + ZONES.length) % ZONES.length);
  });

})();
