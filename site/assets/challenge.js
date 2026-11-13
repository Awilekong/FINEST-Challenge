(() => {
  'use strict';
  const tabs = [...document.querySelectorAll('[data-round]')];
  if (!tabs.length) return;
  const rounds = JSON.parse(document.querySelector('#round-data').textContent);
  function activate(button, focus = false) {
    const round = rounds[button.dataset.round];
    tabs.forEach(tab => {
      const active = tab === button;
      tab.setAttribute('aria-selected',String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    document.querySelector('#round-panel').setAttribute('aria-labelledby',button.id);
    document.querySelector('#round-title').textContent = round.title;
    document.querySelector('#round-date').textContent = round.date;
    document.querySelector('#empty-title').textContent = round.emptyTitle;
    document.querySelector('#empty-description').textContent = round.description;
    document.querySelector('#board-header').hidden = button.dataset.round === 'extreme';
    if (focus) button.focus();
  }
  tabs.forEach((button,index) => {
    button.addEventListener('click', () => activate(button));
    button.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index+1)%tabs.length;
      if (event.key === 'ArrowLeft') next = (index-1+tabs.length)%tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length-1;
      if (next !== undefined) { event.preventDefault(); activate(tabs[next],true); }
    });
  });
})();
