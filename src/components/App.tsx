"use client";

import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";

// Custom hook for typewriter effect
function useTypewriter(text: string, speed = 38, startDelay = 600) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let timeoutId: number;
    let intervalId: number;
    let currentIndex = 0;

    timeoutId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        if (currentIndex < text.length) {
          currentIndex++;
          setDisplayed(text.slice(0, currentIndex));
          if (currentIndex >= text.length) {
            setDone(true);
            clearInterval(intervalId);
          }
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [text, speed, startDelay]);

  return { displayed, done };
}

export default function App() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const prevXRef = useRef<number | null>(null);
  const targetTimeRef = useRef<number>(0);
  const isSeekingRef = useRef<boolean>(false);
  const seekPendingRef = useRef<boolean>(false);

  const [showPills, setShowPills] = useState(false);

  // Typewriter hook for hero message
  const heroText =
    "I’m a Frontend Developer specializing in React and Next.js, turning ideas and designs into fast, modern, and user-friendly web applications.";
  const { displayed, done } = useTypewriter(heroText, 38, 600);

  // Show pill buttons after 400ms delay independently
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowPills(true);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // Seek logic preventing seek-flooding
  const performSeek = () => {
    const video = videoRef.current;
    if (!video || !video.duration || Number.isNaN(video.duration)) return;

    if (isSeekingRef.current) {
      seekPendingRef.current = true;
      return;
    }

    if (Math.abs(video.currentTime - targetTimeRef.current) > 0.01) {
      isSeekingRef.current = true;
      video.currentTime = targetTimeRef.current;
    }
  };

  const handleSeeked = () => {
    isSeekingRef.current = false;
    const video = videoRef.current;
    if (!video || !video.duration) return;

    if (
      seekPendingRef.current ||
      Math.abs(video.currentTime - targetTimeRef.current) > 0.02
    ) {
      seekPendingRef.current = false;
      performSeek();
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      targetTimeRef.current = videoRef.current.currentTime || 0;
    }
  };

  // Mouse scrub handler
  useEffect(() => {
    const SENSITIVITY = 0.8;

    const handleMouseMove = (e: MouseEvent) => {
      const video = videoRef.current;
      if (!video || !video.duration || Number.isNaN(video.duration)) {
        prevXRef.current = e.clientX;
        return;
      }

      if (prevXRef.current === null) {
        prevXRef.current = e.clientX;
        return;
      }

      const delta = e.clientX - prevXRef.current;
      prevXRef.current = e.clientX;

      const timeOffset =
        (delta / window.innerWidth) * SENSITIVITY * video.duration;
      const newTime = Math.max(
        0,
        Math.min(video.duration, targetTimeRef.current + timeOffset),
      );
      targetTimeRef.current = newTime;

      performSeek();
    };

    const handleMouseLeave = () => {
      prevXRef.current = null;
    };

    // Also support touch scrubbing for mobile devices
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const clientX = e.touches[0].clientX;
      const video = videoRef.current;
      if (!video || !video.duration || Number.isNaN(video.duration)) {
        prevXRef.current = clientX;
        return;
      }

      if (prevXRef.current === null) {
        prevXRef.current = clientX;
        return;
      }

      const delta = clientX - prevXRef.current;
      prevXRef.current = clientX;

      const timeOffset =
        (delta / window.innerWidth) * SENSITIVITY * video.duration;
      const newTime = Math.max(
        0,
        Math.min(video.duration, targetTimeRef.current + timeOffset),
      );
      targetTimeRef.current = newTime;

      performSeek();
    };

    const handleTouchEnd = () => {
      prevXRef.current = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  const actionPills = [
    "See what I build",
    "Start a project",
    "Explore my work",
    "Get to know me",
  ];

  return (
    <div className="fixed inset-0 w-full h-screen bg-black text-white selection:bg-white selection:text-black">
      <video
        ref={videoRef}
        src="/media/3d-model-video.mp4"
        muted
        playsInline
        preload="auto"
        onLoadedMetadata={handleLoadedMetadata}
        onSeeked={handleSeeked}
        className="fixed inset-0 z-0 w-full h-full object-cover object-[27%_center] md:object-[70%_center] pointer-events-none select-none"
      />

      {/* NAVBAR (fixed, z-index: 10) */}
      <nav className="fixed top-0 left-0 right-0 z-10 w-full px-5 sm:px-8 py-4 sm:py-5 flex justify-between items-center">
        {/* Logo (left) */}
        <div className="flex items-center gap-3">
          <span
            className="text-[21px] sm:text-[26px] tracking-tight text-white select-none"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Bayarjargal
          </span>
          <span
            className="text-[25px] sm:text-[30px] text-white select-none leading-none"
            style={{ letterSpacing: "-0.02em" }}
          >
            ✳︎
          </span>
        </div>

        {/* Desktop nav links (center, hidden below md) */}
        {/* <div className="hidden md:flex items-center text-[23px] text-white">
          {navItems.map((item, idx) => (
            <React.Fragment key={item}>
              <a
                href={`#${item.toLowerCase()}`}
                className="hover:opacity-60 transition-opacity cursor-pointer"
              >
                {item}
              </a>
              {idx < navItems.length - 1 && <span>,&nbsp;</span>}
            </React.Fragment>
          ))}
        </div> */}
      </nav>

      {/* HERO SECTION (z-index: 1) */}
      <main className="relative z-[1] min-h-[100dvh] w-full flex flex-col items-stretch md:items-end justify-end md:justify-center pt-24 pb-12 md:py-24 px-5 sm:px-8 md:px-10">
        <div className="w-full max-w-xl relative z-10">
          {/* 2. Typewriter text */}
          <p
            className="grid text-white mb-5 sm:mb-6 font-normal"
            style={{
              fontSize: "clamp(18px, 4vw, 26px)",
              lineHeight: 1.35,
              fontWeight: 400,
            }}
          >
            {/* invisible full text reserves the final height so pills never jump */}
            <span aria-hidden className="col-start-1 row-start-1 invisible">
              {heroText}
            </span>
            <span className="col-start-1 row-start-1">
              {displayed}
              {!done && (
                <span className="inline-block w-[2px] h-[1.1em] bg-white align-middle ml-[2px] animate-blink" />
              )}
            </span>
          </p>

          {/* 3. Action pill buttons */}
          {/* <div
            className="flex flex-wrap gap-y-1"
            style={{
              opacity: showPills ? 1 : 0,
              transform: showPills ? "translateY(0)" : "translateY(8px)",
              transition: "opacity 0.4s ease, transform 0.4s ease",
            }}
          >
            {actionPills.map((label) => (
              <button
                key={label}
                type="button"
                className="inline-flex items-center justify-center bg-white text-black border border-black/10 rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap hover:bg-black hover:text-white transition-colors duration-200 cursor-pointer"
              >
                {label}
              </button>
            ))}
          </div> */}
          <button
            type="button"
            className="mt-8 flex flex-col w-full items-center justify-center"
          >
            <Image
              src="/mouse.svg"
              alt=""
              width={48}
              height={48}
              className="opacity-90 size-6 md:size-12"
              aria-hidden
            />
            SCROLL
          </button>
        </div>
      </main>
    </div>
  );
}
