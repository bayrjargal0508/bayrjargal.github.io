"use client";

import React, { useState, useRef, useEffect } from "react";

export interface Prize {
  id: string | number;
  title: string;
  color: string;
  route?: string;
  displayText?: string;
  prizeType?: string;
  weight?: number;
}

interface SpinningWheelProps {
  prizes: Prize[];
  size?: number;
  spinDuration?: number;
  onFinish: (winner: Prize) => void;
  demo?: boolean;
  onRequestSpin?: () => Promise<{ id: string | number }>;
}

const demoBundleItems = [
  {
    id: "6888882c918ec353afa185fd",
    title: "YESH 3 хоног эрх",
    displayText: "3 хоног эрх",
    prizeType: "SERVICE_DURATION",
    weight: 50.0,
  },
  {
    id: "6888883c918ec353afa189d0",
    title: "YESH 7 хоног эрх",
    displayText: "7 хоног эрх",
    prizeType: "SERVICE_DURATION",
    weight: 35.0,
  },
  {
    id: "68888852918ec353afa190c1",
    title: "YESH 14 хоног эрх",
    displayText: "14 хоног эрх",
    prizeType: "SERVICE_DURATION",
    weight: 10.0,
  },
  {
    id: "6888885e918ec353afa196d3",
    title: "YESH 1 сар эрх",
    displayText: "1 сар эрх",
    prizeType: "SERVICE_DURATION",
    weight: 5.0,
  },
];

const debugColors = [
  "#FF3B30",
  "#34C759",
  "#FFCC00",
  "#007AFF",
  "#5856D6",
  "#FF9500",
];

const POINTER_SIZE = 20;

