import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Sphere, Clouds, Cloud } from '@react-three/drei';
import * as THREE from 'three';
function EarthSurface({ health = 0.5 }: { health?: number }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uHealth: { value: health },
      uOcean: { value: new THREE.Color('#0a4d8c') },
      uLand: { value: new THREE.Color('#1a6b3a') },
      uDesert: { value: new THREE.Color('#c2a060') },
      uIce: { value: new THREE.Color('#e8f4ff') },
      uLightDir: { value: new THREE.Vector3(5, 3, 5) },
    }),
    [],
  );

  useFrame((_, delta) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value += delta;
      matRef.current.uniforms.uHealth.value = THREE.MathUtils.lerp(
        matRef.current.uniforms.uHealth.value,
        health,
        0.05,
      );
    }
  });

  const vertexShader = `
    varying vec3 vNormal;
    varying vec3 vPos;
    varying vec2 vUv;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPos = position;
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float uTime;
    uniform float uHealth;
    uniform vec3 uOcean;
    uniform vec3 uLand;
    uniform vec3 uDesert;
    uniform vec3 uIce;
    uniform vec3 uLightDir;
    varying vec3 vNormal;
    varying vec3 vPos;
    varying vec2 vUv;

    float hash(vec3 p) {
      p = fract(p * 0.3183099 + 0.1);
      p *= 17.0;
      return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
    }
    float noise(vec3 p) {
      vec3 i = floor(p);
      vec3 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
            mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
        mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
            mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
        f.z
      );
    }
    float fbm(vec3 p) {
      float v = 0.0;
      float a = 0.5;
      for (int i = 0; i < 5; i++) {
        v += a * noise(p);
        p *= 2.0;
        a *= 0.5;
      }
      return v;
    }

    void main() {
      vec3 p = normalize(vPos) * 3.0;
      float n = fbm(p);
      float n2 = fbm(p * 2.0 + 10.0);

      float land = smoothstep(0.45, 0.55, n);
      float desert = smoothstep(0.6, 0.75, n2) * land;

      vec3 color = mix(uOcean, uLand, land);
      color = mix(color, uDesert, desert * 0.5);

      float lat = abs(vPos.y);
      float ice = smoothstep(0.75, 0.9, lat);
      color = mix(color, uIce, ice);

      vec3 healthyLand = vec3(0.1, 0.55, 0.2);
      vec3 deadLand = vec3(0.45, 0.35, 0.2);
      vec3 landColor = mix(deadLand, healthyLand, uHealth);
      color = mix(color, landColor, land * (1.0 - ice) * 0.7);

      vec3 lightDir = normalize(uLightDir);
      float diff = max(dot(vNormal, lightDir), 0.0);
      float ambient = 0.25;
      vec3 lit = color * (ambient + diff * 0.9);

      float night = 1.0 - diff;
      float cityNoise = fbm(p * 8.0);
      float cities = smoothstep(0.6, 0.75, cityNoise) * land * night;
      lit += vec3(1.0, 0.7, 0.3) * cities * 0.5;

      float fresnel = pow(1.0 - max(dot(vNormal, vec3(0,0,1)), 0.0), 3.0);
      lit += vec3(0.0, 0.6, 1.0) * fresnel * 0.15;

      gl_FragColor = vec4(lit, 1.0);
    }
  `;

  return (
    <Sphere args={[1, 128, 128]}>
      <shaderMaterial ref={matRef} vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={uniforms} />
    </Sphere>
  );
}

function AtmosphereGlow() {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  useFrame((_, delta) => {
    if (matRef.current) matRef.current.uniforms.uTime.value += delta;
  });
  return (
    <Sphere args={[1.15, 64, 64]}>
      <shaderMaterial
        ref={matRef}
        transparent
        side={THREE.BackSide}
        depthWrite={false}
        uniforms={{ uTime: { value: 0 } }}
        vertexShader={`
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          varying vec3 vNormal;
          void main() {
            float intensity = pow(0.7 - dot(vNormal, vec3(0,0,1)), 2.5);
            vec3 col = mix(vec3(0.0, 0.6, 1.0), vec3(0.0, 0.9, 0.66), 0.5 + 0.5 * sin(uTime * 0.5));
            gl_FragColor = vec4(col, intensity * 0.8);
          }
        `}
      />
    </Sphere>
  );
}

function CloudLayer() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.02;
  });
  return (
    <Clouds material={THREE.MeshBasicMaterial}>
      <Cloud
        ref={ref as never}
        seed={42}
        segments={40}
        bounds={[2, 2, 2]}
        volume={1.2}
        color="white"
        opacity={0.35}
        fade={10}
        speed={0.2}
      />
    </Clouds>
  );
}

function RotatingGroup({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.05;
  });
  return <group ref={ref}>{children}</group>;
}

function CameraRig() {
  const { camera } = useThree();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    camera.position.x = Math.sin(t * 0.1) * 0.3;
    camera.position.y = Math.cos(t * 0.08) * 0.15;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export interface Earth3DProps {
  health?: number;
  enableControls?: boolean;
  autoRotate?: boolean;
  className?: string;
}

export function Earth3D({ health = 0.5, enableControls = true, className = '' }: Earth3DProps) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 3], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 3, 5]} intensity={1.5} />
        <Suspense fallback={null}>
          <Stars radius={50} depth={50} count={2000} factor={4} fade speed={1} />
          <RotatingGroup>
            <EarthSurface health={health} />
            <CloudLayer />
          </RotatingGroup>
          <AtmosphereGlow />
        </Suspense>
        <CameraRig />
        {enableControls && (
          <OrbitControls
            enableZoom
            enablePan={false}
            minDistance={2}
            maxDistance={6}
            autoRotate={false}
          />
        )}
      </Canvas>
    </div>
  );
}
