document.addEventListener('DOMContentLoaded', () => {
  const slidesContainer = document.querySelector('.slides');
  const navButtons = Array.from(document.querySelectorAll('.nav-btn'));
  const slideCount = slidesContainer.children.length;
  let currentIndex = 0;
  let intervalId;

  // 指定インデックスのスライドへ移動し、ドットを更新
  function updateSlide(index) {
      if (index < 0 || index >= slideCount) return;

      // スライドの移動位置を調整
      // 最初のスライドは -100%、次のスライドは -200% という風に動く
      slidesContainer.style.transform = `translateX(-${(index) * 100}%)`; 

      // ドットボタンの状態を更新
      navButtons.forEach((btn, i) => btn.classList.toggle('active', i === index));
      currentIndex = index;
  }

  // 自動スライド開始
  function startAutoSlide() {
      intervalId = setInterval(() => {
          updateSlide((currentIndex + 1) % slideCount);
      }, 5000);
  }

  // 自動スライドをリセット（手動操作後に再開）
  function resetAutoSlide() {
      clearInterval(intervalId);
      startAutoSlide();
  }

  // ドットボタンにクリックイベントを登録
  navButtons.forEach((btn, index) => {
      btn.addEventListener('click', () => {
          updateSlide(index);
          resetAutoSlide();
      });
  });

  // 初期表示・自動スライド開始
  updateSlide(0);  // 初期状態で1枚目のスライドが表示される
  startAutoSlide();
});
