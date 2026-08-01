import React, { useEffect, useRef } from 'react';

type WildlifeType = 'bird' | 'fish' | 'butterfly' | 'bee' | 'deer' | 'turtle' | 'none';

interface WildlifeCanvasProps {
  type: WildlifeType;
  className?: string;
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
}

export const WildlifeCanvas: React.FC<WildlifeCanvasProps> = ({ type, className = '' }) => {
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
    const creatures: Creature[] = [];
    const numItems =
      type === 'bee' ? 22 : type === 'butterfly' ? 18 : type === 'bird' ? 14 : type === 'fish' ? 16 : type === 'turtle' ? 6 : 8;

    for (let i = 0; i < numItems; i++) {
      const isTurtle = type === 'turtle';
      const isFish = type === 'fish';
      const speedScale = isTurtle ? 0.4 : isFish ? 1.2 : 1.5;

      const vx = (Math.random() > 0.5 ? 1 : -1) * (0.6 + Math.random() * 0.8) * speedScale;
      const vy = (Math.random() - 0.5) * 0.4 * speedScale;
      const initialAngle = Math.atan2(vy, vx);

      creatures.push({
        x: Math.random() * (width || 600),
        y: isTurtle
          ? height * 0.5 + Math.random() * (height * 0.35)
          : isFish
          ? height * 0.4 + Math.random() * (height * 0.5)
          : Math.random() * (height || 320),
        vx,
        vy,
        size: isTurtle ? 22 : isFish ? 14 : type === 'deer' ? 30 : 8,
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
      t += 0.025;
      ctx.clearRect(0, 0, width, height);

      if (type === 'bird') {
        // Soaring Flock Render
        creatures.forEach((c) => {
          c.x += c.vx + Math.sin(t + c.y * 0.05) * 0.4;
          c.y += c.vy + Math.cos(t * 0.8 + c.x * 0.05) * 0.2;
          c.wingAngle += 0.12;

          if (c.x > width + 30) c.x = -30;
          if (c.x < -30) c.x = width + 30;
          if (c.y > height + 30) c.y = -30;
          if (c.y < -30) c.y = height + 30;

          const angle = Math.atan2(c.vy, c.vx);

          ctx.save();
          ctx.translate(c.x, c.y);
          ctx.rotate(angle * 0.3); // Subtle roll in direction of flight
          ctx.strokeStyle = c.color;
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          const wing = Math.sin(c.wingAngle) * 7;
          ctx.moveTo(-10, wing);
          ctx.quadraticCurveTo(0, -5, 10, wing);
          ctx.stroke();

          // Bird Head
          ctx.fillStyle = c.color;
          ctx.beginPath();
          ctx.arc(0, -3, 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });
      } else if (type === 'fish') {
        // Realistic Swim Physics — Fish face direction of movement
        creatures.forEach((c, idx) => {
          // Gentle organic steering & swimming wobble
          const wobble = Math.sin(t * 2 + idx) * 0.3;
          c.vy = Math.sin(t * 1.5 + idx * 0.8) * 0.4;

          c.x += c.vx + Math.cos(t + idx) * 0.2;
          c.y += c.vy;

          // Boundary turn-around logic
          if (c.x > width - 20 && c.vx > 0) c.vx = -Math.abs(c.vx);
          if (c.x < 20 && c.vx < 0) c.vx = Math.abs(c.vx);
          if (c.y > height - 20) c.vy = -Math.abs(c.vy);
          if (c.y < height * 0.3) c.vy = Math.abs(c.vy);

          c.targetAngle = Math.atan2(c.vy, c.vx);
          // Smooth rotation lerping so fish turn gracefully
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

          // Fish Eye (Pointing forward in movement direction +X)
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(c.size * 0.55, -2, 2.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#0F172A';
          ctx.beginPath();
          ctx.arc(c.size * 0.6, -2, 1, 0, Math.PI * 2);
          ctx.fill();

          // Organic Wiggling Tail Fin (Trailing behind at -X)
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
        // Organic Slow Turtle Swimming Physics
        creatures.forEach((c, idx) => {
          c.x += c.vx * 0.6 + Math.cos(t * 0.4 + idx) * 0.15;
          c.y += Math.sin(t * 0.5 + idx * 1.2) * 0.25;

          if (c.x > width - 30 && c.vx > 0) c.vx = -Math.abs(c.vx);
          if (c.x < 30 && c.vx < 0) c.vx = Math.abs(c.vx);
          if (c.y > height - 30) c.y = height - 35;
          if (c.y < height * 0.35) c.y = height * 0.38;

          c.targetAngle = Math.atan2(c.vy, c.vx);
          let diff = c.targetAngle - c.currentAngle;
          while (diff < -Math.PI) diff += Math.PI * 2;
          while (diff > Math.PI) diff -= Math.PI * 2;
          c.currentAngle += diff * 0.05; // Slow heavy turning

          const flipperStroke = Math.sin(t * 2.5 + idx) * 0.5;

          ctx.save();
          ctx.translate(c.x, c.y);
          ctx.rotate(c.currentAngle);

          // Rear Flippers (Back at -X)
          ctx.fillStyle = c.secondaryColor;
          ctx.beginPath();
          ctx.ellipse(-14, -8 + flipperStroke * 2, 6, 3, -0.4, 0, Math.PI * 2);
          ctx.ellipse(-14, 8 - flipperStroke * 2, 6, 3, 0.4, 0, Math.PI * 2);
          ctx.fill();

          // Turtle Shell (Oval Body)
          ctx.fillStyle = c.color;
          ctx.beginPath();
          ctx.ellipse(0, 0, 16, 12, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#047857';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Shell Pattern Rings
          ctx.strokeStyle = 'rgba(255,255,255,0.2)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.ellipse(0, 0, 10, 7, 0, 0, Math.PI * 2);
          ctx.stroke();

          // Turtle Head (Front at +X)
          ctx.fillStyle = c.secondaryColor;
          ctx.beginPath();
          ctx.ellipse(18, 0, 5, 4, 0, 0, Math.PI * 2);
          ctx.fill();

          // Turtle Eyes
          ctx.fillStyle = '#064E3B';
          ctx.beginPath();
          ctx.arc(20, -1.5, 0.8, 0, Math.PI * 2);
          ctx.arc(20, 1.5, 0.8, 0, Math.PI * 2);
          ctx.fill();

          // Front Swimming Flippers (Upper & Lower at +X)
          ctx.fillStyle = c.secondaryColor;
          ctx.beginPath();
          ctx.ellipse(6, -14 + flipperStroke * 6, 12, 4, 0.6 + flipperStroke * 0.2, 0, Math.PI * 2);
          ctx.ellipse(6, 14 - flipperStroke * 6, 12, 4, -0.6 - flipperStroke * 0.2, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        });
      } else if (type === 'butterfly' || type === 'bee') {
        // Fluttering Insects
        creatures.forEach((c) => {
          c.x += (Math.random() - 0.5) * 1.8;
          c.y += (Math.random() - 0.5) * 1.8;
          c.wingAngle += 0.35;

          if (c.x > width - 10) c.x = 20;
          if (c.x < 10) c.x = width - 20;
          if (c.y > height - 10) c.y = 20;
          if (c.y < 10) c.y = height - 20;

          ctx.save();
          ctx.translate(c.x, c.y);
          const w = Math.abs(Math.sin(c.wingAngle)) * 8 + 2;
          ctx.fillStyle = c.color;
          ctx.beginPath();
          ctx.ellipse(-w / 2, 0, w, 4, 0.2, 0, Math.PI * 2);
          ctx.ellipse(w / 2, 0, w, 4, -0.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });
      } else if (type === 'deer') {
        // Walking Deer Silhouettes
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
  }, [type]);

  if (type === 'none') return null;

  return (
    <div className={`absolute inset-0 pointer-events-none z-15 ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export default WildlifeCanvas;

