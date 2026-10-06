/* ==========================================================================
   PawCompanion — Interactive layer (shared across all pages)
   ========================================================================== */
(function () {
  'use strict';
  const qs = (s, r) => (r || document).querySelector(s);
  const qsa = (s, r) => Array.from((r || document).querySelectorAll(s));
  const on = (el, ev, fn) => el && el.addEventListener(ev, fn);

  /* ---------- Toast ---------- */
  function toast(title, body, icon) {
    let wrap = qs('.toast-wrap');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.className = 'toast-wrap';
      document.body.appendChild(wrap);
    }
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = '<div class="toast-ico">' + (icon || '🐾') + '</div><div><b>' + title +
      '</b><p>' + body + '</p></div>';
    wrap.appendChild(t);
    requestAnimationFrame(() => t.classList.add('show'));
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 4200);
  }

  /* ---------- Sticky header + mobile nav ---------- */
  function initNav() {
    const header = qs('.site-header');
    if (header) {
      on(window, 'scroll', () => header.classList.toggle('scrolled', window.scrollY > 10));
      header.classList.toggle('scrolled', window.scrollY > 10);
    }
    const toggle = qs('.nav-toggle');
    const menu = qs('.mobile-menu');
    if (toggle && menu) {
      on(toggle, 'click', () => {
        const open = menu.classList.toggle('open');
        toggle.classList.toggle('open', open);
        toggle.setAttribute('aria-expanded', open);
        document.body.classList.toggle('no-scroll', open);
      });
      qsa('a', menu).forEach(a => on(a, 'click', () => {
        menu.classList.remove('open'); toggle.classList.remove('open'); document.body.classList.remove('no-scroll');
      }));
    }
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveal() {
    const els = qsa('.reveal');
    if (!els.length || !('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('in')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    els.forEach(e => io.observe(e));
  }

  /* ---------- Back to top ---------- */
  function initBackTop() {
    const b = qs('.back-top');
    if (!b) return;
    on(window, 'scroll', () => b.classList.toggle('show', window.scrollY > 600));
    on(b, 'click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---------- FAQ accordion ---------- */
  function initFaq() {
    qsa('.faq-item').forEach((item) => {
      const q = item.querySelector('.faq-q');
      const a = item.querySelector('.faq-a');
      if (!q || !a) return;
      on(q, 'click', () => {
        const open = item.classList.toggle('open');
        a.style.maxHeight = open ? a.scrollHeight + 'px' : '0px';
        qsa('.faq-item').forEach(o => { if (o !== item) { o.classList.remove('open'); o.querySelector('.faq-a').style.maxHeight = '0px'; } });
      });
    });
  }

  /* ---------- Lazy videos (free-license WebM) ---------- */
  function initVideos() {
    qsa('[data-video]').forEach((box) => {
      const overlay = box.querySelector('.play');
      const vid = document.createElement('video');
      vid.setAttribute('playsinline', '');
      vid.setAttribute('preload', 'none');
      vid.setAttribute('controls', '');
      vid.loop = true;
      vid.muted = true;
      vid.poster = box.getAttribute('data-poster') || '';
      box.appendChild(vid);
      if (overlay) on(overlay, 'click', () => {
        vid.src = box.getAttribute('data-video');
        vid.play().catch(() => {});
        if (overlay) overlay.style.display = 'none';
      });
    });
  }

  /* ---------- Pricing (monthly / annual toggle + plan select) ---------- */
  function initPricing() {
    const sw = qs('.pricing-switch');
    if (sw) {
      const toggle = sw.querySelector('.toggle');
      const lblM = sw.querySelector('[data-lbl-m]');
      const lblA = sw.querySelector('[data-lbl-a]');
      on(toggle, 'click', () => {
        const annual = toggle.classList.toggle('on');
        if (lblM) lblM.classList.toggle('on', !annual);
        if (lblA) lblA.classList.toggle('on', annual);
        qsa('.price').forEach(el => {
          const m = parseFloat(el.getAttribute('data-monthly'));
          const a = parseFloat(el.getAttribute('data-annual'));
          const strong = el.querySelector('strong');
          if (strong) strong.textContent = (annual ? a : m).toFixed(2);
          el.classList.toggle('annual', annual);
        });
        qsa('[data-per]').forEach(el => el.textContent = annual ? '/mo, billed yearly' : '/month');
        qsa('[data-save]').forEach(el => el.style.display = annual ? 'inline-flex' : 'none');
      });
    }
    qsa('[data-plan]').forEach(btn => on(btn, 'click', (e) => { e.preventDefault(); openCheckout(btn.getAttribute('data-plan')); }));
  }

  function openCheckout(planId) {
    const plan = ((window.PC && PC.plans) || []).find(p => p.id === planId);
    const modal = qs('#checkout');
    if (!modal) return;
    if (plan) {
      const name = modal.querySelector('[data-co-name]');
      const price = modal.querySelector('[data-co-price]');
      if (name) name.textContent = plan.name;
      if (price) price.textContent = '$' + plan.monthly.toFixed(2);
      modal.setAttribute('data-plan-id', plan.id);
    }
    modal.classList.add('open');
    document.body.classList.add('no-scroll');
    const field = modal.querySelector('input[type="email"]');
    if (field) setTimeout(() => field.focus(), 150);
  }

  /* ---------- "Today's Solution" + updates filter ---------- */
  function initUpdates() {
    const todayNum = qs('[data-today-num]');
    const todayTitle = qs('[data-today-title]');
    const todayBody = qs('[data-today-body]');
    const todayCat = qs('[data-today-cat]');
    const updates = (window.PC && PC.updates) || [];
    const dayIdx = (new Date().getDate()) % (updates.length || 1);
    if (updates.length) {
      const t = updates[dayIdx];
      if (todayNum) todayNum.textContent = String(dayIdx + 1).padStart(2, '0');
      if (todayTitle) todayTitle.textContent = t.title;
      if (todayBody) todayBody.textContent = t.body;
      if (todayCat) todayCat.textContent = t.cat;
    }

    const list = qs('[data-update-list]');
    const filters = qsa('.filter-btn');
    if (!list) return;
    function render(filter) {
      const items = updates.filter(u => !filter || u.cat === filter);
      list.innerHTML = '';
      items.forEach((u, i) => {
        const cls = i % 3 === 0 ? '' : (i % 3 === 1 ? 'teal' : 'gold');
        const el = document.createElement('article');
        el.className = 'update-item ' + cls;
        el.innerHTML = '<div class="badge">' + u.emoji + '</div><div><div class="tag">' + u.cat + '</div>' +
          '<h4>' + u.title + '</h4><p>' + u.body + '</p><div class="meta"><span>New today</span> · <span>PawCompanion</span></div></div>';
        list.appendChild(el);
      });
    }
    render('');
    filters.forEach(f => on(f, 'click', () => {
      filters.forEach(x => x.classList.remove('on'));
      f.classList.add('on');
      render(f.getAttribute('data-filter') || '');
    }));
  }

  /* ---------- Senior-care reminder builder ---------- */
  function initReminder() {
    const form = qs('#reminder-form');
    const out = qs('#reminder-output');
    if (!form || !out) return;
    const petName = qs('#pet-name');
    const petType = qs('#pet-type');
    const feedAm = qs('#feed-am');
    const feedPm = qs('#feed-pm');
    const medAm = qs('#med-am');
    const statusDot = qs('#alert-status');

    function currentSchedule() {
      try { return JSON.parse(localStorage.getItem('pc_schedule') || 'null'); } catch (e) { return null; }
    }
    function saveSchedule(s) { localStorage.setItem('pc_schedule', JSON.stringify(s)); }
    function hhmm(t) { if (!t) return ''; const [h, m] = t.split(':'); const hh = (+h) % 12 || 12; return hh + ':' + m + ' ' + (+h >= 12 ? 'PM' : 'AM'); }

    function build() {
      const name = (petName && petName.value) || 'Your pet';
      const type = (petType && petType.value) || 'dog';
      const schedule = { name, type, feedAm: feedAm.value, feedPm: feedPm.value, medAm: medAm.value };
      saveSchedule(schedule);
      render(schedule);
      toast('Schedule built', 'Your ' + type + ' care routine for ' + name + ' is ready. 🐾');
    }

    function render(s) {
      const rows = [];
      if (s.feedAm) rows.push([hhmm(s.feedAm), '🍽️', 'Morning feeding for ' + s.name]);
      if (s.feedPm) rows.push([hhmm(s.feedPm), '🍽️', 'Evening feeding for ' + s.name]);
      if (s.medAm) rows.push([hhmm(s.medAm), '💊', 'Medication for ' + s.name]);
      if (!rows.length) rows.push(['--:--', '🐾', 'Add feeding or medication times to fill your routine']);
      out.querySelector('[data-rem-pet]').textContent = s.name;
      out.querySelector('[data-rem-type]').textContent = s.type;
      out.querySelector('.schedule').innerHTML = rows.map(r =>
        '<div class="schedule-row"><span class="t">' + r[0] + '</span><span class="ic">' + r[1] + '</span><span class="d">' + r[2] + '</span></div>'
      ).join('');
    }

    const existing = currentSchedule();
    if (existing) { try { render(existing); } catch (e) {} }

    on(form, 'submit', (e) => { e.preventDefault(); build(); });

    // Notifications
    const enable = qs('#enable-alerts');
    if (enable) on(enable, 'click', async () => {
      if (!('Notification' in window)) { toast('Not available', 'This browser does not support notifications.'); return; }
      const perm = await Notification.requestPermission();
      if (perm === 'granted' && statusDot) { statusDot.textContent = 'Reminders ON — we will alert you at feeding time'; toast('Reminders on', 'Great! We will notify you at each scheduled time.'); }
      else if (statusDot) { statusDot.textContent = 'Reminders blocked — allow notifications in browser settings'; }
    });

    // Browser notification checker while page is open
    const sched = currentSchedule();
    if (sched && 'Notification' in window && Notification.permission === 'granted') {
      const times = [sched.feedAm, sched.feedPm, sched.medAm].filter(Boolean);
      const fired = {};
      setInterval(() => {
        const now = new Date();
        const cur = ('0' + now.getHours()).slice(-2) + ':' + ('0' + now.getMinutes()).slice(-2);
        times.forEach(t => {
          if (t === cur && !fired[t + new Date().toDateString()]) {
            fired[t + new Date().toDateString()] = true;
            try { new Notification('PawCompanion reminder', { body: 'Time to care for ' + sched.name + ' 🐾' }); } catch (e) {}
          }
        });
      }, 30000);
    }

    // Printable schedule
    const printBtn = qs('#print-schedule');
    if (printBtn) on(printBtn, 'click', () => {
      const s = currentSchedule() || { name: 'Your pet', type: 'dog' };
      const win = window.open('', '_blank', 'width=640,height=760');
      if (!win) return;
      win.document.write('<html><head><title>PawCompanion Care Schedule</title><style>' +
        'body{font-family:sans-serif;padding:30px;color:#2b2b3a}h1{color:#e85a3a}' +
        'table{border-collapse:collapse;width:100%;margin-top:18px}td{padding:10px;border-bottom:1px solid #eee}' +
        'footer{margin-top:28px;color:#888;font-size:13px}</style></head><body>' +
        '<h1>🐾 PawCompanion Care Schedule</h1>' +
        '<p>Pet: <b>' + s.name + '</b> &nbsp;·&nbsp; Type: <b>' + s.type + '</b></p>' +
        '<table>' + [
          ['Morning feeding', s.feedAm], ['Evening feeding', s.feedPm], ['Medication', s.medAm]
        ].map(r => '<tr><td>' + r[0] + '</td><td>' + (r[1] ? hhmm(r[1]) : '—') + '</td></tr>').join('') +
        '</table><footer>Generated by PawCompanion — little reminders, big love.</footer></body></html>');
      win.document.close();
    });
  }

  /* ---------- Forms (newsletter, contact, checkout) ---------- */
  function initForms() {
    // Newsletter capture
    qsa('form.email-capture').forEach((f) => on(f, 'submit', (e) => {
      e.preventDefault();
      const input = f.querySelector('input[type="email"]');
      const email = input && input.value.trim();
      if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { toast('Please check', 'Enter a valid email address.'); return; }
      try {
        const subs = JSON.parse(localStorage.getItem('pc_subs') || '[]');
        subs.push({ email, at: Date.now() });
        localStorage.setItem('pc_subs', JSON.stringify(subs));
      } catch (e) {}
      if (input) input.value = '';
      toast('You\'re in!', 'Join the pack — a free daily solution is on the way. 🐾', '🎉');
    }));

    // Contact form
    const contact = qs('#contact-form');
    if (contact) on(contact, 'submit', (e) => {
      e.preventDefault();
      toast('Message sent', 'Thanks! Our care team typically replies within 1–2 business days.', '📬');
      contact.reset();
    });

    // Checkout modal
    const modal = qs('#checkout');
    if (modal) {
      qsa('[data-close], .modal-backdrop', modal).forEach((el) => on(el, 'click', () => {
        modal.classList.remove('open'); document.body.classList.remove('no-scroll');
      }));
      const form = modal.querySelector('form');
      if (form) on(form, 'submit', (e) => {
        e.preventDefault();
        const email = form.querySelector('input[type="email"]');
        const planName = modal.querySelector('[data-co-name]');
        if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value.trim())) { toast('Please check', 'Enter a valid email.'); return; }
        modal.classList.remove('open'); document.body.classList.remove('no-scroll');
        toast('Welcome to ' + (planName ? planName.textContent : 'PawCompanion') + '!', 'Your subscription is set up. We sent details to your inbox.', '🎊');
      });
    }
  }

  /* ---------- 3D tilt + glare (enhancement; safe on touch / reduced motion) ---------- */
  function initTilt() {
    if (window.matchMedia && window.matchMedia('(pointer:coarse)').matches) return;
    const mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
    qsa('[data-tilt]').forEach((el) => {
      const max = parseFloat(el.getAttribute('data-tilt-max')) || 8;
      const useGlare = el.hasAttribute('data-glare') && !(mq && mq.matches);
      on(el, 'mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        el.style.setProperty('--ry', ((px - .5) * 2 * max) + 'deg');
        el.style.setProperty('--rx', ((.5 - py) * 2 * max) + 'deg');
        if (useGlare) { el.style.setProperty('--gx', (px * 100) + '%'); el.style.setProperty('--gy', (py * 100) + '%'); }
      });
      on(el, 'mouseleave', () => { el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); });
    });
  }

  /* ---------- Boot ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initReveal();
    initTilt();
    initBackTop();
    initFaq();
    initVideos();
    initPricing();
    initUpdates();
    initReminder();
    initForms();
  });
})();
