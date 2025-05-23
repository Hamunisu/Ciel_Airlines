// ローディング
window.addEventListener('load', () => {
  const overlay = document.getElementById('loading-overlay');
  const minDisplayTime = 1000;
  const startTime = performance.timing.navigationStart;
  const now = Date.now();
  const elapsed = now - startTime;

  const fadeOutOverlay = () => {
    overlay.classList.add('hidden');
    overlay.addEventListener('transitionend', () => {
      overlay.style.display = 'none';
    }, { once: true });
  };

  if (elapsed >= minDisplayTime) {
    fadeOutOverlay();
  } else {
    setTimeout(fadeOutOverlay, minDisplayTime - elapsed);
  }
});