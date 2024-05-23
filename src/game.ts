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
const BG_COLOR = "#ffffff";

const RATE = 100;

let is_paused = true;

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

function draw_board(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
) {
  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, width, height);

  for (let y = 0; y < BOARD_ROWS; ++y) {
    for (let x = 0; x < BOARD_COLS; ++x) {
      if (board[y][x]) {
        ctx.fillStyle = LIVE_CELL_COLOR;
      } else {
        ctx.fillStyle = DEAD_CELL_COLOR;
      }
      if (ENABLE_GRID) {
        ctx.strokeStyle = GRID_COLOR;
        ctx.lineWidth = GRID_THICK;
        ctx.strokeRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        ctx.fillRect(
          x * CELL_SIZE + GRID_THICK,
          y * CELL_SIZE + GRID_THICK,
          CELL_SIZE - GRID_THICK * 2,
          CELL_SIZE - GRID_THICK * 2,
        );
      } else {
        ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }
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

export function game({ ctx, width, height }: TMainArgs) {
  ctx.translate(0.5, 0.5); // fix line smoothness

  init_board();

  draw_board(ctx, width, height);

  setInterval(() => {
    if (!is_paused) {
      draw_board(ctx, width, height);

      calc_board();
    }
  }, RATE);

  document.addEventListener("keypress", (ev) => {
    if (ev.key === " ") {
      is_paused = !is_paused;
    }
  });
}
