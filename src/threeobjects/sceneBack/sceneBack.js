import * as THREE from "three";

import Magazine from "./magazine";
import globalstateobj from "../../globalstate";

export default function SceneBack(threecontainer) {
  this.threeobjects = [new Magazine()];

  //renderer
  this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  this.renderer.setSize(window.innerWidth, window.innerHeight);
  threecontainer.appendChild(this.renderer.domElement);
  this.renderer.domElement.id = "canvas";

  //camera
  this.camera = new THREE.PerspectiveCamera(
    90,
    window.innerWidth / window.innerHeight,
    1,
    500
  );
  this.camera.position.set(0, 0, 30);
  this.camera.lookAt(0, 0, 0);
  // camera.rotateX(20);
  // camera.rotateY(20);

  // scene
  this.scene = new THREE.Scene();
  this.scene.background = new THREE.Color(0x21222c);
  // scene.background = new THREE.Color(0x282a36);
  this.raycaster = new THREE.Raycaster();

  this.threeobjects.forEach((element) => {
    this.scene.add(element.group);
  });
}

SceneBack.prototype.updateRaycaster = function () {
  let mousePos = new THREE.Vector2(
    globalstateobj.mouseX,
    globalstateobj.mouseY
  );
  this.raycaster.setFromCamera(mousePos, this.camera);

  let intersects = this.raycaster.intersectObjects(this.scene.children);
  if (intersects[0]) {
    this.scene.traverse((child) => {
      if (child.isMesh && intersects[0].object.uuid === child.uuid)
        globalstateobj.clickedUuid = child.uuid;
    });
  }
};

SceneBack.prototype.update = function () {
  this.renderer.render(this.scene, this.camera);
  this.renderer.autoClear = false;

  if (globalstateobj.raycasting) this.updateRaycaster();
  globalstateobj.raycasting = false;

  if (
    this.renderer.domElement.width !== window.innerWidth ||
    this.renderer.domElement.height !== window.innerHeight
  ) {
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }

  this.threeobjects.forEach((element) => {
    element.update();
  });
};
