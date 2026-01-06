import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sphere, Box, Torus, MeshDistortMaterial, Environment } from "@react-three/drei";
import { useRef, Suspense } from "react";
import * as THREE from "three";

const EmotionSphere = ({ position, color, speed = 1 }: { position: [number, number, number]; color: string; speed?: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * speed * 0.3) * 0.2;
      meshRef.current.rotation.y += 0.01 * speed;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <Sphere ref={meshRef} args={[1, 64, 64]} position={position}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  );
};

const EmotionBox = ({ position, color }: { position: [number, number, number]; color: string }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={0.5}>
      <Box ref={meshRef} args={[1.5, 1.5, 1.5]} position={position}>
        <meshStandardMaterial
          color={color}
          roughness={0.1}
          metalness={0.9}
          transparent
          opacity={0.8}
        />
      </Box>
    </Float>
  );
};

const EmotionTorus = ({ position, color }: { position: [number, number, number]; color: string }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <Float speed={2.5} rotationIntensity={0.8} floatIntensity={1.2}>
      <Torus ref={meshRef} args={[0.8, 0.3, 16, 100]} position={position}>
        <meshStandardMaterial
          color={color}
          roughness={0.15}
          metalness={0.85}
        />
      </Torus>
    </Float>
  );
};

export const HeroScene = () => {
  // return (
  //   <div className="absolute inset-0 -z-10">
  //     <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
  //       <Suspense fallback={null}>
  //         <Environment preset="city" />
  //         <ambientLight intensity={0.5} />
  //         <directionalLight position={[10, 10, 5]} intensity={1} />
  //         <pointLight position={[-10, -10, -5]} intensity={0.5} color="#14b8a6" />
          
  //         Happy - Yellow/Gold sphere
  //         <EmotionSphere position={[-3.5, 1.5, 0]} color="#eab308" speed={0.8} />
          
  //         {/* Calm - Teal sphere */}
  //         <EmotionSphere position={[3.5, -1, 0]} color="#14b8a6" speed={1.2} />
          
  //         {/* Energy - Coral box */}
  //         <EmotionBox position={[2.5, 2, -2]} color="#f97316" />
          
  //         {/* Focus - Blue torus */}
  //         <EmotionTorus position={[-2.5, -1.5, -1]} color="#3b82f6" />
          
  //         {/* Surprise - Pink sphere */}
  //         <EmotionSphere position={[0, -2.5, -3]} color="#ec4899" speed={1.5} />
  //       </Suspense>
  //     </Canvas>
  //   </div>
  // );
};
