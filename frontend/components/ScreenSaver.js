import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@chakra-ui/react';

const ScreenSaver = () => {
  const canvasRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const timeoutRef = useRef(null);
  const animationFrameRef = useRef(null);
  const baseColor = '#26A69A'; // Original teal
  const darkColor = '#1B7A71'; // Darker teal for depth
  const glowColor = '#4DD0C5'; // Brighter teal for glow
  const tintColors = ['#FFFFFF']; // White tint

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const columnCount = 200;
    const particlesPerColumn = 60;
    const particles = [];

    for (let col = 0; col < columnCount; col++) {
      for (let i = 0; i < particlesPerColumn; i++) {
        const x = (col + Math.random() * 0.5) * (canvas.width / columnCount);
        particles.push({
          type: 'rain',
          x,
          y: -i * (canvas.height / particlesPerColumn) - Math.random() * canvas.height,
          speed: Math.random() * 5 + 1,
          width: Math.random() + 0.5,
          height: (Math.random() + 0.5) * 1.5,
          opacity: Math.random() * 0.3 + 0.7,
        });
      }
    }

    const resetTimeout = () => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setIsActive(true);
      }, 120000); // 2 mins
    };

    const animate = () => {
      if (!isActive) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      ctx.fillStyle = 'rgba(26, 26, 26, 0.01)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.width / 2, p.height / 2, 0, 0, Math.PI * 2);

        // Calculate color based on position
        const xFraction = p.x / canvas.width; // Left-to-right gradient
        const yFraction = p.y / canvas.height; // Top-to-bottom gradient
        const midDistance = Math.abs(yFraction - 0.5); // Distance from vertical middle

        // Base gradient (teal to white)
        let r = parseInt(baseColor.slice(1, 3), 16) * (1 - xFraction) + parseInt(tintColors[0].slice(1, 3), 16) * xFraction;
        let g = parseInt(baseColor.slice(3, 5), 16) * (1 - xFraction) + parseInt(tintColors[0].slice(3, 5), 16) * xFraction;
        let b = parseInt(baseColor.slice(5, 7), 16) * (1 - xFraction) + parseInt(tintColors[0].slice(5, 7), 16) * xFraction;

        // Add depth with darker teal as drops fall
        const depthFactor = yFraction; // 0 at top, 1 at bottom
        r = r * (1 - depthFactor) + parseInt(darkColor.slice(1, 3), 16) * depthFactor;
        g = g * (1 - depthFactor) + parseInt(darkColor.slice(3, 5), 16) * depthFactor;
        b = b * (1 - depthFactor) + parseInt(darkColor.slice(5, 7), 16) * depthFactor;

        // Add glow effect in the middle
        const glowStrength = Math.max(0, 1 - midDistance * 4); // Peaks at y=0.5, fades out
        r = r * (1 - glowStrength) + parseInt(glowColor.slice(1, 3), 16) * glowStrength;
        g = g * (1 - glowStrength) + parseInt(glowColor.slice(3, 5), 16) * glowStrength;
        b = b * (1 - glowStrength) + parseInt(glowColor.slice(5, 7), 16) * glowStrength;

        const finalColor = `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
        ctx.fillStyle = `${finalColor}${Math.floor(p.opacity * 255 * 0.6).toString(16).padStart(2, '0')}`;
        ctx.fill();

        p.y += p.speed;
        if (p.y > canvas.height + 10) {
          p.y = -10;
          p.x = (Math.floor(p.x / (canvas.width / columnCount)) + Math.random() * 0.5) * (canvas.width / columnCount);
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    const handleActivity = () => {
      setIsActive(false);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      resetTimeout();
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (!isActive) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('click', handleActivity);
    window.addEventListener('resize', resizeCanvas);

    resetTimeout();
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('resize', resizeCanvas);
      clearTimeout(timeoutRef.current);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isActive]);

  return (
    <Box
      as="canvas"
      ref={canvasRef}
      position="fixed"
      top="0"
      left="0"
      width="100%"
      height="100vh"
      zIndex="9999"
      pointerEvents={isActive ? 'auto' : 'none'}
    />
  );
};

export default ScreenSaver;