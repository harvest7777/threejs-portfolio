import * as THREE from "three";

export function createSunsetGradientTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#2e1a47");
  gradient.addColorStop(0.4, "#ff6e40");
  gradient.addColorStop(0.7, "#ffd166");
  gradient.addColorStop(1, "#355c7d");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearFilter;
  return texture;
}
