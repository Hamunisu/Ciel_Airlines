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


// simbrief
// simbrief画像パスをページの場所によって切り替える
(function() {
  const simbriefHref = "https://dispatch.simbrief.com/briefing/latest";

  // ベースパス判定
  function getBasePath() {
    return location.pathname.endsWith("index.html") || location.pathname === "/"
      ? "image/"
      : "../../image/";
  }
  // ダークモード判定
  function isDarkMode() {
    const stored = localStorage.getItem("darkMode");
    const prefers = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return stored === "true" || (stored === null && prefers);
  }
  // モバイル判定
  function isMobile() {
    return window.innerWidth <= 767;
  }

  // simbrief用画像マップ
  function getSimbriefMap() {
    const base = getBasePath();
    return {
      mobileLight: base + "simbrief.png",
      mobileDark:  base + "simbrief-dark.png"
    };
  }

  // 要素取得
  function getLink() {
    return document.querySelector(`a[href="${simbriefHref}"]`);
  }

  // アイコン化
  function toIcon(link) {
    const map = getSimbriefMap();
    const src = isDarkMode() ? map.mobileDark : map.mobileLight;
    const img = link.querySelector("img");
    if (img) {
      if (!img.src.includes(src)) img.src = src;
    } else {
      link.textContent = "";
      const e = document.createElement("img");
      e.src = src;
      e.alt = "Simbrief";
      e.style.height = "24px";
      link.appendChild(e);
    }
  }

  // テキスト化
  function toText(link) {
    if (link.querySelector("img")) {
      link.textContent = "simbrief";
    }
  }

  // 更新処理
  function update() {
    const link = getLink();
    if (!link) return;
    if (isMobile()) toIcon(link);
    else           toText(link);
  }

  window.addEventListener("DOMContentLoaded", update);
  window.addEventListener("resize",        update);

  // ダークモード切替があれば
  const toggle = document.getElementById("modeToggle");
  if (toggle) toggle.addEventListener("change", () => {
    localStorage.setItem("darkMode", toggle.checked);
    update();
  });
})();


window.addEventListener("DOMContentLoaded", () => {
  const link = document.querySelector(
    'a[href="https://docs.google.com/spreadsheets/d/1XCRbloUrsoi-QF936vX9XomI4-PYUnRdxw0KImmjXLI/edit?gid=479897119#gid=479897119"]'
  );
  if (!link) return;

  // ベースパス判定
  const basePath =
    location.pathname === "/" || location.pathname.endsWith("index.html")
      ? "image/"
      : "../../image/";

  function isMobile() {
    return window.matchMedia("(max-width: 767px)").matches;
  }

  function update() {
    if (isMobile()) {
      if (!link.querySelector("img")) {
        link.textContent = "";
        const img = document.createElement("img");
        img.src = basePath + "google.png";
        img.alt = "ログブック";
        img.style.height = "24px";
        link.appendChild(img);
      }
    } else {
      if (link.querySelector("img")) {
        link.textContent = "ログブック";
      }
    }
  }

  update();
  window.addEventListener("resize", update);
});
