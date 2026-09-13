import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export function ThreeDWebcam() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    // Check reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    const handleMotionChange = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleMotionChange);

    const container = containerRef.current;
    if (!container) return;

    // Check WebGL availability
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
        return;
      }
    } catch {
      setHasWebGL(false);
      return;
    }

    // 1. Scene setup
    const scene = new THREE.Scene();

    const width = container.clientWidth || 460;
    const height = container.clientHeight || 460;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.5);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    container.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x38bdf8, 3.5);
    keyLight.position.set(4, 5, 6);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x06b6d4, 2.5);
    rimLight.position.set(-5, -3, -4);
    scene.add(rimLight);

    const pointLight = new THREE.PointLight(0x22d3ee, 4, 10);
    pointLight.position.set(0, 0, 2);
    scene.add(pointLight);

    // 3. Construct Futuristic Camera Lens Device
    const webcamGroup = new THREE.Group();
    scene.add(webcamGroup);

    // Main Outer Metallic Barrel
    const barrelGeo = new THREE.CylinderGeometry(2.0, 2.1, 1.4, 48);
    barrelGeo.rotateX(Math.PI / 2);
    const metallicMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.88,
      roughness: 0.22,
    });
    const barrel = new THREE.Mesh(barrelGeo, metallicMat);
    webcamGroup.add(barrel);

    // Accent Bezel Ring (Dark Titanium)
    const bezelGeo = new THREE.TorusGeometry(2.1, 0.08, 16, 64);
    const bezelMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.95,
      roughness: 0.15,
    });
    const bezel = new THREE.Mesh(bezelGeo, bezelMat);
    bezel.position.z = 0.65;
    webcamGroup.add(bezel);

    // Cyan Emissive Status Ring
    const ledRingGeo = new THREE.TorusGeometry(1.85, 0.04, 16, 64);
    const ledMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x06b6d4,
      emissiveIntensity: 2.5,
      roughness: 0.1,
    });
    const ledRing = new THREE.Mesh(ledRingGeo, ledMat);
    ledRing.position.z = 0.69;
    webcamGroup.add(ledRing);

    // Inner Stepped Lens Housing
    const innerHousingGeo = new THREE.CylinderGeometry(1.65, 1.8, 0.8, 48);
    innerHousingGeo.rotateX(Math.PI / 2);
    const innerHousingMat = new THREE.MeshStandardMaterial({
      color: 0x020617,
      metalness: 0.7,
      roughness: 0.35,
    });
    const innerHousing = new THREE.Mesh(innerHousingGeo, innerHousingMat);
    innerHousing.position.z = 0.35;
    webcamGroup.add(innerHousing);

    // Rotating Optical Iris / Aperture Ring
    const irisGroup = new THREE.Group();
    irisGroup.position.z = 0.55;
    const apertureBladesCount = 8;
    for (let i = 0; i < apertureBladesCount; i++) {
      const angle = (i / apertureBladesCount) * Math.PI * 2;
      const bladeGeo = new THREE.BoxGeometry(0.5, 0.08, 0.02);
      const bladeMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        metalness: 0.8,
        roughness: 0.3,
      });
      const blade = new THREE.Mesh(bladeGeo, bladeMat);
      blade.position.set(Math.cos(angle) * 0.9, Math.sin(angle) * 0.9, 0);
      blade.rotation.z = angle + 0.4;
      irisGroup.add(blade);
    }
    webcamGroup.add(irisGroup);

    // Glass Lens Front Convex Dome
    const lensGeo = new THREE.SphereGeometry(1.4, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.35);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x0284c7,
      transmission: 0.75,
      opacity: 0.9,
      transparent: true,
      roughness: 0.05,
      ior: 1.52,
      metalness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });
    const lens = new THREE.Mesh(lensGeo, glassMat);
    lens.position.z = 0.3;
    webcamGroup.add(lens);

    // Core Camera Sensor Glow (deep inside lens)
    const sensorGeo = new THREE.CircleGeometry(0.5, 32);
    const sensorMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.85,
    });
    const sensor = new THREE.Mesh(sensorGeo, sensorMat);
    sensor.position.z = 0.2;
    webcamGroup.add(sensor);

    // Thin Orbiting Gyro Ring 1
    const ring1Geo = new THREE.TorusGeometry(2.9, 0.02, 12, 80);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.45,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ringMat);
    ring1.rotation.x = Math.PI / 4;
    webcamGroup.add(ring1);

    // Thin Orbiting Gyro Ring 2
    const ring2Geo = new THREE.TorusGeometry(3.3, 0.015, 12, 80);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.35,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ringMat2);
    ring2.rotation.y = Math.PI / 3;
    webcamGroup.add(ring2);

    // Floating Ambient Dust / Optical Particles
    const particleCount = 70;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 9;
      particlePositions[i + 1] = (Math.random() - 0.5) * 8;
      particlePositions[i + 2] = (Math.random() - 0.5) * 6;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x67e8f9,
      size: 0.05,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 4. Mouse Interaction / Parallax
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;
      const nx = (clientX / rect.width) * 2 - 1;
      const ny = -(clientY / rect.height) * 2 + 1;

      targetRotY = nx * 0.45;
      targetRotX = -ny * 0.35;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 5. Animation loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      if (!mediaQuery.matches) {
        // Smooth cursor tracking interpolation (lerp)
        currentRotX += (targetRotX - currentRotX) * 0.05;
        currentRotY += (targetRotY - currentRotY) * 0.05;

        webcamGroup.rotation.x = currentRotX + Math.sin(elapsedTime * 0.7) * 0.08;
        webcamGroup.rotation.y = currentRotY + Math.cos(elapsedTime * 0.5) * 0.08;
        webcamGroup.position.y = Math.sin(elapsedTime * 1.2) * 0.15;

        // Subtle rotating lens aperture
        irisGroup.rotation.z = elapsedTime * 0.25;

        // Orbiting rings
        ring1.rotation.z = elapsedTime * 0.35;
        ring2.rotation.x = elapsedTime * 0.25;
        ring2.rotation.z = -elapsedTime * 0.15;

        // LED ring pulse
        const ledPulse = 1.8 + Math.sin(elapsedTime * 2.5) * 0.7;
        ledMat.emissiveIntensity = ledPulse;

        // Particle subtle drift
        particles.rotation.y = elapsedTime * 0.04;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 6. Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = entry.contentRect.width;
        const newHeight = entry.contentRect.height;
        if (newWidth > 0 && newHeight > 0) {
          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, newHeight);
        }
      }
    });
    resizeObserver.observe(container);

    // Cleanup
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      mediaQuery.removeEventListener('change', handleMotionChange);
      resizeObserver.disconnect();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      // Dispose resources
      barrelGeo.dispose();
      bezelGeo.dispose();
      ledRingGeo.dispose();
      innerHousingGeo.dispose();
      lensGeo.dispose();
      sensorGeo.dispose();
      ring1Geo.dispose();
      ring2Geo.dispose();
      particleGeo.dispose();

      metallicMat.dispose();
      bezelMat.dispose();
      ledMat.dispose();
      innerHousingMat.dispose();
      glassMat.dispose();
      sensorMat.dispose();
      ringMat.dispose();
      ringMat2.dispose();
      particleMat.dispose();

      renderer.dispose();
    };
  }, []);

  if (!hasWebGL) {
    return (
      <div className="w-full h-full flex items-center justify-center p-6">
        <div className="relative w-64 h-64 rounded-full border border-cyan-500/30 flex items-center justify-center bg-cyan-950/20 backdrop-blur-md glow-cyan-sm">
          <div className="w-48 h-48 rounded-full border border-cyan-400/40 flex items-center justify-center bg-slate-900/80">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-500 to-sky-400 opacity-80 animate-pulse flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-slate-950/90 border border-cyan-300" />
            </div>
          </div>
          <span className="absolute bottom-4 text-xs font-mono-tech text-cyan-400/80">
            OPTICAL_DEVICE_ACTIVE
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[380px] sm:h-[440px] md:h-[500px] flex items-center justify-center select-none pointer-events-auto">
      {/* Subtle radial backdrop glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-72 h-72 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="w-48 h-48 rounded-full bg-sky-500/15 blur-2xl" />
      </div>

      {/* 3D Canvas Container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing z-10" />

      {/* Futuristic Telemetry Badges */}
      <div className="absolute top-4 left-4 font-mono-tech text-[10px] text-cyan-400/70 border border-cyan-500/20 bg-slate-950/70 backdrop-blur-sm px-2.5 py-1 rounded">
        SYSTEM // OPTICAL_CORE_v3.4
      </div>
      <div className="absolute bottom-4 right-4 font-mono-tech text-[10px] text-slate-400 border border-white/10 bg-slate-950/70 backdrop-blur-sm px-2.5 py-1 rounded flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
        3D REALTIME HARNESS
      </div>
    </div>
  );
}
