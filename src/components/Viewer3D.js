import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * COMPONENTE VIEWER3D
 * ===================
 * 
 * Visualizza lo spazio 3D con i tre piani di proiezione del metodo di Monge.
 * Permette l'interazione: rotazione con mouse, zoom con rotellina.
 * 
 * Gli elementi visualizzati:
 * - Piano Orizzontale (PO) - XY, z=0
 * - Piano Verticale (PV) - XZ, y=0
 * - Piano Laterale (PL) - YZ, x=0
 * - Assi coordinati X (rosso), Y (verde), Z (blu)
 * - Linea di Terra (LT) - intersezione tra PO e PV
 * - Punti inseriti dall'utente
 */

const Viewer3D = ({ points = [] }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const pointsGroupRef = useRef(new THREE.Group());

  useEffect(() => {
    if (!mountRef.current) return;

    // ========== INIZIALIZZAZIONE SCENE ==========
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);
    sceneRef.current = scene;

    // ========== CAMERA ==========
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(15, 15, 15);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // ========== RENDERER ==========
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // ========== LUCI ==========
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 10);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // ========== ASSI COORDINATI ==========
    const axesHelper = new THREE.AxesHelper(10);
    scene.add(axesHelper);

    // ========== PIANO ORIZZONTALE (PO) - XY, z=0 ==========
    const poGeometry = new THREE.PlaneGeometry(20, 20);
    const poMaterial = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      side: THREE.DoubleSide,
      wireframe: false,
      transparent: true,
      opacity: 0.3
    });
    const poMesh = new THREE.Mesh(poGeometry, poMaterial);
    poMesh.rotation.x = 0;
    poMesh.receiveShadow = true;
    scene.add(poMesh);

    // Griglia sul PO
    const poGridHelper = new THREE.GridHelper(20, 20, 0xdddddd, 0xeeeeee);
    poGridHelper.position.z = 0.01;
    scene.add(poGridHelper);

    // ========== PIANO VERTICALE (PV) - XZ, y=0 ==========
    const pvGeometry = new THREE.PlaneGeometry(20, 20);
    const pvMaterial = new THREE.MeshStandardMaterial({
      color: 0xccccdd,
      side: THREE.DoubleSide,
      wireframe: false,
      transparent: true,
      opacity: 0.2
    });
    const pvMesh = new THREE.Mesh(pvGeometry, pvMaterial);
    pvMesh.rotation.y = Math.PI / 2;
    pvMesh.position.y = 0;
    pvMesh.receiveShadow = true;
    scene.add(pvMesh);

    // ========== PIANO LATERALE (PL) - YZ, x=0 ==========
    const plGeometry = new THREE.PlaneGeometry(20, 20);
    const plMaterial = new THREE.MeshStandardMaterial({
      color: 0xddcccc,
      side: THREE.DoubleSide,
      wireframe: false,
      transparent: true,
      opacity: 0.2
    });
    const plMesh = new THREE.Mesh(plGeometry, plMaterial);
    plMesh.rotation.y = Math.PI / 2;
    plMesh.position.x = 0;
    plMesh.receiveShadow = true;
    scene.add(plMesh);

    // ========== LINEA DI TERRA (LT) ==========
    // Intersezione tra PO (z=0) e PV (y=0)
    const ltGeometry = new THREE.BufferGeometry();
    const ltPoints = [
      new THREE.Vector3(-10, 0, 0),
      new THREE.Vector3(10, 0, 0)
    ];
    ltGeometry.setFromPoints(ltPoints);
    const ltMaterial = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 3 });
    const ltLine = new THREE.Line(ltGeometry, ltMaterial);
    scene.add(ltLine);

    // ========== GRUPPO PER I PUNTI UTENTE ==========
    scene.add(pointsGroupRef.current);

    // ========== CONTROLLI (MOUSE) ==========
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;

        // Rotazione della camera attorno al punto centrale
        const radius = camera.position.length();
        const theta = Math.atan2(camera.position.z, camera.position.x) + deltaX * 0.005;
        const phi = Math.acos(camera.position.y / radius) + deltaY * 0.005;

        const clampedPhi = Math.max(0.1, Math.min(Math.PI - 0.1, phi));

        camera.position.x = radius * Math.sin(clampedPhi) * Math.cos(theta);
        camera.position.y = radius * Math.cos(clampedPhi);
        camera.position.z = radius * Math.sin(clampedPhi) * Math.sin(theta);
        camera.lookAt(0, 0, 0);
      }
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e) => {
      e.preventDefault();
      const direction = camera.position.clone().normalize();
      const currentDistance = camera.position.length();
      const newDistance = Math.max(5, Math.min(50, currentDistance + e.deltaY * 0.01));
      camera.position.copy(direction.multiplyScalar(newDistance));
    };

    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('wheel', onWheel, { passive: false });

    // ========== AGGIORNA PUNTI ==========
    const updatePoints = () => {
      // Rimuovi tutti i punti precedenti
      pointsGroupRef.current.children.forEach(child => {
        pointsGroupRef.current.remove(child);
      });

      // Aggiungi i nuovi punti
      points.forEach((point, index) => {
        // Sfera al punto nello spazio
        const geometry = new THREE.SphereGeometry(0.3, 32, 32);
        const material = new THREE.MeshStandardMaterial({
          color: 0xff6b6b,
          metalness: 0.3,
          roughness: 0.4
        });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(point.x, point.y, point.z);
        sphere.castShadow = true;
        sphere.receiveShadow = true;
        pointsGroupRef.current.add(sphere);

        // Etichetta del punto
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const context = canvas.getContext('2d');
        context.fillStyle = '#ff6b6b';
        context.font = 'bold 60px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(`P${index + 1}`, 128, 128);

        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(2, 2, 1);
        sprite.position.set(point.x + 1, point.y + 1, point.z + 1);
        pointsGroupRef.current.add(sprite);

        // Linea di collegamento al PO
        const lineGeometry = new THREE.BufferGeometry();
        const linePoints = [
          new THREE.Vector3(point.x, point.y, point.z),
          new THREE.Vector3(point.x, point.y, 0)
        ];
        lineGeometry.setFromPoints(linePoints);
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffaaaa, linewidth: 1 });
        const line = new THREE.Line(lineGeometry, lineMaterial);
        pointsGroupRef.current.add(line);

        // Punto proiettato su PO
        const projGeometry = new THREE.SphereGeometry(0.2, 16, 16);
        const projMaterial = new THREE.MeshStandardMaterial({
          color: 0xffcccc,
          transparent: true,
          opacity: 0.6
        });
        const projSphere = new THREE.Mesh(projGeometry, projMaterial);
        projSphere.position.set(point.x, point.y, 0);
        pointsGroupRef.current.add(projSphere);
      });
    };

    updatePoints();

    // ========== ANIMATION LOOP ==========
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // ========== HANDLE RESIZE ==========
    const handleResize = () => {
      if (!mountRef.current) return;
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // ========== CLEANUP ==========
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('mouseup', onMouseUp);
      renderer.domElement.removeEventListener('wheel', onWheel);
      mountRef.current?.removeChild(renderer.domElement);
      geometry.dispose();
      poMaterial.dispose();
      pvMaterial.dispose();
      plMaterial.dispose();
      ltMaterial.dispose();
      renderer.dispose();
    };
  }, [points]);

  return (
    <div
      ref={mountRef}
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#f5f5f5'
      }}
    />
  );
};

export default Viewer3D;
