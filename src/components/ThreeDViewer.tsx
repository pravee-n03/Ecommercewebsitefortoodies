import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface ThreeDViewerProps {
  modelUrl: string;
  color: string;
  designTextures: { imageUrl: string; area: string }[];
  printingMethod: string;
  className?: string;
}

export function ThreeDViewer({ 
  modelUrl, 
  color, 
  designTextures, 
  printingMethod,
  className 
}: ThreeDViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0e1a);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1, 3);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 1.5;
    controls.maxDistance = 5;
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const fillLight = new THREE.DirectionalLight(0x00d4ff, 0.3);
    fillLight.position.set(-5, 0, -5);
    scene.add(fillLight);

    // Load 3D model
    const loader = new GLTFLoader();
    
    setLoading(true);
    setError(null);

    loader.load(
      modelUrl,
      (gltf) => {
        const model = gltf.scene;
        
        // Center and scale model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2 / maxDim;
        model.scale.setScalar(scale);
        
        model.position.x = -center.x * scale;
        model.position.y = -center.y * scale;
        model.position.z = -center.z * scale;

        scene.add(model);
        setLoading(false);

        // Find mesh for applying textures
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            meshRef.current = child;
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
      },
      (progress) => {
        // Loading progress
        console.log('Loading:', (progress.loaded / progress.total * 100) + '%');
      },
      (error) => {
        console.error('Error loading model:', error);
        setError('Failed to load 3D model');
        setLoading(false);
      }
    );

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);
      if (controlsRef.current) controlsRef.current.update();
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    }
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
      if (sceneRef.current) {
        sceneRef.current.clear();
      }
    };
  }, [modelUrl]);

  // Apply color changes
  useEffect(() => {
    if (!meshRef.current) return;

    const mesh = meshRef.current;
    if (mesh.material instanceof THREE.MeshStandardMaterial || 
        mesh.material instanceof THREE.MeshPhongMaterial) {
      mesh.material.color = new THREE.Color(color);
      mesh.material.needsUpdate = true;
    }
  }, [color]);

  // Apply design textures
  useEffect(() => {
    if (!meshRef.current || designTextures.length === 0) return;

    const textureLoader = new THREE.TextureLoader();
    
    designTextures.forEach(({ imageUrl, area }) => {
      textureLoader.load(imageUrl, (texture) => {
        if (!meshRef.current) return;

        const mesh = meshRef.current;
        if (mesh.material instanceof THREE.MeshStandardMaterial || 
            mesh.material instanceof THREE.MeshPhongMaterial) {
          
          // Apply texture based on printing method
          switch (printingMethod.toLowerCase()) {
            case 'dtf':
            case 'dtg':
            case 'screen print':
              // Standard texture application
              mesh.material.map = texture;
              break;
            
            case 'embroidery':
            case 'puff print':
              // Add normal map for raised effect
              mesh.material.map = texture;
              mesh.material.normalMap = texture;
              mesh.material.normalScale = new THREE.Vector2(0.5, 0.5);
              break;
            
            case 'vinyl':
            case 'htv':
              // Glossy finish
              mesh.material.map = texture;
              mesh.material.metalness = 0.3;
              mesh.material.roughness = 0.4;
              break;
            
            default:
              mesh.material.map = texture;
          }
          
          mesh.material.needsUpdate = true;
        }
      });
    });
  }, [designTextures, printingMethod]);

  return (
    <div ref={containerRef} className={`relative w-full h-full ${className || ''}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0a0e1a]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-cyan-400">Loading 3D Model...</p>
          </div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0a0e1a]">
          <div className="text-center text-red-400">
            <p>{error}</p>
            <p className="text-xs text-slate-500 mt-2">Please check the model URL</p>
          </div>
        </div>
      )}
    </div>
  );
}
