/* Keeps in-page navigation on the populated home sections. */
const contrastStyle = document.createElement('style');
contrastStyle.textContent = '.navlinks a.btn{color:#fff!important;text-shadow:0 1px 1px #1e40af}.navlinks a.btn.secondary,.navlinks a.btn.ghost{color:var(--ink)!important;text-shadow:none}';
document.head.appendChild(contrastStyle);
function handleLandingAnchor() {
  const section = location.hash === '#/#features' ? 'features' : location.hash === '#/#how' ? 'how' : null;
  if (!section) return;
  app.innerHTML = home();
  requestAnimationFrame(() => document.getElementById(section)?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
}
window.addEventListener('hashchange', handleLandingAnchor);
handleLandingAnchor();
