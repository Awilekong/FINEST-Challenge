(() => {
  'use strict';
  const toast = document.querySelector('#status-message');
  let toastTimer;
  document.querySelectorAll('[data-soon]').forEach(button => {
    button.addEventListener('click', () => {
      clearTimeout(toastTimer);
      toast.textContent = button.dataset.message || `The ${button.dataset.soon.toLowerCase()} link will be added here when available.`;
      toast.classList.add('visible');
      toastTimer = setTimeout(() => toast.classList.remove('visible'), 4500);
    });
  });
  const menu = document.querySelector('.mobile-menu');
  if (menu) {
    const links = document.getElementById(menu.getAttribute('aria-controls'));
    menu.addEventListener('click', () => {
      const open = menu.getAttribute('aria-expanded') !== 'true';
      menu.setAttribute('aria-expanded', String(open));
      links.classList.toggle('open', open);
    });
    links.addEventListener('click', event => {
      if (event.target.closest('a')) {
        links.classList.remove('open');
        menu.setAttribute('aria-expanded','false');
      }
    });
  }
  const modal = document.querySelector('#figure-dialog');
  if (modal) {
    const figure = modal.querySelector('img');
    const title = modal.querySelector('#figure-title');
    const viewport = modal.querySelector('.modal-scroll');
    const zoom = modal.querySelector('[data-zoom]');
    let origin;
    const open = trigger => {
      origin = trigger;
      figure.src = trigger.dataset.figure;
      figure.alt = trigger.dataset.caption || 'Full research figure';
      title.textContent = trigger.dataset.caption || 'Research figure';
      viewport.classList.remove('zoom');
      zoom.textContent = 'Zoom in';
      figure.onload = () => viewport.style.setProperty('--image-width', `${figure.naturalWidth}px`);
      modal.showModal();
      document.body.style.overflow = 'hidden';
    };
    document.querySelectorAll('[data-figure]').forEach(trigger => trigger.addEventListener('click', () => open(trigger)));
    modal.querySelector('[data-close]').addEventListener('click', () => modal.close());
    modal.addEventListener('click', event => { if (event.target === modal) modal.close(); });
    modal.addEventListener('close', () => {
      document.body.style.overflow = '';
      origin?.focus({preventScroll:true});
    });
    zoom.addEventListener('click', () => {
      const large = viewport.classList.toggle('zoom');
      zoom.textContent = large ? 'Fit to screen' : 'Zoom in';
    });
  }
  const videos = [...document.querySelectorAll('video')];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = matchMedia('(min-width: 768px)');
  videos.forEach(video => {
    video.addEventListener('play', () => {
      videos.forEach(other => { if (other !== video && !other.paused) other.pause(); });
      const toggle = video.parentElement.querySelector('.video-toggle');
      if (toggle) toggle.textContent = 'Pause';
    });
    video.addEventListener('pause', () => {
      const toggle = video.parentElement.querySelector('.video-toggle');
      if (toggle) toggle.textContent = 'Play';
    });
    const toggle = video.parentElement.querySelector('.video-toggle');
    if (toggle) toggle.addEventListener('click', () => {
      if (video.paused) {
        video.dataset.userPaused = 'false';
        video.play().catch(() => {});
      } else {
        video.dataset.userPaused = 'true';
        video.pause();
      }
    });
  });
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    const video = entry.target;
    if (!entry.isIntersecting) { video.pause(); return; }
    if (video.hasAttribute('data-auto') && desktop.matches && !reduceMotion.matches && video.dataset.userPaused !== 'true' && !document.hidden) {
      video.play().catch(() => {});
    }
  }), {threshold:.25});
  videos.forEach(video => observer.observe(video));
  document.addEventListener('visibilitychange', () => { if (document.hidden) videos.forEach(video => video.pause()); });
  reduceMotion.addEventListener('change', () => { if (reduceMotion.matches) videos.forEach(video => video.pause()); });
})();