const SpinningWheel: React.FC<SpinningWheelProps> = ({
  prizes,
  size = 300,
  spinDuration = 4000,
  onFinish,
  demo = false,
  onRequestSpin,
}) => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const animationRef = useRef<number | null>(null);

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const center = size / 2;
  const radius = size / 2;
  const sliceAngle = 360 / prizes.length;

  const calculateRotationToIndex = (index: number, currentRotation: number) => {
    const sliceCenterAngle = index * sliceAngle + sliceAngle / 2;
    const targetRotationMod = (360 + 90 - sliceCenterAngle) % 360;
    const currentRotationMod = currentRotation % 360;
    let deltaRotation = targetRotationMod - currentRotationMod;
    if (deltaRotation < 0) deltaRotation += 360;
    const fullSpins = 5;

    const finalRotation = currentRotation + fullSpins * 270 + deltaRotation;
    return finalRotation;
  };

  const animateRotation = (
    startRotation: number,
    endRotation: number,
    duration: number,
    easing: (t: number) => number = (t) => t,
    onComplete?: () => void
  ) => {
    const startTime = Date.now();
    const rotationDiff = endRotation - startRotation;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easing(progress);

      const currentRotation = startRotation + rotationDiff * easedProgress;
      setRotation(currentRotation);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setRotation(endRotation);
        onComplete?.();
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  const easeOutQuad = (t: number): number => {
    return 1 - (1 - t) * (1 - t);
  };

  const spin = async () => {
    if (isSpinning) return;
    setIsSpinning(true);

    // Cancel any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const currentRotation = rotation % 360;

    try {
      let winnerIndex: number;
      let winnerId: string | number;

      if (demo) {
        const randomDemoPrize =
          demoBundleItems[Math.floor(Math.random() * demoBundleItems.length)];
        winnerId = randomDemoPrize.id;
      } else {
        if (!onRequestSpin) throw new Error("onRequestSpin callback required");
        const backendResult = await onRequestSpin();
        winnerId = backendResult.id;
      }

      winnerIndex = prizes.findIndex((p) => p.id === winnerId);
      if (winnerIndex === -1) {
        winnerIndex = 0;
      }

      const finalRotation = calculateRotationToIndex(
        winnerIndex,
        currentRotation
      );

      // Start spinning animation with completion callback
      animateRotation(
        currentRotation,
        finalRotation,
        spinDuration,
        easeOutQuad,
        () => {
          onFinish(prizes[winnerIndex]);
          setIsSpinning(false);
          setRotation(finalRotation % 360);

          console.log(
            "[spin] Spin finished. Winner index:",
            winnerIndex,
            "Prize:",
            prizes[winnerIndex]
          );
        }
      );
    } catch (error) {
      console.error("[spin] Spin failed:", error);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      setRotation(currentRotation);
      setIsSpinning(false);
    }
  };

  const createSlicePath = (startAngle: number, endAngle: number) => {
    const largeArc = endAngle - startAngle <= 180 ? 0 : 1;

    const x1 = center + radius * Math.cos((Math.PI * startAngle) / 180);
    const y1 = center + radius * Math.sin((Math.PI * startAngle) / 180);

    const x2 = center + radius * Math.cos((Math.PI * endAngle) / 180);
    const y2 = center + radius * Math.sin((Math.PI * endAngle) / 180);

    return `
      M ${center} ${center}
      L ${x1} ${y1}
      A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
      Z
    `;
  };

  const wheelRef = useRef<HTMLDivElement>(null);

  // Don't render the wheel until hydrated to prevent mismatch
  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center">
        <div
          className="relative flex items-center justify-center"
          style={{ width: size, height: size }}
        >
          <div className="absolute z-20 flex items-center justify-center w-24 h-24 bg-transparent">
            <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-gray-500 font-bold">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <div
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
      >
         <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
    {/* Outer border */}
    <circle
      cx={center}
      cy={center}
      r={radius - 5} // radius slightly smaller to fit
      stroke="#ffffff" // border color
      strokeWidth={10} // border thickness
      fill="none"
    />

    {/* Wheel slices */}
    <g transform={`rotate(${rotation}, ${center}, ${center})`}>
      {prizes.map((p, i) => {
        const startAngle = i * sliceAngle;
        const endAngle = startAngle + sliceAngle;
        return (
          <g key={p.id}>
            <path
              fill={debugColors[i % debugColors.length] || p.color}
              d={createSlicePath(startAngle, endAngle)}
            />
            <text fill="#fff" fontSize={16} fontWeight="bold" textAnchor="middle">
              <textPath
                href={`#arcPath${i}`}
                startOffset="50%"
                method="align"
              >
                {p.title}
              </textPath>
            </text>
          </g>
        );
      })}
    </g>
  </svg>

        <div
          ref={wheelRef}
          className="absolute"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? "none" : "transform 0.3s ease-out",
          }}
        >
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <g>
              {prizes.map((p, i) => {
                const startAngle = i * sliceAngle;
                const endAngle = startAngle + sliceAngle;

                const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
                const textRadius = radius * 0.75;

                const startX =
                  center + textRadius * Math.cos((Math.PI * startAngle) / 180);
                const startY =
                  center + textRadius * Math.sin((Math.PI * startAngle) / 180);

                const endX =
                  center + textRadius * Math.cos((Math.PI * endAngle) / 180);
                const endY =
                  center + textRadius * Math.sin((Math.PI * endAngle) / 180);

                const pathId = `arcPath${i}`;

                const arcPath = `
                  M ${startX} ${startY}
                  A ${textRadius} ${textRadius} 0 ${largeArc} 1 ${endX} ${endY}
                `;

                return (
                  <g key={p.id}>
                    <path
                      fill={debugColors[i % debugColors.length] || p.color}
                      d={createSlicePath(startAngle, endAngle)}
                    />

                    <path id={pathId} d={arcPath} fill="none" />
                    <text
                      fill="#fff"
                      fontSize={14}
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      <textPath
                        href={`#${pathId}`}
                        startOffset="50%"
                        method="align"
                      >
                        {p.title}
                      </textPath>
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        {/* Center Button */}
        <div
          className="absolute z-50 flex items-center justify-center"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <button
            className={`w-20 h-20 rounded-full font-bold text-lg text-white shadow-lg transition-colors border ${
              isSpinning
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600 active:bg-red-700"
            }`}
            onClick={spin}
            disabled={isSpinning}
          >
            {isSpinning ? "..." : "SPIN"}
          </button>
        </div>

        {/* Wheel */}
        <div
          ref={wheelRef}
          className="absolute pointer-events-none"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? "none" : "transform 0.3s ease-out",
          }}
        >
          ...
        </div>

        {/* Pointer */}
        <div
          className="absolute z-40 flex justify-center pointer-events-none" // <-- ignore clicks
          style={{
            top: "25%",
            left: "95%",
            transform: "translateX(-50%)",
            marginTop: -POINTER_SIZE / 2,
          }}
        >
          <svg width={POINTER_SIZE} height={POINTER_SIZE} viewBox="0 0 24 24">
            <polygon
              points="2,12 22,4 22,20"
              fill="#e91e63"
              stroke="#fff"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SpinningWheel;
