import * as THREE from "./THREEjs/build/three.module.js"
import { OrbitControls } from './THREEjs/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from './THREEjs/examples/jsm/loaders/GLTFLoader.js'
import { FontLoader } from './THREEjs/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from './THREEjs/examples/jsm/geometries/TextGeometry.js'


const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
document.body.appendChild(renderer.domElement)

const scene = new THREE.Scene()

const cameraTPV = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight,0.1,1000)
cameraTPV.position.set(6,3,5)
cameraTPV.lookAt(0,0,0)

const cameraFPV = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight,0.1,1000)

let activeCamera = cameraTPV

const controls = new OrbitControls(cameraTPV, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 0, 0);

const ambientlight = new THREE.AmbientLight(0xffffff,0.7)
scene.add(ambientlight)
const spotlight = new THREE.SpotLight(0xffffff,1.2)
spotlight.position.set(0, 10, 0);
spotlight.castShadow = true;
spotlight.distance = 1000;
spotlight.shadow.mapSize.width = 2048;
spotlight.shadow.mapSize.height = 2048;
scene.add(spotlight);

const directionalLight = new THREE.DirectionalLight(0xFFFEEE, 0.5)
directionalLight.position.set(5, 2, 8);
scene.add(directionalLight)

const txtrLoader = new THREE.TextureLoader()
const groundTxtr = txtrLoader.load('./assets/textures/grass/rocky_terrain_02_diff_1k.jpg')
const barkTexture = txtrLoader.load('./assets/textures/tree/chinese_cedar_bark_diff_1k.jpg');
const happyTexture = txtrLoader.load('./assets/textures/hamsuke/front_happy.png');
const sadTexture = txtrLoader.load('./assets/textures/hamsuke/front_sad.png');
const hamsterside = txtrLoader.load('./assets/textures/hamsuke/side.png');
const hamstertopback = txtrLoader.load('./assets/textures/hamsuke/top&back.png');

//Skybox Loader
const skyboxLoader = new THREE.CubeTextureLoader();
const skyboxTexture = skyboxLoader.load([
    './assets/skybox/negx.jpg',
    './assets/skybox/posx.jpg',
    './assets/skybox/posy.jpg',
    './assets/skybox/negy.jpg',
    './assets/skybox/negz.jpg',
    './assets/skybox/posz.jpg',
]);
scene.background = skyboxTexture;


const groundGeometry = new THREE.BoxGeometry(25,2,25)
const groundMaterial = new THREE.MeshStandardMaterial({color: 0xFFFFFF, map:groundTxtr})
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial)
groundMesh.position.set(0,-1,0)
groundMesh.receiveShadow = true;
groundMesh.castShadow = false;

scene.add(groundMesh)

function createTree(x, z) {
    const treeGroup = new THREE.Group();
    const trunkGeometry = new THREE.CylinderGeometry(0.6, 0.6, 3);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, map: barkTexture });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMat);
    trunk.position.set(0, 1.5, 0);
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    treeGroup.add(trunk);

    const leaves1Geometry = new THREE.ConeGeometry(3, 4, 8);
    const leavesMat = new THREE.MeshStandardMaterial({ color: 0x374F2F });
    const leaves1 = new THREE.Mesh(leaves1Geometry, leavesMat);
    leaves1.position.set(0, 4, 0);
    leaves1.castShadow = true;
    leaves1.receiveShadow = true;
    treeGroup.add(leaves1);

    const leaves2Geometry = new THREE.ConeGeometry(2.1, 2.8, 8);
    const leaves2 = new THREE.Mesh(leaves2Geometry, leavesMat);
    leaves2.position.set(0, 6, 0);
    leaves2.castShadow = true;
    leaves2.receiveShadow = true;
    treeGroup.add(leaves2);

    treeGroup.position.set(x, 0, z);
    scene.add(treeGroup);
}

createTree(-5, -5);
createTree(7, -6);
createTree(-8, 8);

const hamsterGroup = new THREE.Group();
hamsterGroup.position.set(3, 1, -1);
hamsterGroup.rotation.set(0, Math.PI / 8, 0);
scene.add(hamsterGroup);

