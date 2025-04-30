document.addEventListener("DOMContentLoaded", () => {

  const fetchJSON = async (file) => {
    try {
      const response = await fetch(file);
      if (!response.ok) {
        throw new Error('JSONファイルの読み込みに失敗しました');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching JSON:', error);
      return null;
    }
  };

  const normalizeString = (str) => str.trim().normalize('NFKC').toUpperCase();

  const getIcaoFromInput = (input, airports) => {
    const norm = normalizeString(input);
    const airport = airports.find(a =>
      normalizeString(a.icao) === norm ||
      normalizeString(a.name) === norm ||
      (Array.isArray(a.name) && a.name.some(n => normalizeString(n) === norm))
    );
    return airport ? airport.icao : null;
  };

  const isIcaoValid = (departure, arrival, airports) => {
    const depValid = airports.some(a => normalizeString(a.icao) === normalizeString(departure));
    const arrValid = airports.some(a => normalizeString(a.icao) === normalizeString(arrival));
    return depValid && arrValid;
  };

  const searchFlight = (depCode, arrCode, routeData) => {
    const key = `${depCode} ${arrCode}`;
    return routeData[key] ? routeData[key].flightNumber : null;
  };

  // 検索ボタン処理
  document.getElementById("i_search").addEventListener("click", async () => {
    const depInput = document.getElementById("i_departure").value;
    const arrInput = document.getElementById("i_arrival").value;
    const resultDiv = document.getElementById("i_result");
    const aircraftType = document.getElementById("i_aircraft").value;

    const airportsJSON = await fetchJSON('i_fs/airports.json');
    const routeData = await fetchJSON('i_fs/route.json');

    if (!airportsJSON || !routeData) {
      resultDiv.innerText = "JSONファイルの読み込みに失敗しました";
      return;
    }

    const airports = airportsJSON.airports;
    const depCode = getIcaoFromInput(depInput, airports);
    const arrCode = getIcaoFromInput(arrInput, airports);

    if ((depInput.includes("RJ") || depInput.includes("RO")) && (arrInput.includes("RJ") || arrInput.includes("RO"))) {
      resultDiv.innerHTML = "<p class='english'>国内線でお調べください</p>";
      return;
    }

    if (!depCode || !arrCode) {
      resultDiv.innerText = "入力された空港が見つかりません";
      return;
    }

    if (!isIcaoValid(depCode, arrCode, airports)) {
      resultDiv.innerText = "入力された空港コードに誤りがあります";
      return;
    }

    const flightNumber = searchFlight(depCode, arrCode, routeData);
    const airline = "CJA";
    const simbriefURL = `https://dispatch.simbrief.com/options/custom?airline=${airline}&fltnum=${flightNumber}&orig=${depCode}&dest=${arrCode}&type=${aircraftType}`;

    if (flightNumber) {
      resultDiv.innerHTML = `<a href="${simbriefURL}" target="_blank" class="simbrief-link english japanese">${airline}${flightNumber}便のフライト</a>`;
    } else {
      resultDiv.innerHTML = `<a href="${simbriefURL}" target="_blank" class="simbrief-link english japanese">臨時便のフライト</a>`;
    }
  });

  // 機体選択イベント
  document.getElementById("i_aircraft").addEventListener("change", () => {
    document.getElementById("i_search").click();
  });

  // 入力フィールド：大文字化＆Enterキー
  ["i_departure", "i_arrival"].forEach(id => {
    const input = document.getElementById(id);

    input.addEventListener("input", e => {
      const currentValue = e.target.value;
      if (currentValue !== currentValue.toUpperCase()) {
        const start = e.target.selectionStart;
        const end = e.target.selectionEnd;
        e.target.value = currentValue.toUpperCase();
        e.target.setSelectionRange(start, end);
      }
    });

    input.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        document.getElementById("i_search").click();
      }
    });
  });

});
