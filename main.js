import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { createLights } from "./scene/Lights";
import { createCamera } from "./scene/Camera";
import { createScene } from "./scene/Scene";
import { createSky } from "./scene/Sky";
import { loadGLB } from "./scene/LoadGlb";

// scene setup
const scene = createScene();

/**
 * maybe later i can add a camera pole to create a cool
 * spinny effect
 */

const camera = createCamera();
camera.position.z = 2;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;

createLights(scene);
createSky(scene);

// without this nothing will render
document.body.appendChild(renderer.domElement);

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

let originalMeshEmmissive = new Map();
let trackedMeshes = [];

loadGLB(scene, "sillymobile.glb", "Miata", function (loadedModel) {
  loadedModel.traverse((obj) => {
    if (obj instanceof THREE.Mesh && obj.material && obj.material.emissive) {
      trackedMeshes.push(obj);
      originalMeshEmmissive.set(obj.uuid, {
        modelName: loadedModel.name,
        material: obj.material.clone(),
      });
    }
  });
  loadedModel.scale.set(1.3, 1.3, 1.3);
  loadedModel.position.set(1, -0.5, 0);
});

loadGLB(scene, "indoor_plant.glb", "Pothos", function (loadedModel) {
  loadedModel.traverse((obj) => {
    if (obj instanceof THREE.Mesh && obj.material && obj.material.emissive) {
      trackedMeshes.push(obj);
      originalMeshEmmissive.set(obj.uuid, {
        modelName: loadedModel.name,
        material: obj.material.clone(),
      });
    }
  });
  loadedModel.scale.set(0.3, 0.3, 0.3);
  loadedModel.position.set(0, -0.5, 0);
});

loadGLB(scene, "trophy.glb", "Trophy", function (loadedModel) {
  loadedModel.traverse((obj) => {
    if (obj instanceof THREE.Mesh && obj.material && obj.material.emissive) {
      trackedMeshes.push(obj);
      originalMeshEmmissive.set(obj.uuid, {
        modelName: loadedModel.name,
        material: obj.material.clone(),
      });
    }
  });
  loadedModel.scale.set(0.08, 0.08, 0.08);
  loadedModel.position.set(0, -0.5, 0.5);
});

loadGLB(scene, "gerald.glb", "Gerald", function (loadedModel) {
  loadedModel.traverse((obj) => {
    if (obj instanceof THREE.Mesh && obj.material && obj.material.emissive) {
      trackedMeshes.push(obj);
      originalMeshEmmissive.set(obj.uuid, {
        modelName: loadedModel.name,
        material: obj.material.clone(),
      });
    }
  });
  loadedModel.scale.set(0.1, 0.1, 0.1);
  loadedModel.position.set(0.3, -0.2, 0.5);
});

loadGLB(scene, "desk.glb", "Desk", function (loadedModel) {
  loadedModel.traverse((obj) => {
    if (obj instanceof THREE.Mesh && obj.material && obj.material.emissive) {
      trackedMeshes.push(obj);
      originalMeshEmmissive.set(obj.uuid, {
        modelName: loadedModel.name,
        material: obj.material.clone(),
      });
    }
  });
  loadedModel.scale.set(0.15, 0.15, 0.15);
  loadedModel.rotation.y = Math.PI / 2;
  loadedModel.position.set(0.3, 0, 0.5);
});

loadGLB(scene, "chair.glb", "Chair", function (loadedModel) {
  loadedModel.traverse((obj) => {
    if (obj instanceof THREE.Mesh && obj.material && obj.material.emissive) {
      trackedMeshes.push(obj);
      originalMeshEmmissive.set(obj.uuid, {
        modelName: loadedModel.name,
        material: obj.material.clone(),
      });
    }
  });
  loadedModel.scale.set(0.07, 0.07, 0.07);
  loadedModel.position.set(0.3, -0.2, 0.8);
});

loadGLB(scene, "floor.glb", "Floor", function (loadedModel) {
  loadedModel.traverse((obj) => {
    if (obj instanceof THREE.Mesh && obj.material && obj.material.emissive) {
      trackedMeshes.push(obj);
      originalMeshEmmissive.set(obj.uuid, {
        modelName: loadedModel.name,
        material: obj.material.clone(),
      });
    }
  });
  loadedModel.scale.set(1, 1, 1);
  loadedModel.position.set(0.3, -0.5, 0.8);
});
window.addEventListener("pointermove", onPointerMove);
window.addEventListener("click", onClick);

function onPointerMove(event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function resetMaterials() {
  trackedMeshes.forEach((mesh) => {
    const original = originalMeshEmmissive.get(mesh.uuid);
    if (original && mesh.material && mesh.material.emissive) {
      mesh.material.emissive.copy(original.material.emissive);
      mesh.material.emissiveIntensity = original.material.emissiveIntensity;
    }
  });
}

function raycast() {
  // calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObjects(trackedMeshes, true);
  if (intersects.length > 0) {
    const intersectedObject = intersects[0].object;

    // get model it is a part of
    let currentObject = intersectedObject;
    const modelName = originalMeshEmmissive.get(currentObject.uuid).modelName;
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
  const modelName = originalMeshEmmissive.get(intersectedObject.uuid).modelName;
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
