import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Sphere } from '@react-three/drei';
import * as THREE from 'three';

export type TimeOfDay = 'sunrise' | 'day' | 'sunset' | 'night';
export type Season = 'spring' | 'summer' | 'autumn' | 'winter';
export type WeatherType = 'clear' | 'rain' | 'storm' | 'snow' | 'fog';

function EarthSurface({
  health = 0.5,
  timeOfDay = 'day',
  season = 'spring',
  weather = 'clear',
}: {
  health?: number;
  timeOfDay?: TimeOfDay;
  season?: Season;
  weather?: WeatherType;
}) {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const timeConfig = useMemo(() => ({
    sunrise: { lightDir: new THREE.Vector3(3, 0.5, 2), lightColor: new THREE.Color('#FFB570'), ambientIntensity: 0.2, sunIntensity: 1.2 },
    day:     { lightDir: new THREE.Vector3(5, 5, 3),   lightColor: new THREE.Color('#FFFAF0'), ambientIntensity: 0.35, sunIntensity: 1.6 },
    sunset:  { lightDir: new THREE.Vector3(-3, 0.3, 2), lightColor: new THREE.Color('#FF7040'), ambientIntensity: 0.18, sunIntensity: 1.1 },
    night:   { lightDir: new THREE.Vector3(-5, -2, -3), lightColor: new THREE.Color('#4060AA'), ambientIntensity: 0.05, sunIntensity: 0.3 },
  }), []);

  const seasonConfig = useMemo(() => ({
    spring: { landColor: new THREE.Color('#1DB954'), forestColor: new THREE.Color('#27AE60'), snowLine: 0.9 },
    summer: { landColor: new THREE.Color('#16A34A'), forestColor: new THREE.Color('#145A32'), snowLine: 0.95 },
    autumn: { landColor: new THREE.Color('#D4782A'), forestColor: new THREE.Color('#C0392B'), snowLine: 0.82 },
    winter: { landColor: new THREE.Color('#8BAEC8'), forestColor: new THREE.Color('#5B8EA6'), snowLine: 0.6 },
  }), []);

  const weatherConfig = useMemo(() => ({
    clear:  { cloudDensity: 0.15, cloudDark: 0.0, weatherFog: 0.0 },
    rain:   { cloudDensity: 0.65, cloudDark: 0.5, weatherFog: 0.1 },
    storm:  { cloudDensity: 0.9,  cloudDark: 0.85, weatherFog: 0.15 },
    snow:   { cloudDensity: 0.7,  cloudDark: 0.3, weatherFog: 0.2 },
    fog:    { cloudDensity: 0.5,  cloudDark: 0.1, weatherFog: 0.55 },
  }), []);

  const cfg = timeConfig[timeOfDay];
  const sea = seasonConfig[season];
  const wea = weatherConfig[weather];

  const uniforms = useMemo(() => ({
    uTime:           { value: 0 },
    uHealth:         { value: health },
    uLightDir:       { value: cfg.lightDir.clone() },
    uLightColor:     { value: cfg.lightColor.clone() },
    uAmbient:        { value: cfg.ambientIntensity },
    uSunIntensity:   { value: cfg.sunIntensity },
    uOcean:          { value: new THREE.Color('#0a4d8c') },
    uLandColor:      { value: sea.landColor.clone() },
    uForestColor:    { value: sea.forestColor.clone() },
    uDesert:         { value: new THREE.Color('#c2a060') },
    uIce:            { value: new THREE.Color('#E8F4FF') },
    uSnowLine:       { value: sea.snowLine },
    uCloudDensity:   { value: wea.cloudDensity },
    uCloudDark:      { value: wea.cloudDark },
    uWeatherFog:     { value: wea.weatherFog },
    uIsNight:        { value: timeOfDay === 'night' ? 1.0 : 0.0 },
    uCityLightScale: { value: timeOfDay === 'night' ? 1.0 : 0.0 },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), []);

  useFrame((_, delta) => {
    if (!matRef.current) return;
    const u = matRef.current.uniforms;
    u.uTime.value += delta;
    u.uHealth.value = THREE.MathUtils.lerp(u.uHealth.value, health, 0.04);
    u.uAmbient.value = THREE.MathUtils.lerp(u.uAmbient.value, cfg.ambientIntensity, 0.03);
    u.uSunIntensity.value = THREE.MathUtils.lerp(u.uSunIntensity.value, cfg.sunIntensity, 0.03);
    u.uIsNight.value = THREE.MathUtils.lerp(u.uIsNight.value, timeOfDay === 'night' ? 1.0 : 0.0, 0.05);
    u.uCityLightScale.value = THREE.MathUtils.lerp(u.uCityLightScale.value, timeOfDay === 'night' ? 1.0 : (timeOfDay === 'sunset' ? 0.2 : 0.0), 0.05);
    u.uCloudDensity.value = THREE.MathUtils.lerp(u.uCloudDensity.value, wea.cloudDensity, 0.02);
    u.uCloudDark.value = THREE.MathUtils.lerp(u.uCloudDark.value, wea.cloudDark, 0.02);
    u.uWeatherFog.value = THREE.MathUtils.lerp(u.uWeatherFog.value, wea.weatherFog, 0.02);
    u.uSnowLine.value = THREE.MathUtils.lerp(u.uSnowLine.value, sea.snowLine, 0.02);
    u.uLandColor.value.lerp(sea.landColor, 0.02);
    u.uForestColor.value.lerp(sea.forestColor, 0.02);
    u.uLightColor.value.lerp(cfg.lightColor, 0.03);
    u.uLightDir.value.lerp(cfg.lightDir, 0.03);
  });

  const vertexShader = `
    varying vec3 vNormal;
    varying vec3 vPos;
    varying vec2 vUv;
    varying vec3 vWorldPos;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPos = position;
      vUv = uv;
      vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float uTime;
    uniform float uHealth;
    uniform vec3  uLightDir;
    uniform vec3  uLightColor;
    uniform float uAmbient;
    uniform float uSunIntensity;
    uniform vec3  uOcean;
    uniform vec3  uLandColor;
    uniform vec3  uForestColor;
    uniform vec3  uDesert;
    uniform vec3  uIce;
    uniform float uSnowLine;
    uniform float uCloudDensity;
    uniform float uCloudDark;
    uniform float uWeatherFog;
    uniform float uIsNight;
    uniform float uCityLightScale;

    varying vec3 vNormal;
    varying vec3 vPos;
    varying vec2 vUv;
    varying vec3 vWorldPos;

    float hash(vec3 p) {
      p = fract(p * 0.3183099 + 0.1);
      p *= 17.0;
      return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
    }
    float noise(vec3 p) {
      vec3 i = floor(p); vec3 f = fract(p);
      f = f*f*(3.0-2.0*f);
      return mix(
        mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),
        mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),
        f.z);
    }
    float fbm(vec3 p) {
      float v=0.0; float a=0.5;
      for(int i=0;i<6;i++){v+=a*noise(p);p*=2.0;a*=0.5;}
      return v;
    }

    void main() {
      vec3 p = normalize(vPos) * 3.0;
      float n  = fbm(p);
      float n2 = fbm(p * 2.0 + 10.0);
      float n3 = fbm(p * 4.0 + 20.0);

      // --- Terrain ---
      float land   = smoothstep(0.44, 0.56, n);
      float desert = smoothstep(0.58, 0.72, n2) * land;
      float forest = smoothstep(0.5, 0.65, n) * land;

      // --- Base color blend ---
      vec3 color = mix(uOcean, uLandColor, land);
      color = mix(color, uForestColor, forest * 0.6);
      color = mix(color, uDesert, desert * 0.45);

      // --- Health degradation ---
      vec3 deadLand = vec3(0.42, 0.32, 0.18);
      color = mix(color, mix(color, deadLand, 0.8), land * (1.0 - uHealth) * 0.75);

      // --- Polar ice (dynamic snow line) ---
      float lat = abs(normalize(vPos).y);
      float ice = smoothstep(uSnowLine - 0.05, uSnowLine + 0.05, lat);
      color = mix(color, uIce + vec3(n3*0.05), ice);

      // --- Ocean gloss ---
      vec3 lightDir = normalize(uLightDir);
      vec3 nrm      = normalize(vNormal);
      float diff    = max(dot(nrm, lightDir), 0.0);
      float spec    = pow(max(dot(reflect(-lightDir, nrm), vec3(0,0,1)), 0.0), 24.0);
      float oceanMask = 1.0 - land;
      color += uLightColor * spec * oceanMask * 0.25 * uSunIntensity;

      // --- Lighting ---
      vec3 lit = color * (uAmbient + diff * uSunIntensity * uLightColor);

      // --- Night city lights ---
      float nightSide = 1.0 - smoothstep(0.0, 0.25, diff);
      float cityNoise  = fbm(p * 7.0 + 50.0);
      float cities     = smoothstep(0.58, 0.72, cityNoise) * land * nightSide * uCityLightScale;
      lit += vec3(1.0, 0.82, 0.38) * cities * 0.7;

      // --- Clouds overlay ---
      vec3 cloudP = normalize(vPos) * 2.5;
      float cloudN = fbm(cloudP + vec3(uTime*0.03, 0.0, 0.0));
      float cloud  = smoothstep(1.0 - uCloudDensity, 1.0 - uCloudDensity + 0.35, cloudN);
      vec3 cloudColor = mix(vec3(1.0), vec3(0.12, 0.12, 0.18), uCloudDark);
      lit = mix(lit, cloudColor * (uAmbient + diff * 0.8), cloud * 0.85);

      // --- Weather fog ---
      float fogAmt = uWeatherFog * (0.5 + 0.5 * noise(p * 2.0 + uTime * 0.1));
      lit = mix(lit, vec3(0.55, 0.60, 0.65) * 0.6, fogAmt);

      // --- Fresnel atmosphere rim ---
      float fresnel = pow(1.0 - max(dot(nrm, vec3(0,0,1)), 0.0), 3.5);
      lit += vec3(0.0, 0.55, 1.0) * fresnel * 0.12;

      gl_FragColor = vec4(lit, 1.0);
    }
  `;

  return (
    <Sphere args={[1, 128, 128]}>
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </Sphere>
  );
}

function AtmosphereGlow({ timeOfDay = 'day' }: { timeOfDay?: TimeOfDay }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const atmColors: Record<TimeOfDay, [string, string]> = {
    sunrise: ['#FF8C42', '#38BDF8'],
    day:     ['#38BDF8', '#1E40AF'],
    sunset:  ['#FF5C35', '#7C3AED'],
    night:   ['#0A1628', '#1E3A5F'],
  };

  const [c1, c2] = atmColors[timeOfDay];

  const uniforms = useMemo(() => ({
    uTime:  { value: 0 },
    uCol1:  { value: new THREE.Color(c1) },
    uCol2:  { value: new THREE.Color(c2) },
    uIsNight: { value: timeOfDay === 'night' ? 1.0 : 0.0 },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), []);

  useFrame((_, delta) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value += delta;
    matRef.current.uniforms.uCol1.value.lerp(new THREE.Color(c1), 0.04);
    matRef.current.uniforms.uCol2.value.lerp(new THREE.Color(c2), 0.04);
    matRef.current.uniforms.uIsNight.value = THREE.MathUtils.lerp(
      matRef.current.uniforms.uIsNight.value,
      timeOfDay === 'night' ? 1.0 : 0.0,
      0.04,
    );
  });

  return (
    <Sphere args={[1.16, 64, 64]}>
      <shaderMaterial
        ref={matRef}
        transparent
        side={THREE.BackSide}
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={`
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform vec3  uCol1;
          uniform vec3  uCol2;
          uniform float uIsNight;
          varying vec3  vNormal;
          void main() {
            float fwdDot = dot(vNormal, vec3(0.0, 0.0, 1.0));
            float intensity = pow(0.72 - fwdDot, 3.0);
            intensity = clamp(intensity, 0.0, 1.0);
            vec3 col = mix(uCol1, uCol2, 0.5 + 0.5 * sin(uTime * 0.3));
            float nightBoost = uIsNight * 0.3;
            gl_FragColor = vec4(col, intensity * (0.7 + nightBoost));
          }
        `}
      />
    </Sphere>
  );
}

function AuroraBorealis({ visible }: { visible: boolean }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  useFrame((_, delta) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value += delta;
      matRef.current.uniforms.uOpacity.value = THREE.MathUtils.lerp(
        matRef.current.uniforms.uOpacity.value,
        visible ? 0.7 : 0.0,
        0.04,
      );
    }
  });
  return (
    <Sphere args={[1.13, 64, 64]}>
      <shaderMaterial
        ref={matRef}
        transparent
        side={THREE.FrontSide}
        depthWrite={false}
        uniforms={{ uTime: { value: 0 }, uOpacity: { value: 0 } }}
        vertexShader={`
          varying vec3 vNormal;
          varying vec3 vPos;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vPos = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform float uOpacity;
          varying vec3 vNormal;
          varying vec3 vPos;
          void main() {
            float lat = abs(normalize(vPos).y);
            float auroraZone = smoothstep(0.65, 0.75, lat) * (1.0 - smoothstep(0.92, 1.0, lat));
            if (auroraZone < 0.01) discard;
            float wave1 = sin(vPos.x * 8.0 + uTime * 1.5) * 0.5 + 0.5;
            float wave2 = sin(vPos.z * 6.0 + uTime * 1.2 + 1.5) * 0.5 + 0.5;
            float wave  = wave1 * wave2;
            vec3 col1 = vec3(0.0, 0.9, 0.55);
            vec3 col2 = vec3(0.5, 0.0, 0.9);
            vec3 aurora = mix(col1, col2, wave);
            float alpha = auroraZone * wave * uOpacity;
            gl_FragColor = vec4(aurora, alpha);
          }
        `}
      />
    </Sphere>
  );
}

