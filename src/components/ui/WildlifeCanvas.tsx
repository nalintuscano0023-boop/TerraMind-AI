import React, { useEffect, useRef } from 'react';

type WildlifeType = 'bird' | 'fish' | 'butterfly' | 'bee' | 'deer' | 'turtle' | 'none';

interface WildlifeCanvasProps {
  type: WildlifeType;
  className?: string;
  speedMultiplier?: number;
}

interface Creature {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  wingAngle: number;
  color: string;
  secondaryColor: string;
  targetAngle: number;
  currentAngle: number;
  deerState?: 'walking' | 'running' | 'jumping' | 'grazing' | 'looking' | 'idle';
  deerTimer?: number;
  jumpProgress?: number;
  headAngle?: number;
  legCycle?: number;
  deerVariant?: 'buck' | 'doe' | 'fawn' | 'alert_doe' | 'young_buck' | 'bg_doe';
  scale?: number;
  antlerPoints?: number;
  facing?: number;
  baseY?: number;
}

interface Bubble {
  x: number;
  y: number;
  radius: number;
  speed: number;
  wobbleSpeed: number;
}

interface CloudParticle {
  x: number;
  y: number;
  scale: number;
  speed: number;
}

interface Flower {
  x: number;
  color: string;
  size: number;
  petalCount: number;
}

