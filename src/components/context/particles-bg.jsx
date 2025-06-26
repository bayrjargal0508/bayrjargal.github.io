"use client";

import { useEffect } from "react";
import Script from "next/script";
import BodyDetails from "../details/body";

export default function ParticlesBackground() {
  useEffect(() => {
    const interval = setInterval(() => {
      if (typeof window !== "undefined" && window.particlesJS) {
        window.particlesJS("particles-js", {
          particles: {
            number: {
              value: 90,
              density: { enable: true, value_area: 400 },
            },
            color: { value: "#ffffff" },
            shape: {
              type: "circle",
              stroke: { width: 0, color: "#000" },
              polygon: { nb_sides: 5 },
            },
            opacity: { value: 0.5 },
            size: { value: 3, random: true },
            line_linked: {
              enable: true,
              distance: 150,
              color: "#ffffff",
              opacity: 0.4,
              width: 1,
            },
            move: {
              enable: true,
              speed: 6,
              direction: "none",
              out_mode: "out",
            },
          },
          interactivity: {
            detect_on: "canvas",
            events: {
              onhover: { enable: true, mode: "repulse" },
              onclick: { enable: true, mode: "push" },
              resize: true,
            },
            modes: {
              grab: { distance: 400, line_linked: { opacity: 1 } },
              bubble: { distance: 400, size: 40, duration: 2, opacity: 8 },
              repulse: { distance: 200 },
              push: { particles_nb: 4 },
              remove: { particles_nb: 2 },
            },
          },
          retina_detect: true,
        });
        clearInterval(interval);
      }
    }, 100);
  }, []);

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"
        strategy="beforeInteractive"
      />

      <div className="fixed inset-0 z-0">
        <div id="particles-js" className="w-full h-full" />
      </div>

      <main className="z-10 min-h-screen flex flex-col items-center justify-start px-6 py-[400px]">
        <div>
          <h1 className="text-5xl font-bold mb-8 text-center">
            Welcome to My Landing Page
          </h1>
           <p className="text-5xl font-bold mb-8 text-center pb-[300px]">
            Welcome to My Landing Page Welcome to My Landing Page Welcome to My Landing Page Welcome to My Landing Page
          </p>
          <BodyDetails />
        </div>
      </main>
    </>
  );
}