function CloudLayer({ weather = 'clear' }: { weather?: WeatherType }) {
  const ref = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const cloudSpeeds: Record<WeatherType, number> = { clear: 0.012, rain: 0.025, storm: 0.05, snow: 0.015, fog: 0.008 };

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * cloudSpeeds[weather];
    if (matRef.current) matRef.current.uniforms.uTime.value += delta;
  });

  return (
    <mesh ref={ref as React.RefObject<THREE.Mesh>}>
      <sphereGeometry args={[1.025, 48, 48]} />
      <shaderMaterial
        ref={matRef}
        transparent
        depthWrite={false}
        uniforms={{
          uTime:    { value: 0 },
          uStorm:   { value: weather === 'storm' ? 1.0 : weather === 'rain' ? 0.6 : 0.0 },
        }}
        vertexShader={`
          varying vec2 vUv;
          varying vec3 vNormal;
          void main() {
            vUv = uv;
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform float uStorm;
          varying vec2 vUv;
          varying vec3 vNormal;

          float hash2(vec2 p) {
            p = fract(p * vec2(0.3183099, 0.3678794));
            p += dot(p, p + 34.0);
            return fract(p.x * p.y);
          }
          float noise2(vec2 p) {
            vec2 i = floor(p); vec2 f = fract(p);
            f = f*f*(3.0-2.0*f);
            return mix(mix(hash2(i),hash2(i+vec2(1,0)),f.x),
                       mix(hash2(i+vec2(0,1)),hash2(i+vec2(1,1)),f.x),f.y);
          }
          float fbm2(vec2 p) {
            float v=0.0; float a=0.5;
            for(int i=0;i<5;i++){v+=a*noise2(p);p*=2.0;a*=0.5;}
            return v;
          }

          void main() {
            vec2 uv2 = vUv * 4.0 + vec2(uTime * 0.015, 0.0);
            float n = fbm2(uv2);
            float cloud = smoothstep(0.42, 0.72, n);
            float stormDark = mix(1.0, 0.15, uStorm);
            vec3 cloudCol = vec3(stormDark) * (0.9 + n * 0.1);
            float alpha = cloud * 0.5;
            if (alpha < 0.01) discard;
            gl_FragColor = vec4(cloudCol, alpha);
          }
        `}
      />
    </mesh>
  );
}

