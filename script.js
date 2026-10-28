'use strict';
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() { menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', 'Открыть меню'); navigation.classList.remove('open'); }
menuButton.addEventListener('click', () => { const open = menuButton.getAttribute('aria-expanded') !== 'true'; menuButton.setAttribute('aria-expanded', String(open)); menuButton.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню'); navigation.classList.toggle('open', open); });
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
if ('IntersectionObserver' in window) {
  document.documentElement.classList.add('js-motion');
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
}
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-filter]').forEach(item => { const active = item === button; item.classList.toggle('active', active); item.setAttribute('aria-pressed', String(active)); });
  document.querySelectorAll('.project').forEach(project => { project.hidden = button.dataset.filter !== 'all' && project.dataset.category !== button.dataset.filter; });
}));
const photo = path => `assets/images/${path}`;
const placeholder = new URL(photo('placeholder.svg'), document.baseURI).href;
// Capture also covers gallery images and thumbnails created after page load.
document.addEventListener('error', event => {
  const image = event.target;
  if (image instanceof HTMLImageElement && image.src !== placeholder) {
    image.src = placeholder;
  }
}, true);
const projects = [
  { title: 'Мягкая геометрия', label: 'Квартира / 112 м²', description: 'Демонстрационная концепция. Светлая палитра, открытая планировка и тактильные материалы.', photos: ['project-1/01.svg', 'project-1/02.svg', 'project-1/03.svg'] },
  { title: 'Ближе к природе', label: 'Загородный дом / 240 м²', description: 'Демонстрационная концепция. Пространство, наполненное воздухом, светом и природными фактурами.', photos: ['project-2/01.svg', 'project-2/02.svg', 'project-2/03.svg'] },
  { title: 'Городская пауза', label: 'Квартира / 86 м²', description: 'Демонстрационная концепция. Спокойный интерьер для отдыха от насыщенного городского ритма.', photos: ['project-3/01.svg', 'project-3/02.svg', 'project-3/03.svg'] },
  { title: 'Естественный ритм', label: 'Загородный дом / 185 м²', description: 'Демонстрационная концепция. Сдержанная геометрия, естественные оттенки и внимание к деталям.', photos: ['project-4/01.svg', 'project-4/02.svg', 'project-4/03.svg'] }
];
const gallery = document.querySelector('.gallery');
const galleryImage = document.querySelector('#gallery-image');
const thumbs = document.querySelector('.gallery-thumbs');
let currentProject = 0, currentPhoto = 0, trigger = null;
function showPhoto(index) {
  const project = projects[currentProject];
  currentPhoto = (index + project.photos.length) % project.photos.length;
  galleryImage.src = photo(project.photos[currentPhoto]);
  galleryImage.alt = `${project.title} — интерьер, фотография ${currentPhoto + 1}`;
  document.querySelector('#gallery-count').textContent = `0${currentPhoto + 1} / 0${project.photos.length}`;
  thumbs.querySelectorAll('button').forEach((button, i) => { button.classList.toggle('active', i === currentPhoto); button.setAttribute('aria-pressed', String(i === currentPhoto)); });
}
document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => {
  trigger = button; currentProject = Number(button.dataset.project);
  const project = projects[currentProject];
  document.querySelector('#gallery-title').textContent = project.title;
  document.querySelector('#gallery-label').textContent = project.label;
  document.querySelector('#gallery-description').textContent = project.description;
  thumbs.replaceChildren();
  project.photos.forEach((id, index) => { const thumb = document.createElement('button'); thumb.setAttribute('aria-label', `Показать фото ${index + 1}`); const img = document.createElement('img'); img.src = photo(id); img.alt = ''; thumb.append(img); thumb.addEventListener('click', () => showPhoto(index)); thumbs.append(thumb); });
  showPhoto(0); gallery.showModal(); document.body.style.overflow = 'hidden';
}));
document.querySelector('.gallery-close').addEventListener('click', () => gallery.close());
gallery.addEventListener('close', () => { document.body.style.overflow = ''; trigger?.focus(); });
document.querySelector('.gallery-prev').addEventListener('click', () => showPhoto(currentPhoto - 1));
document.querySelector('.gallery-next').addEventListener('click', () => showPhoto(currentPhoto + 1));
gallery.addEventListener('keydown', event => { if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); showPhoto(currentPhoto + (event.key === 'ArrowRight' ? 1 : -1)); } });
let touchStart = null;
galleryImage.addEventListener('touchstart', event => { touchStart = event.changedTouches[0].clientX; }, { passive: true });
galleryImage.addEventListener('touchend', event => { if (touchStart === null) return; const distance = event.changedTouches[0].clientX - touchStart; if (Math.abs(distance) > 50) showPhoto(currentPhoto + (distance < 0 ? 1 : -1)); touchStart = null; }, { passive: true });
