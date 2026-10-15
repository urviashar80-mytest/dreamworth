/* Certifications block, shared by Home and About. Runs before site.js so the
   reveal / stagger motion picks it up. */
(() => {
  const host = document.querySelector('[data-certs]');
  if (!host) return;
  const laurel = `<svg aria-hidden="true" width="0" height="0" style="position:absolute">
  <defs><symbol id="dw-laurel" viewBox="0 0 60 160">
    <path d="M46 152 Q4 92 26 8" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
    <ellipse cx="29" cy="134" rx="4.2" ry="10" transform="rotate(-58 29 134)" fill="currentColor"/>
    <ellipse cx="21" cy="117" rx="4.2" ry="10" transform="rotate(-48 21 117)" fill="currentColor"/>
    <ellipse cx="15" cy="99" rx="4.2" ry="10" transform="rotate(-38 15 99)" fill="currentColor"/>
    <ellipse cx="12" cy="80" rx="4.2" ry="10" transform="rotate(-28 12 80)" fill="currentColor"/>
    <ellipse cx="11.5" cy="61" rx="4.2" ry="10" transform="rotate(-18 11.5 61)" fill="currentColor"/>
    <ellipse cx="13.5" cy="42" rx="4" ry="9.5" transform="rotate(-8 13.5 42)" fill="currentColor"/>
    <ellipse cx="18" cy="22" rx="3.8" ry="9" transform="rotate(4 18 22)" fill="currentColor"/>
    <ellipse cx="44" cy="128" rx="3.6" ry="8.5" transform="rotate(32 44 128)" fill="currentColor"/>
    <ellipse cx="34" cy="110" rx="3.6" ry="8.5" transform="rotate(38 34 110)" fill="currentColor"/>
    <ellipse cx="28" cy="91" rx="3.6" ry="8.5" transform="rotate(42 28 91)" fill="currentColor"/>
    <ellipse cx="26" cy="72" rx="3.6" ry="8.5" transform="rotate(46 26 72)" fill="currentColor"/>
    <ellipse cx="27" cy="53" rx="3.4" ry="8" transform="rotate(50 27 53)" fill="currentColor"/>
    <ellipse cx="30" cy="34" rx="3.2" ry="7.5" transform="rotate(54 30 34)" fill="currentColor"/>
    <ellipse cx="27" cy="6" rx="3" ry="7" transform="rotate(20 27 6)" fill="currentColor"/>
  </symbol></defs></svg>`;
  const items = [
    ['ISO', '9001', 'ISO 9001:2015', 'Quality management systems'],
    ['ISO', '27701', 'ISO 27701', 'Privacy information management'],
    ['SOC', '2', 'SOC 2', 'Security · Availability · Integrity<br>Confidentiality · Privacy']
  ];
  const leaf = '<svg aria-hidden="true" viewBox="0 0 60 160"><use href="#dw-laurel"/></svg>';
  host.innerHTML = `${laurel}
<div class="certs">
  <div class="certs__head" data-reveal>
    <div class="stack" style="gap:20px">
      <span class="eyebrow">Awards &amp; certifications</span>
      <h2 class="certs__title" id="certs-title">Certified for quality, privacy and security.</h2>
    </div>
    <p class="certs__note">Independently audited standards behind every campaign we run.</p>
  </div>
  <ul class="certs__grid" data-stagger style="list-style:none;margin:0;padding:0">
    ${items.map(([k, n, name, desc]) => `
    <li class="cert">
      <div class="cert__badge">${leaf}<div class="cert__ring"><small>${k}</small><b>${n}</b></div>${leaf}</div>
      <div class="cert__text"><span class="cert__name">${name}</span><span class="cert__desc">${desc}</span></div>
    </li>`).join('')}
  </ul>
</div>`;
})();
