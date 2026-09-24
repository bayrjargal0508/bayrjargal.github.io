"use client";

export default function ExamplePage() {
  return (
    <main className="relative h-dvh w-screen overflow-hidden">
      <video
        src="/media/media.mp4"
        className="h-full w-full object-cover"
        autoPlay
        muted
        // loop
        playsInline
      />
    </main>
  );
}
