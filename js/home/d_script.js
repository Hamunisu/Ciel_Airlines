// 大文字変換専用関数
function setupUppercaseInput(input) {
  input.addEventListener('beforeinput', (e) => {
    if (e.isComposing) return; // 日本語変換中は無視
    const inputType = e.inputType;
    if (inputType === 'insertText' || inputType === 'insertReplacementText') {
      const start = input.selectionStart;
      const end = input.selectionEnd;
      input.value = input.value.toUpperCase();
      setTimeout(() => input.setSelectionRange(start, end), 0);
    }
  });
}

// DOMコンテンツロード後にイベント登録
document.addEventListener('DOMContentLoaded', () => {
  const departureInput = document.getElementById('departure');
  const arrivalInput = document.getElementById('arrival');
  const searchButton = document.getElementById('search');
  const aircraftSelect = document.getElementById('aircraft'); // 追加：機種セレクター

  [departureInput, arrivalInput].forEach(input => {
    if (input) {
      setupUppercaseInput(input);
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          if (searchButton) searchButton.click();
        }
      });
    }
  });

  if (searchButton) {
    searchButton.addEventListener('click', searchFlights);
  }

  // 機種セレクターの変更時に検索を実行
  if (aircraftSelect) {
    aircraftSelect.addEventListener('change', async () => {
      await searchFlights();  // 機種セレクター変更時に検索実行
    });
  }
});

// 空港コードのチェック関数
async function checkAirports(departure, arrival) {
  if (!departure || !arrival) {
    return false;  // 空港が指定されていない場合は無効
  }

  return true;  // 空港コードが有効な場合
}