function MoonOrbit({ visible }: { visible: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const matRef   = useRef<THREE.MeshStandardMaterial>(null);
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime * 0.15;
    groupRef.current.position.set(Math.cos(t) * 2.5, Math.sin(t * 0.4) * 0.5, Math.sin(t) * 2.5);
    if (matRef.current) matRef.current.opacity = THREE.MathUtils.lerp(matRef.current.opacity, visible ? 0.9 : 0.0, 0.05);
  });
  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[0.08, 24, 24]} />
        <meshStandardMaterial ref={matRef} color="#D4D8E0" roughness={0.9} transparent opacity={0} emissive="#A8B0C0" emissiveIntensity={0.1} />
      </mesh>
    </group>
  );
}

function SunGlow({ timeOfDay = 'day' }: { timeOfDay?: TimeOfDay }) {
  const ref = useRef<THREE.Group>(null);

  const sunPositions: Record<TimeOfDay, THREE.Vector3> = {
    sunrise: new THREE.Vector3(3, 0.5, 2),
    day:     new THREE.Vector3(0, 4, 3),
    sunset:  new THREE.Vector3(-3, 0.3, 2),
    night:   new THREE.Vector3(-5, -3, -4),
  };

  const sunColors: Record<TimeOfDay, string> = {
    sunrise: '#FFB570',
    day:     '#FFFDE8',
    sunset:  '#FF7040',
    night:   '#102040',
  };

  const matRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(() => {
    if (!ref.current || !matRef.current) return;
    const target = sunPositions[timeOfDay].clone().normalize().multiplyScalar(3.5);
    ref.current.position.lerp(target, 0.03);
    matRef.current.color.lerp(new THREE.Color(sunColors[timeOfDay]), 0.03);
    matRef.current.opacity = THREE.MathUtils.lerp(matRef.current.opacity, timeOfDay === 'night' ? 0.0 : 0.6, 0.03);
  });

  return (
    <group ref={ref}>
      <mesh>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial ref={matRef} color="#FFFDE8" transparent opacity={0.6} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshBasicMaterial color="#FFD080" transparent opacity={0.12} />
      </mesh>
    </group>
  );
}