const bodyGeometry = new THREE.BoxGeometry(2, 2, 2);

const bodyMaterials = [
    new THREE.MeshPhongMaterial({ map: hamsterside }),    // Right
    new THREE.MeshPhongMaterial({ map: hamsterside }),    // Left
    new THREE.MeshPhongMaterial({ map: hamstertopback }), // Top
    new THREE.MeshPhongMaterial({ map: hamstertopback }),    // Bottom
    new THREE.MeshPhongMaterial({ map: happyTexture }),   // Front (Face)
    new THREE.MeshPhongMaterial({ map: hamstertopback })  // Back
];

const hamsterBody = new THREE.Mesh(bodyGeometry, bodyMaterials);
hamsterBody.castShadow = true;
hamsterBody.receiveShadow = true;
hamsterBody.userData = { isHamsterBody: true, mood: 'happy' }; 
hamsterGroup.add(hamsterBody);

const tailGeometry = new THREE.BoxGeometry(0.6, 2.8, 0.6);
const tailMat = new THREE.MeshPhongMaterial({ color: 0x023020 });
const tail = new THREE.Mesh(tailGeometry, tailMat);
tail.position.set(0, 0.4, -1.25); 
tail.rotation.x = Math.PI / 8;
tail.castShadow = true; tail.receiveShadow = true;
hamsterGroup.add(tail);

const earGeometry = new THREE.ConeGeometry(0.2, 0.7, 32);
const leftEarMat = new THREE.MeshPhongMaterial({ color: 0x023020 });
const rightEarMat = new THREE.MeshPhongMaterial({ color: 0x6B6860 });

const leftEar = new THREE.Mesh(earGeometry, leftEarMat);
leftEar.position.set(0.6, 1.1, 0.4);
leftEar.rotation.z = -Math.PI / 8;
hamsterGroup.add(leftEar);

const rightEar = new THREE.Mesh(earGeometry, rightEarMat);
rightEar.position.set(-0.6, 1.1, 0.4);
rightEar.rotation.z = Math.PI / 8;
hamsterGroup.add(rightEar);

//Font
const fontLoader = new FontLoader();
fontLoader.load('./THREEjs/examples/fonts/helvetiker_bold.typeface.json', function (font){
    const textGeometry = new TextGeometry('OVerlord', {
        font: font,
        size: 1,
        height: 0.2,
        curveSegments: 12,
        bevelEnabled: false
    }); //Text
    const textMaterial = new THREE.MeshStandardMaterial({color: 0xFFFFFF})
    const textMesh = new THREE.Mesh(textGeometry, textMaterial)
    textMesh.position.set(-6,4,5)
    textMesh.rotation.set(0, Math.PI / 2, 0)
    textMesh.castShadow = true
    textMesh.receiveShadow = true
    scene.add(textMesh)
});

let darkWarrior = new THREE.Group()
scene.add(darkWarrior)
const placeholderGeometry = new THREE.BoxGeometry(0.5, 1.8, 0.5);
const placeholderMat = new THREE.MeshStandardMaterial({ color: 0xaa0000 });
const placeholderMesh = new THREE.Mesh(placeholderGeometry, placeholderMat);
placeholderMesh.position.y = 0.9;
placeholderMesh.castShadow = true;
darkWarrior.add(placeholderMesh);

const gltfLoader = new GLTFLoader();

gltfLoader.load(
    './assets/models/momonga_ainz_ooal_gown/scene.gltf',
    (gltf) => {
        darkWarrior.remove(placeholderMesh);
        const model = gltf.scene;
        model.scale.set(0.01, 0.01, 0.01);
        model.rotation.y = Math.PI; 
        
        model.traverse((node) => {
            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
            }
        });
        darkWarrior.add(model);
        console.log("Model loaded successfully");
    },
    (xhr) => {
    },
    (error) => { //Error message on Console if loading the dark warriro model fails
        console.error("Error While Loading Model:", error);
    }
);


darkWarrior.position.set(0, 0, 3);
darkWarrior.rotation.set(0, Math.PI / 2, 0);

