document.addEventListener('DOMContentLoaded', () => {
  // 国内・国際タブ切り替え
  const domesticBtn = document.getElementById('domesticBtn');
  const internationalBtn = document.getElementById('internationalBtn');
  const domesticContent = document.getElementById('domesticContent');
  const internationalContent = document.getElementById('internationalContent');

  domesticBtn.addEventListener('click', () => {
    domesticBtn.classList.add('active');
    internationalBtn.classList.remove('active');
    domesticContent.classList.remove('hidden');
    internationalContent.classList.add('hidden');
  });

  internationalBtn.addEventListener('click', () => {
    internationalBtn.classList.add('active');
    domesticBtn.classList.remove('active');
    internationalContent.classList.remove('hidden');
    domesticContent.classList.add('hidden');
  });

  // 国内・国際スワップボタン
  const domesticSwapButton = document.getElementById('domesticSwapButton');
  const departureInput = document.getElementById('departure');
  const arrivalInput = document.getElementById('arrival');

  domesticSwapButton.addEventListener('click', () => {
    const temp = departureInput.value;
    departureInput.value = arrivalInput.value;
    arrivalInput.value = temp;
  });

  const internationalSwapButton = document.getElementById('internationalSwapButton');
  const iDepartureInput = document.getElementById('i_departure');
  const iArrivalInput = document.getElementById('i_arrival');

  internationalSwapButton.addEventListener('click', () => {
    const tempInternational = iDepartureInput.value;
    iDepartureInput.value = iArrivalInput.value;
    iArrivalInput.value = tempInternational;
  });

  // MSFS・X-Planeタブ切り替え
  const msfsBtn = document.getElementById('msfsBtn');
  const xplaneBtn = document.getElementById('xplaneBtn');
  const msfsContent = document.getElementById('msfsContent');
  const xplaneContent = document.getElementById('xplaneContent');

  msfsBtn.addEventListener('click', () => {
    msfsBtn.classList.add('active');
    xplaneBtn.classList.remove('active');
    msfsContent.classList.remove('hidden');
    xplaneContent.classList.add('hidden');
  });

  xplaneBtn.addEventListener('click', () => {
    xplaneBtn.classList.add('active');
    msfsBtn.classList.remove('active');
    xplaneContent.classList.remove('hidden');
    msfsContent.classList.add('hidden');
  });
});

// エンターキー無効化（スワップボタン）
document.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && (document.activeElement.id === 'domesticSwapButton' || document.activeElement.id === 'internationalSwapButton')) {
    event.preventDefault();
  }
});
