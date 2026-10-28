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
const photo = id => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1800&q=85`;
const projects = [
  { title: 'Мягкая геометрия', label: 'Квартира / 112 м²', description: 'Демонстрационная концепция. Светлая палитра, открытая планировка и тактильные материалы.', photos: ['photo-1600607687920-4e2a09cf159d','photo-1600607687939-ce8a6c25118c','photo-1600566753086-00f18fb6b3ea'] },
  { title: 'Ближе к природе', label: 'Загородный дом / 240 м²', description: 'Демонстрационная концепция. Пространство, наполненное воздухом, светом и природными фактурами.', photos: ['photo-1600210491892-03d54c0aaf87','photo-1600210492486-724fe5c67fb0','photo-1616486338812-3dadae4b4ace'] },
  { title: 'Городская пауза', label: 'Квартира / 86 м²', description: 'Демонстрационная концепция. Спокойный интерьер для отдыха от насыщенного городского ритма.', photos: ['photo-1600607687939-ce8a6c25118c','photo-1600607687920-4e2a09cf159d','photo-1616486338812-3dadae4b4ace'] },
  { title: 'Естественный ритм', label: 'Загородный дом / 185 м²', description: 'Демонстрационная концепция. Сдержанная геометрия, естественные оттенки и внимание к деталям.', photos: ['photo-1600566753086-00f18fb6b3ea','photo-1600210491892-03d54c0aaf87','photo-1600210492486-724fe5c67fb0'] }
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
  project.photos.forEach((id, index) => { const thumb = document.createElement('button'); thumb.setAttribute('aria-label', `Показать фото ${index + 1}`); const img = document.createElement('img'); img.src = `https://images.unsplash.com/${id}?auto=format&fit=crop&w=160&q=60`; img.alt = ''; thumb.append(img); thumb.addEventListener('click', () => showPhoto(index)); thumbs.append(thumb); });
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
