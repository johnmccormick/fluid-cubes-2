import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import './lib/jm-controls';
import { toRadians, map_range } from './lib/jm-math';

function createCubeMesh(x, y, z, color = null) {
    var geometry = new THREE.BoxGeometry(x, y, z);
    var material = new THREE.MeshPhongMaterial();
    material.color = color || baseColor;

    var cube = new THREE.Mesh(geometry, material);
    return cube;
}

function reconstruct() {
    if (group) {
        scene.remove(group);
        const groupCount = group.children.length;
        for (var i = groupCount - 1; i >= 0; i--) {
            const child = group.children[i];
            if (child.isMesh) {
                child.geometry.dispose();
                child.material.dispose();
            }
            group.remove(child);
        };
    }

    cubes = new Array(blocks.width)
    for (var i = 0; i < blocks.width; i++) {
        cubes[i] = new Array(blocks.height)
    }

    centerPoint = new THREE.Vector3(blocks.width / 2, -1, -blocks.height / 2);

    var padding = 0.0;
    for (var i = 0; i < blocks.width; i++) {
        for (var j = 0; j < blocks.height; j++) {
            const x = i
            const y = 0;
            const z = -j;

            var cube = createCubeMesh(1 - padding, 1 - padding, 1 - padding)

            cube.rotation.x += toRadians(90);
            cube.position.y -= 1;

            cube.position.x = x
            cube.position.z = z

            cubes[i][j] = cube;
            group.add(cubes[i][j])
        }
    }

    scene.add(group)

    // var magicAngle = toRadians(54.735);

    // group.rotateOnAxis(rotationVectorX, magicAngle);
    // group.rotateOnAxis(rotationVectorY, toRadians(45));

    // cameraPadding = 15 - zoom;

    // camera = new THREE.OrthographicCamera(-blocks.width - cameraPadding, blocks.width + cameraPadding, blocks.height + cameraPadding, -blocks.height - cameraPadding, -blocks.height, blocks.height);
    // frustumSize = blocks.width * 2;
    // camera = new THREE.OrthographicCamera(frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, -blocks.height, blocks.height);
    // camera.position.x = blocks.width / 2;
    // camera.position.y = blocks.height / 4;

    controls.target.set(blocks.width / 2, 0, - blocks.width / 2);
    let furthestCubeVector = new THREE.Vector3(0, -1, 0);
    maxDistance = furthestCubeVector.distanceTo(centerPoint);
}


