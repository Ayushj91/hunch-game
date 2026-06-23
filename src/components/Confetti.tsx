"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

gsap.registerPlugin(useGSAP);

interface ConfettiProps {
  active: boolean;
}

export function Confetti({ active }: ConfettiProps) {
  const layerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!active || !layerRef.current) return;
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        return;
      }

      const colors = [
        "var(--bull)",
        "var(--cow)",
        "var(--accent)",
      ];
      const particles: HTMLSpanElement[] = [];

      for (let i = 0; i < 40; i++) {
        const p = document.createElement("span");
        p.className = "absolute top-[-12px] w-[9px] h-[14px] rounded-sm opacity-90";
        p.style.left = `${Math.random() * 100}%`;
        p.style.background = colors[i % colors.length];
        layerRef.current.appendChild(p);
        particles.push(p);
      }

      particles.forEach((p, i) => {
        gsap.fromTo(
          p,
          {
            y: -20,
            x: 0,
            rotation: Math.random() * 360,
            opacity: 0,
          },
          {
            y: window.innerHeight + 40,
            x: (Math.random() - 0.5) * 180,
            rotation: `+=${360 + Math.random() * 360}`,
            opacity: 0.2,
            duration: 0.9 + Math.random() * 0.7,
            delay: Math.random() * 0.18,
            ease: "power1.in",
            onComplete: () => p.remove(),
          }
        );
      });

      gsap.delayedCall(2, () => {
        if (layerRef.current) layerRef.current.innerHTML = "";
      });
    },
    { dependencies: [active] }
  );

  if (!active) return null;

  return (
    <div
      ref={layerRef}
      className="fixed inset-0 pointer-events-none z-[200] overflow-hidden"
      aria-hidden
    />
  );
}
