// @ts-nocheck
import init, { search } from "../wasm/ciel_core2.js";


async function main() {
    await init();
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