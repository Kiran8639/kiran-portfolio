'use strict';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('nav');

if (menu && nav) {
  menu.addEventListener('click', () => {
    const opened = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(opened));
    menu.setAttribute('aria-label', opened ? 'Close navigation' : 'Open navigation');
    menu.textContent = opened ? 'Close ×' : 'Menu ☰';
    nav.classList.toggle('open', opened);
  });

  function closeMenu() {
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Open navigation');
    menu.textContent = 'Menu ☰';
    nav.classList.remove('open');
  }

  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });
}

const role = document.getElementById('role-text');
const roles = ['Python Full Stack Developer', 'Django Web Developer', 'Web Application Developer'];

if (role && !reduceMotion) {
  let item = 0, chars = roles[0].length, deleting = true;
  function type() {
    const word = roles[item];
    chars += deleting ? -1 : 1;
    role.textContent = word.slice(0, chars);
    let delay = deleting ? 35 : 75;
    if (chars === 0) {
      deleting = false;
      item = (item + 1) % roles.length;
      delay = 300;
    } else if (!deleting && chars === word.length) {
      deleting = true;
      delay = 2500;
    }
    window.setTimeout(type, delay);
  }
  window.setTimeout(type, 2800);
}

const progress = document.querySelector('.scroll-progress');
const links = nav ? Array.from(nav.querySelectorAll('a')) : [];
const sections = links.map(a => document.querySelector(a.getAttribute('href')));
let scheduled = false;

function updateScroll() {
  if (progress) {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (total > 0 ? window.scrollY / total * 100 : 0) + '%';
  }
  let current = 0, closest = -Infinity;
  sections.forEach((s, i) => {
    const top = s ? s.getBoundingClientRect().top : Infinity;
    if (top <= 170 && top > closest) {
      current = i;
      closest = top;
    }
  });
  links.forEach((a, i) => {
    a.classList.toggle('active', i === current);
    if (i === current) a.setAttribute('aria-current', 'location');
    else a.removeAttribute('aria-current');
  });
  scheduled = false;
}

window.addEventListener('scroll', () => {
  if (!scheduled) {
    scheduled = true;
    requestAnimationFrame(updateScroll);
  }
}, {passive: true});
window.addEventListener('resize', updateScroll);
updateScroll();

if (!reduceMotion && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  }), {threshold: 0.08});

  document.querySelectorAll('.project,.tool-row,.timeline article,.cert-grid>div,.section-head').forEach(el => {
    el.classList.add('reveal', 'ready');
    observer.observe(el);
  });
}

const copyButton = document.querySelector('.copy-phone');
if (copyButton) {
  copyButton.addEventListener('click', async () => {
    const status = document.querySelector('.copy-status');
    const phone = '+918639140079';
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(phone);
      } else {
        const input = document.createElement('textarea');
        input.value = phone;
        input.style.position = 'fixed';
        input.style.opacity = '0';
        document.body.appendChild(input);
        input.select();
        const copied = document.execCommand('copy');
        input.remove();
        if (!copied) throw new Error('Copy unavailable');
      }
      if (status) status.textContent = 'Number copied!';
    } catch {
      if (status) status.textContent = 'Select and copy: +91 86391 40079';
    }
  });
}
