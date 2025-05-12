import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export function loadMiata(scene, onModelLoaded) {
  const loader = new GLTFLoader();
  loader.load(
    "miata.glb",
    function (gltf) {
      const model = gltf.scene;
      model.name = "Miata";
      scene.add(model);

      if (onModelLoaded) {
        onModelLoaded(model); // Pass the loaded model to the callback
      }
    },
    undefined,
    function (error) {
      console.error(error);
    }
  );
}
