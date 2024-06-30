import {
  draw_board,
  calc_board,
  init_board,
  set_on_board,
  get_from_board,
} from "../build/debug";

type TMainArgs = {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
};

const RATE = 100;
const CELL_SIZE = 20;

let is_paused = true;
let lastFrameTime = 0;
let accumulatedTime = 0;

function render_fps(ctx: CanvasRenderingContext2D, fps: number, width: number) {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(width / 2 - 40, 0, 80, 25);
  ctx.font = "16px monospace";
  ctx.fillStyle = "#000000";
  ctx.fillText(`FPS: ${Math.floor(fps)}`, width / 2 - 33, 20);
}

function render(
  ctx: CanvasRenderingContext2D,
  stamp: number,
  width: number,
  height: number,
) {
  const deltaTime = stamp - lastFrameTime;
  lastFrameTime = stamp;
  accumulatedTime += deltaTime;

  if (accumulatedTime >= RATE) {
    if (!is_paused) {
      draw_board(width, height);
      calc_board();
    }
    render_fps(ctx, 1000 / deltaTime, width);

    accumulatedTime %= RATE;
  }

  requestAnimationFrame((stamp) => render(ctx, stamp, width, height));
}

export function game_asm({ ctx, width, height }: TMainArgs) {
  const cnv = ctx.canvas;

  init_board();
  draw_board(width, height);

  render(ctx, 0, width, height);

  document.addEventListener("keypress", (ev) => {
    if (ev.key === " ") {
      is_paused = !is_paused;
    }
  });

  cnv.addEventListener("click", (ev) => {
    const clickX = ev.clientX - cnv.offsetLeft;
    const clickY = ev.clientY - cnv.offsetTop;

    const x = Math.floor(clickX / CELL_SIZE);
    const y = Math.floor(clickY / CELL_SIZE);

    set_on_board(y, x, !get_from_board(y, x));

    draw_board(width, height);
  });
}
