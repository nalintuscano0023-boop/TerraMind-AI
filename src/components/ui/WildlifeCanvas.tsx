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

      creatures.push({
        x: Math.random() * (width || 600),
        y: initialY,
        vx,
        vy,
        size: isTurtle ? 22 : isFish ? 13 : type === 'deer' ? 30 : 8,
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
            : type === 'turtle'
            ? '#059669'
            : '#D97706',
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
        creatures.forEach((c, idx) => {
          // Initialize state machine properties if absent
          if (!c.deerState) {
            c.deerState = idx === 0 ? 'walking' : idx === 1 ? 'grazing' : 'idle';
            c.deerTimer = 60 + Math.floor(Math.random() * 120);
            c.jumpProgress = 0;
            c.headAngle = 0;
            c.legCycle = idx * 1.2;
          }

          // State Machine Transition Logic
          c.deerTimer -= 1;
          if (c.deerTimer <= 0) {
            const states: Array<'walking' | 'running' | 'jumping' | 'grazing' | 'looking' | 'idle'> = [
              'walking', 'walking', 'grazing', 'grazing', 'looking', 'idle', 'running', 'jumping'
            ];
            c.deerState = states[Math.floor(Math.random() * states.length)];
            c.deerTimer = c.deerState === 'jumping' ? 45 : c.deerState === 'grazing' ? 140 : 80 + Math.floor(Math.random() * 100);
            if (c.deerState === 'jumping') c.jumpProgress = 0;
          }

          // Herd Separation & Cohesion (Avoid Collision / Overlapping)
          creatures.forEach((other, oIdx) => {
            if (idx !== oIdx) {
              const distX = Math.abs(c.x - other.x);
              if (distX < 45) {
                c.x += c.x > other.x ? 0.6 : -0.6;
              }
            }
          });

          // State Behaviors
          let moveSpeed = 0;
          let yOffset = 0;
          let headTargetAngle = 0;

          if (c.deerState === 'walking') {
            moveSpeed = 0.75 * speedMultiplier;
            c.legCycle += 0.12 * speedMultiplier;
            headTargetAngle = Math.sin(t * 3 + idx) * 0.08;
          } else if (c.deerState === 'running') {
            moveSpeed = 2.2 * speedMultiplier;
            c.legCycle += 0.25 * speedMultiplier;
            headTargetAngle = 0.15;
          } else if (c.deerState === 'jumping') {
            moveSpeed = 1.8 * speedMultiplier;
            c.jumpProgress = Math.min(1, c.jumpProgress + 0.025 * speedMultiplier);
            yOffset = -Math.sin(c.jumpProgress * Math.PI) * 32;
            c.legCycle += 0.2;
            headTargetAngle = -0.2;
          } else if (c.deerState === 'grazing') {
            moveSpeed = 0.05;
            headTargetAngle = 0.75; // Head lowered to grass
          } else if (c.deerState === 'looking') {
            moveSpeed = 0;
            headTargetAngle = -0.35 + Math.sin(t * 1.5) * 0.25; // Looking up & around
          } else {
            // Idle
            moveSpeed = 0;
            headTargetAngle = Math.sin(t * 2 + idx) * 0.05;
          }

          c.x += moveSpeed;
          if (c.x > width + 50) c.x = -50;

          // Head Angle Lerp
          c.headAngle += (headTargetAngle - c.headAngle) * 0.1;

          // Draw Articulated Deer Body
          ctx.save();
          const baseGroundY = height - 32 + yOffset;
          const breathingScale = 1 + Math.sin(t * 2.5 + idx) * 0.02;
          ctx.translate(c.x, baseGroundY);
          ctx.scale(breathingScale, breathingScale);

          // 1. Articulated Legs (4 Legs with Knee/Hock Joints)
          ctx.strokeStyle = '#D97706'; // Warm Cervid Brown
          ctx.lineWidth = 2.4;
          ctx.lineCap = 'round';

          const legSwing1 = Math.sin(c.legCycle) * 12;
          const legSwing2 = Math.sin(c.legCycle + Math.PI) * 12;

          // Hind Legs (Back Left & Right)
          ctx.beginPath();
          ctx.moveTo(-10, 6);
          ctx.lineTo(-12 - legSwing1 * 0.5, 15);
          ctx.lineTo(-10 - legSwing1, 24);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(-4, 6);
          ctx.lineTo(-6 - legSwing2 * 0.5, 15);
          ctx.lineTo(-4 - legSwing2, 24);
          ctx.stroke();

          // Fore Legs (Front Left & Right)
          ctx.beginPath();
          ctx.moveTo(8, 6);
          ctx.lineTo(10 + legSwing2 * 0.5, 15);
          ctx.lineTo(8 + legSwing2, 24);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(14, 6);
          ctx.lineTo(16 + legSwing1 * 0.5, 15);
          ctx.lineTo(14 + legSwing1, 24);
          ctx.stroke();

          // 2. Main Deer Body (Torso & Flank)
          ctx.fillStyle = c.color || '#B45309';
          ctx.beginPath();
          ctx.ellipse(0, 0, 18, 10, 0, 0, Math.PI * 2);
          ctx.fill();

          // Underbelly Highlight
          ctx.fillStyle = '#FDE68A';
          ctx.beginPath();
          ctx.ellipse(-2, 3, 12, 5, 0, 0, Math.PI * 2);
          ctx.fill();

          // Tail Flick
          const tailFlick = Math.sin(t * 4 + idx) * 0.4;
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.ellipse(-18, -3 + tailFlick * 2, 4, 3, -0.4 + tailFlick, 0, Math.PI * 2);
          ctx.fill();

          // 3. Neck & Articulated Head (Rotates on headAngle)
          ctx.save();
          ctx.translate(14, -6);
          ctx.rotate(c.headAngle);

          // Neck
          ctx.fillStyle = c.color || '#B45309';
          ctx.beginPath();
          ctx.ellipse(4, -6, 5, 9, 0.4, 0, Math.PI * 2);
          ctx.fill();

          // Head & Snout
          ctx.beginPath();
          ctx.ellipse(9, -12, 6, 4.5, 0.2, 0, Math.PI * 2);
          ctx.fill();

          // Eye
          ctx.fillStyle = '#0F172A';
          ctx.beginPath();
          ctx.arc(10, -13.5, 1.2, 0, Math.PI * 2);
          ctx.fill();

          // Twitching Ears
          const earTwitch = Math.sin(t * 6 + idx) * 0.15;
          ctx.fillStyle = c.secondaryColor || '#78350F';
          ctx.beginPath();
          ctx.ellipse(6, -17 + earTwitch * 3, 3, 1.5, -0.8 + earTwitch, 0, Math.PI * 2);
          ctx.fill();

          // Branching Antlers (For Bucks)
          if (idx % 2 === 0) {
            ctx.strokeStyle = '#78350F';
            ctx.lineWidth = 1.6;
            ctx.beginPath();
            ctx.moveTo(7, -15);
            ctx.lineTo(10, -24);
            ctx.lineTo(14, -22);
            ctx.moveTo(10, -24);
            ctx.lineTo(8, -28);
            ctx.stroke();
          }

          ctx.restore(); // End Head Transform
          ctx.restore(); // End Deer Body Transform
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
        // Walking Deer Silhouettes (Strictly Ground Level)
        creatures.forEach((c, idx) => {
          c.x += 0.8;
          if (c.x > width + 40) c.x = -40;

          ctx.save();
          ctx.translate(c.x, height - 45 + Math.sin(t * 2 + idx) * 1.5);
          ctx.fillStyle = c.color;
          // Body
          ctx.beginPath();
          ctx.ellipse(0, 0, 18, 10, 0, 0, Math.PI * 2);
          ctx.fill();
          // Head & Neck
          ctx.beginPath();
          ctx.ellipse(14, -10, 6, 8, 0.3, 0, Math.PI * 2);
          ctx.fill();
          // Antlers
          ctx.strokeStyle = c.secondaryColor;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(16, -16); ctx.lineTo(19, -24); ctx.lineTo(22, -22);
          ctx.moveTo(19, -24); ctx.lineTo(16, -28);
          ctx.stroke();
          // Animated Legs
          const legMove = Math.sin(t * 4 + idx) * 6;
          ctx.strokeStyle = c.secondaryColor;
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.moveTo(-10, 8); ctx.lineTo(-10 + legMove, 22);
          ctx.moveTo(-4, 8);  ctx.lineTo(-4 - legMove, 22);
          ctx.moveTo(8, 8);   ctx.lineTo(8 + legMove, 22);
          ctx.moveTo(14, 8);  ctx.lineTo(14 - legMove, 22);
          ctx.stroke();
          ctx.restore();
        });
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
