import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';

// Defining our architecture nodes representing Karthik's core domains
const ARCHITECTURE_NODES = [
  {
    id: 'distributed',
    label: 'Distributed Systems',
    tag: 'Kafka 4.2 • JDK Threads • Microservices',
    color: 0x38bdf8, // Sky cyan
    pos: [0, 1.4, 0],
    size: 0.32,
    details: 'Event-driven cargo routing, asynchronous pipelines & fault-tolerant design'
  },
  {
    id: 'fullstack',
    label: 'Full-Stack Engineering',
    tag: 'Spring Boot • React • Node • SQL',
    color: 0x818cf8, // Indigo
    pos: [-1.6, 0.4, 0.6],
    size: 0.28,
    details: 'RESTful architectures, WolfCafe platform, enterprise banking systems'
  },
  {
    id: 'ml_ai',
    label: 'Machine Learning & AI',
    tag: 'TensorFlow • Flask • Minimax Algorithms',
    color: 0xa855f7, // Purple
    pos: [1.6, 0.5, 0.4],
    size: 0.28,
    details: 'Gesture control CNNs, Minimax alpha-beta pruning, predictive models'
  },
  {
    id: 'algorithms',
    label: 'Algorithmic Optimization',
    tag: 'O(k log k) Min-Heap • High-Throughput',
    color: 0x34d399, // Emerald
    pos: [-1.2, -1.2, -0.4],
    size: 0.26,
    details: 'Path optimization, dynamic weighting, space-time efficiency'
  },
  {
    id: 'enterprise',
    label: 'Enterprise Infrastructure',
    tag: 'SunTec Banking • LlamaPress AI • Docker',
    color: 0xf59e0b, // Amber
    pos: [1.2, -1.1, -0.3],
    size: 0.26,
    details: 'JBoss/WebSphere, enterprise invoice generation & vulnerability remediation'
  },
  {
    id: 'interactive',
    label: 'Interactive Tech & Game Dev',
    tag: 'Godot • Narrative Systems • 7+ Releases',
    color: 0xec4899, // Pink
    pos: [0, -0.2, 1.5],
    size: 0.26,
    details: 'Dialogue branching, interactive state machines, procedural mechanics'
  }
];

