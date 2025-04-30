document.addEventListener("DOMContentLoaded", () => {
  // MSFSセレクトボックスやボタン
  const r_select = document.getElementById("r_select");
  const r_result = document.getElementById("r_result");
  const r_button = document.getElementById("r_button");

  // X-Planeセレクトボックスやボタン
  const r_x_select = document.getElementById("r_x_select");
  const r_x_result = document.getElementById("r_x_result");
  const r_x_button = document.getElementById("r_x_button");

  let r_data = {};    // MSFSのデータ
  let r_x_data = {};  // X-Planeのデータ

  // セレクトボックスを更新する関数（すべて対応）
  const updateSelectBox = (selectBox, data) => {
    selectBox.innerHTML = ''; // セレクトボックスをクリア

    // 「すべて」選択肢を追加
    const allOption = document.createElement("option");
    allOption.value = "all";
    allOption.textContent = "すべて";
    selectBox.appendChild(allOption);

    // 各機種を追加
    for (const model in data) {
      const option = document.createElement("option");
      option.value = model;
      option.textContent = model;
      selectBox.appendChild(option);
    }
  };

  // データを読み込む関数
  const loadAircraftData = (fileName, isXPlane = false) => {
    fetch(fileName)
      .then(response => response.json())
      .then(data => {
        if (isXPlane) {
          r_x_data = data;
          updateSelectBox(r_x_select, r_x_data);
        } else {
          r_data = data;
          updateSelectBox(r_select, r_data);
        }
      })
      .catch(error => {
        console.error("JSONの読み込みに失敗しました:", error);
      });
  };

  // 初期表示でMSFSデータを読み込み
  loadAircraftData("json/msfs_aircraft.json");

  // タブ切り替え（MSFS）
  document.getElementById('msfsBtn').addEventListener('click', () => {
    document.getElementById('msfsContent').style.display = 'block';
    document.getElementById('xplaneContent').style.display = 'none';
    loadAircraftData("json/msfs_aircraft.json");
  });

  // タブ切り替え（X-Plane）
  document.getElementById('xplaneBtn').addEventListener('click', () => {
    document.getElementById('xplaneContent').style.display = 'block';
    document.getElementById('msfsContent').style.display = 'none';
    loadAircraftData("json/xplane_aircraft.json", true);
  });

  // MSFSルーレット実行（すべて対応）
  r_button.addEventListener("click", () => {
    const selectedModel = r_select.value;

    if (selectedModel === "all") {
      // すべての機体から抽選
      const allAircrafts = Object.values(r_data).flat();
      if (allAircrafts.length > 0) {
        const randomIndex = Math.floor(Math.random() * allAircrafts.length);
        const result = allAircrafts[randomIndex];
        r_result.textContent = `機体番号: ${result}`;
      } else {
        r_result.textContent = "データがありません。";
      }
    } else if (selectedModel && r_data[selectedModel]) {
      // 特定機種から抽選
      const aircrafts = r_data[selectedModel];
      const randomIndex = Math.floor(Math.random() * aircrafts.length);
      const result = aircrafts[randomIndex];
      r_result.textContent = `機体番号: ${result}`;
    } else {
      r_result.textContent = "機種を選択してください。";
    }
  });

  // X-Planeルーレット実行（すべて対応）
  r_x_button.addEventListener("click", () => {
    const selectedModel = r_x_select.value;

    if (selectedModel === "all") {
      // すべての機体から抽選
      const allAircrafts = Object.values(r_x_data).flat();
      if (allAircrafts.length > 0) {
        const randomIndex = Math.floor(Math.random() * allAircrafts.length);
        const result = allAircrafts[randomIndex];
        r_x_result.textContent = `機体番号: ${result}`;
      } else {
        r_x_result.textContent = "データがありません。";
      }
    } else if (selectedModel && r_x_data[selectedModel]) {
      // 特定機種から抽選
      const aircrafts = r_x_data[selectedModel];
      const randomIndex = Math.floor(Math.random() * aircrafts.length);
      const result = aircrafts[randomIndex];
      r_x_result.textContent = `機体番号: ${result}`;
    } else {
      r_x_result.textContent = "機種を選択してください。";
    }
  });
});
