import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

// renderer.setAnimationLoop(animate);

const controls = new OrbitControls(camera, renderer.domElement);

document.body.appendChild(renderer.domElement);

// le miata
const loader = new GLTFLoader();
const light = new THREE.AmbientLight(0xffffff, 1); // soft white light
scene.add(light);

const directionalLight = new THREE.DirectionalLight(light);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

loader.load(
  "miata.glb",
  function (gltf) {
    scene.add(gltf.scene);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

camera.position.z = 5;

function animate() {
  requestAnimationFrame(animate);
  // cube.rotation.x += 0.1;
  // cube.rotation.y += 0.1;
  controls.update();
  renderer.render(scene, camera);
}
animate();
