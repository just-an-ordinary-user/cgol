import {
  draw_board,
  calc_board,
  init_board,
  set_on_board,
} from "../build/debug";

type TMainArgs = {
  ctx: CanvasRenderingContext2D;
  cnv: HTMLCanvasElement;
  width: number;
  height: number;
};

const RATE = 100;

const CELL_SIZE = 20;

let is_paused = true;

export function game_asm({ ctx, cnv, width, height }: TMainArgs) {
  ctx.translate(0.5, 0.5); // fix line smoothness

  init_board();
  draw_board(width, height);

  setInterval(() => {
    if (!is_paused) {
      draw_board(width, height);
      calc_board();
    }
  }, RATE);

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

    set_on_board(y, x, true);

    draw_board(width, height);
  });
}
