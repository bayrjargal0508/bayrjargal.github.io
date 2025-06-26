import Image from "next/image";

export default function BodyDetails() {
  return (
    <div className="py-24 px-6 text-center max-w-full mx-auto grid gap-96" id="about">
      <section className="flex gap-24">
        <div className="max-w-xl py-20">
          <h2 className="font-semibold mb-4">About This Page</h2>
          <p className="">
            This is a simple landing page built with Next.js, Tailwind CSS, and
            particles.js. This is a simple landing page built with Next.js,
            Tailwind CSS, and particles.js. This is a simple landing page built
            with Next.js, Tailwind CSS, and particles.js. This is a simple
            landing page built with Next.js, Tailwind CSS, and particles.js.
            This is a simple landing page built with Next.js, Tailwind CSS, and
            particles.js. This is a simple landing page built with Next.js,
            Tailwind CSS, and particles.js.
          </p>
        </div>
        <div>
          <Image
            src="/image1.jpg"
            width={300}
            height={500}
            alt="Picture of the author"
          />
        </div>
      </section>
      <section>
        <h2 className="text-3xl font-semibold mb-4">About This Page</h2>
        <p className="text-lg">
          This is a simple landing page built with Next.js, Tailwind CSS, and
          particles.js.
        </p>
      </section>
      <section>
        <h2 className="text-3xl font-semibold mb-4">About This Page</h2>
        <p className="text-lg">
          This is a simple landing page built with Next.js, Tailwind CSS, and
          particles.js.
        </p>
      </section>
    </div>
  );
}
