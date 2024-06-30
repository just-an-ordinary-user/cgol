export function fill_rect(
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
) {
  const cnv = document.querySelector("canvas");
  if (cnv) {
    const ctx = cnv.getContext("2d");

    if (ctx) {
      ctx.fillStyle = color;

      // ctx.beginPath();
      // ctx.moveTo(x, y);
      // ctx.lineTo(x + width, y);
      // ctx.lineTo(x + width, y + height);
      // ctx.lineTo(x, y + height);
      // ctx.fill();

      ctx.fillRect(x, y, width, height);
    }
  }
}

export function stroke_rect(
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
  line_width: number,
) {
  const cnv = document.querySelector("canvas");
  if (cnv) {
    const ctx = cnv.getContext("2d");

    if (ctx) {
      ctx.lineWidth = line_width;
      ctx.strokeStyle = color;
      ctx.strokeRect(x, y, width, height);
    }
  }
}

export function draw_line(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color: string,
  line_width: number,
) {
  const cnv = document.querySelector("canvas");
  if (cnv) {
    const ctx = cnv.getContext("2d");

    if (ctx) {
      ctx.lineWidth = line_width;
      ctx.strokeStyle = color;

      ctx.beginPath();
      ctx.moveTo(x1 + 0.5, y1 + 0.5);
      ctx.lineTo(x2 + 0.5, y2 + 0.5);
      ctx.stroke();
    }
  }
}
