"use client";

import { useEffect, useState } from "react";

export function useCountdown(active: boolean) {
  const [text, setText] = useState("");

  useEffect(() => {
    if (!active) return;

    const tick = () => {
      const now = new Date();
      const end = new Date(now);
      end.setUTCHours(24, 0, 0, 0);
      let seconds = Math.max(0, Math.floor((end.getTime() - now.getTime()) / 1000));
      const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
      seconds %= 3600;
      const m = String(Math.floor(seconds / 60)).padStart(2, "0");
      const s = String(seconds % 60).padStart(2, "0");
      setText(`${h}:${m}:${s}`);
    };

    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [active]);

  return text;
}
