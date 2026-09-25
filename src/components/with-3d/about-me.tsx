"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/* The room is photographed once, then a wall of the same plaster colour closes
   over it and the writing continues on bare wall. One red thread is sewn down
   the whole length; it is the only thing in the section that moves. */

const INK = "#2B241E"; // her felted sweater, lifted; 7.0:1 on the darkest wall in the column
const BODY = "#3A2F25"; // one step off ink, never used where the column reaches the floor
const THREAD = "#9C3025"; // her red socks, darkened until it clears the 3:1 non-text gate
const SEAM = "#7A2A20"; // the tie-off: underline + focus ring, survives every ground here
const WALL = "#EFBE89";

const HAND = "var(--font-hand), Georgia, 'Times New Roman', serif";
const SANS = "var(--font-geist-sans), system-ui, sans-serif";
const MONO = "var(--font-geist-mono), ui-monospace, monospace";

const STITCH_Y = `repeating-linear-gradient(to bottom, ${THREAD} 0 9px, transparent 9px 17px)`;
const STITCH_X = `repeating-linear-gradient(to right, ${THREAD} 0 9px, transparent 9px 17px)`;

// the sewn end rides here on screen, so a knot ties as its beat crosses the reading line
const SEWN_AT = 0.72;

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const seg = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));

/* globals.css declares unlayered `p, div, h1-h6` rules (font-mono, text-white).
   Unlayered CSS beats Tailwind's layered utilities, so every leaf text node sets
   family/size/leading/weight/colour inline or it renders white mono on cream. */
const heroName = {
  fontFamily: HAND,
  fontSize: "clamp(31px, min(4.4vw, 6.4vh), 52px)",
  lineHeight: 1.05,
  letterSpacing: "-0.02em",
  fontWeight: 500,
  fontVariationSettings: "'wght' 500, 'SOFT' 100, 'WONK' 1",
  color: INK,
} as const;

const heroLine = {
  fontFamily: SANS,
  fontSize: "clamp(16.5px, min(1.5vw, 2.6vh), 21px)",
  lineHeight: 1.4,
  fontWeight: 400,
  color: INK,
  maxWidth: "40ch",
} as const;

const heading = {
  fontFamily: HAND,
  fontSize: "clamp(17.5px, 1.65vw, 23px)",
  lineHeight: 1.2,
  letterSpacing: "-0.01em",
  fontWeight: 600,
  fontVariationSettings: "'wght' 600, 'SOFT' 100, 'WONK' 0",
  color: INK,
} as const;

const prose = {
  fontFamily: SANS,
  fontSize: "clamp(14.5px, 1.1vw, 16.5px)",
  lineHeight: 1.6,
  fontWeight: 400,
  color: BODY,
} as const;

const name = { fontWeight: 600, color: INK } as const;

// what I do: one rule generates all four — what is nearest the thread is biggest
const craft = [
  {
    text: "Frontend development. React, Next, TypeScript.",
    size: "clamp(21px, 2.6vw, 29px)",
    indent: "0px",
    measure: "30ch",
  },
  {
    text: "Working out what a thing is for, before it exists.",
    size: "clamp(19px, 2.2vw, 25px)",
    indent: "clamp(12px, 2vw, 24px)",
    measure: "28ch",
  },
  {
    text: "How it moves, and how that feels under a thumb.",
    size: "clamp(17px, 1.9vw, 21.5px)",
    indent: "clamp(24px, 4.5vw, 56px)",
    measure: "26ch",
  },
  {
    text: "A folder of things that were never meant to ship.",
    size: "clamp(15.5px, 1.7vw, 18.5px)",
    indent: "clamp(36px, 7.5vw, 96px)",
    measure: "24ch",
  },
];

// curiosity: more thread paid out the further down the list it goes
const curious = [
  { text: "AI in product development", spur: "clamp(24px, 3vw, 44px)" },
  { text: "Creative web experiences", spur: "clamp(34px, 5.5vw, 70px)" },
  { text: "Frontend architecture", spur: "clamp(44px, 8vw, 96px)" },
  { text: "Interactive design", spur: "clamp(54px, 10.5vw, 122px)" },
  { text: "New web technologies", spur: "clamp(64px, 13vw, 148px)" },
];

// the tie-off: the three facts a reader scans for, with the live links
const facts = [
  { label: "Works in", value: "React, Next.js, TypeScript, Tailwind" },
  { label: "Shipped", sites: ["e-geree.mn", "gobi-travel.mn", "yesh.mn"] },
  {
    label: "Cares about",
    value: "Speed, keyboard access, and the small states nobody designs",
  },
];

const factLabel = {
  fontFamily: SANS,
  fontSize: "clamp(13px, 1vw, 14.5px)",
  lineHeight: 1.5,
  fontWeight: 500,
  color: BODY,
} as const;

