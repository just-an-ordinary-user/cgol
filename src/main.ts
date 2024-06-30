import { game_ts } from "./game";
import "./style.css";
import { game_asm } from "./wasm_main";

const CNV_WIDTH = 640;
const CNV_HEIGHT = 480;

const IMPL: TImpl = "ts";

function render(impl: TImpl, ctx: CanvasRenderingContext2D) {
  if (ctx) {
    switch (impl) {
      case "ts":
        game_ts({ ctx, width: CNV_WIDTH, height: CNV_HEIGHT });
        break;
      case "asm-ts":
        game_asm({
          ctx,
          width: CNV_WIDTH,
          height: CNV_HEIGHT,
        });
        break;
      default:
        throw "Unreachable";
    }
  }
}

const root = document.querySelector<HTMLDivElement>("#app");

if (root) {
  const cnv = document.createElement("canvas");

  if (cnv) {
    cnv.width = CNV_WIDTH;
    cnv.height = CNV_HEIGHT;
    root.appendChild(cnv);
    const ctx_ts = cnv.getContext("2d");

    ctx_ts && render(IMPL, ctx_ts);
  }
}
