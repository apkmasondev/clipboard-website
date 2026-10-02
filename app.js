document.documentElement.classList.add('js');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  navigation.removeAttribute('data-open');
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  navigation.toggleAttribute('data-open', open);
});
navigation.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuButton.focus();
  }
});
document.addEventListener('click', (event) => {
  if (!event.target.closest('.site-header')) closeMenu();
});

const screens = {
  'history-dark': {
    alt: 'Historia schowka w ciemnym motywie: lista wpisów i podgląd JSON',
    caption: 'Historia schowka · ciemny motyw · przykładowe dane',
  },
  'snippets-dark': {
    alt: 'Biblioteka snippetów w ciemnym motywie: zapisany prompt do przeglądu kodu',
    caption: 'Biblioteka snippetów · ciemny motyw · przykładowe dane',
  },
  'history-light': {
    alt: 'Historia schowka w jasnym motywie: wyszukiwanie, lista i szczegóły wpisu',
    caption: 'Historia schowka · jasny motyw · przykładowe dane',
  },
};
const galleryImage = document.querySelector('#gallery-image');
const galleryCaption = document.querySelector('#gallery-caption');
for (const button of document.querySelectorAll('[data-screen]')) {
  button.addEventListener('click', () => {
    const key = button.dataset.screen;
    const screen = screens[key];
    if (!screen) return;
    for (const other of document.querySelectorAll('[data-screen]')) {
      other.setAttribute('aria-pressed', String(other === button));
    }
    galleryImage.src = `assets/${key}.jpg`;
    galleryImage.alt = screen.alt;
    galleryImage.parentElement.href = galleryImage.src;
    galleryCaption.textContent = screen.caption;
  });
}

const lightbox = document.querySelector('.lightbox');
const lightboxImage = lightbox.querySelector('img');
let previousFocus;
for (const link of document.querySelectorAll('[data-lightbox]')) {
  link.addEventListener('click', (event) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    if (typeof lightbox.showModal !== 'function') return;
    event.preventDefault();
    previousFocus = link;
    lightboxImage.src = link.href;
    lightboxImage.alt = link.querySelector('img').alt;
    document.querySelector('#lightbox-caption').textContent = lightboxImage.alt;
    lightbox.showModal();
    document.body.classList.add('modal-open');
  });
}
lightbox.querySelector('button').addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', (event) => {
  if (event.target !== lightbox) return;
  const bounds = lightbox.getBoundingClientRect();
  if (
    event.clientX < bounds.left ||
    event.clientX > bounds.right ||
    event.clientY < bounds.top ||
    event.clientY > bounds.bottom
  )
    lightbox.close();
});
lightbox.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  previousFocus?.focus();
});