window.onresize = () => {
    // var aspect = window.innerWidth / window.innerHeight;

    // camera.left = frustumSize * aspect / - 2;
    // camera.right = frustumSize * aspect / 2;
    // camera.top = frustumSize / 2;
    // camera.bottom = - frustumSize / 2;

    
    aspect = window.innerWidth / window.innerHeight;
    
    camera.aspect = aspect;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.wallpaperPropertyListener = {
    applyUserProperties: function (properties) {
        if (properties.cube_depth) {
            if (properties.cube_depth.value !== "") {
                blocks.width = properties.cube_depth.value;
                blocks.height = properties.cube_depth.value;
                reconstruct()
            }
        }
        if (properties.speed) {
            if (properties.speed.value !== "") {
                speed = properties.speed.value
            }
        }
        if (properties.zoom) {
            if (properties.zoom.value !== "") {
                zoom = properties.zoom.value
                reconstruct()
            }
        }
    }
}

const canvas = document.querySelector('#canvas-1');
const renderer = new THREE.WebGLRenderer({ canvas });
const blocks = { width: 16, height: 16 }

const fov = 75;
let aspect = window.innerWidth / window.innerHeight;
// const aspect = 2;  // the canvas default
const near = 0.1;
const far = maxDistance;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

camera.position.z = blocks.width * 0.725;
camera.position.y = 10;

const scene = new THREE.Scene();
const group = new THREE.Group();

// var frustumSize = 20;

// const baseHex =  0x03bb85;
// const targetHex =  0xec33a3;
let targetHex = 0x00f0ff;
let baseHex = 0xffff44
let baseColor = new THREE.Color(baseHex)
let storedBaseColor = new THREE.Color(baseColor.getHex())
let targetColor = new THREE.Color(targetHex)
let storedTargetColor = new THREE.Color(targetHex)
let nextColor = new THREE.Color();
nextColor.r = 0.5 + (Math.random() / 2)
nextColor.g = 0.5 + (Math.random() / 2)
nextColor.b = 0.5 + (Math.random() / 2)
// const targetColor = new THREE.Color( 0x44ff44 )

const controls = new OrbitControls(camera, canvas);
controls.autoRotate = true;
controls.autoRotateSpeed = 1;

controls.target.set(blocks.width / 2, 0, - blocks.width / 2);
controls.update();

var running = false;
let cubes;
var zoom = 5;
var centerPoint;
let speed = 2;
let maxDistance;
let stiffness = 4;

let cycleColors = true;

function start() {

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // {
    //     const color = 0xFFFFFF;
    //     const intensity = 0.41;
    //     const light = new THREE.AmbientLight(color, intensity);
    //     scene.add(light);
    // }

    // const near = 1;
    // const far = 1.5;
    // const color = 'lightblue';
    // scene.fog = new THREE.Fog(color, near, far);
    // scene.background = new THREE.Color(color);

    // scene.background = new THREE.Color(0xff0000);

    var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    // directionalLight.target = centerPoint
    scene.add(directionalLight);
    directionalLight.position.y += 2

    running = true;
    var clock = new THREE.Clock()
    var deltaTotal = 0;

    let colorChangeInterval = 0;
    let colorChangeIntervalLimit = 8;
    let colorChangeTimeFraction = 0;

    function animate() {
        if (running == true) {
            var deltaTime = clock.getDelta();
            deltaTotal += deltaTime;

            requestAnimationFrame(animate);
            renderer.render(scene, camera);

            controls.update();

            if (cycleColors) {
                colorChangeInterval = colorChangeInterval += (deltaTime * speed)
                if (colorChangeInterval >= colorChangeIntervalLimit) {
                    colorChangeInterval -= colorChangeIntervalLimit;
                    baseColor = storedTargetColor;
                    storedBaseColor = new THREE.Color(baseColor.getHex())
                    targetColor = nextColor;
                    storedTargetColor = targetColor;
                    nextColor = new THREE.Color(nextColor.getHex());

                    const rgorb = Math.random() * 3;
                    const colorFraction = 0.5 + (Math.random() / 2);
                    if (rgorb < 1) {
                        if (nextColor.b > 0.5) nextColor.r = Math.random()
                        else nextColor.r = colorFraction
                    } else if (rgorb < 2) {
                        if (nextColor.r > 0.5) nextColor.g = Math.random()
                        else nextColor.g = colorFraction
                    } else {
                        if (nextColor.g > 0.5) nextColor.b = Math.random()
                        else nextColor.b = colorFraction
                    }
                    colorChangeTimeFraction = 0
                    colorChangeIntervalLimit = parseInt(Math.random() * 21) + 7;
                }

                colorChangeTimeFraction = colorChangeTimeFraction + ((deltaTime * speed) / colorChangeIntervalLimit);
                const baseColorToLerp = new THREE.Color(storedBaseColor.getHex())
                baseColor = baseColorToLerp.lerp(storedTargetColor, colorChangeTimeFraction)

                const targetColorToLerp = new THREE.Color(storedTargetColor.getHex())
                targetColor = targetColorToLerp.lerp(nextColor, colorChangeTimeFraction)
            }

            for (let y = 0; y < blocks.height; y++) {
                for (let x = 0; x < blocks.width; x++) {
                    let cubePos = cubes[x][y].position;
                    let cubePosVector = new THREE.Vector3(cubePos.x, cubePos.y, cubePos.z);
                    let distanceFromCenter = cubePosVector.distanceTo(centerPoint);

                    const relativeDelta = deltaTotal * -speed;

                    const distanceFraction = map_range(distanceFromCenter * distanceFromCenter * stiffness, 0, maxDistance, -1, 1);
                    const resultFraction = Math.sin(distanceFraction + relativeDelta);
                    
                    const minHeight = 2;
                    const maxHeight = 10;
                    
                    const result = map_range(resultFraction, -1, 1, minHeight, maxHeight)
                    cubes[x][y].scale.z = result;

                    if (cycleColors) {
                        const newColor = new THREE.Color(baseColor.getHex())
                        const absFraction =  Math.sin(distanceFraction + relativeDelta);
                        cubes[x][y].material.color = newColor.lerp(targetColor, absFraction);
                    }
                }
            }
        }
    }
    animate();
    clock.start()
}

var toggleablePanels = document.getElementsByClassName("toggleable");
var cubeDepthSlider = document.getElementById("cube-depth-slider");
var cubeDepthOutput = document.getElementById("cube-depth-output");
cubeDepthOutput.innerHTML = cubeDepthSlider.value;
blocks.width = parseInt(cubeDepthSlider.value);
blocks.height = parseInt(cubeDepthSlider.value);
reconstruct()

cubeDepthSlider.oninput = function () {
    cubeDepthOutput.innerHTML = this.value;
    blocks.width = parseInt(this.value);
    blocks.height = parseInt(this.value);
    debugger
    reconstruct()
}

var speedSlider = document.getElementById("speed-slider");
var speedOutput = document.getElementById("speed-output");
var speedSliderValue = speedSlider.value / 1000;
speedOutput.innerHTML = speedSliderValue;
speed = speedSliderValue;

speedSlider.oninput = function () {
    var value = this.value / 1000;
    speedOutput.innerHTML = value;
    speed = value;
}

var stiffnessSlider = document.getElementById("stiffness-slider");
var stiffnessOutput = document.getElementById("stiffness-output");
var stiffnessSliderValue = stiffnessSlider.value / 1000;
stiffnessOutput.innerHTML = stiffnessSliderValue;
stiffness = 1 / stiffnessSliderValue;

stiffnessSlider.oninput = function () {
    var value = this.value / 1000;
    stiffnessOutput.innerHTML = value;
    stiffness = 1 / value;
}


var cycleColorsCheckbox = document.getElementById("cycle-colors-checkbox");
cycleColors = cycleColorsCheckbox.checked;

cycleColorsCheckbox.onclick = function () {
    cycleColors = cycleColorsCheckbox.checked;
}

var autoRotateCheckbox = document.getElementById("auto-rotate-checkbox");
controls.autoRotate = autoRotateCheckbox.checked;

autoRotateCheckbox.onclick = function () {
    controls.autoRotate = autoRotateCheckbox.checked;
}

var slidersHideTimeout;
var panelVisibleCheckbox = document.getElementById("panel-visible-checkbox");
var panelAlwaysVisible = panelVisibleCheckbox.checked;
if (panelAlwaysVisible) changeToggleablePanels(1);

panelVisibleCheckbox.onclick = function () {
    panelAlwaysVisible = panelVisibleCheckbox.checked;
    if (panelAlwaysVisible) {
        changeToggleablePanels(1);
        clearTimeout(slidersHideTimeout);
    }
}

function changeToggleablePanels(opacity) {
    var length = toggleablePanels.length;
    for (var i = 0; i < length; i++) {

        toggleablePanels[i].style.opacity = opacity;
    };
}

document.addEventListener("mousemove", function () {
    if (panelAlwaysVisible) return;
    clearTimeout(slidersHideTimeout);
    changeToggleablePanels(1);
    slidersHideTimeout = setTimeout(function () { changeToggleablePanels(0) }, 3500)
})

start()