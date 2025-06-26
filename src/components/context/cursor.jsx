"use client";

import { useEffect, useRef } from "react";

export default function ParticleCanvas() {
  const canvasRef = useRef(null);
  const mousePosRef = useRef({
    x: typeof window !== "undefined" ? window.innerWidth / 2 : 0,
    y: typeof window !== "undefined" ? window.innerHeight / 2 : 0,
  });

  const particles = useRef([]);
  const particleCount = 25;
  const connectionDistance = 150;

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  class NetworkParticle {
    constructor() {
      this.radius = random(2, 5);
      this.offsetX = random(-200, 200);
      this.offsetY = random(-200, 200);
      this.x = mousePosRef.current.x + this.offsetX;
      this.y = mousePosRef.current.y + this.offsetY;
      this.alpha = random(0.4, 0.9);
      this.smoothing = random(0.02, 0.06);
      this.driftX = random(-0.5, 0.5);
      this.driftY = random(-0.5, 0.5);
    }
    
    draw(ctx) {
      // Main particle
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
      ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
      ctx.fill();
      
      // Subtle glow
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius + 2, 0, 2 * Math.PI, false);
      ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha * 0.3})`;
      ctx.fill();
    }
    
    update() {
      // Add slight drift to offset
      this.offsetX += this.driftX * 0.1;
      this.offsetY += this.driftY * 0.1;
      
      // Keep offset within bounds
      this.offsetX = Math.max(-250, Math.min(250, this.offsetX));
      this.offsetY = Math.max(-250, Math.min(250, this.offsetY));
      
      // Calculate target position relative to mouse
      const targetX = mousePosRef.current.x + this.offsetX;
      const targetY = mousePosRef.current.y + this.offsetY;
      
      // Smoothly move to target position
      this.x += (targetX - this.x) * this.smoothing;
      this.y += (targetY - this.y) * this.smoothing;
    }
  }

  function drawConnections(ctx) {
    // Draw connections between particles
    for (let i = 0; i < particles.current.length; i++) {
      for (let j = i + 1; j < particles.current.length; j++) {
        const particle1 = particles.current[i];
        const particle2 = particles.current[j];
        
        const distance = Math.sqrt(
          Math.pow(particle1.x - particle2.x, 2) + 
          Math.pow(particle1.y - particle2.y, 2)
        );
        
        if (distance < connectionDistance) {
          const opacity = (1 - distance / connectionDistance) * 0.5;
          ctx.beginPath();
          ctx.moveTo(particle1.x, particle1.y);
          ctx.lineTo(particle2.x, particle2.y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();

    // Create particles
    particles.current = [];
    for (let i = 0; i < particleCount; i++) {
      particles.current.push(new NetworkParticle());
    }

    let animationFrameId;

    function draw() {
      // Clear canvas
      ctx.fillStyle = "rgba(0, 0, 0, 1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.current.forEach((particle) => {
        particle.update();
        particle.draw(ctx);
      });
      
      // Draw connection lines
      drawConnections(ctx);

      animationFrameId = requestAnimationFrame(draw);
    }

    draw();

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  function handleMouseMove(e) {
    mousePosRef.current.x = e.clientX;
    mousePosRef.current.y = e.clientY;
  }

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      className="w-full h-full bg-black cursor-crosshair"
      style={{ display: "block" }}
    />
  );
}