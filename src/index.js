import * as THREE from './lib/three.js-master/build/three.module';
import { OrbitControls } from './lib/three.js-master/examples/jsm/controls/OrbitControls'

import './lib/jm-controls';
import { toRadians, map_range } from './lib/jm-math';

function createCubeMesh(x, y, z, index) {
    var geometry = new THREE.BoxGeometry(x, y, z);
    var material = new THREE.MeshBasicMaterial({ color: 0x03bb85 + index });
    var cube = new THREE.Mesh(geometry, material);
    return cube;
}

function reconstruct() {
    if (group) {
        group.children.forEach(element => {
            scene.remove(element);
        });
        scene.remove(group);
    }

    cubes = new Array(blocks.width)
    for (var i = 0; i < blocks.width; i++) {
        cubes[i] = new Array(blocks.height)
    }

    var padding = 0.5;
    for (var i = 0; i < blocks.width; i++) {
        for (var j = 0; j < blocks.height; j++) {
            var cube = createCubeMesh(1 - padding, 1 - padding, 1 - padding, (i * blocks.height) + j)
            cube.rotation.x += toRadians(90);
            cube.position.y -= 1;

            cube.position.x = i
            cube.position.z = -j

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

    centerPoint = new THREE.Vector3(blocks.width / 2, -1, -blocks.height / 2);
}


window.onresize = () => {
    // var aspect = window.innerWidth / window.innerHeight;

    // camera.left = frustumSize * aspect / - 2;
    // camera.right = frustumSize * aspect / 2;
    // camera.top = frustumSize / 2;
    // camera.bottom = - frustumSize / 2;

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

const fov = 75;
const aspect = 2;  // the canvas default
const near = 0.1;
const far = 100;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

camera.position.z = 25;

const scene = new THREE.Scene();
const group = new THREE.Group();

const blocks = { width: 16, height: 16 }
// var aspect = window.innerWidth / window.innerHeight;
// var frustumSize = 20;

const controls = new OrbitControls(camera, canvas);

controls.target.set(blocks.width / 2, 0, - blocks.width / 2);
controls.update();

var running = false;
let cubes;
var zoom = 5;
var cameraPadding = 10;
var centerPoint;
var speed = 2;

function start() {

    reconstruct();

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    var directionalLights = [new THREE.DirectionalLight(0xffffff, 0.5), new THREE.DirectionalLight(0xffffff, 0.5), new THREE.DirectionalLight(0xffffff, 0.5)];
    scene.add(directionalLights[0]);

    directionalLights[0].position.y += 2

    running = true;
    var clock = new THREE.Clock()
    var deltaTotal = 0;

    function animate() {
        if (running == true) {
            var deltaTime = clock.getDelta();
            deltaTotal += deltaTime;

            requestAnimationFrame(animate);
            renderer.render(scene, camera);

            for (let y = 0; y < blocks.height; y++) {
                for (let x = 0; x < blocks.width; x++) {
                    let cubePos = cubes[x][y].position;
                    let cubePosVector = new THREE.Vector3(cubePos.x, cubePos.y, cubePos.z);
                    let distanceFromCenter = cubePosVector.distanceTo(centerPoint);

                    let delta = Math.sin(deltaTotal / 20);
                    let differenceDelta = map_range(delta, -1, 1, 2, 7)

                    let distanceRemapped = map_range(distanceFromCenter, 0, 20, -differenceDelta, differenceDelta)

                    let sin = Math.sin((deltaTotal * -1 * speed) + distanceRemapped);
                    let size = map_range(sin, -1, 1, 10, 30)

                    cubes[x][y].scale.z = size;
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

var speedSlider = document.getElementById("speed-slider");
var speedOutput = document.getElementById("speed-output");
var speedSliderValue = speedSlider.value / 1000;
speedOutput.innerHTML = speedSliderValue;
speed = speedSliderValue;

cubeDepthSlider.oninput = function () {
    cubeDepthOutput.innerHTML = this.value;
    blocks.width = parseInt(this.value);
    blocks.height = parseInt(this.value);
    reconstruct()
}

speedSlider.oninput = function () {
    var value = this.value / 1000;
    speedOutput.innerHTML = value;
    speed = value;
}

function changeToggleablePanels(opacity) {
    var length = toggleablePanels.length;
    for (var i = 0; i < length; i++) {

        toggleablePanels[i].style.opacity = opacity;
    };
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

document.addEventListener("mousemove", function () {
    if (panelAlwaysVisible) return;
    clearTimeout(slidersHideTimeout);
    changeToggleablePanels(1);
    slidersHideTimeout = setTimeout(function () { changeToggleablePanels(0) }, 3500)
})

start()