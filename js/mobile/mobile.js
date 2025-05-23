function switchHomeIcon() {
  // 全てのaタグの中からhrefに'index.html'を含むものを取得
  const allLinks = document.querySelectorAll('a[href]');
  const homeLinks = Array.from(allLinks).filter(link => link.getAttribute('href').includes('index.html'));
  const targetIndex = 1; // 置き換えたいリンクのインデックス（ここは0が良いかと思います）
  if (homeLinks.length <= targetIndex) return;

  const targetLink = homeLinks[targetIndex];
  const originalText = 'home'; // 元のテキスト

  if (window.innerWidth <= 767) {
    // スマホ時：テキストをアイコンに置き換え
    if (!targetLink.querySelector('.dli-home')) {
      targetLink.innerHTML = '';
      const iconDiv = document.createElement('div');
      iconDiv.className = 'dli-home';
      targetLink.appendChild(iconDiv);
    }
  } else {
    // PC時：元のテキストに戻す
    if (!targetLink.textContent.includes(originalText)) {
      targetLink.textContent = originalText;
    }
  }
}

window.addEventListener('DOMContentLoaded', switchHomeIcon);
window.addEventListener('resize', switchHomeIcon);


(() => {
  // ベースパス判定：URLに /html/ が含まれる場合はサブディレクトリ、
  // それ以外（ルート直下）は image/ を返す
  function getBasePath() {
    return location.pathname.includes("/html/")
      ? "../../image/"
      : "image/";
  }

  // モバイル判定
  function isMobile() {
    return window.matchMedia("(max-width: 767px)").matches;
  }

  // ダークモード判定
  function isDarkMode() {
    const stored = localStorage.getItem("darkMode");
    const prefers = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return stored === "true" || (stored === null && prefers);
  }

  // 各リンクの href
  const LINKS = {
    simbrief: "https://dispatch.simbrief.com/briefing/latest",
    logbook:  "https://docs.google.com/spreadsheets/d/1XCRbloUrsoi-QF936vX9XomI4-PYUnRdxw0KImmjXLI/edit?gid=479897119#gid=479897119"
  };

  // 画像パス getter
  function getSimbriefSrc() {
    const base = getBasePath();
    return isDarkMode()
      ? base + "simbrief-dark.png"
      : base + "simbrief.png";
  }
  function getLogbookSrc() {
    return getBasePath() + "google.png";
  }

  // 画像化／テキスト化共通処理
  function setIcon(link, src, alt) {
    const img = link.querySelector("img");
    if (img) {
      if (!img.src.includes(src)) img.src = src;
    } else {
      link.textContent = "";
      const e = document.createElement("img");
      e.src = src;
      e.alt = alt;
      e.style.height = "24px";
      link.appendChild(e);
    }
  }
  function setText(link, text) {
    if (link.querySelector("img")) {
      link.textContent = text;
    }
  }

  // 更新処理
  function updateLink(href, getSrc, text, alt) {
    const link = document.querySelector(`a[href="${href}"]`);
    if (!link) return;
    if (isMobile()) {
      setIcon(link, getSrc(), alt);
    } else {
      setText(link, text);
    }
  }

  // 全体更新
  function updateAll() {
    updateLink(LINKS.simbrief, getSimbriefSrc, "simbrief", "Simbrief");
    updateLink(LINKS.logbook,  getLogbookSrc,  "ログブック", "ログブック");
  }

  window.addEventListener("DOMContentLoaded", updateAll);
  window.addEventListener("resize",        updateAll);

  // ダークモードトグル反映
  const toggle = document.getElementById("modeToggle");
  if (toggle) {
    toggle.addEventListener("change", () => {
      localStorage.setItem("darkMode", toggle.checked);
      updateAll();
    });
  }
})();