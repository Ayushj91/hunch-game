"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

gsap.registerPlugin(useGSAP);

export function BgDecor() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      const orbs = ref.current.querySelectorAll(".orb");
      orbs.forEach((orb, i) => {
        gsap.to(orb, {
          x: `random(-30, 30)`,
          y: `random(-20, 20)`,
          duration: 4 + i * 0.8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
    },
    { scope: ref }
  );

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-0 overflow-hidden -z-10"
      aria-hidden
    >
      <div
        className="absolute inset-0"
        style={{ background: "var(--bg)" }}
      />
      <div
        className="orb absolute -top-32 -right-24 w-96 h-96 rounded-full opacity-[0.04] blur-3xl"
        style={{ background: "var(--accent)" }}
      />
      <div
        className="orb absolute bottom-0 -left-24 w-72 h-72 rounded-full opacity-[0.04] blur-3xl"
        style={{ background: "var(--violet)" }}
      />
    </div>
  );
}
