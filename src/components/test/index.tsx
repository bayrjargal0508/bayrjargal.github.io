"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import SpinningWheel, { Prize } from "./spin";

const demoBundleItems: Prize[] = [
  {
    id: "6888882c918ec353afa185fd",
    title: "YESH 3 хоног эрх",
    displayText: "3 хоног эрх",
    prizeType: "SERVICE_DURATION",
    weight: 50.0,
    color: "#FF6384",
    route: "/prizes/3days",
  },
  {
    id: "6888883c918ec353afa189d0",
    title: "YESH 7 хоног эрх",
    displayText: "7 хоног эрх",
    prizeType: "SERVICE_DURATION",
    weight: 35.0,
    color: "#36A2EB",
    route: "/prizes/7days",
  },
  {
    id: "68888852918ec353afa190c1",
    title: "YESH 14 хоног эрх",
    displayText: "14 хоног эрх",
    prizeType: "SERVICE_DURATION",
    weight: 10.0,
    color: "#FFCE56",
    route: "/prizes/14days",
  },
  {
    id: "6888885e918ec353afa196d3",
    title: "YESH 1 сар эрх",
    displayText: "1 сар эрх",
    prizeType: "SERVICE_DURATION",
    weight: 5.0,
    color: "#4BC0C0",
    route: "/prizes/1month",
  },
];

export default function SpinWheel() {
  const [result, setResult] = useState<Prize | null>(null);
  const router = useRouter();

  const handleWinner = (winner: Prize) => {
    console.log("Winner:", winner);
    setResult(winner); 
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 relative">
      <div className="relative flex items-center justify-center w-[700px] h-[700px] bg-black">
        <Image
          src="/spin-monster.svg"
          alt="Spin Wheel"
          width={650}
          height={650}
          className="object-contain z-10 pointer-events-none"
        />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="-translate-x-[173px] -translate-y-8 scale-[0.7] relative">
            <SpinningWheel
              prizes={demoBundleItems}
              onFinish={handleWinner}
              demo={true}
              size={420}
              spinDuration={3000}
            />
            
          </div>
        </div>
      </div>

      {result && (
        <p className="mt-4 text-lg text-black underline cursor-pointer">
          Таны шагнал:
          <span className="font-bold text-black">{result.title}</span>
        </p>
      )}
    </div>
  );
}
