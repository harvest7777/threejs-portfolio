import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { createLights } from "./scene/Lights";
import { loadMiata } from "./scene/Miata";
import { createCamera } from "./scene/Camera";
import { createScene } from "./scene/Scene";

// scene setup
const scene = createScene();

const camera = createCamera();
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

const controls = new OrbitControls(camera, renderer.domElement);
document.body.appendChild(renderer.domElement);

// object setup
createLights(scene);
let miataModel = null;
loadMiata(scene, function (loadedModel) {
  console.log(loadedModel);
});

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function onPointerMove(event) {
  // calculate pointer position in normalized device coordinates
  // (-1 to +1) for both components

  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

window.addEventListener("pointermove", onPointerMove);

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  raycaster.setFromCamera(pointer, camera);

  // calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObjects(scene.children);
  for (let i = 0; i < intersects.length; i++) {
    const intersectedObject = intersects[i].object;

    // Traverse up the parent hierarchy to find the top-level GLTF model or group
    let currentObject = intersectedObject;
    while (currentObject) {
      currentObject = currentObject.parent; // Move up to the parent
      if (currentObject instanceof THREE.Group) {
        console.log(currentObject);
        break;
      }
    }
  }
  renderer.render(scene, camera);
}

animate();
