import { Sky } from "three/examples/jsm/Addons.js";
import * as THREE from "three";

export function createSky(scene) {
  let sky = new Sky();
  sky.scale.setScalar(450000);
  scene.add(sky);

  const skyUniforms = sky.material.uniforms;
  skyUniforms["turbidity"].value = 0.1;
  skyUniforms["rayleigh"].value = 2.5;
  skyUniforms["mieCoefficient"].value = 0.005;
  skyUniforms["mieDirectionalG"].value = 0.7;

  const sun = new THREE.Vector3();
  const phi = THREE.MathUtils.degToRad(90 - 3);
  const theta = THREE.MathUtils.degToRad(180);
  sun.setFromSphericalCoords(1, phi, theta);
  skyUniforms["sunPosition"].value.copy(sun);
}
