import React, { useEffect, useRef } from 'react';

const Bubble: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const setCanvasDimensions = () => {
      canvas.width = Math.min(400, window.innerWidth * 0.8);
      canvas.height = canvas.width;
    };
    
    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);
    
    let animationFrameId: number;
    let hue = 0;
    
    const drawBubble = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 2
      );
      
      gradient.addColorStop(0, `hsla(${hue}, 100%, 95%, 0.3)`);
      gradient.addColorStop(0.5, `hsla(${(hue + 30) % 360}, 100%, 85%, 0.2)`);
      gradient.addColorStop(1, `hsla(${(hue + 60) % 360}, 100%, 75%, 0.1)`);
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 2 - 10,
        0,
        Math.PI * 2
      );
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(
        canvas.width * 0.35,
        canvas.height * 0.35,
        canvas.width * 0.15,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.fill();
      
      hue = (hue + 0.2) % 360;
      
      animationFrameId = requestAnimationFrame(drawBubble);
    };
    
    drawBubble();
    
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return (
    <div className="relative flex justify-center items-center py-8">
      <canvas 
        ref={canvasRef} 
        className="max-w-full h-auto" 
        style={{ 
          filter: 'drop-shadow(0 10px 15px rgba(0, 0, 0, 0.05))',
        }}
      />
    </div>
  );
};

export default Bubble;