// フライト情報取得関数
async function fetchFlights(departureAirport) {
  let filePath;
  departureAirport = departureAirport.trim().toLowerCase();

  const airportMappings = [
    { keys: ['rjcw', 'wkj', '稚内'], path: 'd_fs/hk/d_rjcw.json' },
    { keys: ['rjer', 'ris', '利尻'], path: 'd_fs/hk/d_rjer.json' },
    { keys: ['rjcr', 'rbj', '礼文'], path: 'd_fs/hk/d_rjcr.json' },
    { keys: ['rjcm', 'mmb', '女満別'], path: 'd_fs/hk/d_rjcm.json' },
    { keys: ['rjck', 'kuh', '釧路'], path: 'd_fs/hk/d_rjck.json' },
    { keys: ['rjcb', 'obo', '帯広'], path: 'd_fs/hk/d_rjcb.json' },
    { keys: ['rjec', 'akj', '旭川'], path: 'd_fs/hk/d_rjec.json' },
    { keys: ['rjco', 'okd', '丘珠'], path: 'd_fs/hk/d_rjco.json' },
    { keys: ['rjcc', 'cts', '新千歳'], path: 'd_fs/hk/d_rjcc.json' },
    { keys: ['rjch', 'hkd', '函館'], path: 'd_fs/hk/d_rjch.json' },
    { keys: ['rjeo', 'oir', '奥尻'], path: 'd_fs/hk/d_rjeo.json' },
    { keys: ['rjcn', 'shb', '中標津'], path: 'd_fs/hk/d_rjcn.json' },
    { keys: ['rjeb', 'meb', '紋別'], path: 'd_fs/hk/d_rjeb.json' },
    { keys: ['rjsa', 'aoj', '青森'], path: 'd_fs/ao/d_rjsa.json' },
    { keys: ['rjsm', 'msj', '三沢'], path: 'd_fs/ao/d_rjsm.json' },
    { keys: ['rjsr', 'onj', '大館能代'], path: 'd_fs/ak/d_rjsr.json' },
    { keys: ['rjsk', 'axt', '秋田'], path: 'd_fs/ak/d_rjsk.json' },
    { keys: ['rjsi', 'hna', '花巻'], path: 'd_fs/it/d_rjsi.json' },
    { keys: ['rjsy', 'syo', '庄内'], path: 'd_fs/yg/d_rjsy.json' },
    { keys: ['rjsc', 'gaj', '山形'], path: 'd_fs/yg/d_rjsc.json' },
    { keys: ['rjss', 'sdj', '仙台'], path: 'd_fs/mg/d_rjss.json' },
    { keys: ['rjsf', 'fks', '福島'], path: 'd_fs/fs/d_rjsf.json' },
    { keys: ['rjah', 'ibr', '茨城'], path: 'd_fs/ib/d_rjah.json' },
    { keys: ['rjaa', 'nrt', '成田'], path: 'd_fs/cb/d_rjaa.json' },
    { keys: ['rjtt', 'hnd', '羽田'], path: 'd_fs/ty/d_rjtt.json' },
    { keys: ['rjto', 'oim', '大島'], path: 'd_fs/ty/d_rjto.json' },
    { keys: ['rjth', 'hac', '八丈島'], path: 'd_fs/ty/d_rjth.json' },
    { keys: ['rjaz', 'kzu', '神津島'], path: 'd_fs/ty/d_rjaz.json' },
    { keys: ['rjns', 'fsz', '静岡', '富士山静岡'], path: 'd_fs/sz/d_rjns.json' },
    { keys: ['rjaf', 'mmj', '松本', '信州まつもと'], path: 'd_fs/na/d_rjaf.json' },
    { keys: ['rjgg', 'ngo', '中部', 'セントレア'], path: 'd_fs/ai/d_rjgg.json' },
    { keys: ['rjna', 'nkm', '小牧'], path: 'd_fs/ai/d_rjna.json' },
    { keys: ['rjsn', 'kij', '新潟'], path: 'd_fs/ni/d_rjsn.json' },
    { keys: ['rjsd', 'sds', '佐渡'], path: 'd_fs/ni/d_rjsd.json' },
    { keys: ['rjnt', 'toy', '富山'], path: 'd_fs/tm/d_rjnt.json' },
    { keys: ['rjnw', 'ntq', '能登'], path: 'd_fs/is/d_rjnw.json' },
    { keys: ['rjnk', 'kmq', '小松'], path: 'd_fs/is/d_rjnk.json' },
    { keys: ['rjnf', 'fkj', '福井'], path: 'd_fs/fi/d_rjnf.json' },
    { keys: ['rjbd', 'shm', '和歌山'], path: 'd_fs/wa/d_rjbd.json' },
    { keys: ['rjoo', 'itm', '伊丹'], path: 'd_fs/os/d_rjoo.json' },
    { keys: ['rjbb', 'kix', '関西'], path: 'd_fs/os/d_rjbb.json' },
    { keys: ['rjbe', 'ukb', '神戸'], path: 'd_fs/hg/d_rjbe.json' },
    { keys: ['rjbt', 'tjh', '但馬'], path: 'd_fs/hg/d_rjbt.json' },
    { keys: ['rjos', 'tks', '徳島'], path: 'd_fs/tk/d_rjos.json' },
    { keys: ['rjok', 'kcz', '高知'], path: 'd_fs/ko/d_rjok.json' },
    { keys: ['rjom', 'myj', '松山'], path: 'd_fs/eh/d_rjom.json' },
    { keys: ['rjot', 'tak', '高松'], path: 'd_fs/ka/d_rjot.json' },
    { keys: ['rjor', 'ttj', '鳥取'], path: 'd_fs/tt/d_rjor.json' },
    { keys: ['rjoh', 'tgj', '米子'], path: 'd_fs/sm/d_rjoh.json' },
    { keys: ['rjoc', 'izo', '出雲'], path: 'd_fs/sm/d_rjoc.json' },
    { keys: ['rjno', 'oki', '隠岐'], path: 'd_fs/sm/d_rjno.json' },
    { keys: ['rjow', 'iwj', '石見'], path: 'd_fs/sm/d_rjow.json' },
    { keys: ['rjob', 'okj', '岡山'], path: 'd_fs/oy/d_rjob.json' },
    { keys: ['rjoa', 'hij', '広島'], path: 'd_fs/hs/d_rjoa.json' },
    { keys: ['rjdc', 'ubj', '宇部'], path: 'd_fs/ya/d_rjdc.json' },
    { keys: ['rjoi', 'iwk', '岩国'], path: 'd_fs/ya/d_rjoi.json' },
    { keys: ['rjfr', 'kkj', '北九州'], path: 'd_fs/fo/d_rjfr.json' },
    { keys: ['rjff', 'fuk', '福岡'], path: 'd_fs/fo/d_rjff.json' },
    { keys: ['rjfo', 'oit', '大分'], path: 'd_fs/oi/d_rjfo.json' },
    { keys: ['rjfs', 'hsg', '佐賀'], path: 'd_fs/sg/d_rjfs.json' },
    { keys: ['rjfu', 'ngs', '長崎'], path: 'd_fs/ns/d_rjfe.json' },
    { keys: ['rjfe', 'fuj', '福江'], path: 'd_fs/ns/d_rjfe.json' },
    { keys: ['rjdb', 'iki', '壱岐'], path: 'd_fs/ns/d_rjdb.json' },
    { keys: ['rjdt', 'tsj', '対馬'], path: 'd_fs/ns/d_rjdt.json' },
    { keys: ['rjda', 'axj', '天草'], path: 'd_fs/ku/d_rjda.json' },
    { keys: ['rjft', 'kmj', '熊本'], path: 'd_fs/ns/d_rjft.json' },
    { keys: ['rjfm', 'kmi', '宮崎'], path: 'd_fs/mz/d_rjfm.json' },
    { keys: ['rjfk', 'koj', '鹿児島'], path: 'd_fs/kg/d_rjfk.json' },
    { keys: ['rjfg', 'tne', '種子島'], path: 'd_fs/kg/d_rjfg.json' },
    { keys: ['rjfc', 'kum', '屋久島'], path: 'd_fs/kg/d_rjfc.json' },
    { keys: ['rjka', 'asj', '奄美'], path: 'd_fs/kg/d_rjka.json' },
    { keys: ['rjki', 'kkx', '喜界'], path: 'd_fs/kg/d_rjki.json' },
    { keys: ['rjkb', 'oke', '沖永良部'], path: 'd_fs/kg/d_rjkb.json' },
    { keys: ['rjkn', 'rnj', '与論'], path: 'd_fs/kg/d_rjkn.json' },
    { keys: ['roah', 'oka', '沖縄'], path: 'd_fs/ok/d_roah.json' },
    { keys: ['roig', 'isg', '石垣'], path: 'd_fs/ok/d_roig.json' },
    { keys: ['rork', 'kit', '北大東'], path: 'd_fs/ok/d_rork.json' },
    { keys: ['romd', 'mmd', '南大東'], path: 'd_fs/ok/d_romd.json' },
    { keys: ['rokj', 'ueo', '久米'], path: 'd_fs/ok/d_rokj.json' },
    { keys: ['romy', 'mmy', '宮古'], path: 'd_fs/ok/d_romy.json' },
    { keys: ['rors', 'shi', '下地'], path: 'd_fs/ok/d_rors.json' },
    { keys: ['royn', 'ogn', '与那国'], path: 'd_fs/ok/d_royn.json' }
  ];

  for (const mapping of airportMappings) {
    if (mapping.keys.includes(departureAirport)) {
      filePath = mapping.path;
      break;
    }
  }

  if (!filePath) {
    try {
      const nameResponse = await fetch('d_fs/airport_name.json');
      if (!nameResponse.ok) throw new Error('空港名データの取得に失敗しました');
      const nameData = await nameResponse.json();
      if (nameData.airports.includes(departureAirport)) {
        return 1;
      } else {
        return null;
      }
    } catch (nameError) {
      console.error(nameError);
      return null;
    }
  }

  try {
    const response = await fetch(filePath);
    if (!response.ok) throw new Error('ファイルの取得に失敗しました');
    const data = await response.json();
    return data.flights;
  } catch (error) {
    console.error(error);
    return [];
  }
}

