type TMainArgs = {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
};

export function game({ ctx, width, height }: TMainArgs) {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#000000";
  ctx.fillRect(width / 2 - 25, height / 2 - 25, 50, 50);

  ctx.font = "24px monospace";
  ctx.fillText("Hello, World!", 50, 50);
}
