"use client";
import Image from "next/image";
import { useRef } from "react";

export default function AboutMe() {
  const wrapRef = useRef<HTMLElement | null>(null);

  return (
    <>
      {" "}
      <section ref={wrapRef} className="relative h-[200vh]">
        <div className="sticky top-0 h-screen overflow-hidden">
          <div
            className="absolute inset-0 will-change-transform"
            // style={{
            //   transform: `translate3d(${(1 - progress) * 100}%, 0, 0)`,
            // }}
          >
            <Image
              src="/woolen-model-bg.png"
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
              aria-hidden
            />
          </div>
        </div>
      </section>
    </>
  );
}
