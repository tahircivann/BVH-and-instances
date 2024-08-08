import * as THREE from 'three';
import { MeshBVH, acceleratedRaycast } from 'three-mesh-bvh';
import Stats from 'stats.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Enable BVH raycasting
THREE.Mesh.prototype.raycast = acceleratedRaycast;

// Create the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;

// Initialize stats.js for FPS
const stats = new Stats();
stats.showPanel(0); // 0: fps
document.body.appendChild(stats.dom);

// Custom stats panel for rendering information
const customStats = {
    vertices: 0,
    triangles: 0,
    geometries: 0,
    textures: 0,
    drawCalls: 0,
    programs: 0,
    memory: {
        geometries: 0,
        textures: 0,
    },
};

const rightSidebar = document.createElement('div');
rightSidebar.style.position = 'fixed';
rightSidebar.style.top = '0';
rightSidebar.style.right = '0';
rightSidebar.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
rightSidebar.style.color = 'white';
rightSidebar.style.padding = '10px';
rightSidebar.style.zIndex = '10000';
document.body.appendChild(rightSidebar);

function updateCustomStats() {
    // Calculate total vertices from all meshes in the scene
    let totalVertices = 0;
    scene.traverse((object) => {
        if (object.isMesh) {
            const geometry = object.geometry;
            totalVertices += geometry.attributes.position.count;
        }
    });

    customStats.vertices = totalVertices;

    const info = renderer.info;
    customStats.triangles = info.render.triangles;
    customStats.geometries = info.memory.geometries;
    customStats.textures = info.memory.textures;
    customStats.drawCalls = info.render.calls;
    customStats.programs = info.programs ? info.programs.length : 0;
    customStats.memory.geometries = info.memory.geometries;
    customStats.memory.textures = info.memory.textures;

    rightSidebar.innerHTML = `
        <strong>Custom Stats</strong><br>
        Vertices: ${customStats.vertices}<br>
        Triangles: ${customStats.triangles}<br>
        Geometries: ${customStats.geometries}<br>
        Textures: ${customStats.textures}<br>
        Draw Calls: ${customStats.drawCalls}<br>
        Programs: ${customStats.programs}<br>
        Memory - Geometries: ${customStats.memory.geometries}<br>
        Memory - Textures: ${customStats.memory.textures}
    `;
}

// Create a geometry and material
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

// Create instanced meshes
const instances = new THREE.InstancedMesh(boxGeometry, material, 10000);
scene.add(instances);
console.log(scene);

// Position the instances randomly and assign unique names
const instanceData = [];
for (let i = 0; i < instances.count; i++) {
    const matrix = new THREE.Matrix4();
    const position = new THREE.Vector3(
        Math.random() * 100 - 50,
        Math.random() * 100 - 50,
        Math.random() * 100 - 50
    );
    matrix.setPosition(position);
    instances.setMatrixAt(i, matrix);
    
    // Store instance data
    instanceData.push({ id: i, name: `Instance_${i}`, position });
}

// Update the instance matrix
instances.instanceMatrix.needsUpdate = true;

// Build the BVH
const bvh = new MeshBVH(instances.geometry);
instances.geometry.boundsTree = bvh;

// Create a box that follows the pointer
const pointerBoxGeometry = new THREE.BoxGeometry(1, 1, 1);
const pointerBoxMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
const pointerBox = new THREE.Mesh(pointerBoxGeometry, pointerBoxMaterial);
scene.add(pointerBox);

camera.position.z = 50;

let lastIntersectedInstance = null;

function animate() {
    stats.begin();

    // Update custom stats
    updateCustomStats();

    // Render the scene
    renderer.render(scene, camera);

    stats.end();

    requestAnimationFrame(animate);
}

animate();

// Pointer move event
document.addEventListener('mousemove', (event) => {
    const rect = renderer.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2(
        (event.clientX - rect.left) / rect.width * 2 - 1,
        - (event.clientY - rect.top) / rect.height * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    const intersect = raycaster.intersectObject(instances);

    if (intersect.length > 0) {
        const point = intersect[0].point;
        pointerBox.position.copy(point);
    }
});

// Check for intersections
function checkIntersection() {
    const raycaster = new THREE.Raycaster();
    const pointerBoxCenter = pointerBox.position.clone();
    raycaster.set(pointerBoxCenter, new THREE.Vector3(0, 0, -1)); // Direction can be adjusted as needed

    const intersects = raycaster.intersectObject(instances, true);

    if (intersects.length > 0) {
        const instanceId = intersects[0].instanceId;
        if (instanceId !== undefined) {
            const instance = instanceData[instanceId];
            if (lastIntersectedInstance !== instance.name) {
                console.log(`Intersected with: ${instance.name}`);
                lastIntersectedInstance = instance.name;
            }
        }
    } else {
        lastIntersectedInstance = null;
    }
}

// Run intersection check periodically
setInterval(checkIntersection, 100);