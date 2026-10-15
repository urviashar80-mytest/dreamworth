/* ==========================================================================
   Homepage behaviour: hero mask, services tabs + cards, "what we solve"
   tracker, sectors spotlight, presence panels.
   ========================================================================== */
(() => {
  'use strict';
  const { RM, $, $$, esc, href } = window.DW;
  const unsplash = (id, w) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=72`;

  /* ---------- Hero mask: video plays through "impact." ---------- */
  const mask = $('[data-mask]');
  const video = mask && $('video', mask);
  const toggle = $('[data-video-toggle]');
  if (video) {
    video.muted = true; video.defaultMuted = true; video.playsInline = true;
    const setToggle = () => {
      const paused = video.paused;
      toggle.textContent = paused ? '▶' : '❚❚';
      toggle.setAttribute('aria-label', paused ? 'Play showreel' : 'Pause showreel');
    };
    const play = () => { const p = video.play(); if (p && p.catch) p.catch(() => {}); };
    if (RM) { video.removeAttribute('autoplay'); video.pause(); } else if (video.readyState >= 2) play(); else video.addEventListener('canplay', play, { once: true });
    video.addEventListener('play', setToggle); video.addEventListener('pause', setToggle); setToggle();
    toggle.addEventListener('click', () => (video.paused ? play() : video.pause()));
    if (!RM) {
      mask.addEventListener('pointermove', e => {
        const r = mask.getBoundingClientRect(); if (!r.width) return;
        const x = -((e.clientX - r.left) / r.width - 0.5) * 48, y = -((e.clientY - r.top) / r.height - 0.5) * 32;
        video.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) scale(1.1)`;
      });
      mask.addEventListener('pointerleave', () => { video.style.transform = 'scale(1.04)'; });
    }
  }

  /* ---------- Services: Influence / Impact tabs + card track ---------- */
  const SERVICES = [
    { v: 'Influence', name: 'Brand Strategy', line: 'Define your position. Clarify your voice. Shape perception.', subs: ['Communication Strategy', 'Messaging & Narrative'], img: ['1577962917302-cd874c4e31d2', 'Team meeting in an Indian office'] },
    { v: 'Influence', name: 'Social Media & Content', line: 'Turn attention into meaningful engagement.', subs: ['Social Strategy', 'Content Strategy'], img: ['1753806390503-efe57f9f916c', 'Crowd on the Mumbai seafront'] },
    { v: 'Influence', name: 'Influencers & Amplification', line: 'Put the right voices behind the right message.', subs: ['Creator Discovery', 'KOL & Celebrity'], img: ['1642828971923-b1bce8553bff', 'Person on the Marine Drive sea wall'] },
    { v: 'Influence', name: 'Performance Marketing & Search', line: 'Turn digital investment into measurable growth and leads.', subs: ['Media Buying', 'SEO'], img: ['1761818645907-8bed418b415b', 'Coworking office in India'] },
    { v: 'Influence', name: 'PR & Online Reputation', line: 'Shape perception. Protect reputation. Manage risk.', subs: ['Reputation Management', 'Negative Content'], img: ['1751105723946-d370b762219a', 'Corporate tower in Nariman Point'] },
    { v: 'Influence', name: 'Digital, Technology & AI', line: 'Build the digital foundation behind modern organisations.', subs: ['Technology Consulting', 'Digital Transformation'], img: ['1668577593918-43e743cad2f8', 'Mumbai skyline at night'] },
    { v: 'Impact', name: 'Media Monitoring', line: 'See the media landscape. Understand what matters.', subs: ['Coverage Monitoring', 'Executive Visibility'], img: ['1753808316148-b7bb56682fc9', 'People on the Marine Drive promenade'] },
    { v: 'Impact', name: 'Social Listening', line: 'Understand the conversations shaping your audience.', subs: ['Conversation Listening', 'Audience Intelligence'], img: ['1753806389160-162eeec494c8', 'Crowd on Marine Drive in monochrome'] },
    { v: 'Impact', name: 'Digital Experience Audit', line: 'Diagnose your digital experience. Prioritise what to improve.', subs: ['UX Intelligence', 'SEO & Discoverability'], img: ['1553009338-80e505b3f61b', 'Young people talking outdoors'] }
  ];
  const VERBS = { Influence: 'Shape · Amplify · Engage · Protect', Impact: 'Listen · Measure · Understand · Act' };
  const track = $('[data-svc-track]');
  const tabs = $$('[data-tab]');
  const renderServices = tab => {
    track.innerHTML = SERVICES.filter(s => s.v === tab).map((s, k) => `
      <a class="card${k === 0 ? ' card--blue' : ''}" href="${href(s.name)}">
        <div class="card__top">
          <div class="card__tags">${s.subs.map(x => `<span class="card__tag">${esc(x)}</span>`).join('')}</div>
          <span class="card__name">${esc(s.name)}</span>
          <span class="card__line">${esc(s.line)}</span>
        </div>
        <div class="card__media">
          <img src="${unsplash(s.img[0], 900)}" alt="${esc(s.img[1])}" loading="lazy">
          <span class="card__more">Learn more<i aria-hidden="true">→</i></span>
        </div>
      </a>`).join('');
    track.scrollLeft = 0;
    $('[data-svc-verbs]').textContent = VERBS[tab];
    track.setAttribute('aria-labelledby', `tab-${tab.toLowerCase()}`);
    tabs.forEach(t => { const on = t.dataset.tab === tab; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; });
  };
  tabs.forEach(t => t.addEventListener('click', () => renderServices(t.dataset.tab)));
  $('[data-svc-tabs]').addEventListener('keydown', e => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const i = tabs.findIndex(t => t.getAttribute('aria-selected') === 'true');
    const n = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
    renderServices(n.dataset.tab); n.focus();
  });
  renderServices('Influence');

  /* ---------- What we solve: highlight the row nearest the viewport middle ---------- */
  const rows = $$('[data-qrow]');
  const qCount = $('[data-qcount]'), qTag = $('[data-qtag]'), qBar = $('[data-qbar]');
  let qActive = -1, qQueued = false;
  const updateQ = () => {
    qQueued = false;
    const mid = window.innerHeight * 0.5; let best = 0, bd = Infinity;
    rows.forEach((el, i) => { const r = el.getBoundingClientRect(), d = Math.abs(r.top + r.height / 2 - mid); if (d < bd) { bd = d; best = i; } });
    if (best === qActive) return;
    qActive = best;
    rows.forEach((el, i) => el.classList.toggle('is-on', i === best));
    qCount.textContent = String(best + 1).padStart(2, '0');
    if (!RM && qCount.animate) qCount.animate([{ transform: 'translateY(40%)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 500, easing: 'cubic-bezier(.16,1,.3,1)' });
    qTag.textContent = best < 3 ? 'Influence' : 'Impact';
    qBar.style.transform = `scaleX(${((best + 1) / rows.length).toFixed(3)})`;
  };
  const queueQ = () => { if (!qQueued) { qQueued = true; requestAnimationFrame(updateQ); } };
  window.addEventListener('scroll', queueQ, { passive: true }); window.addEventListener('resize', queueQ); updateQ();

  /* ---------- Sectors spotlight ---------- */
  const SECTORS = [
    ['BFSI', ['Regulated', 'Trust'], 'Banks, insurers and NBFCs where every word is checked.', '1751105723946-d370b762219a', 'Corporate tower in Nariman Point'],
    ['Government & Public Sector', ['Public', 'Citizens'], 'Campaigns that reach a billion people, clearly.', '1532375810709-75b1da00537c', 'Indian national flag'],
    ['Consumer & FMCG', ['Mass reach', 'Festive'], 'Brands that live in every kirana and every feed.', '1607604760190-ec9ccc12156e', 'Ganesha festival in Mumbai'],
    ['Retail & E-commerce', ['D2C', 'Marketplaces'], 'From the bazaar to the cart.', '1524230507669-5ff97982bb5e', 'Hawa Mahal, Jaipur'],
    ['Healthcare & Pharma', ['Regulated', 'Patients'], 'Credible voices for hospitals and pharma.', '1577962917302-cd874c4e31d2', 'Team meeting in an Indian office'],
    ['Technology & IT', ['B2B', 'Talent'], 'Make complex products easy to trust.', '1761818645907-8bed418b415b', 'Coworking office in India'],
    ['Automotive & Mobility', ['Launches', 'Dealers'], 'Launches, dealers and the drive home.', '1517330357046-3ab5a5dd42a1', 'Auto rickshaw on an Indian street'],
    ['Real Estate & Infrastructure', ['Projects', 'Investors'], 'Projects people believe in before they are built.', '1751105723940-bbae918cedaa', 'Mumbai tower with palm trees'],
    ['Education', ['Admissions', 'Parents'], 'Reach students and the parents who decide.', '1553009338-80e505b3f61b', 'Young people talking outdoors'],
    ['Media & Entertainment', ['Audiences', 'Talent'], 'Premieres, talent and fandoms.', '1668577593918-43e743cad2f8', 'Mumbai skyline at night'],
    ['Energy & Power', ['ESG', 'Policy'], 'Transition stories that hold up to scrutiny.', '1751105724002-5a286c0d8bb2', 'Towers under a cloudy Mumbai sky'],
    ['Hospitality & Travel', ['Travel', 'Experience'], 'Places people want to be.', '1524492412937-b28074a5d7da', 'Taj Mahal']
  ];
  const spot = $('[data-spot]');
  const spotTabs = $('[data-spot-tabs]'), spotMedia = $('[data-spot-media]');
  spotTabs.innerHTML = SECTORS.map(([n], i) => `<button type="button" class="spot__tab" role="tab" id="spot-tab-${i}" aria-controls="spot-panel" aria-selected="false" tabindex="-1" data-spot-i="${i}">${esc(n)}</button>`).join('');
  spotMedia.insertAdjacentHTML('afterbegin', SECTORS.map(([, , , id, alt]) => `<img src="${unsplash(id, 1200)}" alt="" data-alt="${esc(alt)}" loading="lazy">`).join(''));
  const spotBtns = $$('[data-spot-i]', spotTabs), spotImgs = $$('img', spotMedia);
  const DUR = 3600;
  let spotI = -1, spotHold = RM, spotPause = false, spotT0 = performance.now(), spotEl = 0;
  const fill = document.createElement('span'); fill.className = 'spot__fill'; fill.setAttribute('aria-hidden', 'true');
  const setSpot = i => {
    if (i === spotI) return;
    spotI = i;
    const [name, tags, desc] = SECTORS[i];
    spotBtns.forEach((b, k) => { const on = k === i; b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1; });
    spotBtns[i].appendChild(fill);
    spotImgs.forEach((im, k) => { const on = k === i; im.classList.toggle('is-on', on); im.alt = on ? im.dataset.alt : ''; if (on) im.loading = 'eager'; });
    $('[data-spot-tags]').innerHTML = tags.map(t => `<span>${esc(t)}</span>`).join('');
    $('[data-spot-name]').textContent = name;
    $('[data-spot-desc]').textContent = desc;
    $('#spot-panel').setAttribute('aria-labelledby', `spot-tab-${i}`);
  };
  const pick = i => { spotHold = true; setSpot(i); fill.style.width = '100%'; };
  spotTabs.addEventListener('click', e => { const b = e.target.closest('[data-spot-i]'); if (b) pick(+b.dataset.spotI); });
  spotTabs.addEventListener('keydown', e => {
    const keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    if (!(e.key in keys)) return;
    e.preventDefault();
    const n = (spotI + keys[e.key] + SECTORS.length) % SECTORS.length; pick(n); spotBtns[n].focus();
  });
  const pause = on => { if (on) { spotPause = true; } else { spotPause = false; spotT0 = performance.now() - spotEl; } };
  spot.addEventListener('mouseenter', () => pause(true));
  spot.addEventListener('mouseleave', () => pause(false));
  spot.addEventListener('focusin', () => pause(true));
  spot.addEventListener('focusout', e => { if (!spot.contains(e.relatedTarget)) pause(false); });
  setSpot(0);
  if (spotHold) fill.style.width = '100%';
  let spotVisible = false;
  new IntersectionObserver(([e]) => { spotVisible = e.isIntersecting; if (spotVisible) spotT0 = performance.now() - spotEl; }).observe(spot);
  const spotLoop = now => {
    if (!spotHold && !spotPause && spotVisible) {
      spotEl = now - spotT0;
      if (spotEl >= DUR) { spotT0 = now; spotEl = 0; setSpot((spotI + 1) % SECTORS.length); }
      fill.style.width = `${Math.min(1, spotEl / DUR) * 100}%`;
    }
    requestAnimationFrame(spotLoop);
  };
  if (!RM) requestAnimationFrame(spotLoop);

  /* ---------- Presence: expanding city panels ---------- */
  const CITIES = [
    ['Mumbai', 'Headquarters', '1570168007204-dfb528c6958f', 'Gateway of India, Mumbai'],
    ['Thane', 'Office', '1567157577867-05ccb1388e66', 'Waterfront promenade with city towers'],
    ['Delhi', 'Office', '1587474260584-136574528ed5', 'India Gate, New Delhi'],
    ['Bengaluru', 'Office', '1596176530529-78163a4f7af2', 'City skyline at dusk'],
    ['Chennai', 'Office', '1582510003544-4d00b7f74220', 'Temple gopuram, Chennai'],
    ['Kolkata', 'Office', '1536421469767-80559bb6f5e1', 'Howrah Bridge at night, Kolkata'],
    ['Ahmedabad', 'Office', '1599661046289-e31897846e41', 'Stepwell architecture'],
    ['Nagpur', 'Office', '1668577593918-43e743cad2f8', 'City lights at night']
  ];
  const HEIGHTS = [86, 72, 94, 78, 64, 88, 74, 92];
  const cities = $('[data-cities]');
  cities.innerHTML = CITIES.map(([n, role, id, alt], i) => `
    <button type="button" class="city" style="--h:${HEIGHTS[i]}%" aria-expanded="${i === 0}" aria-label="${esc(n)}, ${esc(role)}" data-city="${i}">
      <img src="${unsplash(id, 1200)}" alt="${esc(alt)}" loading="lazy">
      <span class="city__shade" aria-hidden="true"></span>
      <span class="city__v" aria-hidden="true">${esc(n)}</span>
      <span class="city__cap" aria-hidden="true">
        <span class="city__init">${n[0]}</span>
        <span class="city__txt"><span class="city__name">${esc(n)}</span><span class="city__role">${esc(role)}</span></span>
      </span>
    </button>`).join('');
  const cityBtns = $$('[data-city]', cities);
  const openCity = i => cityBtns.forEach((b, k) => b.setAttribute('aria-expanded', String(k === i)));
  cities.addEventListener('mouseover', e => { const b = e.target.closest('[data-city]'); if (b) openCity(+b.dataset.city); });
  cities.addEventListener('focusin', e => { const b = e.target.closest('[data-city]'); if (b) openCity(+b.dataset.city); });
  cities.addEventListener('click', e => { const b = e.target.closest('[data-city]'); if (b) openCity(+b.dataset.city); });
  new ResizeObserver(() => cities.classList.toggle('is-narrow', cities.clientWidth < 680)).observe(cities);
})();
