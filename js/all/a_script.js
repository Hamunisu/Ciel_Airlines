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
  