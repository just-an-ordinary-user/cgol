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
