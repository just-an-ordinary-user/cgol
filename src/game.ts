import { draw_line, fill_rect } from "./bindings";

type TMainArgs = {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
};

const BOARD_ROWS = 24;
const BOARD_COLS = 32;
const ENABLE_GRID = true;
const GRID_THICK = 1;
const GRID_COLOR = "#000000";

const CELL_SIZE = 20;
const LIVE_CELL_COLOR = "#000000";
const DEAD_CELL_COLOR = "#ffffff";
const RATE = 100;

let is_paused = true;
let lastFrameTime = 0;
let accumulatedTime = 0;

type TField = boolean[][];

const board: TField = Array.from({ length: BOARD_ROWS }, () =>
  new Array(BOARD_COLS).fill(false),
);

const back_board: TField = Array.from({ length: BOARD_ROWS }, () =>
  new Array(BOARD_COLS).fill(false),
);

function mod(a: number, b: number): number {
  return ((a % b) + b) % b;
}

function flip_board(): void {
  for (let y = 0; y < BOARD_ROWS; ++y) {
    for (let x = 0; x < BOARD_COLS; ++x) {
      board[y][x] = back_board[y][x];
    }
  }
}

function count_neighbors(cx: number, cy: number): number {
  let nbors = 0;
  for (let dx = -1; dx <= 1; ++dx) {
    for (let dy = -1; dy <= 1; ++dy) {
      if (!(dx === 0 && dy === 0)) {
        // if (dx !== 0 || dy !== 0) {
        const x = mod(cx + dx, BOARD_COLS);
        const y = mod(cy + dy, BOARD_ROWS);

        if (board[y][x]) {
          nbors += 1;
        }
      }
    }
  }

  return nbors;
}

function calc_board(): void {
  for (let y = 0; y < BOARD_ROWS; ++y) {
    for (let x = 0; x < BOARD_COLS; ++x) {
      const nbors_count = count_neighbors(x, y);
      if (board[y][x]) {
        back_board[y][x] = nbors_count === 2 || nbors_count === 3;
      } else {
        back_board[y][x] = nbors_count === 3;
      }
    }
  }
  flip_board();
}

function draw_grid(width: number, height: number) {
  for (let y = 0; y < height; y += CELL_SIZE) {
    draw_line(0, y, width, y, GRID_COLOR, GRID_THICK);
  }
  for (let x = 0; x < width; x += CELL_SIZE) {
    draw_line(x, 0, x, height, GRID_COLOR, GRID_THICK);
  }
}

function draw_board(width: number, height: number) {
  fill_rect(0, 0, width, height, DEAD_CELL_COLOR);

  for (let y = 0; y < BOARD_ROWS; ++y) {
    for (let x = 0; x < BOARD_COLS; ++x) {
      if (board[y][x]) {
        const gridThick = ENABLE_GRID ? GRID_THICK : 0;
        fill_rect(
          x * CELL_SIZE + gridThick,
          y * CELL_SIZE + gridThick,
          CELL_SIZE - gridThick,
          CELL_SIZE - gridThick,
          LIVE_CELL_COLOR,
        );
      }
    }
  }

  if (ENABLE_GRID) {
    draw_grid(width, height);
  }
}

function init_board() {
  board[1][2] = true;
  board[2][3] = true;
  board[3][1] = true;
  board[3][2] = true;
  board[3][3] = true;

  board[1][BOARD_COLS - 3] = true;
  board[2][BOARD_COLS - 4] = true;
  board[3][BOARD_COLS - 4] = true;
  board[3][BOARD_COLS - 3] = true;
  board[3][BOARD_COLS - 2] = true;

  board[BOARD_ROWS - 2][2] = true;
  board[BOARD_ROWS - 3][3] = true;
  board[BOARD_ROWS - 4][1] = true;
  board[BOARD_ROWS - 4][2] = true;
  board[BOARD_ROWS - 4][3] = true;

  board[BOARD_ROWS - 2][BOARD_COLS - 3] = true;
  board[BOARD_ROWS - 3][BOARD_COLS - 4] = true;
  board[BOARD_ROWS - 4][BOARD_COLS - 4] = true;
  board[BOARD_ROWS - 4][BOARD_COLS - 3] = true;
  board[BOARD_ROWS - 4][BOARD_COLS - 2] = true;
}

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

export function game_ts({ ctx, width, height }: TMainArgs) {
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

    board[y][x] = !board[y][x];

    draw_board(width, height);
  });
}