// Spells
const spellGroup = new THREE.Group();
spellGroup.visible = false; 
darkWarrior.add(spellGroup); 

const spellLight = new THREE.PointLight(0xFFD700, 2, 3);
spellLight.position.set(0, 0.5, 0);
spellGroup.add(spellLight);

const spellMat = new THREE.MeshPhongMaterial({
    color: 0xDAA520,
    emissive: 0xFFCC00,
    emissiveIntensity: 2,
    shininess: 100,
    transparent: true,
    opacity: 0.8,
    side: THREE.DoubleSide
});

//Rings
const innerRingGeometry = new THREE.RingGeometry(1, 1.2, 64);
const innerRing = new THREE.Mesh(innerRingGeometry, spellMat);
innerRing.rotation.x = -Math.PI / 2;
innerRing.position.y = 0.02;
spellGroup.add(innerRing);

const outerRingGeometry = new THREE.RingGeometry(1.8, 2, 64);
const outerRing = new THREE.Mesh(outerRingGeometry, spellMat);
outerRing.rotation.x = -Math.PI / 2;
outerRing.position.y = 0.02;
spellGroup.add(outerRing);

// Pointers
const pointerGeometry = new THREE.BoxGeometry(0.05, 4, 0.01);
const pointer1 = new THREE.Mesh(pointerGeometry, spellMat);
pointer1.rotation.x = -Math.PI / 2;
pointer1.rotation.z = Math.PI / 2;
pointer1.position.y = 0.01;
spellGroup.add(pointer1);

const pointer2 = new THREE.Mesh(pointerGeometry, spellMat);
pointer2.rotation.x = -Math.PI / 2;
pointer2.position.y = 0.01;
spellGroup.add(pointer2);

//Controls
const keys = { w: false, a: false, s: false, d: false, q: false, e: false };
const moveSpeed = 0.1;
const rotSpeed = 0.05;

window.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    if (keys.hasOwnProperty(key)) keys[key] = true;
    if (key === ' ') {
        spellGroup.visible = !spellGroup.visible;
    }if (key === 'c') {
        activeCamera = (activeCamera === cameraTPV) ? cameraFPV : cameraTPV;
    }
});

window.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    if (keys.hasOwnProperty(key)) keys[key] = false;
});


// Raycaster
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, activeCamera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    for (let i = 0; i < intersects.length; i++) {
        if (intersects[i].object.userData.isHamsterBody) {
            const obj = intersects[i].object;
            const faceMaterial = obj.material[4];

            if (obj.userData.mood === 'happy') {
                faceMaterial.map = sadTexture;
                obj.userData.mood = 'sad';
            } else {
                faceMaterial.map = happyTexture;
                obj.userData.mood = 'happy';
            }
            faceMaterial.needsUpdate = true;
            break;
        }
    }
});

window.addEventListener('resize', () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    cameraTPV.aspect = w / h;
    cameraTPV.updateProjectionMatrix();
    cameraFPV.aspect = w / h;
    cameraFPV.updateProjectionMatrix();
    renderer.setSize(w, h);
});

function animate() {
    renderer.setAnimationLoop(animate);

    if (keys.w) darkWarrior.translateZ(moveSpeed); 
    if (keys.s) darkWarrior.translateZ(-moveSpeed); 
    if (keys.a) darkWarrior.translateX(moveSpeed); 
    if (keys.d) darkWarrior.translateX(-moveSpeed); 
    if (keys.q) darkWarrior.rotateY(rotSpeed);
    if (keys.e) darkWarrior.rotateY(-rotSpeed);

    const relativeCamPos = new THREE.Vector3(0, 1.8, 0); 
    relativeCamPos.applyMatrix4(darkWarrior.matrixWorld);
    cameraFPV.position.copy(relativeCamPos);

    const relativeTarget = new THREE.Vector3(0, 1.8, 1); 
    relativeTarget.applyMatrix4(darkWarrior.matrixWorld);
    cameraFPV.lookAt(relativeTarget);
    
    if (activeCamera === cameraTPV) {
        controls.update();
    }
    renderer.render(scene, activeCamera);
}

// Start
animate();