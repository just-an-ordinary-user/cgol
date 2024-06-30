@external("../src/bindings.ts", "fill_rect")
declare function fill_rect(
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
): void;

@external("../src/bindings.ts", "stroke_rect")
declare function stroke_rect(
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
  line_width: number,
): void;

@external("../src/bindings.ts", "draw_line")
declare function draw_line(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  line_width: number,
): void;

type TField = bool[][];

const BOARD_ROWS = 24;
const BOARD_COLS = 32;
const ENABLE_GRID = false;
const GRID_THICK = 1;
const GRID_COLOR = "#000000";

const CELL_SIZE = 20;
const LIVE_CELL_COLOR = "#000000";
const DEAD_CELL_COLOR = "#ffffff";

function make_board(rows: i32, cols: i32): bool[][] {
  const result = new Array<bool[]>(rows).fill([]);

  for (let i = 0; i < rows; ++i) {
    const row = new Array<bool>(cols);

    row.fill(false);

    result[i] = row;
  }

  return result;
}


const board: TField = make_board(BOARD_ROWS, BOARD_COLS);

const back_board: TField = make_board(BOARD_ROWS, BOARD_COLS);


function mod(a: i32, b: i32): i32 {
  return ((a % b) + b) % b;
}

function flip_board(): void {
  for (let y = 0; y < BOARD_ROWS; ++y) {
    for (let x = 0; x < BOARD_COLS; ++x) {
      board[y][x] = back_board[y][x];
    }
  }
}

function count_neighbors(cx: i32, cy: i32): number {
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

export function calc_board(): void {
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

export function init_board(): void {
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

function draw_grid(width: number, height: number): void {
  for (let y = 0; y < height; y += CELL_SIZE) {
    draw_line(0, y, width, y, GRID_COLOR, GRID_THICK);
  }
  for (let x = 0; x < width; x += CELL_SIZE) {
    draw_line(x, 0, x, height, GRID_COLOR, GRID_THICK);
  }
}

export function draw_board(width: number, height: number): void {
  fill_rect(0, 0, width, height, DEAD_CELL_COLOR);

  const gridThick = ENABLE_GRID ? GRID_THICK : 0;

  for (let y = 0; y < BOARD_ROWS; ++y) {
    for (let x = 0; x < BOARD_COLS; ++x) {
      if (board[y][x]) {
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

export function set_on_board(y: i32, x: i32, value: bool): void {
    board[y][x] = value;
}

export function get_from_board(y: i32, x: i32): bool {
  return board[y][x];
}

export function frame(width: i32, height: i32): void {
    draw_board(width, height);

    calc_board();
}