const factValue = {
  fontFamily: SANS,
  fontSize: "clamp(14.5px, 1.1vw, 16.5px)",
  lineHeight: 1.5,
  fontWeight: 400,
  color: INK,
  maxWidth: "42ch",
} as const;

const EMAIL = "ganboldtergel11@gmail.com";

function Knot({ on, still }: { on: boolean; still: boolean }) {
  return (
    <span
      aria-hidden
      style={{
        position: "absolute",
        left: -33,
        top: 7,
        width: 8,
        height: 8,
        borderRadius: 9999,
        background: THREAD,
        transform: `scale(${on ? 1 : 0})`,
        // the small bounce of wool being pressed; the only easing curve in the file
        transition: still ? "none" : "transform 160ms cubic-bezier(.34,1.56,.64,1)",
      }}
    />
  );
}

export default function AboutMe() {
  const stageRef = useRef<HTMLDivElement>(null);
  const colRef = useRef<HTMLDivElement>(null);
  const beatRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [wipe, setWipe] = useState(0); // the wall closing over the room
  const [sewn, setSewn] = useState(0); // how far the column thread has run
  const [knots, setKnots] = useState(0); // bitmask, one bit per beat
  const [still, setStill] = useState(false); // prefers-reduced-motion

  useEffect(() => {
    // reduced motion lands on the finished composition: room kept, thread fully sewn
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStill(true);
      setSewn(1);
      setKnots(-1);
      return;
    }

    const update = () => {
      const stage = stageRef.current;
      if (stage) {
        const { top, height } = stage.getBoundingClientRect();
        const travel = height - window.innerHeight;
        // fail open: a stage shorter than the viewport shows everything, not nothing
        const p = travel <= 0 ? 1 : clamp01(-top / travel);
        setWipe(seg(p, 0.3, 0.92));
      }

      const col = colRef.current;
      if (!col) return;
      const line = window.innerHeight * SEWN_AT;
      const rect = col.getBoundingClientRect();
      setSewn(clamp01((line - rect.top) / rect.height));
      // live rects, not offsets cached at mount: survives resize and the font swap
      setKnots(
        beatRefs.current.reduce(
          (mask, el, i) =>
            el && el.getBoundingClientRect().top <= line ? mask | (1 << i) : mask,
          0,
        ),
      );
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const tied = (i: number) => (knots & (1 << i)) !== 0;
  const beat = (i: number) => (el: HTMLDivElement | null) => {
    beatRefs.current[i] = el;
  };

  return (
    <section
      aria-labelledby="about-heading"
      className="relative"
      style={{ background: WALL }}
    >
      {/* A — the room, and the wall that closes over it */}
      <div ref={stageRef} className="relative h-[240svh] motion-reduce:h-[100lvh]">
        {/* lvh, not svh: when mobile browser chrome retracts the small viewport
              grows and an svh-tall photo would leave a band of bare plaster under it */}
          <div className="sticky top-0 h-[100lvh] overflow-hidden motion-reduce:static">
          {/* object-position 12% is hand-tuned to this 1672x941 asset: at phone
              widths it opens onto lit plaster rather than her face. Recrop the
              image and this number silently becomes wrong. */}
          <Image
            src="/woolen-model-bg.png"
            alt=""
            aria-hidden
            fill
            sizes="100vw"
            quality={70}
            className="object-cover object-[12%_center] md:landscape:object-[50%_center]"
          />

          {/* not a crossfade: a hard edge, drawn downward at the needle's own rate.
              The clip is on this flat rectangle, never on the 2MB image. */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background: WALL,
              clipPath: `inset(0 0 ${(1 - wipe) * 100}% 0)`,
            }}
          />

          <div className="absolute inset-0 px-5 sm:px-8 md:px-10">
            <div className="relative h-full">
              {/* the thread only ever exists on wall the curtain has already made */}
              <span
                aria-hidden
                className="absolute left-0 top-0 bottom-0 w-[2px]"
                style={{
                  backgroundImage: STITCH_Y,
                  clipPath: `inset(0 0 ${(1 - wipe) * 100}% 0)`,
                }}
              />
              <div className="absolute inset-x-0 bottom-[26vh] md:landscape:bottom-[30vh] pl-[30px]">
                <h2 id="about-heading" style={heroName}>
                  Hi, I&rsquo;m Bayaraa.
                </h2>
                <p className="mt-4" style={heroLine}>
                  I&rsquo;m a frontend developer who enjoys turning ideas into
                  digital experiences.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* B — bare wall. Everything in normal flow, so no block can run out of room. */}
      <div className="px-5 sm:px-8 md:px-10">
        <div ref={colRef} className="relative">
          <span
            aria-hidden
            className="absolute left-0 top-0 bottom-0 w-[2px]"
            style={{
              backgroundImage: STITCH_Y,
              clipPath: `inset(0 0 ${(1 - sewn) * 100}% 0)`,
            }}
          />

          <div className="pl-[30px] pb-[clamp(72px,12vh,140px)]">
            {/* my story — the plainest block on the page, on purpose */}
            <div className="pt-[clamp(56px,9vh,120px)]">
              <div ref={beat(0)} className="relative">
                <Knot still={still} on={tied(0)} />
                <p style={{ ...prose, maxWidth: "46ch" }}>
                  I studied Information Systems, which is mostly the study of how
                  information moves through an organisation: who enters it, who
                  needs it, where it gets stuck. Frontend was the part of that I
                  could hold in my hands. Same question, except now it is one
                  person and one screen, and you can watch them get stuck in real
                  time.
                </p>
              </div>
            </div>

            {/* what I do — four moves, one knot, so it cannot be read as a list */}
            <div className="pt-[clamp(64px,10vh,132px)]">
              <div ref={beat(1)} className="relative">
                <Knot still={still} on={tied(1)} />
                {craft.map(({ text, size, indent, measure }) => (
                  <p
                    key={text}
                    className="mt-3 first:mt-0"
                    style={{
                      fontFamily: HAND,
                      fontSize: size,
                      lineHeight: 1.25,
                      letterSpacing: "-0.01em",
                      fontWeight: 500,
                      fontVariationSettings: "'wght' 500, 'SOFT' 100, 'WONK' 0",
                      color: INK,
                      marginLeft: indent,
                      maxWidth: measure,
                    }}
                  >
                    {text}
                  </p>
                ))}
              </div>
            </div>

            {/* what I've built — who is on the other end, not the roster again */}
            <div className="pt-[clamp(64px,10vh,132px)]">
              <div ref={beat(2)} className="relative">
                <Knot still={still} on={tied(2)} />
                <h3 style={heading}>Five of them, and who is on the other end</h3>
                <p className="mt-3" style={{ ...prose, maxWidth: "52ch" }}>
                  You already scrolled past what they are. What that list leaves
                  out: <b style={name}>Yesh</b> is a student at eleven at night
                  finding out which chapter they actually do not know.{" "}
                  <b style={name}>E-Geree</b> is two people signing a contract
                  without either of them looking for a printer.{" "}
                  <b style={name}>GobiTravel</b> is somebody a long way off
                  deciding where in Mongolia to go.{" "}
                  <b style={name}>Assessment Cortexa</b> is someone seeing what an
                  assessment measured about them. And <b style={name}>AquaMotion</b>{" "}
                  has nobody on the other end yet: it is still a concept, about
                  analysing how someone swims.
                </p>
                <p className="mt-4" style={{ ...prose, maxWidth: "52ch" }}>
                  All five started the same way. Someone describes a thing that
                  does not exist, and I decide what it looks like before there is
                  anything to look at.
                </p>
              </div>
            </div>

            {/* beyond code — the one block that steps away from the thread */}
            <div className="pt-[clamp(64px,10vh,132px)]">
              <div ref={beat(3)} className="relative">
                <Knot still={still} on={tied(3)} />
                <p
                  style={{
                    ...prose,
                    maxWidth: "34ch",
                    marginLeft: "clamp(24px, 5vw, 60px)",
                  }}
                >
                  Away from the editor it is books, and English that gets a little
                  less effortful every year. Most of what I learn arrives
                  sideways: from a design I liked, a model that surprised me, or
                  something I built on a weekend that only ever had one user.
                </p>
              </div>
            </div>

            {/* currently curious — five loose ends tied to the spine, not chips */}
            <div className="pt-[clamp(64px,10vh,132px)]">
              <div ref={beat(4)} className="relative">
                <Knot still={still} on={tied(4)} />
                <h3 style={heading}>Currently curious about</h3>
                <ul className="mt-5 ml-[-30px]">
                  {curious.map(({ text, spur }) => (
                    <li
                      key={text}
                      className="flex items-center mt-[22px] first:mt-0"
                    >
                      <span
                        aria-hidden
                        className="shrink-0"
                        style={{
                          width: spur,
                          height: 2,
                          backgroundImage: STITCH_X,
                        }}
                      />
                      <span
                        aria-hidden
                        className="shrink-0"
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 9999,
                          background: THREAD,
                        }}
                      />
                      <span
                        style={{
                          fontFamily: SANS,
                          fontSize: "clamp(14.5px, 1.2vw, 17px)",
                          lineHeight: 1.3,
                          fontWeight: 500,
                          color: INK,
                          marginLeft: 12,
                        }}
                      >
                        {text}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-6" style={{ ...prose, maxWidth: "40ch" }}>
                  None of it is finished, which is the point.
                </p>
              </div>
            </div>

            {/* the statement, alone: the only other block that gets WONK 1 */}
            <div className="pt-[clamp(104px,18vh,220px)]">
              <div ref={beat(5)} className="relative">
                <Knot still={still} on={tied(5)} />
                <p
                  style={{
                    fontFamily: HAND,
                    fontSize: "clamp(24px, 3.4vw, 42px)",
                    lineHeight: 1.18,
                    letterSpacing: "-0.02em",
                    fontWeight: 500,
                    fontVariationSettings: "'wght' 500, 'SOFT' 100, 'WONK' 1",
                    color: INK,
                    maxWidth: "26ch",
                  }}
                >
                  I like taking something that exists only as an idea and turning
                  it into something you can actually click, use, and experience.
                </p>
              </div>
            </div>
            {/* the last beat on the thread: the same section, scannable */}
            <div className="pt-[clamp(64px,10vh,132px)]">
              <div ref={beat(6)} className="relative">
                <Knot still={still} on={tied(6)} />
                <dl>
                  {facts.map(({ label, value, sites }) => (
                    <div
                      key={label}
                      className="mt-5 first:mt-0 sm:grid sm:grid-cols-[9.5rem_1fr] sm:gap-x-6"
                    >
                      <dt style={factLabel}>{label}</dt>
                      <dd className="mt-1 sm:mt-0" style={factValue}>
                        {value}
                        {sites?.map((site, i) => (
                          <span key={site}>
                            {i > 0 && ", "}
                            <a
                              href={`https://${site}`}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-[2px] [text-decoration-thickness:1.5px] hover:[text-decoration-thickness:3px]! focus-visible:[text-decoration-thickness:3px]! focus-visible:[outline:2px_solid_#7A2A20] focus-visible:[outline-offset:3px]"
                              style={{
                                color: INK,
                                textDecoration: "underline",
                                textDecorationColor: SEAM,
                                textUnderlineOffset: 4,
                              }}
                            >
                              {site}
                            </a>
                          </span>
                        ))}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
            {/* contact, still on the wall and still on the thread */}
            <div className="pt-[clamp(72px,12vh,150px)]">
              <div ref={beat(7)} className="relative">
                <Knot still={still} on={tied(7)} />
                <h3
                  style={{
                    ...heading,
                    fontSize: "clamp(24px, 3vw, 38px)",
                    fontWeight: 500,
                    fontVariationSettings: "'wght' 500, 'SOFT' 100, 'WONK' 0",
                  }}
                >
                  Have an idea?
                </h3>
                <p className="mt-3" style={{ ...prose, color: INK, maxWidth: "44ch" }}>
                  I am always interested in interesting products, creative
                  experiments, and things worth building. Tell me what it is
                  supposed to feel like, not only what it is supposed to do.
                </p>
                <a
                  href={`mailto:${EMAIL}`}
                  className="inline-block mt-5 rounded-[2px] [text-decoration-thickness:1.5px] hover:[text-decoration-thickness:3px]! focus-visible:[text-decoration-thickness:3px]! focus-visible:[outline:2px_solid_#7A2A20] focus-visible:[outline-offset:3px]"
                  style={{
                    fontFamily: MONO,
                    fontSize: "clamp(13.5px, 1.15vw, 16px)",
                    lineHeight: 1.4,
                    fontWeight: 400,
                    letterSpacing: "0.01em",
                    color: INK,
                    textDecoration: "underline",
                    textDecorationColor: SEAM,
                    textDecorationThickness: 1.5,
                    textUnderlineOffset: 4,
                    outlineColor: SEAM,
                  }}
                >
                  {EMAIL}
                </a>
              </div>
            </div>
          </div>

          {/* the thread stops above the floor: #9C3025 on #DB8443 is 2.58:1 */}
          <span
            aria-hidden
            className="absolute left-[-3px] bottom-[6px] w-2 h-2 rounded-full"
            style={{
              background: THREAD,
              transform: `scale(${sewn > 0.995 ? 1 : 0})`,
              transition: still
                ? "none"
                : "transform 160ms cubic-bezier(.34,1.56,.64,1)",
            }}
          />
        </div>
      </div>

      {/* C — the page ends back in the room: the last 251 rows of the same
          photograph (wall base, baseboard, floorboards). Width-fitted at every
          viewport, so object-bottom always lands on source y 690-941. No text
          sits here, so the band carries no contrast requirement. */}
      <div className="relative w-full aspect-[1672/251]">
        <Image
          src="/woolen-model-bg.png"
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          quality={70}
          className="object-cover object-bottom"
        />
      </div>
    </section>
  );
}
