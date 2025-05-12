import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { createLights } from "./scene/Lights";
import { loadMiata } from "./scene/Miata";
import { createCamera } from "./scene/Camera";
import { createScene } from "./scene/Scene";

const scene = createScene();

const camera = createCamera();
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

const controls = new OrbitControls(camera, renderer.domElement);
document.body.appendChild(renderer.domElement);

createLights(scene);
loadMiata(scene);

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
