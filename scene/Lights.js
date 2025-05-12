import * as THREE from "three";

export function createLights(scene) {
  const light = new THREE.AmbientLight(0xffffff, 1); // soft white light
  scene.add(light);

  const directionalLight = new THREE.DirectionalLight(light);
  directionalLight.position.set(5, 10, 7.5);
  scene.add(directionalLight);
}
