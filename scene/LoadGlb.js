import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export function loadGLB(scene, fileName, modelName, onModelLoaded) {
  const loader = new GLTFLoader();
  loader.load(
    fileName,
    function (gltf) {
      const model = gltf.scene;
      model.name = modelName;
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
