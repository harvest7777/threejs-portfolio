import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { createLights } from "./scene/Lights";
import { loadMiata } from "./scene/Miata";
import { createCamera } from "./scene/Camera";
import { createScene } from "./scene/Scene";

// import { openModal } from "./modal";

// scene setup
const scene = createScene();

const camera = createCamera();
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

const controls = new OrbitControls(camera, renderer.domElement);
document.body.appendChild(renderer.domElement);

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

let originalMaterials = new Map();
let trackedMeshes = [];

// object setup
createLights(scene);
loadMiata(scene, function (loadedModel) {
  loadedModel.traverse((obj) => {
    if (obj instanceof THREE.Mesh && obj.material && obj.material.emissive) {
      trackedMeshes.push(obj);
      originalMaterials.set(obj.uuid, {
        modelName: loadedModel.name,
        color: obj.material.emissive.clone(),
        intensity: obj.material.emissiveIntensity,
      });
    }
  });
});

function onPointerMove(event) {
  // calculate pointer position in normalized device coordinates
  // (-1 to +1) for both components

  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

window.addEventListener("pointermove", onPointerMove);
window.addEventListener("click", onClick);

function resetMaterials() {
  trackedMeshes.forEach((mesh) => {
    const original = originalMaterials.get(mesh.uuid);
    if (original && mesh.material && mesh.material.emissive) {
      mesh.material.emissive.copy(original.color);
      mesh.material.emissiveIntensity = original.intensity;
    }
  });
}

function raycast() {
  // calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObjects(trackedMeshes, true);
  for (let i = 0; i < intersects.length; i++) {
    const intersectedObject = intersects[i].object;

    // get model it is a part of
    let currentObject = intersectedObject;
    const modelName = originalMaterials.get(currentObject.uuid).modelName;
    const originalModel = scene.getObjectByName(modelName);

    // highlight the whole model by adding emissive to all children
    originalModel.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        const mat = obj.material;
        if (mat && mat.color) {
          if ("emissive" in mat) {
            mat.emissive.set(0xfffccc);
            mat.emissiveIntensity = 0.3;
          }
        }
      }
    });
  }
}

function onClick() {
  // we only rly need the first mesh, then we can bubble up
  const firstIntersect = raycaster.intersectObjects(trackedMeshes, true)[0];
  if (!firstIntersect) return;

  const intersectedObject = firstIntersect.object;

  // get model it is a part of
  const modelName = originalMaterials.get(intersectedObject.uuid).modelName;

  // if (modelName === "Miata") openModal();
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  raycaster.setFromCamera(pointer, camera);

  resetMaterials();
  raycast();

  renderer.render(scene, camera);
}

animate();
