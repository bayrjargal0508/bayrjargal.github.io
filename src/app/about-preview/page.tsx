"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AboutMe from "@/components/with-3d/about-me";

// query is read client-side so the page can be statically exported
function Preview() {
  const y = useSearchParams().get("y");
  return (
    <div style={{ marginTop: -Number(y ?? 0) }}>
      <AboutMe />
    </div>
  );
}

export default function P() {
  return (
    <Suspense>
      <Preview />
    </Suspense>
  );
}
