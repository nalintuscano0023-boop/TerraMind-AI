import React, { useEffect, useRef } from 'react';

interface OceanHealthCanvasProps {
  plasticReduction: number; // 0 - 100
  activeDroneCount: number; // 1 - 6
  className?: string;
}

interface MarineEntity {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  type: 'fish' | 'turtle' | 'whale' | 'stingray';
  color: string;
  secondaryColor: string;
  currentAngle: number;
  targetAngle: number;
}

interface DebrisEntity {
  x: number;
  y: number;
  vy: number;
  type: 'bottle' | 'barrel' | 'bag';
  size: number;
  rotation: number;
  rotSpeed: number;
}

export const OceanHealthCanvas: React.FC<OceanHealthCanvasProps> = ({
  plasticReduction,
  activeDroneCount,
  className = '',
}) => {
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

    // Initialize Marine Life
    const marineLife: MarineEntity[] = [];
    const creatureTypes: ('fish' | 'turtle' | 'whale' | 'stingray')[] = [
      'fish', 'fish', 'fish', 'fish', 'turtle', 'turtle', 'stingray', 'whale',
    ];

    creatureTypes.forEach((type, i) => {
      const vx = (Math.random() > 0.5 ? 1 : -1) * (0.5 + Math.random() * 0.8) * (type === 'turtle' ? 0.4 : type === 'whale' ? 0.3 : 1.2);
      const vy = (Math.random() - 0.5) * 0.3;
      const angle = Math.atan2(vy, vx);

      marineLife.push({
        x: Math.random() * (width || 600),
        y: type === 'whale'
          ? (height || 260) * 0.65
          : type === 'turtle'
          ? (height || 260) * 0.45 + Math.random() * ((height || 260) * 0.3)
          : (height || 260) * 0.35 + Math.random() * ((height || 260) * 0.4),
        vx,
        vy,
        size: type === 'whale' ? 36 : type === 'turtle' ? 20 : type === 'stingray' ? 22 : 12,
        type,
        color:
          type === 'fish'
            ? i % 2 === 0 ? '#38BDF8' : '#00E5A8'
            : type === 'turtle'
            ? '#059669'
            : type === 'whale'
            ? '#0284C7'
            : '#7C3AED',
        secondaryColor:
          type === 'fish'
            ? i % 2 === 0 ? '#0284C7' : '#059669'
            : type === 'turtle'
            ? '#10B981'
            : type === 'whale'
            ? '#38BDF8'
            : '#C084FC',
        currentAngle: angle,
        targetAngle: angle,
      });
    });

    // Initialize Surface Debris
    const maxDebris = 16;
    const debrisList: DebrisEntity[] = [];
    for (let i = 0; i < maxDebris; i++) {
      debrisList.push({
        x: 40 + Math.random() * ((width || 600) - 80),
        y: 25 + Math.random() * 60,
        vy: (Math.random() - 0.5) * 0.1,
        type: i % 3 === 0 ? 'bottle' : i % 3 === 1 ? 'barrel' : 'bag',
        size: i % 3 === 1 ? 14 : 10,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
      });
    }

    const render = () => {
      t += 0.025;
      ctx.clearRect(0, 0, width, height);

      // 1. Water Background Gradient
      const waterHealth = plasticReduction / 100;
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      if (waterHealth > 0.6) {
        grad.addColorStop(0, '#0284C7');
        grad.addColorStop(0.5, '#0369A1');
        grad.addColorStop(1, '#0C4A6E');
      } else if (waterHealth > 0.3) {
        grad.addColorStop(0, '#0369A1');
        grad.addColorStop(0.5, '#1E293B');
        grad.addColorStop(1, '#0F172A');
      } else {
        grad.addColorStop(0, '#334155');
        grad.addColorStop(0.5, '#1E293B');
        grad.addColorStop(1, '#020617');
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // 2. Animated Surface Waves & Sun Rays
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let x = 0; x < width; x += 10) {
        const y = 15 + Math.sin(x * 0.02 + t * 2) * 5 + Math.cos(x * 0.01 + t * 1.5) * 3;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Underwater Sun Rays
      if (waterHealth > 0.3) {
        ctx.fillStyle = 'rgba(56, 189, 248, 0.04)';
        ctx.beginPath();
        ctx.moveTo(width * 0.2, 0);
        ctx.lineTo(width * 0.35, height);
        ctx.lineTo(width * 0.45, height);
        ctx.lineTo(width * 0.25, 0);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(width * 0.6, 0);
        ctx.lineTo(width * 0.75, height);
        ctx.lineTo(width * 0.85, height);
        ctx.lineTo(width * 0.68, 0);
        ctx.fill();
      }

      // 3. Seabed Coral Reef & Seaweed at Bottom
      const numSeaweed = 12;
      for (let i = 0; i < numSeaweed; i++) {
        const sx = (i + 0.5) * (width / numSeaweed);
        const sy = height - 5;
        const sway = Math.sin(t * 1.5 + i) * 12;

        // Seaweed Strand
        ctx.strokeStyle = i % 2 === 0 ? '#059669' : '#10B981';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.quadraticCurveTo(sx + sway * 0.5, sy - 25, sx + sway, sy - 50);
        ctx.stroke();
      }

      // Coral Structures
      const coralColors = ['#F43F5E', '#FB923C', '#A855F7', '#38BDF8'];
      for (let i = 0; i < 6; i++) {
        const cx = 30 + i * (width / 5.5);
        const cy = height - 8;
        const color = coralColors[i % coralColors.length];

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(cx, cy, 14, Math.PI, Math.PI * 2);
        ctx.fill();

        // Coral Branch
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(cx - 4, cy - 10);
        ctx.lineTo(cx - 8, cy - 22);
        ctx.moveTo(cx + 4, cy - 10);
        ctx.lineTo(cx + 8, cy - 20);
        ctx.stroke();
      }

      // 4. Underwater Marine Life (Scales with water health)
      const visibleMarineCount = Math.max(1, Math.round((waterHealth) * marineLife.length));
      for (let i = 0; i < visibleMarineCount; i++) {
        const m = marineLife[i];

        m.x += m.vx + Math.cos(t + i) * 0.2;
        m.y += m.vy + Math.sin(t * 0.8 + i) * 0.2;

        if (m.x > width - 30 && m.vx > 0) m.vx = -Math.abs(m.vx);
        if (m.x < 30 && m.vx < 0) m.vx = Math.abs(m.vx);
        if (m.y > height - 30) m.vy = -Math.abs(m.vy);
        if (m.y < height * 0.25) m.vy = Math.abs(m.vy);

        m.targetAngle = Math.atan2(m.vy, m.vx);
        let diff = m.targetAngle - m.currentAngle;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        m.currentAngle += diff * 0.08;

        ctx.save();
        ctx.translate(m.x, m.y);
        ctx.rotate(m.currentAngle);

        if (m.type === 'fish') {
          // Fish Body
          ctx.fillStyle = m.color;
          ctx.beginPath();
          ctx.ellipse(0, 0, m.size, m.size * 0.45, 0, 0, Math.PI * 2);
          ctx.fill();

          // Fish Eye
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(m.size * 0.5, -2, 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#0F172A';
          ctx.beginPath();
          ctx.arc(m.size * 0.55, -2, 0.9, 0, Math.PI * 2);
          ctx.fill();

          // Wiggling Tail Fin
          const tailWiggle = Math.sin(t * 6 + i) * 4;
          ctx.fillStyle = m.secondaryColor;
          ctx.beginPath();
          ctx.moveTo(-m.size, 0);
          ctx.lineTo(-m.size - 6, -5 + tailWiggle);
          ctx.lineTo(-m.size - 4, 0);
          ctx.lineTo(-m.size - 6, 5 + tailWiggle);
          ctx.closePath();
          ctx.fill();
        } else if (m.type === 'turtle') {
          const flipper = Math.sin(t * 2.5 + i) * 0.4;
          // Turtle Flippers
          ctx.fillStyle = m.secondaryColor;
          ctx.beginPath();
          ctx.ellipse(4, -12 + flipper * 5, 10, 3.5, 0.5, 0, Math.PI * 2);
          ctx.ellipse(4, 12 - flipper * 5, 10, 3.5, -0.5, 0, Math.PI * 2);
          ctx.fill();

          // Shell
          ctx.fillStyle = m.color;
          ctx.beginPath();
          ctx.ellipse(0, 0, 14, 10, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#047857';
          ctx.lineWidth = 1.2;
          ctx.stroke();

          // Head
          ctx.fillStyle = m.secondaryColor;
          ctx.beginPath();
          ctx.ellipse(15, 0, 4, 3, 0, 0, Math.PI * 2);
          ctx.fill();
        } else if (m.type === 'whale') {
          // Whale Silhouette Body
          ctx.fillStyle = m.color;
          ctx.beginPath();
          ctx.ellipse(0, 0, m.size, m.size * 0.4, 0, 0, Math.PI * 2);
          ctx.fill();
          // Whale Tail
          const tailW = Math.sin(t * 3) * 4;
          ctx.beginPath();
          ctx.moveTo(-m.size, 0);
          ctx.lineTo(-m.size - 10, -8 + tailW);
          ctx.lineTo(-m.size - 10, 8 + tailW);
          ctx.closePath();
          ctx.fill();
        } else if (m.type === 'stingray') {
          // Stingray Wings
          ctx.fillStyle = m.color;
          ctx.beginPath();
          ctx.moveTo(m.size, 0);
          ctx.quadraticCurveTo(0, -m.size, -m.size * 0.5, 0);
          ctx.quadraticCurveTo(0, m.size, m.size, 0);
          ctx.fill();
          // Tail Whip
          ctx.strokeStyle = m.secondaryColor;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(-m.size * 0.5, 0);
          ctx.lineTo(-m.size - 12, Math.sin(t * 4 + i) * 3);
          ctx.stroke();
        }

        ctx.restore();
      }

      // 5. Surface Plastic Debris (Count drops with plasticReduction)
      const visibleDebrisCount = Math.max(0, Math.round((1 - waterHealth) * maxDebris));
      for (let i = 0; i < visibleDebrisCount; i++) {
        const d = debrisList[i];
        d.x += Math.cos(t + i) * 0.3;
        d.y += d.vy;
        d.rotation += d.rotSpeed;

        if (d.x > width - 30) d.x = 30;
        if (d.x < 30) d.x = width - 30;

        ctx.save();
        ctx.translate(d.x, d.y);
        ctx.rotate(d.rotation);

        if (d.type === 'bottle') {
          ctx.fillStyle = 'rgba(239, 68, 68, 0.85)';
          ctx.fillRect(-3, -8, 6, 12);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.fillRect(-1.5, -11, 3, 3);
        } else if (d.type === 'barrel') {
          ctx.fillStyle = '#F59E0B';
          ctx.beginPath();
          ctx.ellipse(0, 0, 7, 10, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#78350F';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        } else {
          ctx.fillStyle = 'rgba(203, 213, 225, 0.75)';
          ctx.beginPath();
          ctx.ellipse(0, 0, 8, 6, 0.4, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      // 6. Autonomous Skimmer Drones
      for (let i = 0; i < activeDroneCount; i++) {
        const dx = ((t * 60 + i * (width / activeDroneCount)) % (width + 80)) - 40;
        const dy = 22 + Math.sin(t * 2 + i) * 4;

        // Laser Scanning Cone down to water surface
        const scanGrad = ctx.createLinearGradient(dx, dy, dx, dy + 50);
        scanGrad.addColorStop(0, 'rgba(56, 189, 248, 0.4)');
        scanGrad.addColorStop(1, 'rgba(56, 189, 248, 0.0)');
        ctx.fillStyle = scanGrad;
        ctx.beginPath();
        ctx.moveTo(dx, dy);
        ctx.lineTo(dx - 22, dy + 50);
        ctx.lineTo(dx + 22, dy + 50);
        ctx.closePath();
        ctx.fill();

        // Skimmer Boat Body
        ctx.save();
        ctx.translate(dx, dy);
        ctx.fillStyle = '#0F172A';
        ctx.strokeStyle = '#38BDF8';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-16, -4);
        ctx.lineTo(16, -4);
        ctx.lineTo(22, 4);
        ctx.lineTo(-12, 4);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Glowing Drone Beacon
        ctx.fillStyle = '#00E5A8';
        ctx.beginPath();
        ctx.arc(0, -6, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [plasticReduction, activeDroneCount]);

  return (
    <div className={`relative w-full h-full pointer-events-none ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export default OceanHealthCanvas;
