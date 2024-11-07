let scene, camera, renderer, particles, raycaster, mouse;

function init3DBackground() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.insertBefore(renderer.domElement, document.body.firstChild);

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 5000;

    const posArray = new Float32Array(particlesCount * 3);
    const colorArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i += 3) {
        posArray[i] = (Math.random() - 0.5) * 10;
        posArray[i + 1] = (Math.random() - 0.5) * 10;
        posArray[i + 2] = (Math.random() - 0.5) * 10;

        colorArray[i] = 0; // R
        colorArray[i + 1] = Math.random(); // G
        colorArray[i + 2] = Math.random(); // B
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.005,
        vertexColors: true,
    });

    particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    camera.position.z = 2;

    // Raycaster for interactivity
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // Add event listeners
    document.addEventListener('mousemove', onDocumentMouseMove);
    window.addEventListener('resize', onWindowResize);

    animate();
}

function onDocumentMouseMove(event) {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
}

function animate() {
    requestAnimationFrame(animate);

    particles.rotation.x += 0.0005;
    particles.rotation.y += 0.0005;

    // Update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // Calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObject(particles);

    if (intersects.length > 0) {
        const intersectPoint = intersects[0].point;
        const particlesGeometry = particles.geometry;
        const positions = particlesGeometry.attributes.position.array;

        for (let i = 0; i < positions.length; i += 3) {
            const x = positions[i];
            const y = positions[i + 1];
            const z = positions[i + 2];

            const distance = Math.sqrt(
                Math.pow(x - intersectPoint.x, 2) +
                Math.pow(y - intersectPoint.y, 2) +
                Math.pow(z - intersectPoint.z, 2)
            );

            if (distance < 0.1) {
                positions[i] += (Math.random() - 0.5) * 0.01;
                positions[i + 1] += (Math.random() - 0.5) * 0.01;
                positions[i + 2] += (Math.random() - 0.5) * 0.01;
            }
        }

        particlesGeometry.attributes.position.needsUpdate = true;
    }

    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

document.addEventListener('DOMContentLoaded', () => {
    init3DBackground();

    const urlInput = document.getElementById('url-input');
    const detectButton = document.getElementById('detect-button');
    const result = document.getElementById('result');
    const resultText = document.getElementById('result-text');

    detectButton.addEventListener('click', () => {
        const url = urlInput.value.trim();
        if (url === '') {
            alert('Please enter a URL');
            return;
        }

        // Simulate detection process
        result.classList.remove('hidden');
        resultText.textContent = 'Analyzing...';

        setTimeout(() => {
            const randomScore = Math.random();
            let detectionResult;

            if (randomScore > 0.8) {
                detectionResult = 'High risk: This URL might be malicious.';
                resultText.style.color = '#ff4136';
            } else if (randomScore > 0.5) {
                detectionResult = 'Medium risk: Exercise caution when visiting this URL.';
                resultText.style.color = '#ff851b';
            } else {
                detectionResult = 'Low risk: This URL appears to be safe.';
                resultText.style.color = '#2ecc40';
            }

            resultText.textContent = detectionResult;

            // Add animation to the result text
            resultText.style.opacity = '0';
            resultText.style.transform = 'translateY(20px)';
            setTimeout(() => {
                resultText.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                resultText.style.opacity = '1';
                resultText.style.transform = 'translateY(0)';
            }, 50);
        }, 1500);
    });

    // Add animation to the input and button
    urlInput.addEventListener('focus', () => {
        urlInput.style.transform = 'scale(1.05)';
        urlInput.style.transition = 'transform 0.3s ease';
    });

    urlInput.addEventListener('blur', () => {
        urlInput.style.transform = 'scale(1)';
    });

    detectButton.addEventListener('mouseenter', () => {
        detectButton.style.transform = 'scale(1.1)';
        detectButton.style.transition = 'transform 0.3s ease';
    });

    detectButton.addEventListener('mouseleave', () => {
        detectButton.style.transform = 'scale(1)';
    });
});