// 検索関数の変更
async function searchFlights() {
  const departureInput = document.getElementById('departure').value.trim().toLowerCase();
  const arrivalInput   = document.getElementById('arrival').value.trim().toLowerCase();
  const resultDiv      = document.getElementById('result');
  const aircraftType   = document.getElementById('aircraft') ? document.getElementById('aircraft').value : '';
  let resultHtml       = "";

  // 入力チェック: 未入力時に案内を表示
  if (!departureInput || !arrivalInput) {
    resultDiv.innerHTML = `<p class="english">出発地と到着地を入力してください</p>`;
    return;
  }

  const flights = await fetchFlights(departureInput);

  if (flights === null) {
    resultDiv.innerHTML = `<p class="english">空港名が異なります</p>`;
    return;
  }

  if (Array.isArray(flights)) {
    const matchedFlight = flights.find(flight =>
      flight.arrival.map(a => a.toLowerCase()).includes(arrivalInput)
    );
    if (matchedFlight) {
      const flightNumbers = matchedFlight.flightNumber.split('\n').map(num => num.trim());
      const airline = "CJA";
      const orig    = departureInput.toUpperCase();
      const dest    = arrivalInput.toUpperCase();
      resultHtml = `<p class="english">フライトが見つかりました<br></p>`;
      flightNumbers.forEach(flightNumber => {
        const simbriefURL = `https://dispatch.simbrief.com/options/custom?airline=${airline}&fltnum=${flightNumber}&orig=${orig}&dest=${dest}&type=${aircraftType}`;
        resultHtml += `<a href="${simbriefURL}" target="_blank" class="simbrief-link english japanese">CJA${flightNumber}便のフライト</a><br>`;
      });
      resultDiv.innerHTML = resultHtml;
      return;
    } else {
      const validAirports = await checkAirports(departureInput, arrivalInput);
      if (validAirports) {
        const airline = "CJA";
        const orig    = departureInput.toUpperCase();
        const dest    = arrivalInput.toUpperCase();
        const simbriefURL = `https://dispatch.simbrief.com/options/custom?airline=${airline}&orig=${orig}&dest=${dest}&type=${aircraftType}`;
        resultHtml = `<p class="english">臨時便に乗務する</p>` +
                     `<a href="${simbriefURL}" target="_blank" class="simbrief-link english japanese">臨時便を計画</a>`;
        resultDiv.innerHTML = resultHtml;
        return;
      }
    }
  } else if (flights === 1) {
    const validAirports = await checkAirports(departureInput, arrivalInput);
    if (validAirports) {
      const airline = "CJA";
      const orig    = departureInput.toUpperCase();
      const dest    = arrivalInput.toUpperCase();
      const simbriefURL = `https://dispatch.simbrief.com/options/custom?airline=${airline}&orig=${orig}&dest=${dest}&type=${aircraftType}`;
      resultHtml = `<p class="english">臨時便に乗務する</p>` +
                   `<a href="${simbriefURL}" target="_blank" class="simbrief-link english japanese">臨時便を計画</a>`;
      resultDiv.innerHTML = resultHtml;
      return;
    }
  }

  resultDiv.innerHTML = `<p class="english">空港が見つかりませんでした</p>`;
}

["departure", "arrival"].forEach(id => {
  const input = document.getElementById(id);
  if (!input) return;

  input.addEventListener("input", e => {
    if (e.isComposing) return;

    const currentValue = e.target.value;
    const start = e.target.selectionStart;
    const end = e.target.selectionEnd;

    if (currentValue !== currentValue.toUpperCase()) {
      e.target.value = currentValue.toUpperCase();
      setTimeout(() => {
        e.target.setSelectionRange(start, end);
      }, 0);
    }
  });

  input.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      document.getElementById("search").click();
    }
  });
});
