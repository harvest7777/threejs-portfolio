import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export function loadMiata(scene) {
  // le miata
  const loader = new GLTFLoader();
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
}
