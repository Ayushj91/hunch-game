"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef } from "react";

gsap.registerPlugin(useGSAP);

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ open, onClose, children, className = "" }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useGSAP(
    () => {
      if (!overlayRef.current || !cardRef.current) return;
      if (open) {
        gsap.set(overlayRef.current, { display: "flex" });
        gsap.fromTo(
          overlayRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.2, ease: "power2.out" }
        );
        gsap.fromTo(
          cardRef.current,
          { opacity: 0, scale: 0.88, y: 12 },
          { opacity: 1, scale: 1, y: 0, duration: 0.28, ease: "power3.out" }
        );
      } else {
        gsap.to(cardRef.current, {
          opacity: 0,
          scale: 0.92,
          duration: 0.15,
          ease: "power2.in",
        });
        gsap.to(overlayRef.current, {
          opacity: 0,
          duration: 0.15,
          ease: "power2.in",
          onComplete: () => {
            if (overlayRef.current) gsap.set(overlayRef.current, { display: "none" });
          },
        });
      }
    },
    { dependencies: [open] }
  );

  return (
    <div
      ref={overlayRef}
      className="modal-overlay"
      style={{ display: open ? "flex" : "none" }}
      onClick={(e) => e.target === overlayRef.current && onClose()}
      role="presentation"
    >
      <div
        ref={cardRef}
        className={`modal-card ${className}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </div>
  );
}