function RotatingGroup({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.04;
  });
  return <group ref={ref}>{children}</group>;
}

function CameraRig({ enableControls }: { enableControls: boolean }) {
  const { camera } = useThree();
  useFrame((state) => {
    if (enableControls) return;
    const t = state.clock.elapsedTime;
    camera.position.x = Math.sin(t * 0.08) * 0.4;
    camera.position.y = Math.cos(t * 0.06) * 0.2;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export interface Earth3DProps {
  health?: number;
  timeOfDay?: TimeOfDay;
  season?: Season;
  weather?: WeatherType;
  enableControls?: boolean;
  className?: string;
}

export function Earth3D({
  health = 0.5,
  timeOfDay = 'day',
  season = 'spring',
  weather = 'clear',
  enableControls = true,
  className = '',
}: Earth3DProps) {
  const lightConfig: Record<TimeOfDay, { color: string; intensity: number; pos: [number, number, number] }> = {
    sunrise: { color: '#FFB570', intensity: 1.2, pos: [3, 0.5, 2] },
    day:     { color: '#FFFAF0', intensity: 1.8, pos: [5, 5, 3] },
    sunset:  { color: '#FF7040', intensity: 1.0, pos: [-3, 0.3, 2] },
    night:   { color: '#4060AA', intensity: 0.2, pos: [-5, -2, -3] },
  };
  const lc = lightConfig[timeOfDay];

  const starCount = timeOfDay === 'night' ? 5000 : timeOfDay === 'sunrise' || timeOfDay === 'sunset' ? 1500 : 400;

  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 3], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.08} />
        <directionalLight position={lc.pos} intensity={lc.intensity} color={lc.color} />
        <pointLight position={[0, 0, -3]} intensity={0.15} color="#102040" />

        <Suspense fallback={null}>
          <Stars radius={80} depth={60} count={starCount} factor={5} fade speed={timeOfDay === 'night' ? 1.5 : 0.5} />
          <RotatingGroup>
            <EarthSurface health={health} timeOfDay={timeOfDay} season={season} weather={weather} />
            <CloudLayer weather={weather} />
          </RotatingGroup>
          <AtmosphereGlow timeOfDay={timeOfDay} />
          <AuroraBorealis visible={timeOfDay === 'night'} />
          <MoonOrbit visible={timeOfDay === 'night' || timeOfDay === 'sunrise'} />
          <SunGlow timeOfDay={timeOfDay} />
        </Suspense>

        <CameraRig enableControls={enableControls} />
        {enableControls && (
          <OrbitControls
            enableZoom
            enablePan={false}
            minDistance={1.8}
            maxDistance={6}
            autoRotate={false}
            enableDamping
            dampingFactor={0.08}
          />
        )}
      </Canvas>
    </div>
  );
}
