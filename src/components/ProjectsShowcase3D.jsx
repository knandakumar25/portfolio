import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const FEATURED_3D_PROJECTS = [
  {
    id: 'cargo',
    name: 'Cargo Router Microservice',
    type: 'Distributed System',
    color: 0x38bdf8,
    metrics: 'Kafka 4.2 • O(k log k) Min-Heap • Virtual Threads',
    shape: 'network'
  },
  {
    id: 'connect4',
    name: 'Connect 4 AI Opponent',
    type: 'Decision Algorithms',
    color: 0xa855f7,
    metrics: 'Minimax • Alpha-Beta Pruning • Java',
    shape: 'grid'
  },
  {
    id: 'smarthome',
    name: 'SmartHome Gesture Control',
    type: 'Computer Vision & ML',
    color: 0x34d399,
    metrics: 'TensorFlow • Flask • Android Studio',
    shape: 'ring'
  },
  {
    id: 'wolfcafe',
    name: 'WolfCafe Platform',
    type: 'Full-Stack Architecture',
    color: 0xf59e0b,
    metrics: 'Spring Boot • Hibernate • React • MySQL',
    shape: 'tower'
  }
];

const ProjectsShowcase3D = ({ onSelectProject }) => {
  const mountRef = useRef(null);
  const [selectedIdx, setSelectedIdx] = useState(0);

  const sceneRef = useRef(null);
  const groupRef = useRef(null);
  const targetColorRef = useRef(new THREE.Color(FEATURED_3D_PROJECTS[0].color));

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    currentMount.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2);
    dirLight.position.set(5, 5, 8);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(FEATURED_3D_PROJECTS[0].color, 3, 15);
    pointLight.position.set(0, 0, 3);
    scene.add(pointLight);

    // Object Group
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    groupRef.current = modelGroup;

    // Helper to build 3D geometry based on selected shape
    const buildGeometry = (idx) => {
      // Clear previous children
      while (modelGroup.children.length > 0) {
        const obj = modelGroup.children[0];
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
          else obj.material.dispose();
        }
        modelGroup.remove(obj);
      }

      const p = FEATURED_3D_PROJECTS[idx];
      targetColorRef.current = new THREE.Color(p.color);
      pointLight.color.set(p.color);

      if (p.shape === 'network') {
        // Cargo Router: Central hub with orbiting waypoint nodes and data lines
        const hubGeo = new THREE.DodecahedronGeometry(0.85);
        const hubMat = new THREE.MeshStandardMaterial({
          color: p.color,
          roughness: 0.2,
          metalness: 0.8,
          wireframe: false
        });
        const hub = new THREE.Mesh(hubGeo, hubMat);
        modelGroup.add(hub);

        // Surrounding Waypoint Satellites

        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2;
          const nodeGeo = new THREE.SphereGeometry(0.2, 16, 16);
          const nodeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: p.color, emissiveIntensity: 0.6 });
          const node = new THREE.Mesh(nodeGeo, nodeMat);
          node.position.set(Math.cos(angle) * 2, Math.sin(angle) * 0.7, Math.sin(angle) * 2);
          modelGroup.add(node);
        }
      } else if (p.shape === 'grid') {
        // Connect 4 AI: Suspended isometric lattice with glowing heuristic tokens
        const gridGroup = new THREE.Group();
        for (let x = -1.2; x <= 1.2; x += 0.8) {
          for (let y = -1.2; y <= 1.2; y += 0.8) {
            const cubeGeo = new THREE.BoxGeometry(0.4, 0.4, 0.4);
            const isToken = (Math.abs(x) + Math.abs(y)) > 1.2;
            const cubeMat = new THREE.MeshStandardMaterial({
              color: isToken ? p.color : 0x1e293b,
              emissive: isToken ? p.color : 0x0f172a,
              emissiveIntensity: isToken ? 0.8 : 0.1,
              wireframe: !isToken
            });
            const cube = new THREE.Mesh(cubeGeo, cubeMat);
            cube.position.set(x, y, 0);
            gridGroup.add(cube);
          }
        }
        modelGroup.add(gridGroup);
      } else if (p.shape === 'ring') {
        // SmartHome Gesture: Torus knot sensor with scanning laser ring
        const torusGeo = new THREE.TorusKnotGeometry(0.9, 0.25, 64, 16);
        const torusMat = new THREE.MeshStandardMaterial({
          color: p.color,
          roughness: 0.3,
          metalness: 0.7,
          wireframe: true
        });
        const torus = new THREE.Mesh(torusGeo, torusMat);
        modelGroup.add(torus);
      } else {
        // WolfCafe: Stacked architectural cylinders / microservices layer
        for (let l = 0; l < 4; l++) {
          const layerGeo = new THREE.CylinderGeometry(1.4 - l * 0.2, 1.4 - l * 0.2, 0.25, 24);
          const layerMat = new THREE.MeshStandardMaterial({
            color: l === 0 ? p.color : 0x334155,
            wireframe: l % 2 === 1,
            roughness: 0.3,
            metalness: 0.6
          });
          const layer = new THREE.Mesh(layerGeo, layerMat);
          layer.position.y = (l - 1.5) * 0.5;
          modelGroup.add(layer);
        }
      }
    };

    buildGeometry(selectedIdx);

    // Mouse tracking for parallax tilt
    let mouseX = 0;
    let mouseY = 0;
    const handlePointerMove = (e) => {
      const rect = currentMount.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    currentMount.addEventListener('pointermove', handlePointerMove);

    // Animation Loop
    let animationFrameId;
    let timer = new THREE.Timer();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      timer.update();
      const elapsed = timer.getElapsed();

      // Smooth rotation
      modelGroup.rotation.y += 0.012;
      modelGroup.rotation.x = Math.sin(elapsed * 0.7) * 0.15 + mouseY * 0.3;
      modelGroup.rotation.z = Math.cos(elapsed * 0.5) * 0.08 + mouseX * 0.2;

      renderer.render(scene, camera);
    };

    animate();

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newW, height: newH } = entry.contentRect;
        if (newW > 0 && newH > 0) {
          camera.aspect = newW / newH;
          camera.updateProjectionMatrix();
          renderer.setSize(newW, newH);
        }
      }
    });
    resizeObserver.observe(currentMount);

    return () => {
      cancelAnimationFrame(animationFrameId);
      currentMount.removeEventListener('pointermove', handlePointerMove);
      resizeObserver.disconnect();
      timer.dispose();
      renderer.dispose();
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
    };
  }, [selectedIdx]);

  const activeProject = FEATURED_3D_PROJECTS[selectedIdx];

  return (
    <div className="projects-3d-showcase-card">
      <div className="showcase-3d-canvas-wrap" ref={mountRef} />

      <div className="showcase-3d-overlay">
        <div className="showcase-3d-meta">
          <span className="showcase-pill font-mono" style={{ color: `#${activeProject.color.toString(16).padStart(6, '0')}`, borderColor: `#${activeProject.color.toString(16).padStart(6, '0')}44` }}>
            <i className="bi bi-box me-1"></i> 3D Architecture Hologram
          </span>
          <h3 className="showcase-title">{activeProject.name}</h3>
          <p className="showcase-metrics font-mono">{activeProject.metrics}</p>
        </div>

        <div className="showcase-selector-buttons">
          {FEATURED_3D_PROJECTS.map((proj, idx) => (
            <button
              key={proj.id}
              className={`showcase-select-btn ${idx === selectedIdx ? 'active' : ''}`}
              onClick={() => {
                setSelectedIdx(idx);
                if (onSelectProject) onSelectProject(proj.name);
              }}
            >
              <span className="dot" style={{ background: `#${proj.color.toString(16).padStart(6, '0')}` }} />
              {proj.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsShowcase3D;
