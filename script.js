const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('#site-nav');

if (navToggle && nav) {
  const syncForViewport = () => {
    if (window.matchMedia('(min-width: 761px)').matches) {
      nav.hidden = false;
      navToggle.setAttribute('aria-expanded', 'false');
    } else if (navToggle.getAttribute('aria-expanded') !== 'true') {
      nav.hidden = true;
    }
  };

  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    nav.hidden = expanded;
  });

  nav.addEventListener('click', (event) => {
    if (event.target instanceof HTMLAnchorElement && window.matchMedia('(max-width: 760px)').matches) {
      navToggle.setAttribute('aria-expanded', 'false');
      nav.hidden = true;
    }
  });

  window.addEventListener('resize', syncForViewport);
  syncForViewport();
}