/* ── Realistically Rendered Articulated Deer ── */
function drawRealisticDeer(
  ctx: CanvasRenderingContext2D,
  c: Creature,
  t: number,
  height: number,
  width: number,
  speedMultiplier: number
) {
  if (!c.deerState) {
    c.deerState = 'walking';
    c.deerTimer = 80 + Math.floor(Math.random() * 100);
    c.jumpProgress = 0;
    c.headAngle = 0;
    c.legCycle = Math.random() * Math.PI * 2;
  }

  const scale = c.scale || 1.0;
  const isFawn = c.deerVariant === 'fawn';
  const isBuck = (c.antlerPoints || 0) > 0;
  const isBg = c.deerVariant === 'bg_doe';

  // State Machine Timers & Transitions
  c.deerTimer = c.deerTimer! - 1 * speedMultiplier;
  if (c.deerTimer <= 0) {
    const states: Array<'walking' | 'running' | 'jumping' | 'grazing' | 'looking' | 'idle'> = [
      'walking', 'walking', 'grazing', 'grazing', 'looking', 'idle', 'running', 'jumping'
    ];
    c.deerState = states[Math.floor(Math.random() * states.length)];
    c.deerTimer = c.deerState === 'jumping' ? 45 : c.deerState === 'grazing' ? 140 : 90 + Math.floor(Math.random() * 110);
    if (c.deerState === 'jumping') c.jumpProgress = 0;
  }

  // Speed and Pose variables
  let moveSpeed = 0;
  let yOffset = 0;
  let headTargetAngle = 0;

  if (c.deerState === 'walking') {
    moveSpeed = 0.55 * scale * speedMultiplier;
    c.legCycle = (c.legCycle! + 0.1 * speedMultiplier) % (Math.PI * 2);
    headTargetAngle = Math.sin(t * 3) * 0.06;
  } else if (c.deerState === 'running') {
    moveSpeed = 1.8 * scale * speedMultiplier;
    c.legCycle = (c.legCycle! + 0.22 * speedMultiplier) % (Math.PI * 2);
    headTargetAngle = 0.12;
  } else if (c.deerState === 'jumping') {
    moveSpeed = 1.5 * scale * speedMultiplier;
    c.jumpProgress = Math.min(1, c.jumpProgress! + 0.025 * speedMultiplier);
    yOffset = -Math.sin(c.jumpProgress! * Math.PI) * 28 * scale;
    c.legCycle = (c.legCycle! + 0.18) % (Math.PI * 2);
    headTargetAngle = -0.15;
  } else if (c.deerState === 'grazing') {
    moveSpeed = 0.03 * scale;
    headTargetAngle = 0.85; // Head lowered to grass
  } else if (c.deerState === 'looking') {
    moveSpeed = 0;
    headTargetAngle = -0.4 + Math.sin(t * 1.5) * 0.18; // Head raised alert
  } else {
    // Idle / standing
    moveSpeed = 0;
    headTargetAngle = Math.sin(t * 2) * 0.04;
  }

  // Facing direction movement
  const facing = c.facing || 1;
  c.x += moveSpeed * facing;
  if (facing > 0 && c.x > width + 60) c.x = -60;
  if (facing < 0 && c.x < -60) c.x = width + 60;

  // Smooth lerp for head angle
  c.headAngle = c.headAngle! + (headTargetAngle - c.headAngle!) * 0.08;

  // Ground Y contact point
  const groundY = (c.baseY || (height - 28)) + yOffset;
  const bodyBob = c.deerState === 'walking' || c.deerState === 'running'
    ? Math.abs(Math.sin(c.legCycle! * 2)) * 1.8 * scale
    : 0;
  const breathing = Math.sin(t * 2.5 + c.x) * 0.5;

  ctx.save();
  ctx.translate(c.x, groundY);
  ctx.scale(facing * scale, scale);

  // Colors
  const mainColor   = isFawn ? '#B87333' : isBg ? '#7A4B24' : '#8C532B';
  const darkColor   = isFawn ? '#8C4D1D' : isBg ? '#573316' : '#5E381A';
  const bellyColor  = isFawn ? '#FDF6EE' : '#F2E6D8';
  const hoofColor   = '#231810';
  const shadowLegCol = '#422610';

  // LEGS
  const legCycle = c.legCycle!;
  let legA1 = 0, legA2 = 0, legA3 = 0, legA4 = 0;
  if (c.deerState === 'walking' || c.deerState === 'running') {
    legA1 = Math.sin(legCycle) * 0.38;
    legA2 = Math.sin(legCycle + Math.PI) * 0.38;
    legA3 = Math.sin(legCycle + Math.PI) * 0.38;
    legA4 = Math.sin(legCycle) * 0.38;
  } else if (c.deerState === 'jumping') {
    const jp = c.jumpProgress!;
    legA1 = -0.5 + jp * 0.8;
    legA2 = -0.6 + jp * 0.9;
    legA3 = 0.5 - jp * 0.8;
    legA4 = 0.6 - jp * 0.9;
  } else if (c.deerState === 'grazing') {
    legA1 = 0.05; legA2 = -0.05; legA3 = 0.15; legA4 = 0.08;
  }

  // Draw 1 Leg Helper
  const drawLeg = (hipX: number, hipY: number, isFore: boolean, legAngle: number, color: string) => {
    ctx.save();
    ctx.translate(hipX, hipY);
    ctx.rotate(legAngle);
    ctx.strokeStyle = color;
    ctx.lineWidth = isFawn ? 2.0 : 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const upperLen = 13;
    const lowerLen = 14;
    const jointBend = isFore ? -0.25 - Math.max(0, legAngle * 0.4) : 0.35 + Math.max(0, -legAngle * 0.4);

    ctx.beginPath();
    ctx.moveTo(0, 0);
    const jx = Math.sin(jointBend) * upperLen;
    const jy = Math.cos(jointBend) * upperLen;
    ctx.lineTo(jx, jy);

    const fx = jx + Math.sin(jointBend * 0.3) * lowerLen;
    const fy = jy + Math.cos(jointBend * 0.3) * lowerLen;
    ctx.lineTo(fx, fy);
    ctx.stroke();

    // Dark Hoof tip
    ctx.fillStyle = hoofColor;
    ctx.beginPath();
    ctx.arc(fx, fy, isFawn ? 1.2 : 1.6, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  // 1. FAR LEGS (Background Hind & Fore)
  drawLeg(-14, -24 + bodyBob, false, legA1, shadowLegCol);
  drawLeg(12, -24 + bodyBob, true, legA3, shadowLegCol);

  // 2. MAIN TORSO & BODY
  ctx.save();
  ctx.translate(0, -28 + bodyBob + breathing * 0.3);

  // Body Path
  ctx.fillStyle = mainColor;
  ctx.beginPath();
  ctx.moveTo(-20, -6);
  ctx.quadraticCurveTo(-26, 0, -22, 8);
  ctx.quadraticCurveTo(0, 14, 18, 6);
  ctx.quadraticCurveTo(24, -2, 18, -10);
  ctx.quadraticCurveTo(0, -14, -20, -6);
  ctx.closePath();
  ctx.fill();

  // Darker Back Saddle Shading
  ctx.fillStyle = darkColor;
  ctx.beginPath();
  ctx.moveTo(-20, -6);
  ctx.quadraticCurveTo(0, -14, 18, -10);
  ctx.quadraticCurveTo(10, -5, -18, -2);
  ctx.closePath();
  ctx.fill();

  // Lighter Cream Belly Patch
  ctx.fillStyle = bellyColor;
  ctx.beginPath();
  ctx.moveTo(-16, 4);
  ctx.quadraticCurveTo(0, 12, 16, 5);
  ctx.quadraticCurveTo(2, 4, -14, 2);
  ctx.closePath();
  ctx.fill();

  // Fawn Spots
  if (isFawn) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    const spots = [
      { x: -14, y: -4 }, { x: -8, y: -6 }, { x: -2, y: -5 },
      { x: 4, y: -6 }, { x: 10, y: -4 }, { x: -10, y: -1 },
      { x: -4, y: -1 }, { x: 3, y: -1 }, { x: 8, y: 0 }
    ];
    spots.forEach(sp => {
      ctx.beginPath();
      ctx.arc(sp.x, sp.y, 1.1, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // Tail Flick
  const tailFlick = Math.sin(t * 5 + c.x) * 0.25;
  ctx.save();
  ctx.translate(-22, -4);
  ctx.rotate(tailFlick);
  ctx.fillStyle = darkColor;
  ctx.beginPath();
  ctx.ellipse(-3, -2, 4, 2.5, -0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.ellipse(-3, 0, 3.5, 2, -0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 3. NECK AND HEAD
  ctx.save();
  ctx.translate(14, -6);
  ctx.rotate(c.headAngle!);

  // Neck
  ctx.fillStyle = mainColor;
  ctx.beginPath();
  ctx.moveTo(-4, -2);
  ctx.quadraticCurveTo(0, -14, 6, -20);
  ctx.lineTo(14, -16);
  ctx.quadraticCurveTo(6, -4, 0, 2);
  ctx.closePath();
  ctx.fill();

  // White Throat Stripe
  ctx.fillStyle = bellyColor;
  ctx.beginPath();
  ctx.moveTo(2, -8);
  ctx.quadraticCurveTo(8, -14, 12, -15);
  ctx.quadraticCurveTo(6, -8, 2, -4);
  ctx.closePath();
  ctx.fill();

  // Head Base & Snout
  ctx.save();
  ctx.translate(8, -19);

  ctx.fillStyle = mainColor;
  ctx.beginPath();
  ctx.moveTo(-6, -4);
  ctx.quadraticCurveTo(2, -5, 10, -1);
  ctx.lineTo(11, 2);
  ctx.quadraticCurveTo(4, 5, -4, 2);
  ctx.closePath();
  ctx.fill();

  // Dark Snout Tip (Nose)
  ctx.fillStyle = '#1F130B';
  ctx.beginPath();
  ctx.arc(10.5, 0.5, 1.6, 0, Math.PI * 2);
  ctx.fill();

  // Dark Eye with Glint
  ctx.fillStyle = '#120B05';
  ctx.beginPath();
  ctx.ellipse(3, -2, 1.8, 1.4, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(3.4, -2.4, 0.6, 0, Math.PI * 2);
  ctx.fill();

  // Ears
  const earTwitch = Math.sin(t * 7 + c.x) * 0.12;
  ctx.fillStyle = darkColor;
  ctx.beginPath();
  ctx.ellipse(-5, -6 + earTwitch * 2, 4, 1.8, -0.7 + earTwitch, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = mainColor;
  ctx.beginPath();
  ctx.ellipse(-3, -7 + earTwitch * 2, 4.5, 2, -0.6 + earTwitch, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#E8D0C0';
  ctx.beginPath();
  ctx.ellipse(-3, -7 + earTwitch * 2, 3, 1.2, -0.6 + earTwitch, 0, Math.PI * 2);
  ctx.fill();

  // Antlers (For Bucks)
  if (isBuck) {
    const pts = c.antlerPoints || 6;
    ctx.strokeStyle = '#D6C7B2';
    ctx.lineWidth = 1.8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(-1, -5);
    ctx.quadraticCurveTo(-1, -15, 6, -24);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(1, -12);
    ctx.lineTo(6, -15);
    ctx.stroke();

    if (pts >= 4) {
      ctx.beginPath();
      ctx.moveTo(3, -19);
      ctx.lineTo(8, -21);
      ctx.stroke();
    }
    if (pts >= 6) {
      ctx.beginPath();
      ctx.moveTo(4, -22);
      ctx.lineTo(2, -26);
      ctx.stroke();
    }

    ctx.strokeStyle = '#A89985';
    ctx.beginPath();
    ctx.moveTo(-3, -5);
    ctx.quadraticCurveTo(-5, -14, 1, -22);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-3, -11);
    ctx.lineTo(1, -14);
    ctx.stroke();
  }

  ctx.restore(); // Head Base
  ctx.restore(); // Neck
  ctx.restore(); // Torso

  // 3. NEAR LEGS (Foreground Hind & Fore)
  drawLeg(-14, -24 + bodyBob, false, legA2, mainColor);
  drawLeg(12, -24 + bodyBob, true, legA4, mainColor);

  ctx.restore(); // Ground & Scale
}

export const WildlifeCanvas: React.FC<WildlifeCanvasProps> = ({ type, className = '', speedMultiplier = 1 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      const rect = canvas.parentElement.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = window.devicePixelRatio || 1;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    let t = 0;

    // Underwater Bubbles (For Fish & Turtle Environments)
    const bubbles: Bubble[] = Array.from({ length: 25 }).map(() => ({
      x: Math.random() * (width || 600),
      y: Math.random() * (height || 320),
      radius: 1.5 + Math.random() * 3.5,
      speed: 0.6 + Math.random() * 1.2,
      wobbleSpeed: 1 + Math.random() * 2,
    }));

    // Sky Clouds (For Bird & Daylight Environments)
    const clouds: CloudParticle[] = Array.from({ length: 5 }).map((_, i) => ({
      x: i * ((width || 600) / 4) - 50,
      y: 20 + Math.random() * 50,
      scale: 0.7 + Math.random() * 0.6,
      speed: 0.3 + Math.random() * 0.4,
    }));

    // Meadow Flowers (For Butterfly & Bee Environments)
    const flowerColors = ['#EF4444', '#F59E0B', '#8B5CF6', '#EC4899', '#38BDF8', '#F43F5E'];
    const flowers: Flower[] = Array.from({ length: 14 }).map((_, i) => ({
      x: 20 + i * ((width || 600) / 14),
      color: flowerColors[i % flowerColors.length],
      size: 6 + Math.random() * 5,
      petalCount: 5 + (i % 3),
    }));

    // Creature objects
    const creatures: Creature[] = [];
    const numItems =
      type === 'bee' ? 20 : type === 'butterfly' ? 16 : type === 'bird' ? 14 : type === 'fish' ? 18 : type === 'turtle' ? 5 : 6;

    for (let i = 0; i < numItems; i++) {
      const isTurtle = type === 'turtle';
      const isFish = type === 'fish';
      const speedScale = isTurtle ? 0.35 : isFish ? 1.1 : 1.4;

      const vx = (Math.random() > 0.5 ? 1 : -1) * (0.6 + Math.random() * 0.8) * speedScale;
      const vy = (Math.random() - 0.5) * 0.4 * speedScale;
      const initialAngle = Math.atan2(vy, vx);

      // Y position bounds strictly enforced per habitat!
      let initialY = Math.random() * (height || 320);
      if (isFish) {
        initialY = (height || 320) * 0.35 + Math.random() * ((height || 320) * 0.55); // Strictly underwater
      } else if (isTurtle) {
        initialY = (height || 320) * 0.45 + Math.random() * ((height || 320) * 0.45); // Strictly deep ocean
      } else if (type === 'bird') {
        initialY = 20 + Math.random() * ((height || 320) * 0.5); // Strictly sky
      } else if (type === 'deer') {
        initialY = (height || 320) - 45; // Strictly ground level
      }

      if (type === 'deer') {
        const deerConfigs = [
          { variant: 'buck' as const, scale: 1.12, antlers: 6, facing: 1, baseY: (height || 320) - 26, xPct: 0.15 },
          { variant: 'doe' as const, scale: 1.0, antlers: 0, facing: 1, baseY: (height || 320) - 28, xPct: 0.38 },
          { variant: 'fawn' as const, scale: 0.65, antlers: 0, facing: 1, baseY: (height || 320) - 25, xPct: 0.46 },
          { variant: 'alert_doe' as const, scale: 0.95, antlers: 0, facing: -1, baseY: (height || 320) - 27, xPct: 0.62 },
          { variant: 'young_buck' as const, scale: 0.88, antlers: 3, facing: 1, baseY: (height || 320) - 29, xPct: 0.78 },
          { variant: 'bg_doe' as const, scale: 0.75, antlers: 0, facing: 1, baseY: (height || 320) - 36, xPct: 0.28 },
        ];
        const cfg = deerConfigs[i % deerConfigs.length];
        creatures.push({
          x: cfg.xPct * (width || 600),
          y: cfg.baseY,
          vx: 0,
          vy: 0,
          size: 30,
          wingAngle: 0,
          color: '#8C532B',
          secondaryColor: '#5E381A',
          targetAngle: 0,
          currentAngle: 0,
          deerState: i === 0 ? 'walking' : i === 1 ? 'grazing' : i === 3 ? 'looking' : 'idle',
          deerTimer: 60 + Math.floor(Math.random() * 120),
          jumpProgress: 0,
          headAngle: 0,
          legCycle: i * 1.2,
          deerVariant: cfg.variant,
          scale: cfg.scale,
          antlerPoints: cfg.antlers,
          facing: cfg.facing,
          baseY: cfg.baseY,
        });
      } else {
        creatures.push({
          x: Math.random() * (width || 600),
          y: initialY,
          vx,
          vy,
          size: isTurtle ? 22 : isFish ? 13 : 8,
          wingAngle: Math.random() * Math.PI * 2,
          color:
            type === 'butterfly'
              ? ['#F59E0B', '#38BDF8', '#7C3AED', '#00E5A8'][i % 4]
              : type === 'bee'
              ? '#F59E0B'
              : type === 'bird'
              ? '#00E5A8'
              : type === 'fish'
              ? i % 2 === 0 ? '#38BDF8' : '#00E5A8'
              : '#059669',
          secondaryColor:
            type === 'fish'
              ? i % 2 === 0 ? '#0284C7' : '#059669'
              : type === 'turtle'
              ? '#10B981'
              : '#B45309',
          targetAngle: initialAngle,
          currentAngle: initialAngle,
        });
      }
    }

    const render = () => {
      t += 0.025 * speedMultiplier;
      ctx.clearRect(0, 0, width, height);

      /* =========================================================
         1. ENVIRONMENT HABITAT BACKDROP RENDERING
         ========================================================= */

      if (type === 'fish' || type === 'turtle') {
        // --- 🌊 UNDERWATER OCEAN HABITAT ---
        // Radiant Underwater Ocean Gradient
        const oceanGrad = ctx.createLinearGradient(0, 0, 0, height);
        oceanGrad.addColorStop(0, '#0284c7');
        oceanGrad.addColorStop(0.35, '#0369a1');
        oceanGrad.addColorStop(0.75, '#0f172a');
        oceanGrad.addColorStop(1, '#040d1a');
        ctx.fillStyle = oceanGrad;
        ctx.fillRect(0, 0, width, height);

        // Water Caustics Sunbeam Rays
        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        for (let r = 0; r < 5; r++) {
          const rayX = (r * width) / 4 + Math.sin(t * 0.8 + r) * 20;
          ctx.beginPath();
          ctx.moveTo(rayX, 0);
          ctx.lineTo(rayX + 40, height);
          ctx.lineTo(rayX - 30, height);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();

        // Coral Reef & Seabed Kelp Plants (At Bottom Seabed)
        ctx.save();
        // Seabed Floor
        ctx.fillStyle = '#0f2942';
        ctx.beginPath();
        ctx.ellipse(width / 2, height + 10, width * 0.6, 40, 0, 0, Math.PI * 2);
        ctx.fill();

        // Waving Green Kelp Seaweed
        for (let k = 0; k < 8; k++) {
          const kX = 30 + k * (width / 7);
          const sway = Math.sin(t * 1.5 + k) * 12;
          ctx.strokeStyle = '#059669';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(kX, height);
          ctx.quadraticCurveTo(kX + sway, height - 35, kX + sway * 0.7, height - 70);
          ctx.stroke();
        }

        // Coral Formations
        for (let c = 0; c < 5; c++) {
          const cX = 60 + c * (width / 4);
          ctx.fillStyle = c % 2 === 0 ? '#EC4899' : '#8B5CF6';
          ctx.beginPath();
          ctx.arc(cX, height - 15, 12, Math.PI, 0);
          ctx.arc(cX + 8, height - 22, 10, Math.PI, 0);
          ctx.arc(cX - 8, height - 18, 9, Math.PI, 0);
          ctx.fill();
        }
        ctx.restore();

        // Rising Air Bubbles
        bubbles.forEach((b) => {
          b.y -= b.speed;
          b.x += Math.sin(t * b.wobbleSpeed) * 0.5;
          if (b.y < -10) {
            b.y = height + 10;
            b.x = Math.random() * width;
          }
          ctx.save();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        });
      } else if (type === 'bird') {
        // --- ☁️ SKY ATMOSPHERE HABITAT ---
        const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
        skyGrad.addColorStop(0, '#0284c7');
        skyGrad.addColorStop(0.6, '#38bdf8');
        skyGrad.addColorStop(1, '#bae6fd');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, width, height);

        // Drifting Cumulus Clouds
        clouds.forEach((cl) => {
          cl.x += cl.speed;
          if (cl.x > width + 80) cl.x = -80;
          ctx.save();
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.beginPath();
          ctx.arc(cl.x, cl.y, 22 * cl.scale, 0, Math.PI * 2);
          ctx.arc(cl.x + 18 * cl.scale, cl.y - 8 * cl.scale, 18 * cl.scale, 0, Math.PI * 2);
          ctx.arc(cl.x + 36 * cl.scale, cl.y, 20 * cl.scale, 0, Math.PI * 2);
          ctx.arc(cl.x + 18 * cl.scale, cl.y + 6 * cl.scale, 16 * cl.scale, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });
      } else if (type === 'butterfly' || type === 'bee') {
        // --- 🌸 FLOWER MEADOW & CANOPY HABITAT ---
        const meadowGrad = ctx.createLinearGradient(0, 0, 0, height);
        meadowGrad.addColorStop(0, '#38bdf8');
        meadowGrad.addColorStop(0.55, '#fef08a');
        meadowGrad.addColorStop(0.75, '#15803d');
        meadowGrad.addColorStop(1, '#166534');
        ctx.fillStyle = meadowGrad;
        ctx.fillRect(0, 0, width, height);

        // Blooming Meadow Flowers
        flowers.forEach((fl) => {
          ctx.save();
          const flY = height - 25;
          // Stem
          ctx.strokeStyle = '#166534';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(fl.x, height);
          ctx.lineTo(fl.x, flY);
          ctx.stroke();

          // Petals
          ctx.fillStyle = fl.color;
          for (let p = 0; p < fl.petalCount; p++) {
            const angle = (p * Math.PI * 2) / fl.petalCount;
            const px = fl.x + Math.cos(angle) * (fl.size * 0.8);
            const py = flY + Math.sin(angle) * (fl.size * 0.8);
            ctx.beginPath();
            ctx.arc(px, py, fl.size * 0.6, 0, Math.PI * 2);
            ctx.fill();
          }
          // Center
          ctx.fillStyle = '#F59E0B';
          ctx.beginPath();
          ctx.arc(fl.x, flY, fl.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });
      } else if (type === 'deer') {
        // --- 🦌 REALISTIC WOODLAND HABITAT & HERD SIMULATION ---
        const forestGrad = ctx.createLinearGradient(0, 0, 0, height);
        forestGrad.addColorStop(0, '#0a131f');
        forestGrad.addColorStop(0.4, '#113524');
        forestGrad.addColorStop(1, '#144d32');
        ctx.fillStyle = forestGrad;
        ctx.fillRect(0, 0, width, height);

        // Parallax Background Canopy Trees
        for (let b = 0; b < 6; b++) {
          const treeX = 30 + b * (width / 5) + Math.sin(t * 0.2 + b) * 8;
          ctx.fillStyle = b % 2 === 0 ? 'rgba(20, 83, 45, 0.65)' : 'rgba(15, 118, 62, 0.55)';
          ctx.beginPath();
          ctx.ellipse(treeX, height - 70, 24, 55, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#451A03';
          ctx.fillRect(treeX - 3, height - 70, 6, 40);
        }

        // Woodland Terrain Rocks & Fallen Log
        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.ellipse(80, height - 22, 18, 9, -0.1, 0, Math.PI * 2);
        ctx.ellipse(width - 120, height - 25, 24, 11, 0.1, 0, Math.PI * 2);
        ctx.fill();

        // Fallen Log
        ctx.fillStyle = '#78350F';
        ctx.beginPath();
        ctx.ellipse(width * 0.45, height - 18, 35, 7, 0.05, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#451A03';
        ctx.beginPath();
        ctx.ellipse(width * 0.45 - 33, height - 18, 4, 7, 0, 0, Math.PI * 2);
        ctx.fill();

        // Woodland Grass Floor & Wildflowers
        ctx.fillStyle = '#15803d';
        ctx.fillRect(0, height - 28, width, 28);

        for (let g = 0; g < 15; g++) {
          const gx = 15 + g * (width / 14);
          const sway = Math.sin(t * 2 + g) * 3;
          ctx.strokeStyle = g % 2 === 0 ? '#22C55E' : '#166534';
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(gx, height - 28);
          ctx.lineTo(gx + sway, height - 42);
          ctx.moveTo(gx + 4, height - 28);
          ctx.lineTo(gx + 4 + sway * 0.8, height - 38);
          ctx.stroke();

          // Wildflower Blossom
          if (g % 3 === 0) {
            ctx.fillStyle = g % 6 === 0 ? '#EC4899' : '#F59E0B';
            ctx.beginPath();
            ctx.arc(gx + sway, height - 43, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // --- DEER HERD PHYSICS & ANIMATION ---
        creatures.forEach((c) => {
          drawRealisticDeer(ctx, c, t, height, width, speedMultiplier);
        });
      }

      /* =========================================================
         2. REALISTIC ANIMAL CREATURE ANIMATION & RENDERING
         ========================================================= */

      if (type === 'bird') {
        // Soaring Flock Render (Strictly in Sky)
        creatures.forEach((c) => {
          c.x += c.vx + Math.sin(t + c.y * 0.05) * 0.4;
          c.y += c.vy + Math.cos(t * 0.8 + c.x * 0.05) * 0.2;
          c.wingAngle += 0.12;

          if (c.x > width + 30) c.x = -30;
          if (c.x < -30) c.x = width + 30;
          if (c.y > height * 0.6) c.vy = -Math.abs(c.vy);
          if (c.y < 10) c.vy = Math.abs(c.vy);

          const angle = Math.atan2(c.vy, c.vx);

          ctx.save();
          ctx.translate(c.x, c.y);
          ctx.rotate(angle * 0.3);
          ctx.strokeStyle = '#047857';
          ctx.lineWidth = 2.4;
          ctx.beginPath();
          const wing = Math.sin(c.wingAngle) * 7;
          ctx.moveTo(-10, wing);
          ctx.quadraticCurveTo(0, -5, 10, wing);
          ctx.stroke();

          // Bird Head
          ctx.fillStyle = '#065F46';
          ctx.beginPath();
          ctx.arc(0, -3, 2.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });
      } else if (type === 'fish') {
        // Swimming Fish Physics (Strictly Underwater)
        creatures.forEach((c, idx) => {
          const wobble = Math.sin(t * 2 + idx) * 0.3;
          c.vy = Math.sin(t * 1.5 + idx * 0.8) * 0.4;

          c.x += c.vx + Math.cos(t + idx) * 0.2;
          c.y += c.vy;

          // Boundary turn-around strictly underwater
          if (c.x > width - 20 && c.vx > 0) c.vx = -Math.abs(c.vx);
          if (c.x < 20 && c.vx < 0) c.vx = Math.abs(c.vx);
          if (c.y > height - 30) c.vy = -Math.abs(c.vy);
          if (c.y < height * 0.3) c.vy = Math.abs(c.vy);

          c.targetAngle = Math.atan2(c.vy, c.vx);
          let diff = c.targetAngle - c.currentAngle;
          while (diff < -Math.PI) diff += Math.PI * 2;
          while (diff > Math.PI) diff -= Math.PI * 2;
          c.currentAngle += diff * 0.1;

          ctx.save();
          ctx.translate(c.x, c.y);
          ctx.rotate(c.currentAngle);

          // Body Oval
          ctx.fillStyle = c.color;
          ctx.beginPath();
          ctx.ellipse(0, 0, c.size, c.size * 0.45, 0, 0, Math.PI * 2);
          ctx.fill();

          // Fish Eye (Pointing forward)
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(c.size * 0.55, -2, 2.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#0F172A';
          ctx.beginPath();
          ctx.arc(c.size * 0.6, -2, 1, 0, Math.PI * 2);
          ctx.fill();

          // Organic Tail Fin
          const tailWiggle = Math.sin(t * 6 + idx) * 5 + wobble * 2;
          ctx.fillStyle = c.secondaryColor;
          ctx.beginPath();
          ctx.moveTo(-c.size, 0);
          ctx.lineTo(-c.size - 8, -6 + tailWiggle);
          ctx.lineTo(-c.size - 6, 0);
          ctx.lineTo(-c.size - 8, 6 + tailWiggle);
          ctx.closePath();
          ctx.fill();

          // Pectoral Fin
          ctx.fillStyle = c.secondaryColor;
          ctx.beginPath();
          ctx.ellipse(2, 2, 4, 2, Math.PI / 4, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        });
      } else if (type === 'turtle') {
        // Slow Turtle Swimming Physics (Strictly Underwater)
        creatures.forEach((c, idx) => {
          c.x += c.vx * 0.6 + Math.cos(t * 0.4 + idx) * 0.15;
          c.y += Math.sin(t * 0.5 + idx * 1.2) * 0.25;

          if (c.x > width - 30 && c.vx > 0) c.vx = -Math.abs(c.vx);
          if (c.x < 30 && c.vx < 0) c.vx = Math.abs(c.vx);
          if (c.y > height - 35) c.vy = -Math.abs(c.vy);
          if (c.y < height * 0.35) c.vy = Math.abs(c.vy);

          c.targetAngle = Math.atan2(c.vy, c.vx);
          let diff = c.targetAngle - c.currentAngle;
          while (diff < -Math.PI) diff += Math.PI * 2;
          while (diff > Math.PI) diff -= Math.PI * 2;
          c.currentAngle += diff * 0.05;

          const flipperStroke = Math.sin(t * 2.5 + idx) * 0.5;

          ctx.save();
          ctx.translate(c.x, c.y);
          ctx.rotate(c.currentAngle);

          // Rear Flippers
          ctx.fillStyle = c.secondaryColor;
          ctx.beginPath();
          ctx.ellipse(-14, -8 + flipperStroke * 2, 6, 3, -0.4, 0, Math.PI * 2);
          ctx.ellipse(-14, 8 - flipperStroke * 2, 6, 3, 0.4, 0, Math.PI * 2);
          ctx.fill();

          // Turtle Shell
          ctx.fillStyle = c.color;
          ctx.beginPath();
          ctx.ellipse(0, 0, 16, 12, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#047857';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Shell Pattern Rings
          ctx.strokeStyle = 'rgba(255,255,255,0.3)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.ellipse(0, 0, 10, 7, 0, 0, Math.PI * 2);
          ctx.stroke();

          // Turtle Head
          ctx.fillStyle = c.secondaryColor;
          ctx.beginPath();
          ctx.ellipse(18, 0, 5, 4, 0, 0, Math.PI * 2);
          ctx.fill();

          // Front Swimming Flippers
          ctx.fillStyle = c.secondaryColor;
          ctx.beginPath();
          ctx.ellipse(6, -14 + flipperStroke * 6, 12, 4, 0.6 + flipperStroke * 0.2, 0, Math.PI * 2);
          ctx.ellipse(6, 14 - flipperStroke * 6, 12, 4, -0.6 - flipperStroke * 0.2, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        });
      } else if (type === 'bee') {
        // --- 🐝 REALISTIC HONEYBEE HABITAT & POLLINATING FLIGHT ---
        creatures.forEach((c, idx) => {
          // Zig-zag pollinating hovering towards meadow flowers
          const targetFlower = flowers[idx % flowers.length];
          const dx = targetFlower.x - c.x;
          const dy = (height - 35 - targetFlower.size) - c.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 15) {
            // Hovering over flower to pollinate
            c.vx = (Math.random() - 0.5) * 0.4;
            c.vy = (Math.random() - 0.5) * 0.4;
          } else {
            // Flight towards flower with zig-zag wobble
            c.vx += (dx / dist) * 0.05 + (Math.sin(t * 5 + idx) * 0.3);
            c.vy += (dy / dist) * 0.05 + (Math.cos(t * 4 + idx) * 0.2);
            c.vx *= 0.95;
            c.vy *= 0.95;
          }

          c.x += c.vx * speedMultiplier;
          c.y += c.vy * speedMultiplier;
          c.wingAngle += 0.8 * speedMultiplier; // High frequency wing buzz

          // Screen boundary safety
          if (c.x > width - 15) c.x = 20;
          if (c.x < 15) c.x = width - 20;
          if (c.y > height - 25) c.y = height - 50;
          if (c.y < 20) c.y = 40;

          c.targetAngle = Math.atan2(c.vy, c.vx);
          let diff = c.targetAngle - c.currentAngle;
          while (diff < -Math.PI) diff += Math.PI * 2;
          while (diff > Math.PI) diff -= Math.PI * 2;
          c.currentAngle += diff * 0.15;

          ctx.save();
          ctx.translate(c.x, c.y);
          ctx.rotate(c.currentAngle);

          // 1. Translucent Rapidly Flapping Buzzing Wings
          const wingFlap = Math.sin(c.wingAngle) * 6;
          ctx.fillStyle = 'rgba(240, 249, 255, 0.75)';
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.lineWidth = 0.8;

          // Upper & Lower Wings (Left & Right)
          ctx.beginPath();
          ctx.ellipse(0, -7 + wingFlap * 0.5, 7, 4, -0.4, 0, Math.PI * 2);
          ctx.ellipse(-3, -8 - wingFlap * 0.5, 5, 3, -0.6, 0, Math.PI * 2);
          ctx.ellipse(0, 7 - wingFlap * 0.5, 7, 4, 0.4, 0, Math.PI * 2);
          ctx.ellipse(-3, 8 + wingFlap * 0.5, 5, 3, 0.6, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // 2. Bee Abdomen (Yellow & Black Striped Body)
          ctx.fillStyle = '#F59E0B'; // Bright Bee Yellow
          ctx.beginPath();
          ctx.ellipse(0, 0, 11, 7, 0, 0, Math.PI * 2);
          ctx.fill();

          // Black Abdominal Stripes
          ctx.fillStyle = '#0F172A';
          ctx.beginPath();
          ctx.rect(-6, -6.5, 2.5, 13);
          ctx.rect(-1, -7, 2.5, 14);
          ctx.rect(4, -6.5, 2.5, 13);
          ctx.fill();

          // Re-clip Body for Smooth Oval Edge
          ctx.strokeStyle = '#D97706';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.ellipse(0, 0, 11, 7, 0, 0, Math.PI * 2);
          ctx.stroke();

          // 3. Thorax & Small Black Head
          ctx.fillStyle = '#334155'; // Dark Thorax
          ctx.beginPath();
          ctx.ellipse(7, 0, 4, 5, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#0F172A'; // Black Head
          ctx.beginPath();
          ctx.arc(11, 0, 3, 0, Math.PI * 2);
          ctx.fill();

          // Head Eyes
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(12, -1.2, 0.8, 0, Math.PI * 2);
          ctx.arc(12, 1.2, 0.8, 0, Math.PI * 2);
          ctx.fill();

          // 4. Tiny Antennae
          ctx.strokeStyle = '#0F172A';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(13, -1); ctx.lineTo(17, -4);
          ctx.moveTo(13, 1);  ctx.lineTo(17, 4);
          ctx.stroke();

          // 5. Stinger Point at Tail
          ctx.fillStyle = '#0F172A';
          ctx.beginPath();
          ctx.moveTo(-11, 0);
          ctx.lineTo(-14, -1);
          ctx.lineTo(-14, 1);
          ctx.closePath();
          ctx.fill();

          ctx.restore();
        });
      } else if (type === 'butterfly') {
        // --- 🦋 REALISTIC BUTTERFLY FLUTTERING ---
        creatures.forEach((c) => {
          c.x += (Math.random() - 0.5) * 1.8 * speedMultiplier;
          c.y += (Math.random() - 0.5) * 1.8 * speedMultiplier;
          c.wingAngle += 0.35 * speedMultiplier;

          if (c.x > width - 15) c.x = 25;
          if (c.x < 15) c.x = width - 25;
          if (c.y > height - 30) c.y = height - 60;
          if (c.y < 20) c.y = 40;

          ctx.save();
          ctx.translate(c.x, c.y);
          const w = Math.abs(Math.sin(c.wingAngle)) * 10 + 3;

          // Butterfly Forewings & Hindwings
          ctx.fillStyle = c.color;
          ctx.beginPath();
          ctx.ellipse(-w * 0.4, -4, w * 0.8, 6, 0.3, 0, Math.PI * 2);
          ctx.ellipse(w * 0.4, -4, w * 0.8, 6, -0.3, 0, Math.PI * 2);
          ctx.ellipse(-w * 0.3, 4, w * 0.6, 5, -0.2, 0, Math.PI * 2);
          ctx.ellipse(w * 0.3, 4, w * 0.6, 5, 0.2, 0, Math.PI * 2);
          ctx.fill();

          // Slender Body
          ctx.fillStyle = '#1E293B';
          ctx.beginPath();
          ctx.ellipse(0, 0, 1.8, 8, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        });
      } else if (type === 'deer') {
        // Deer herd master rendering handled in backdrop woodland section
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [type, speedMultiplier]);

  if (type === 'none') return null;

  return (
    <div className={`absolute inset-0 pointer-events-none z-15 ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export default WildlifeCanvas;
