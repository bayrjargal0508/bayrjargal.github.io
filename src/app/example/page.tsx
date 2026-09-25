"use client";

export default function ExamplePage() {
  return (
    <main className="relative h-dvh w-screen overflow-hidden">
      <video
        src={`${process.env.NEXT_PUBLIC_BASE_PATH}/media/media.mp4`}
        className="h-full w-full object-cover"
        autoPlay
        muted
        // loop
        playsInline
      />
    </main>
  );
}
