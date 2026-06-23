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
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% -10%, var(--violet-soft), transparent),
                       radial-gradient(ellipse 60% 50% at 100% 50%, var(--accent-soft), transparent),
                       radial-gradient(ellipse 50% 40% at 0% 80%, var(--bull-soft), transparent),
                       linear-gradient(180deg, var(--bg) 0%, var(--bg-2) 100%)`,
        }}
      />
      <div
        className="orb absolute -top-24 -right-16 w-72 h-72 rounded-full opacity-25 blur-3xl"
        style={{ background: "var(--violet)" }}
      />
      <div
        className="orb absolute top-1/3 -left-20 w-56 h-56 rounded-full opacity-20 blur-3xl"
        style={{ background: "var(--accent)" }}
      />
      <div
        className="orb absolute bottom-20 right-1/4 w-48 h-48 rounded-full opacity-15 blur-3xl"
        style={{ background: "var(--bull)" }}
      />
    </div>
  );
}
