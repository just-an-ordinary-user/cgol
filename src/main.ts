import { game } from "./game";
import "./style.css";

const CNV_WIDTH = 640;
const CNV_HEIGHT = 480;

const root = document.querySelector<HTMLDivElement>("#app");

if (root) {
  const cnv = document.createElement("canvas");
  cnv.width = CNV_WIDTH;
  cnv.height = CNV_HEIGHT;
  root.appendChild(cnv);
  const ctx = cnv.getContext("2d");

  ctx && game({ ctx, width: CNV_WIDTH, height: CNV_HEIGHT });
}
