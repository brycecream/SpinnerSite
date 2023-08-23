const container = document.getElementById('three-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(container.offsetWidth, container.offsetHeight);
renderer.setClearColor(0xffc0cb); // Set background color to pink
container.appendChild(renderer.domElement);

// Adding lighting to the scene
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 1, 1);
scene.add(directionalLight);

const loader = new THREE.GLTFLoader();

const modelUrl = './model for threes/scene.gltf'; // Relative path to the model

// Array to hold the candies
let candies = [];

loader.load(
    modelUrl,
    (gltf) => {
        const originalModel = gltf.scene;

        // Define the number of copies and the spacing between them
        const numberOfCopies = 10;
        const spacing = 5;

        for (let i = 0; i < numberOfCopies; i++) {
            for (let j = 0; j < numberOfCopies; j++) {
                // Clone the original model
                const model = originalModel.clone();

                // Scale down the model
                model.scale.set(0.1, 0.1, 0.1);

                // Set the position for each model
                model.position.set(i * spacing - (spacing * (numberOfCopies - 1)) / 2, j * spacing - (spacing * (numberOfCopies - 1)) / 2, 0);

                // Add the model to the candies array
                candies.push(model);

                // Add the model to the scene
                scene.add(model);
            }
        }

        animate();
    },
    undefined,
    (error) => {
        console.error('Error loading GLTF model:', error);
    }
);

function animateCandies() {
    candies.forEach(candy => {
        candy.position.x += (Math.random() - 0.5) * 0.5; // Random movement in x
        candy.position.y += (Math.random() - 0.5) * 0.5; // Random movement in y
        candy.position.z += (Math.random() - 0.5) * 0.5; // Random movement in z
    });
}

function spinCandies() {
    const spinTime = document.getElementById('spinTimeRange').value * 1000; // Time in milliseconds

    const spinInterval = setInterval(animateCandies, 16); // Update every 16 ms

    setTimeout(() => {
        clearInterval(spinInterval); // Stop the animation after the specified time
    }, spinTime);
}

document.getElementById('spinButton').addEventListener('click', spinCandies);

function animate() {
    requestAnimationFrame(animate);

    // Rotate all models in the scene
    scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
            object.rotation.x += 0.01;
            object.rotation.y += 0.01;
        }
    });

    renderer.render(scene, camera);
}

camera.position.z = 13;

// Handle window resizing
window.addEventListener('resize', () => {
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});