const DistributedMatrix3D = ({ onNodeSelect }) => {
  const mountRef = useRef(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [activeNode, setActiveNode] = useState(null);
  const [isInteracting, setIsInteracting] = useState(false);

  // Keep references for animation loop
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const nodeMeshesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const rotationGroupRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    // 1. Scene & Camera setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.5);
    cameraRef.current = camera;

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    currentMount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xb4c5ff, 2.5);
    dirLight1.position.set(5, 5, 5);
    scene.add(dirLight1);

    const pointLight = new THREE.PointLight(0x38bdf8, 3, 10);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    // 4. Main rotating group
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);
    rotationGroupRef.current = mainGroup;

    // 5. Central glowing computing core (Wireframe Icosahedron + Inner Core)
    const coreGeo = new THREE.IcosahedronGeometry(0.55, 1);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x2563eb,
      wireframe: true,
      emissive: 0x1d4ed8,
      emissiveIntensity: 0.7,
      transparent: true,
      opacity: 0.6
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    mainGroup.add(coreMesh);

    const innerCoreGeo = new THREE.SphereGeometry(0.32, 16, 16);
    const innerCoreMat = new THREE.MeshBasicMaterial({
      color: 0x60a5fa,
      wireframe: false,
      transparent: true,
      opacity: 0.4
    });
    const innerCore = new THREE.Mesh(innerCoreGeo, innerCoreMat);
    mainGroup.add(innerCore);

    // 6. Create Architecture Nodes
    const nodeMeshes = [];
    const nodePositions = [];

    ARCHITECTURE_NODES.forEach((node) => {
      const nodeGroup = new THREE.Group();
      nodeGroup.position.set(...node.pos);

      // Node Sphere (solid)
      const sphereGeo = new THREE.SphereGeometry(node.size, 24, 24);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: node.color,
        emissive: node.color,
        emissiveIntensity: 0.4,
        roughness: 0.2,
        metalness: 0.8
      });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      nodeGroup.add(sphere);

      // Outer Pulse Ring
      const ringGeo = new THREE.RingGeometry(node.size * 1.25, node.size * 1.4, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: node.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      nodeGroup.add(ring);

      // Save custom data
      nodeGroup.userData = {
        nodeData: node,
        sphere,
        ring,
        initialScale: 1
      };

      mainGroup.add(nodeGroup);
      nodeMeshes.push(nodeGroup);
      nodePositions.push(new THREE.Vector3(...node.pos));
    });
    nodeMeshesRef.current = nodeMeshes;

    // 7. Dynamic Data Connection Lines between nodes
    const linesMaterial = new THREE.LineBasicMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending
    });

    // Connect nodes to center and to nearest neighbors
    const linePositions = [];
    const centerVec = new THREE.Vector3(0, 0, 0);

    nodePositions.forEach((posA, i) => {
      // Connect each node to central computing core
      linePositions.push(centerVec.x, centerVec.y, centerVec.z);
      linePositions.push(posA.x, posA.y, posA.z);

      // Connect each node to adjacent neighbors
      for (let j = i + 1; j < nodePositions.length; j++) {
        const posB = nodePositions[j];
        if (posA.distanceTo(posB) < 3.2) {
          linePositions.push(posA.x, posA.y, posA.z);
          linePositions.push(posB.x, posB.y, posB.z);
        }
      }
    });

    const linesGeometry = new THREE.BufferGeometry();
    linesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    const linesMesh = new THREE.LineSegments(linesGeometry, linesMaterial);
    mainGroup.add(linesMesh);

    // 8. Flowing Data Particles traveling through connections
    const particleCount = 120;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities = [];

    for (let i = 0; i < particleCount; i++) {
      // Random position around the matrix
      const r = 1.2 + Math.random() * 1.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      particlePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = r * Math.cos(phi);

      particleVelocities.push({
        speed: 0.005 + Math.random() * 0.01,
        angle: Math.random() * Math.PI * 2,
        radius: r
      });
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x93c5fd,
      size: 0.04,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    mainGroup.add(particles);

    // 9. Raycasting for Mouse Interaction
    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2();

    const handlePointerMove = (e) => {
      const rect = currentMount.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      mouseVector.x = x;
      mouseVector.y = y;

      mouseRef.current.targetX = x * 0.6;
      mouseRef.current.targetY = y * 0.4;

      // Handle dragging rotation
      if (isDraggingRef.current) {
        const deltaX = e.clientX - previousMousePositionRef.current.x;
        const deltaY = e.clientY - previousMousePositionRef.current.y;
        mainGroup.rotation.y += deltaX * 0.008;
        mainGroup.rotation.x += deltaY * 0.008;
        previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
      }

      // Raycast against node groups
      raycaster.setFromCamera(mouseVector, camera);
      const meshesToTest = nodeMeshes.map(group => group.userData.sphere);
      const intersects = raycaster.intersectObjects(meshesToTest, false);

      if (intersects.length > 0) {
        const intersectedSphere = intersects[0].object;
        const parentGroup = intersectedSphere.parent;
        const nodeData = parentGroup.userData.nodeData;
        setHoveredNode(nodeData);
        currentMount.style.cursor = 'pointer';
      } else {
        setHoveredNode(null);
        currentMount.style.cursor = isDraggingRef.current ? 'grabbing' : 'grab';
      }
    };

    const handlePointerDown = (e) => {
      isDraggingRef.current = true;
      setIsInteracting(true);
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
      setIsInteracting(false);
    };

    const handleClick = () => {
      raycaster.setFromCamera(mouseVector, camera);
      const meshesToTest = nodeMeshes.map(group => group.userData.sphere);
      const intersects = raycaster.intersectObjects(meshesToTest, false);

      if (intersects.length > 0) {
        const nodeData = intersects[0].object.parent.userData.nodeData;
        setActiveNode(nodeData);
        if (onNodeSelect) onNodeSelect(nodeData);
      }
    };

    currentMount.addEventListener('pointermove', handlePointerMove);
    currentMount.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    currentMount.addEventListener('click', handleClick);

    // 10. Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newWidth, height: newHeight } = entry.contentRect;
        if (newWidth > 0 && newHeight > 0) {
          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, newHeight);
        }
      }
    });
    resizeObserver.observe(currentMount);

    // 11. Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Idle auto-rotation (gentler when dragging)
      if (!isDraggingRef.current) {
        mainGroup.rotation.y += 0.0035;
        mainGroup.rotation.x = Math.sin(elapsedTime * 0.5) * 0.08;
      }

      // Smooth camera parallax following mouse
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;
      camera.position.x = mouseRef.current.x * 0.7;
      camera.position.y = mouseRef.current.y * 0.7;
      camera.lookAt(0, 0, 0);

      // Core rotation & pulsing
      coreMesh.rotation.x = elapsedTime * 0.3;
      coreMesh.rotation.y = elapsedTime * 0.4;
      const coreScale = 1 + Math.sin(elapsedTime * 2.5) * 0.06;
      innerCore.scale.set(coreScale, coreScale, coreScale);

      // Node rings rotation & scale hover transitions
      nodeMeshes.forEach((group) => {
        const { ring, sphere, nodeData } = group.userData;
        ring.rotation.z += 0.015;

        const isHovered = hoveredNode && hoveredNode.id === nodeData.id;
        const targetScale = isHovered ? 1.35 : 1;
        sphere.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
        ring.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

        // Make rings always face camera
        ring.quaternion.copy(camera.quaternion);
      });

      // Flow particles along subtle orbits
      const positions = particles.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        const p = particleVelocities[i];
        p.angle += p.speed;
        const idx = i * 3;
        positions[idx] += Math.sin(elapsedTime * 0.8 + i) * 0.002;
        positions[idx + 1] += Math.cos(elapsedTime * 0.8 + i) * 0.002;
      }
      particles.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // 12. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      currentMount.removeEventListener('pointermove', handlePointerMove);
      currentMount.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      currentMount.removeEventListener('click', handleClick);
      resizeObserver.disconnect();

      // Dispose Three.js objects
      coreGeo.dispose();
      coreMat.dispose();
      innerCoreGeo.dispose();
      innerCoreMat.dispose();
      linesGeometry.dispose();
      linesMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();

      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
    };
  }, [hoveredNode, onNodeSelect]);

  return (
    <div className="matrix-3d-wrapper" style={{ position: 'relative', width: '100%', height: '100%', minHeight: '420px' }}>
      {/* Three.js Canvas Mount */}
      <div
        ref={mountRef}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          outline: 'none',
          touchAction: 'none'
        }}
      />

      {/* Floating 2D Tooltip on Node Hover */}
      {hoveredNode && (
        <div
          className="matrix-node-tooltip notranslate"
          style={{
            position: 'absolute',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(11, 19, 38, 0.85)',
            border: `1px solid #${hoveredNode.color.toString(16).padStart(6, '0')}`,
            boxShadow: `0 8px 30px rgba(0, 0, 0, 0.5), 0 0 15px rgba(${hoveredNode.color >> 16}, ${(hoveredNode.color >> 8) & 255}, ${hoveredNode.color & 255}, 0.3)`,
            borderRadius: '12px',
            padding: '12px 18px',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            color: '#fff',
            pointerEvents: 'none',
            zIndex: 10,
            maxWidth: '320px',
            textAlign: 'center',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#93c5fd', fontWeight: 600, marginBottom: '2px' }}>
            Architecture Pillar
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', marginBottom: '4px' }}>
            {hoveredNode.label}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#38bdf8', fontFamily: 'var(--font-mono, monospace)', marginBottom: '6px' }}>
            {hoveredNode.tag}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.4 }}>
            {hoveredNode.details}
          </div>
        </div>
      )}

      {/* Ambient Hint Badge */}
      <div
        className="matrix-hint-badge"
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          fontSize: '0.72rem',
          fontFamily: 'var(--font-mono, monospace)',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '4px 10px',
          borderRadius: '20px',
          color: '#94a3b8',
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 6px #38bdf8' }} />
        3D Matrix • Drag to Orbit
      </div>
    </div>
  );
};

export default DistributedMatrix3D;
