// app/Scramble.tsx
"use client";

import { useEffect, useRef, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&*";

export default function Scramble({ text, className }: { text: string; className?: string }) {
  const [display, setDisplay] = useState(text);
  const started = useRef(false);

  useEffect(() => {
    // respect reduced motion
    if (typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(text);
      return;
    }
    if (started.current) return;
    started.current = true;

    let frame = 0;
    const total = text.length;
    const id = setInterval(() => {
      frame++;
      const revealed = Math.floor(frame / 3);
      let out = "";
      for (let i = 0; i < total; i++) {
        if (i < revealed || text[i] === " ") out += text[i];
        else out += CHARS[Math.floor(Math.random() * CHARS.length)];
      }
      setDisplay(out);
      if (revealed >= total) clearInterval(id);
    }, 40);

    return () => clearInterval(id);
  }, [text]);

  return <span className={className}>{display}</span>;
}