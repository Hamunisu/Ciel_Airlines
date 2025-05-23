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
  if (location.pathname.includes("/legal/")) {
    return;
  }

  const toggle = document.getElementById("modeToggle");
  const logos = document.querySelectorAll('img[data-keyword]');

  const imageMap = {
    ciellogo1: {
      light: 'image/ciellogo.png',
      dark: 'image/ciellogo-dark.png',
      mobile: 'image/fluer.png',
    },
    ciellogo2: {
      light: '../../image/ciellogo.png',
      dark: '../../image/ciellogo-dark.png',
      mobile: '../../image/fluer.png',
    },
  };

  const storedMode = localStorage.getItem("darkMode");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  let isDarkMode = storedMode === "true" || (storedMode === null && prefersDark);

  // isMobile を動的に取得する関数
  function isMobile() {
    return window.matchMedia("(max-width: 767px)").matches;
  }

  function applyMode(dark) {
    document.body.classList.toggle("dark-mode", dark);
    if (toggle) toggle.checked = dark;

    logos.forEach(img => {
      const key = img.dataset.keyword;
      const paths = imageMap[key];
      if (!paths) return;

      if (isMobile()) {
        img.src = paths.mobile || (dark ? paths.dark : paths.light);
      } else {
        img.src = dark ? paths.dark : paths.light;
      }
    });
  }

  applyMode(isDarkMode);

  if (toggle) {
    toggle.addEventListener("change", () => {
      isDarkMode = toggle.checked;
      localStorage.setItem("darkMode", isDarkMode.toString());
      applyMode(isDarkMode);
    });
  }

  // ウィンドウサイズ変更時に画像切り替えを再適用
  window.addEventListener('resize', () => {
    applyMode(isDarkMode);
  });
});