import * as THREE from "./THREEjs/build/three.module.js"

const renderer = new THREE.WebGLRenderer({antialiasing: true,});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.updateShadowMap.enabled = true;
renderer.updateShadowMap.type == THREE.PCFShadowMap;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight,0.1,1000);
camera.position.set(6,3,5);
camera.lookAt(0,0,0)


function animate(){
    renderer.render(scene,camera)
}
renderer.setAnimationLoop(animate)