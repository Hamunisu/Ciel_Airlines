// @ts-nocheck
import init, { search } from "../pkg/ciel.js";



async function main() {
    await init();
    console.log("wasm初期化完了");
    const dep = document.getElementById("dep");
    const arr = document.getElementById("arr");
    const enter = document.getElementById("enter");
    const result = document.getElementById("result");


            
    const Wasm = () => {
        // @ts-ignore
        const resultText = search(dep.value, arr.value);
        result.innerHTML = resultText;
    };

    if(enter) {
        enter.addEventListener('click', () => {
            Wasm()
        });
    }

    const ClickEnter = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            enter.click();
        }
    };

    dep.addEventListener("keydown", ClickEnter);
    arr.addEventListener("keydown", ClickEnter);
}

main();