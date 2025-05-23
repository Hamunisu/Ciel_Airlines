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
(() => {
  // ベースパス判定
  function getBasePath() {
    const path = location.pathname;
    // ルートが / または /index.html のとき image/
    if (path === "/" || path === "/index.html") {
      return "image/";
    }
    // それ以外は ../../image/
    return "../../image/";
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

  // simbriefリンクと画像パス設定
  const simbriefHref = "https://dispatch.simbrief.com/briefing/latest";
  function getSimbriefImages() {
    const base = getBasePath();
    return {
      light: base + "simbrief.png",
      dark: base + "simbrief-dark.png"
    };
  }

  // ログブックリンクと画像パス
  const logbookHref = "https://docs.google.com/spreadsheets/d/1XCRbloUrsoi-QF936vX9XomI4-PYUnRdxw0KImmjXLI/edit?gid=479897119#gid=479897119";
  function getLogbookImage() {
    return getBasePath() + "google.png";
  }

  // リンク要素取得関数
  function getLink(href) {
    return document.querySelector(`a[href="${href}"]`);
  }

  // 画像表示関数
  function setIcon(link, src, alt = "") {
    const img = link.querySelector("img");
    if (img) {
      // srcが違ったら切り替え
      if (!img.src.includes(src)) {
        img.src = src;
      }
    } else {
      link.textContent = "";
      const e = document.createElement("img");
      e.src = src;
      e.alt = alt;
      e.style.height = "24px";
      link.appendChild(e);
    }
  }

  // テキスト表示関数
  function setText(link, text) {
    if (link.querySelector("img")) {
      link.textContent = text;
    }
  }

  // simbriefリンクの更新処理
  function updateSimbrief() {
    const link = getLink(simbriefHref);
    if (!link) return;
    if (isMobile()) {
      const imgs = getSimbriefImages();
      const src = isDarkMode() ? imgs.dark : imgs.light;
      setIcon(link, src, "Simbrief");
    } else {
      setText(link, "simbrief");
    }
  }

  // ログブックリンクの更新処理
  function updateLogbook() {
    const link = getLink(logbookHref);
    if (!link) return;
    if (isMobile()) {
      setIcon(link, getLogbookImage(), "ログブック");
    } else {
      setText(link, "ログブック");
    }
  }

  // すべて更新
  function updateAll() {
    updateSimbrief();
    updateLogbook();
  }

  window.addEventListener("DOMContentLoaded", updateAll);
  window.addEventListener("resize", updateAll);

  // ダークモード切替トグルの監視
  const toggle = document.getElementById("modeToggle");
  if (toggle) {
    toggle.addEventListener("change", () => {
      localStorage.setItem("darkMode", toggle.checked);
      updateAll();
    });
  }
})();
