import React, { useEffect, useRef } from 'react';

type WildlifeType = 'bird' | 'fish' | 'butterfly' | 'bee' | 'deer' | 'turtle' | 'none';

interface WildlifeCanvasProps {
  type: WildlifeType;
  className?: string;
}

export const WildlifeCanvas: React.FC<WildlifeCanvasProps> = ({ type, className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 320);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle / Creature objects
    let t = 0;
    const creatures: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      wingAngle: number;
      color: string;
    }[] = [];

    const numItems = type === 'bee' ? 25 : type === 'butterfly' ? 20 : type === 'bird' ? 14 : type === 'fish' ? 16 : 8;

    for (let i = 0; i < numItems; i++) {
      creatures.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.2,
        size: type === 'turtle' ? 24 : type === 'deer' ? 32 : type === 'fish' ? 14 : 8,
        wingAngle: Math.random() * Math.PI * 2,
        color:
          type === 'butterfly'
            ? ['#F59E0B', '#38BDF8', '#7C3AED', '#00E5A8'][i % 4]
            : type === 'bee'
            ? '#F59E0B'
            : type === 'bird'
            ? '#00E5A8'
            : type === 'fish'
            ? '#38BDF8'
            : '#10B981',
      });
    }

    const render = () => {
      t += 0.03;
      ctx.clearRect(0, 0, width, height);

      if (type === 'bird') {
        // Soaring Flock Render
        creatures.forEach((c) => {
          c.x += c.vx + Math.sin(t + c.y) * 0.5;
          c.y += c.vy;
          c.wingAngle += 0.15;

          if (c.x > width + 20) c.x = -20;
          if (c.x < -20) c.x = width + 20;
          if (c.y > height + 20) c.y = -20;
          if (c.y < -20) c.y = height + 20;

          // Draw Bird V-wing shape
          ctx.save();
          ctx.translate(c.x, c.y);
          ctx.strokeStyle = '#00E5A8';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          const wing = Math.sin(c.wingAngle) * 8;
          ctx.moveTo(-10, wing);
          ctx.quadraticCurveTo(0, -6, 10, wing);
          ctx.stroke();
          ctx.restore();
        });
      } else if (type === 'fish' || type === 'turtle') {
        // Underwater Fish/Turtle Render
        creatures.forEach((c, idx) => {
          c.x += Math.cos(t * 0.5 + idx) * 1.2 + 0.5;
          c.y += Math.sin(t * 0.8 + idx) * 0.8;

          if (c.x > width + 30) c.x = -30;

          ctx.save();
          ctx.translate(c.x, c.y);
          if (type === 'turtle') {
            // Shell
            ctx.fillStyle = '#059669';
            ctx.beginPath();
            ctx.ellipse(0, 0, 16, 12, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#34D399';
            ctx.lineWidth = 1.5;
            ctx.stroke();
            // Flippers
            const fAngle = Math.sin(t * 2 + idx) * 0.4;
            ctx.fillStyle = '#10B981';
            ctx.beginPath();
            ctx.ellipse(8, -12 + fAngle * 5, 10, 4, 0.4, 0, Math.PI * 2);
            ctx.ellipse(8, 12 - fAngle * 5, 10, 4, -0.4, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Fish Body & Tail
            ctx.fillStyle = idx % 2 === 0 ? '#38BDF8' : '#06B6D4';
            ctx.beginPath();
            ctx.ellipse(0, 0, 10, 5, 0, 0, Math.PI * 2);
            ctx.fill();
            // Tail Fin
            const tailWiggle = Math.sin(t * 4 + idx) * 4;
            ctx.beginPath();
            ctx.moveTo(-10, 0);
            ctx.lineTo(-18, -6 + tailWiggle);
            ctx.lineTo(-18, 6 + tailWiggle);
            ctx.closePath();
            ctx.fill();
          }
          ctx.restore();
        });
      } else if (type === 'butterfly' || type === 'bee') {
        // Fluttering Insects
        creatures.forEach((c) => {
          c.x += (Math.random() - 0.5) * 2;
          c.y += (Math.random() - 0.5) * 2;
          c.wingAngle += 0.3;

          ctx.save();
          ctx.translate(c.x, c.y);
          const w = Math.abs(Math.sin(c.wingAngle)) * 8 + 2;
          ctx.fillStyle = c.color;
          ctx.beginPath();
          ctx.ellipse(-w / 2, 0, w, 5, 0.2, 0, Math.PI * 2);
          ctx.ellipse(w / 2, 0, w, 5, -0.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });
      } else if (type === 'deer') {
        // Walking Deer Silhouettes
        creatures.forEach((c, idx) => {
          c.x += 0.8;
          if (c.x > width + 40) c.x = -40;

          ctx.save();
          ctx.translate(c.x, height - 50 + Math.sin(t + idx) * 2);
          ctx.fillStyle = '#D97706';
          // Body
          ctx.beginPath();
          ctx.ellipse(0, 0, 18, 10, 0, 0, Math.PI * 2);
          ctx.fill();
          // Head & Neck
          ctx.beginPath();
          ctx.ellipse(14, -10, 6, 8, 0.3, 0, Math.PI * 2);
          ctx.fill();
          // Legs animation
          const legMove = Math.sin(t * 3 + idx) * 6;
          ctx.strokeStyle = '#B45309';
          ctx.lineWidth = 2.5;
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
