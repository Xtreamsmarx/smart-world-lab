/* ============================================================
   Centers Pages Interactions
   ============================================================ */

(function () {
  'use strict';

  const links = document.querySelectorAll('.nav-links a[href^="#"]');

  function highlightNav() {
    const sections = document.querySelectorAll('section[id]');
    const position = window.scrollY + 120;

    sections.forEach(section => {
      const id = section.getAttribute('id');
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const link = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (!link) return;
      link.classList.toggle('active', position >= top && position < top + height);
    });
  }

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - 84;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Lightweight assistant chat for center pages
  const chatForm = document.querySelector('[data-chat-form]');
  const chatInput = document.querySelector('[data-chat-input]');
  const chatLog = document.querySelector('[data-chat-log]');

  const cannedResponses = [
    { key: ['hello', 'hi', 'hey'], text: 'Hello. I can help with center overview, services, roadmap, and collaboration steps.' },
    { key: ['director', 'lead'], text: 'For AIT Center leadership: Director Iraj H.P. Mamaghani and Co-Director Mohammad Rasouli.' },
    { key: ['service', 'workshop', 'training'], text: 'Core services include AI literacy workshops, mentoring, consultations, and practical implementation support.' },
    { key: ['contact', 'email'], text: 'Use the contact links on this page or return to Smart World Lab contact section for collaboration requests.' },
    { key: ['phase', 'roadmap'], text: 'Implementation is phased: planning, core service launch, then expanded partnerships and advanced offerings.' }
  ];

  function addMessage(text, role) {
    if (!chatLog) return;
    const msg = document.createElement('div');
    msg.className = `chat-msg ${role}`;
    msg.textContent = text;
    chatLog.appendChild(msg);
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  function getResponse(input) {
    const normalized = input.toLowerCase();
    const match = cannedResponses.find(item => item.key.some(k => normalized.includes(k)));
    if (match) return match.text;
    return 'I can share details about center goals, services, implementation phases, and how to collaborate. Ask me a specific question.';
  }

  if (chatForm && chatInput && chatLog) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const question = chatInput.value.trim();
      if (!question) return;

      addMessage(question, 'user');
      chatInput.value = '';

      setTimeout(() => {
        addMessage(getResponse(question), 'bot');
      }, 320);
    });
  }

  // AIT page visual state animation (safe no-op on pages without these elements)
  const tfNodes = Array.from(document.querySelectorAll('[data-tf-node]'));
  if (tfNodes.length) {
    let tfIndex = 0;
    setInterval(() => {
      tfNodes.forEach((n, i) => n.classList.toggle('tf-node--active', i === tfIndex));
      tfIndex = (tfIndex + 1) % tfNodes.length;
    }, 1700);
  }

  const goSteps = Array.from(document.querySelectorAll('[data-go-step]'));
  const gatewayOrbit = document.querySelector('[data-gateway-orbit]');
  if (goSteps.length) {
    let goIndex = 0;
    setInterval(() => {
      goSteps.forEach((s, i) => s.classList.toggle('go-step--active', i === goIndex));
      goIndex = (goIndex + 1) % goSteps.length;
    }, 1200);
  }

  if (gatewayOrbit && goSteps.length) {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const baseAngles = goSteps.map(step => {
      const raw = getComputedStyle(step).getPropertyValue('--ga').trim();
      const value = Number.parseFloat(raw.replace('deg', ''));
      return Number.isFinite(value) ? value : 0;
    });

    let spin = 0;

    function syncRadius() {
      const width = gatewayOrbit.clientWidth;
      const height = gatewayOrbit.clientHeight;
      const r = Math.max(96, Math.min(width, height) * 0.35);
      gatewayOrbit.style.setProperty('--go-radius', `${r}px`);
    }

    function renderOrbit() {
      goSteps.forEach((step, i) => {
        const angle = baseAngles[i] + spin;
        step.style.setProperty('--go-angle', `${angle}deg`);
      });
      spin = (spin + 0.12) % 360;
      requestAnimationFrame(renderOrbit);
    }

    syncRadius();
    window.addEventListener('resize', syncRadius);

    if (reducedMotion) {
      goSteps.forEach((step, i) => {
        step.style.setProperty('--go-angle', `${baseAngles[i]}deg`);
      });
    } else {
      requestAnimationFrame(renderOrbit);
    }
  }

  window.addEventListener('scroll', highlightNav, { passive: true });
  highlightNav();
})();
