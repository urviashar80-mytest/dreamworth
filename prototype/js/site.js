/* ==========================================================================
   Dreamworth prototype: shared chrome + motion.
   - Injects header, full-screen menu, contact band and footer.
   - Runs reveal / word-rise / drift / clip / fill / slide / zoom / count-up.
   - Everything motion-related is skipped under prefers-reduced-motion.
   ========================================================================== */
(() => {
  'use strict';

  const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const EASE = 'cubic-bezier(.16,1,.3,1)';
  const body = document.body;
  const page = body.dataset.page || 'home';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  /* ---------------------------------------------------------------------
     Site map (from the handoff). Items without a page in this prototype
     fall back to "#" and show a toast when clicked.
     --------------------------------------------------------------------- */
  const PG = {
    'About Us': 'about.html',
    'Our Team': 'about.html#team',
    'Advertising Agency': 'advertising-agency.html',
    'Reputation Management': 'reputation-management.html',
    'Online Reputation': 'reputation-management.html',
    'PR & Online Reputation': 'reputation-management.html',
    'Contact Us': '#b-contact'
  };
  const href = t => PG[t] || '#';

  const MENUS = [
    ['Advertising Services', [
      ['Advertising Agency', ['Print Advertising', 'TV Commercials', 'OOH (Outdoor Ads)', 'Radio Advertising', 'Marketing Collaterals', 'Packaging Design', 'PR & Media']],
      ['Brand Development', ['Logo Design', 'Brand Identity Development', 'Rebranding Services', 'Brand Positioning']],
      ['Multimedia Services', ['Video Production', 'Photography Services', 'Audio Production', '3D & Motion Graphics', 'Visual Content Creation']],
      ['Media', ['Content Writing', 'Content Translation', 'Article Writing', 'Blog Writing', 'Press Release', 'Media Stories', 'News Stories Script', 'Video Script']],
      ['Dreamwalker', ['Jewellery', 'Real Estate', 'FMCG', 'Automobiles', 'Government Schemes', 'Political Awareness']]
    ]],
    ['Brand Management', [
      ['Digital Marketing', ['Social Media Advertising', 'Media Buying', 'Email Marketing', 'Influencers Collab', 'Celebrity Management', 'Monitoring Services', 'SEO Services', 'Online Reputation', 'Crisis Management', 'Digital Property']],
      ['Performance Marketing', ['SEM', 'Social Media Marketing', 'Geo-Fencing Solutions', 'Media Buying', 'Direct Commerce', 'Affiliate Marketing', 'Mass Media Acquisition']],
      ['UI & UX', ['Wireframes Designing', 'Design Consulting', 'Fidelity Prototype', 'Mobile App Design', 'Responsive Website', 'Information Architecture', 'UX Analysis', 'UI UX Design']],
      ['Web Development', ['Enterprise Solution', 'Ecommerce Website', 'Mobile Backend & APIs', 'Content Management', 'Custom Website', 'ERP-CRM', 'Web Portal', 'SaaS Product']],
      ['Tech Services', ['Apps Development', 'Web App Development', 'Website Development', 'Software Consulting', 'Web Based Chat Bots', 'WhatsApp Chat Bots']],
      ['Tele Marketing', ['SMS Marketing', 'WhatsApp Marketing', 'Audio Bridge', 'Hello SMS', 'Missed Call Services', 'Voice Engagement', 'Call Centre Facility']]
    ]],
    ['Cyber Security', [
      ['Cyber Security', ['Cloud Security Services', 'Infrastructure Security', 'Vulnerability / PEN', 'Compliance']],
      ['Cyber Security Consultancy', ['Security Assessment', 'Vulnerability', 'Penetration Testing', 'Risk Analysis', 'Data Protection Policies', 'Incident Response Plan', 'Disaster Recovery', 'Breach Response', 'Business Continuity']],
      ['Cyber Security Products', ['Antivirus', 'Firewall & Network', 'Communication', 'Identity & Access', 'Data Security Tools']],
      ['Managed Security Services', ['24/7 Security Monitoring', 'Security Operations', 'Endpoint Protection']],
      ['Cyber Security Awareness', ['Corporate Training', 'Government Training', 'Individual Training', 'Community Programs', 'Educational Resources', 'Customized Campaign']],
      ['Digital Transmission', ['Cloud Consulting', 'Cloud Managed', 'Cloud Migration']]
    ]],
    ['Other Services', ['Media House', 'Consulting Services', 'Project Management', 'Digital Eco System', 'Project Based Services', 'Experience'].map(t => [t, []])],
    ['Agency', ['About Us', 'Vision & Mission', 'Our Team', 'Our Clients', 'Careers', 'Press Release', 'Contact Us', 'Blog'].map(t => [t, []])]
  ];
  const CITIES = ['Mumbai', 'Thane', 'Delhi', 'Bengaluru', 'Chennai', 'Kolkata', 'Ahmedabad', 'Nagpur'];
  const SOCIAL = ['Facebook', 'Instagram', 'LinkedIn', 'X', 'YouTube'];

  /* ---------------------------------------------------------------------
     Chrome templates
     --------------------------------------------------------------------- */
  const tplHeader = () => `
<a class="skip" href="#main">Skip to content</a>
<header class="hdr" data-hdr>
  <div class="wrap hdr__in">
    <a class="hdr__logo" href="index.html"><img data-logo src="assets/brand/dws-logo-crop.png" alt="Dreamworth Solutions" height="56"></a>
    <nav class="hdr__nav" aria-label="Main">
      ${MENUS.map(([l]) => `<button type="button" class="hdr__item" aria-expanded="false" aria-controls="menu" data-open="${esc(l)}">${esc(l)}<span class="chev" aria-hidden="true"></span></button>`).join('')}
    </nav>
    <div class="hdr__actions">
      <a class="btn btn--navy" href="#b-contact">Let’s talk</a>
      <button type="button" class="btn btn--outline hdr__menu-btn" aria-expanded="false" aria-controls="menu" data-open="">Menu</button>
    </div>
  </div>
</header>`;

  const tplMenu = () => `
<div class="menu" id="menu" role="dialog" aria-modal="true" aria-label="Site menu" hidden>
  <button type="button" class="menu__close" aria-label="Close menu" data-close><i aria-hidden="true"></i></button>
  <div class="menu__main">
    <a class="menu__logo" href="index.html"><img src="assets/brand/dws-logo-crop-white.png" alt="Dreamworth Solutions" height="52"></a>
    <div class="menu__grid">
      <nav class="menu__primary" aria-label="Menu sections">
        ${MENUS.map(([l], i) => `<div class="menu__pwrap"><button type="button" class="menu__p" data-primary="${esc(l)}" style="animation-delay:${220 + i * 70}ms">${esc(l)}<span aria-hidden="true">→</span></button></div>`).join('')}
      </nav>
      <div class="menu__sub" data-sub></div>
    </div>
    <div class="menu__foot">
      <a class="menu__cta" href="#b-contact" data-close>
        <span class="menu__cta-a">Not sure which service fits?</span>
        <span class="menu__cta-b">Tell us the challenge →</span>
      </a>
      <div class="menu__social">${SOCIAL.map(s => `<a href="#">${s}</a>`).join('')}</div>
    </div>
  </div>
  <div class="menu__side">
    <div class="menu__pitch">
      <span class="menu__pitch-a">Got a communication challenge?</span>
      <h2>Let’s shape perception and prove what changed.</h2>
      <a class="btn btn--outline-light" href="#b-contact" data-close>Get in touch</a>
      <div class="menu__links">
        <a href="tel:+918657357244">Call now</a>
        <a href="https://wa.me/918657357244">WhatsApp</a>
        <a href="mailto:sales@dreamworth.in">sales@dreamworth.in</a>
      </div>
    </div>
    <div class="menu__cities">${CITIES.map(c => `<span>${c}</span>`).join('')}</div>
  </div>
</div>`;

  const tplContact = () => `
<section id="b-contact" class="contact on-blue" data-cliprev aria-labelledby="contact-title">
  <div class="wrap contact__in">
    <div class="contact__copy">
      <span class="contact__kicker" data-reveal>Got a communication challenge?</span>
      <h2 class="contact__title" id="contact-title" data-reveal>Let’s build influence together.</h2>
      <span class="contact__who" data-reveal>Gagan Mahotra, Managing Director · <a href="mailto:gagan@dreamworth.in">gagan@dreamworth.in</a></span>
    </div>
    <a class="ring" href="mailto:gagan@dreamworth.in" aria-label="Let’s talk: email gagan@dreamworth.in" data-reveal="img">
      <svg viewBox="0 0 200 200" aria-hidden="true"><defs><path id="dwRing" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0"/></defs><text><textPath href="#dwRing">Let’s talk · Let’s talk · Let’s talk ·</textPath></text></svg>
      <span class="ring__arrow" aria-hidden="true">↗</span>
    </a>
  </div>
</section>`;

  const tplFooter = () => {
    const tick = ['Delivering with passion – appreciating our clients', 'Your success is our success – appreciating the journey together'];
    const items = [0, 1, 2, 3].flatMap(() => tick).map(t => `<span class="ticker__item">${t}<i></i></span>`).join('');
    const glass = page === 'about';
    const word = glass
      ? `<span class="foot__word foot__word--glass" data-drift="12"><span>dreamworth</span><span aria-hidden="true">dreamworth</span></span>`
      : `<span class="foot__word" data-drift="12">dreamworth</span>`;
    const col = (label, links) => `<div class="foot__col"><span class="foot__label">${label}</span>${links}</div>`;
    const a = t => `<a href="${href(t)}">${t}</a>`;
    return `
<footer class="foot on-dark">
  <div class="ticker" role="img" aria-label="Delivering with passion, appreciating our clients. Your success is our success, appreciating the journey together."><div class="ticker__track" aria-hidden="true">${items}</div></div>
  <div class="wrap foot__body">
    <div class="foot__cols">
      <div class="foot__col">
        <img src="assets/brand/dws-logo-crop-white.png" alt="Dreamworth Solutions" height="52">
        <span class="foot__tag">Influence &amp; Impact,<br>since 2012.</span>
      </div>
      ${col('Services', ['Advertising Services', 'Brand Management', 'Cyber Security', 'Other Services'].map(a).join(''))}
      ${col('Agency', ['About Us', 'Our Team', 'Careers', 'Blog'].map(a).join(''))}
      ${col('Contact', `<a class="foot__big" href="tel:+918657357244">+91 8657 357 244</a><a class="foot__big" href="mailto:sales@dreamworth.in">sales@dreamworth.in</a><span class="foot__addr">Embassy Centre, Nariman Point, Mumbai</span>`)}
      ${col('Follow', ['LinkedIn', 'Instagram', 'Facebook', 'X', 'YouTube'].map(s => `<a href="#">${s}</a>`).join(''))}
    </div>
    <div class="foot__bar">
      <span>© 2026 Dreamworth Solutions Pvt. Ltd.</span>
      <div class="foot__legal">
        <a href="#">Terms &amp; Conditions</a>
        <a href="#">Privacy Policy</a>
        <a class="foot__top" href="#top" aria-label="Back to top">↑</a>
      </div>
    </div>
  </div>
  <div class="wrap foot__mark" aria-hidden="true">${word}</div>
</footer>`;
  };

  /* Photos are Unsplash stand-ins loaded by URL. If one fails, hide it so the
     navy frame shows instead of a broken-image icon. */
  const hideBroken = img => { img.style.visibility = 'hidden'; };
  document.addEventListener('error', e => { if (e.target.tagName === 'IMG') hideBroken(e.target); }, true);
  $$('img').forEach(img => { if (img.complete && img.src && img.naturalWidth === 0) hideBroken(img); });

  const inject = (name, html) => { const el = $(`[data-chrome="${name}"]`); if (el) el.outerHTML = html; };
  inject('header', tplHeader());
  inject('contact', tplContact());
  inject('footer', tplFooter());
  $('.page').insertAdjacentHTML('beforeend', tplMenu());

  /* ---------------------------------------------------------------------
     Header: shadow + logo shrink on scroll
     --------------------------------------------------------------------- */
  const hdr = $('[data-hdr]');
  let hdrScrolled = null;
  const onHdr = () => {
    const s = window.scrollY > 60;
    if (s !== hdrScrolled) { hdrScrolled = s; hdr.classList.toggle('is-scrolled', s); }
  };
  window.addEventListener('scroll', onHdr, { passive: true }); onHdr();

  /* ---------------------------------------------------------------------
     Full-screen split menu
     --------------------------------------------------------------------- */
  const menu = $('#menu');
  const sub = $('[data-sub]', menu);
  const compactMQ = window.matchMedia('(max-width: 1199px)');
  const hoverMQ = window.matchMedia('(hover: hover)');
  const state = { open: false, primary: MENUS[0][0], group: 0, returnTo: null };

  const renderSub = () => {
    const entry = MENUS.find(m => m[0] === state.primary) || MENUS[0];
    const cols = entry[1];
    const simple = cols.every(c => !c[1].length);
    $$('.menu__p', menu).forEach(b => b.setAttribute('aria-current', String(b.dataset.primary === state.primary)));
    if (simple) {
      sub.innerHTML = `<span class="menu__meta">Pages</span>` + cols.map(([t]) => `<a class="menu__page" href="${href(t)}" data-close>${esc(t)}</a>`).join('');
      return;
    }
    sub.innerHTML = `<span class="menu__meta">Services</span>` + cols.map(([t, items], i) => {
      const on = i === state.group;
      const id = `mg-${i}`;
      const overview = PG[t] ? `<a class="menu__overview" href="${href(t)}" data-close>${esc(t)} overview →</a>` : '';
      return `<div class="menu__group">
        <button type="button" class="menu__gbtn" aria-expanded="${on}" aria-controls="${id}" data-group="${i}">${esc(t)}</button>
        <div class="menu__items" id="${id}" ${on ? '' : 'hidden'}>${overview}${items.map(x => `<a href="${href(x)}" data-close>${esc(x)}</a>`).join('')}</div>
      </div>`;
    }).join('');
  };

  const setPrimary = label => {
    if (label === state.primary) return;
    state.primary = label; state.group = 0; renderSub();
    syncTriggers();
  };
  const syncTriggers = () => {
    $$('[data-open]').forEach(b => {
      const isNav = b.classList.contains('hdr__item');
      b.setAttribute('aria-expanded', String(state.open && (!isNav || b.dataset.open === state.primary)));
    });
    $('.hdr__menu-btn').textContent = state.open ? 'Close' : 'Menu';
  };
  const focusables = () => $$('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])', menu).filter(el => el.getClientRects().length > 0);

  const openMenu = (label, trigger) => {
    state.primary = label || MENUS[0][0]; state.group = 0; state.open = true; state.returnTo = trigger || document.activeElement;
    renderSub();
    menu.hidden = false;
    document.documentElement.style.overflow = 'hidden';
    syncTriggers();
    $('.menu__close', menu).focus({ preventScroll: true });
  };
  const closeMenu = (restore = true) => {
    if (!state.open) return;
    state.open = false; menu.hidden = true;
    document.documentElement.style.overflow = '';
    syncTriggers();
    if (restore && state.returnTo && state.returnTo.focus) state.returnTo.focus({ preventScroll: true });
  };

  document.addEventListener('click', e => {
    const opener = e.target.closest('[data-open]');
    if (opener) {
      const label = opener.dataset.open;
      if (state.open && (!label || label === state.primary)) closeMenu(); else openMenu(label, opener);
      return;
    }
    if (!state.open) return;
    const pb = e.target.closest('[data-primary]');
    if (pb) { setPrimary(pb.dataset.primary); return; }
    const gb = e.target.closest('[data-group]');
    if (gb) { state.group = +gb.dataset.group; renderSub(); const again = $(`[data-group="${state.group}"]`, menu); if (again) again.focus(); return; }
    const closer = e.target.closest('[data-close]');
    if (closer) closeMenu(closer.tagName !== 'A');
  });
  menu.addEventListener('mouseover', e => {
    if (!hoverMQ.matches) return;
    const pb = e.target.closest('[data-primary]');
    if (pb) setPrimary(pb.dataset.primary);
  });
  menu.addEventListener('focusin', e => {
    const pb = e.target.closest('[data-primary]');
    if (pb) setPrimary(pb.dataset.primary);
  });
  document.addEventListener('keydown', e => {
    if (!state.open) return;
    if (e.key === 'Escape') { e.preventDefault(); closeMenu(); return; }
    if (e.key === 'Tab') {
      const f = focusables(); if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  compactMQ.addEventListener('change', () => closeMenu(false));

  /* ---------------------------------------------------------------------
     Dead links: the handoff lists them as "go nowhere yet"
     --------------------------------------------------------------------- */
  const toast = document.createElement('div');
  toast.className = 'toast'; toast.setAttribute('role', 'status'); toast.setAttribute('aria-live', 'polite');
  document.body.appendChild(toast);
  let toastT = 0;
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href="#"]');
    if (!a) return;
    e.preventDefault();
    toast.textContent = `“${a.textContent.trim()}” is not part of this prototype yet`;
    toast.classList.add('is-on'); clearTimeout(toastT);
    toastT = setTimeout(() => toast.classList.remove('is-on'), 2400);
  });

  /* ---------------------------------------------------------------------
     Rails: prev / next buttons scroll a horizontal track
     --------------------------------------------------------------------- */
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-rail]');
    if (!b) return;
    const t = document.getElementById(b.dataset.rail);
    if (t) t.scrollBy({ left: (+b.dataset.dir || 1) * t.clientWidth * (+b.dataset.step || 0.6), behavior: RM ? 'auto' : 'smooth' });
  });

  /* ---------------------------------------------------------------------
     Intro overlay (homepage only)
     --------------------------------------------------------------------- */
  const intro = $('.intro');
  const playIntro = !!intro && !RM && document.visibilityState !== 'hidden';
  const BASE = playIntro ? 1150 : 0;
  if (intro && !playIntro) intro.remove();
  if (playIntro) {
    setTimeout(() => {
      if (!intro.animate) { intro.remove(); return; }
      const a = intro.animate([{ clipPath: 'inset(0 0 0 0)' }, { clipPath: 'inset(0 0 100% 0)' }], { duration: 850, easing: 'cubic-bezier(.76,0,.24,1)', fill: 'forwards' });
      a.onfinish = () => intro.remove();
    }, 1050);
  }

  window.DW = { RM, EASE, BASE, $, $$, esc, href, PG };

  /* ---------------------------------------------------------------------
     Motion. Nothing below runs under reduced motion.
     --------------------------------------------------------------------- */
  if (RM || !('IntersectionObserver' in window) || document.visibilityState === 'hidden') return;

  const H = () => window.innerHeight;
  const below = el => el.getBoundingClientRect().top > H() * 0.92;
  const clamp01 = v => Math.max(0, Math.min(1, v));
  const easeOut3 = t => 1 - Math.pow(1 - t, 3);

  /* Header slides in */
  if (hdr.animate) hdr.animate([{ transform: 'translateY(-100%)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 900, delay: BASE + 80, easing: EASE, fill: 'backwards' });

  /* Load-in: hero words and blocks */
  const words = $$('[data-word]');
  words.forEach((w, i) => {
    const d = BASE + 200 + i * 120;
    w.style.opacity = '0'; w.style.transform = 'translateY(70%) rotate(3deg)'; w.style.transformOrigin = '0 100%';
    w.style.transition = `opacity 1s ${EASE} ${d}ms, transform 1.1s ${EASE} ${d}ms`;
  });
  const loads = $$('[data-load]');
  loads.forEach(el => {
    const d = BASE + 600 + (+el.dataset.load || 0) * 130;
    if (el.hasAttribute('data-loadclip') && el.animate) el.animate([{ clipPath: 'inset(0 12% round 48px)' }, { clipPath: 'inset(0 0% round 0px)' }], { duration: 1300, delay: d, easing: 'cubic-bezier(.76,0,.24,1)', fill: 'backwards' });
    el.style.opacity = '0'; el.style.transform = 'translateY(28px)';
    el.style.transition = `opacity .9s ${EASE} ${d}ms, transform .9s ${EASE} ${d}ms`;
  });
  requestAnimationFrame(() => requestAnimationFrame(() => [...words, ...loads].forEach(w => { w.style.opacity = '1'; w.style.transform = 'none'; })));

  /* Word / character rise for H2s and drifting giant type */
  const wrapUnits = (el, chars) => {
    const inner = [];
    const walk = n => Array.from(n.childNodes).forEach(c => {
      if (c.nodeType === 3) {
        const frag = document.createDocumentFragment();
        c.textContent.split(/(\s+)/).forEach(p => {
          if (!p) return;
          if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(p)); return; }
          const word = document.createElement('span');
          word.style.cssText = 'display:inline-block;white-space:nowrap';
          (chars ? Array.from(p) : [p]).forEach(u => {
            const o = document.createElement('span'), i = document.createElement('span');
            o.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:top;padding:0.1em 0 0.3em;margin:-0.1em 0 -0.3em';
            i.style.cssText = 'display:inline-block;transform:translateY(110%)';
            i.textContent = u; o.appendChild(i); word.appendChild(o); inner.push(i);
          });
          frag.appendChild(word);
        });
        c.replaceWith(frag);
      } else if (c.nodeType === 1 && c.tagName !== 'BR') walk(c);
    });
    walk(el); return inner;
  };
  const splitIO = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; splitIO.unobserve(e.target);
    (e.target.__units || []).forEach((u, i) => {
      const d = Math.min(i, 40) * (e.target.__chars ? 28 : 70);
      u.style.transition = `transform 1.1s ${EASE} ${d}ms`; u.style.transform = 'none';
      setTimeout(() => { if (u.parentNode) u.parentNode.style.overflow = 'visible'; }, d + 1150);
    });
  }), { threshold: 0.2 });
  $$('h2[data-reveal]:not([data-reveal="img"])').forEach(el => {
    if (!below(el)) return;
    el.dataset.reveal = 'split'; el.__units = wrapUnits(el, false); splitIO.observe(el);
  });
  $$('[data-drift]').forEach(el => {
    if (!below(el) || el.children.length) return;
    el.__chars = true; el.__units = wrapUnits(el, true); splitIO.observe(el);
  });

  /* Breaker: grid children grow down from the top, staggered */
  const lineIO = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; lineIO.unobserve(e.target);
    Array.from(e.target.children).forEach((c, i) => { c.style.transition = `transform 1.4s ${EASE} ${i * 60}ms`; c.style.transform = 'none'; });
  }), { threshold: 0.1 });
  $$('[data-lines]').forEach(g => {
    if (!below(g)) return;
    Array.from(g.children).forEach(c => { c.style.transformOrigin = '50% 0'; c.style.transform = 'scaleY(0)'; });
    lineIO.observe(g);
  });

  /* Reveal / image reveal / stagger / count-up */
  const hide = [];
  const prep = (el, tr) => { if (el.getBoundingClientRect().top < H()) return false; el.style.opacity = '0'; el.style.transform = tr; hide.push(el); return true; };
  $$('[data-reveal]').forEach(el => {
    const v = el.dataset.reveal;
    if (v === 'split') return;
    if (v === 'img') { if (prep(el, 'scale(0.92)')) el.style.transition = `opacity 1.1s ${EASE}, transform 1.2s ${EASE}`; return; }
    if (prep(el, 'translateY(48px)')) el.style.transition = `opacity 1s ${EASE}, transform 1s ${EASE}`;
  });
  /* Reveal, then hand the element back to its stylesheet so hover transforms work. */
  const show = (el, settle) => {
    el.style.opacity = '1'; el.style.transform = 'none';
    setTimeout(() => { el.style.removeProperty('opacity'); el.style.removeProperty('transform'); el.style.removeProperty('transition'); }, settle);
  };
  /* Stagger groups are observed as a whole, so items scrolled out of a
     horizontal rail still come in with their siblings. */
  const groupIO = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; groupIO.unobserve(e.target);
    Array.from(e.target.children).forEach((c, i) => show(c, Math.min(i, 12) * 60 + 900));
  }), { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
  $$('[data-stagger]').forEach(g => {
    if (g.getBoundingClientRect().top < H()) return;
    Array.from(g.children).forEach((c, i) => {
      const d = Math.min(i, 12) * 60;
      c.style.opacity = '0'; c.style.transform = 'translateY(36px)';
      c.style.transition = `opacity .8s ${EASE} ${d}ms, transform .8s ${EASE} ${d}ms`;
    });
    groupIO.observe(g);
  });
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target; io.unobserve(el);
    if (el.hasAttribute('data-count')) {
      const to = +el.dataset.count, t0 = performance.now();
      const st = t => { const p = Math.min(1, (t - t0) / 1400); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 4))); if (p < 1) requestAnimationFrame(st); };
      el.textContent = '0'; requestAnimationFrame(st);
    } else show(el, 1300);
  }), { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
  hide.forEach(el => io.observe(el));
  $$('[data-count]').forEach(el => io.observe(el));

  /* Scroll fill: words go from 0.16 to 1 opacity as the paragraph crosses the viewport */
  const fills = $$('[data-fill]');
  fills.forEach(el => {
    const ws = [];
    const walk = n => Array.from(n.childNodes).forEach(c => {
      if (c.nodeType === 3) {
        const frag = document.createDocumentFragment();
        c.textContent.split(/(\s+)/).forEach(p => {
          if (!p) return;
          if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(p)); return; }
          const s = document.createElement('span'); s.textContent = p; s.style.opacity = '0.16'; s.style.transition = 'opacity .3s linear';
          ws.push(s); frag.appendChild(s);
        });
        c.replaceWith(frag);
      } else if (c.nodeType === 1) walk(c);
    });
    walk(el); el.__ws = ws;
  });

  /* One rAF loop for everything scroll-linked */
  const drifts = $$('[data-drift]'), spins = $$('[data-spin]'), clips = $$('[data-cliprev]');
  const pars = $$('[data-par]'), zooms = $$('[data-zoom]'), slides = $$('[data-slide]');
  const tick = () => {
    const h = H();
    drifts.forEach(el => {
      const r = el.parentElement.getBoundingClientRect(); if (r.bottom < 0 || r.top > h) return;
      const p = (h - r.top) / (h + r.height);
      el.style.transform = `translate3d(${((p - 0.5) * 2 * +el.dataset.drift).toFixed(1)}px,0,0)`;
    });
    spins.forEach(el => {
      const r = (el.closest('section') || el.parentElement).getBoundingClientRect(); if (r.bottom < 0 || r.top > h) return;
      el.style.transform = `rotate(${(((h - r.top) / (h + r.height)) * +el.dataset.spin).toFixed(1)}deg)`;
    });
    clips.forEach(el => {
      const r = el.getBoundingClientRect(); if (r.bottom < 0 || r.top > h) return;
      const q = 1 - easeOut3(clamp01((h - r.top) / (h * 0.7)));
      el.style.clipPath = `inset(0 ${(q * 5).toFixed(2)}% round ${(q * 56).toFixed(1)}px)`;
    });
    pars.forEach(el => {
      const r = el.parentElement.getBoundingClientRect(); if (r.bottom < 0) return;
      const y = Math.max(0, -r.top);
      el.style.transform = `translate3d(0,${(y * 0.32).toFixed(1)}px,0)`;
      el.style.opacity = (1 - clamp01(y / (r.height * 0.9)) * 0.6).toFixed(3);
    });
    zooms.forEach(el => {
      const r = el.parentElement.getBoundingClientRect(); if (r.bottom < 0 || r.top > h) return;
      el.style.transform = `scale(${(1.22 - 0.22 * easeOut3(clamp01((h - r.top) / (h * 1.1)))).toFixed(4)})`;
    });
    slides.forEach(el => {
      const r = el.getBoundingClientRect(); if (r.bottom < -100 || r.top > h + 100) return;
      el.style.transform = `translate3d(${((1 - easeOut3(clamp01((h - r.top) / (h * 0.75)))) * +el.dataset.slide).toFixed(2)}vw,0,0)`;
    });
    fills.forEach(el => {
      const r = el.getBoundingClientRect(); if (r.bottom < -80 || r.top > h + 80) return;
      const p = clamp01((h * 0.85 - r.top) / (r.height + h * 0.3)), ws = el.__ws, f = p * ws.length * 1.1;
      for (let i = 0; i < ws.length; i++) {
        const o = Math.round(Math.max(0.16, Math.min(1, f - i)) * 100) / 100;
        if (ws[i].__o !== o) { ws[i].__o = o; ws[i].style.opacity = o; }
      }
    });
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
})();
