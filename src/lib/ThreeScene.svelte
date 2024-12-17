<script lang="ts">
    import * as THREE from "three";
    import { onMount } from "svelte";

    let container: HTMLDivElement | null = null;
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let cube: THREE.Mesh;

    const init = () => {
        if (!container) return;

        // Scene
        scene = new THREE.Scene();

        // Camera
        camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.z = 5;

        // Renderer
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

        // Cube
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color: 0x00ffff });
        cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        // Handle window resize
        window.addEventListener("resize", onWindowResize);
    };

    const onWindowResize = () => {
        if (!container) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    };

    const animate = () => {
        requestAnimationFrame(animate);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);
    };

    onMount(() => {
        init();
        animate();
        return () => {
            window.removeEventListener("resize", onWindowResize);
            renderer.dispose();
        };
    });
</script>

<div bind:this={container}></div>

<style>
    div {
        width: 500px;
        height: 300px;
    }
</style>
