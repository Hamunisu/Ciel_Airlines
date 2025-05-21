document.addEventListener('DOMContentLoaded', () => {
    const burger = document.querySelector('.burger');
    const menu = document.querySelector('.menu');
    const overlay = document.querySelector('.overlay');
  
    burger.addEventListener('click', () => {
      menu.classList.toggle('open');
      burger.classList.toggle('open');
      overlay.classList.toggle('active');
    });
  
    overlay.addEventListener('click', () => {
      menu.classList.remove('open');
      burger.classList.remove('open');
      overlay.classList.remove('active');
    });
  });
  
// dark mode
// ロゴ変更
window.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("modeToggle");
  const logos = document.querySelectorAll('img[data-keyword]');

  const imageMap = {
    ciellogo1: {
      light: 'image/ciellogo.png',
      dark: 'image/ciellogo-dark.png',
    },
    ciellogo2: {
      light: '../../image/ciellogo.png',
      dark: '../../image/ciellogo-dark.png',
    },
  };

  const storedMode = localStorage.getItem("darkMode");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDarkMode = storedMode === "true" || (storedMode === null && prefersDark);

  function applyMode(dark) {
    document.body.classList.toggle("dark-mode", dark);
    if (toggle) toggle.checked = dark;

    logos.forEach(img => {
      const key = img.dataset.keyword;
      const paths = imageMap[key];
      if (paths) img.src = dark ? paths.dark : paths.light;
    });
  }

  applyMode(isDarkMode);

  if (toggle) {
    toggle.addEventListener("change", () => {
      const isDark = toggle.checked;
      localStorage.setItem("darkMode", isDark.toString());
      applyMode(isDark);
    });
  }
});

