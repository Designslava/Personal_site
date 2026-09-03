(function(){
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;

  var saved = null;
  try{ saved = localStorage.getItem('ds-theme'); }catch(e){}
  if (saved !== 'dark' && saved !== 'light'){
    saved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  setTheme(saved);
  function setTheme(t){
    root.setAttribute('data-theme', t);
    try{ localStorage.setItem('ds-theme', t); }catch(e){}
    const tg = document.getElementById('themeToggle');
    if (tg) tg.setAttribute('aria-checked', t === 'dark');
  }
  document.getElementById('themeToggle').addEventListener('click', () => {
    setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });

  const burger = document.getElementById('burger');
  const menu = document.getElementById('mobileMenu');
  burger.addEventListener('click', () => menu.classList.toggle('open'));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const sibs = Array.from(e.target.parentElement.children).filter(c => c.classList.contains('rv'));
      setTimeout(() => e.target.classList.add('in'), reduced ? 0 : Math.max(0, sibs.indexOf(e.target)) * 70);
      io.unobserve(e.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.rv').forEach(el => io.observe(el));

  /* --- аккордеон проектов: single + collapsible --- */
  const acc = document.getElementById('projAcc');
  if (acc){
    const items = Array.from(acc.querySelectorAll('.acc-item'));
    const panelOf = it => it.querySelector('.acc-panel');
    const setH = (it, open) => {
      const p = panelOf(it);
      p.style.height = open ? p.querySelector('.acc-inner').offsetHeight + 'px' : '0px';
    };
    items.forEach(it => setH(it, it.classList.contains('is-open')));
    items.forEach(it => {
      it.querySelector('.acc-trig').addEventListener('click', () => {
        const willOpen = !it.classList.contains('is-open');
        items.forEach(o => {
          const open = (o === it) && willOpen;
          o.classList.toggle('is-open', open);
          o.querySelector('.acc-trig').setAttribute('aria-expanded', open);
          setH(o, open);
        });
      });
    });
    window.addEventListener('resize', () => {
      items.forEach(it => setH(it, it.classList.contains('is-open')));
    });
  }
})();

/* --- журнал лаборатории: аккордеон записей --- */
(function(){
  const log = document.getElementById('labLog');
  if (!log) return;
  const items = Array.from(log.querySelectorAll('.entry-item'));
  const setH = (it, open) => {
    const p = it.querySelector('.e-panel');
    p.style.height = open ? p.firstElementChild.offsetHeight + 'px' : '0px';
  };
  items.forEach(it => setH(it, false));
  items.forEach(it => {
    it.querySelector('.entry').addEventListener('click', () => {
      const willOpen = !it.classList.contains('is-open');
      items.forEach(o => {
        const open = (o === it) && willOpen;
        o.classList.toggle('is-open', open);
        o.querySelector('.entry').setAttribute('aria-expanded', open);
        setH(o, open);
      });
    });
  });
  window.addEventListener('resize', () => {
    items.forEach(it => setH(it, it.classList.contains('is-open')));
  });
})();
