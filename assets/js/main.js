/* ═══════════════════════════════════════════════════════════════════
   INNOVENTUM — Main JS
   Nav scroll · Logo swap (bug-fixed) · Mobile menu · Reveal · Counter
═══════════════════════════════════════════════════════════════════ */
'use strict';

const nav       = document.getElementById('nav');
const logoImg   = document.getElementById('nav-logo-img');
const hamburger = document.getElementById('hamburger');
const mobMenu   = document.getElementById('mob-menu');
const mobClose  = document.getElementById('mob-close');

const LOGO_WHITE = 'assets/img/Logo_Innoventum_STORE_orange_White_text.png';
const LOGO_BLACK = 'assets/img/Logo_Innoventum_STORE_orange_Black_text.png';

// ── Nav: listen on WINDOW (standard page scroll) ─────────────────
function updateNav() {
  const scrolled = window.scrollY > 72;
  nav.classList.toggle('scrolled', scrolled);
  // ✅ Single img src swap — eliminates the CSS display-toggle bug
  if (logoImg) logoImg.src = scrolled ? LOGO_BLACK : LOGO_WHITE;
}
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

// ── Mobile menu ───────────────────────────────────────────────────
function toggleMenu(force) {
  const open = force ?? !mobMenu.classList.contains('open');
  mobMenu.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
}
hamburger.addEventListener('click', () => toggleMenu());
mobClose?.addEventListener('click', () => toggleMenu(false));
mobMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape') toggleMenu(false); });

// ── Reveal on scroll ─────────────────────────────────────────────
const revealEls = document.querySelectorAll('.reveal, .reveal-up');
if ('IntersectionObserver' in window) {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });
  revealEls.forEach(el => obs.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('revealed'));
}

// ── Stat counter animation ────────────────────────────────────────
const counters = document.querySelectorAll('.stat-number[data-target]');
function animateCount(el) {
  const target = +el.dataset.target, dur = 1400, t0 = performance.now();
  (function tick(now) {
    const p = Math.min((now - t0) / dur, 1);
    el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target);
    if (p < 1) requestAnimationFrame(tick);
  })(performance.now());
}
if ('IntersectionObserver' in window) {
  const co = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { animateCount(e.target); co.unobserve(e.target); } });
  }, { threshold: 0.5 });
  counters.forEach(el => co.observe(el));
}

// ── Contact form ──────────────────────────────────────────────────
const form = document.getElementById('contact-form');
const submitBtn = document.getElementById('form-submit');
if (form && submitBtn) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;
    form.querySelectorAll('[required]').forEach(f => {
      const err = !f.value.trim();
      f.style.borderColor = err ? '#e04040' : '';
      if (err) valid = false;
    });
    if (!valid) return;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '✓ Message envoyé — Nous vous répondrons sous 24h';
    submitBtn.style.background = '#2a7a2a';
    setTimeout(() => {
      form.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Envoyer ma demande <span class="arr">→</span>';
      submitBtn.style.background = '';
    }, 5000);
  });
}
