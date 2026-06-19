// app/StepThrough.tsx
"use client";

import { useState, useEffect } from "react";
import type { BuildStep } from "@/lib/baseLibrary";

export default function StepThrough({ steps }: { steps: BuildStep[] }) {
  const [i, setI] = useState(0);

  // Reset to step 1 whenever a different base is shown.
  useEffect(() => {
    setI(0);
  }, [steps]);

  if (!steps || steps.length === 0) return null;
  const step = steps[i];
  const isVideo = step.media.toLowerCase().endsWith(".mp4");

  return (
    <div>
      <div className="stepper-media">
        {isVideo ? (
          <video
            src={step.media}
            controls
            loop
            muted
            playsInline
            className="w-full"
          />
        ) : (
          <img src={step.media} alt={`Step ${i + 1}`} className="w-full" />
        )}
      </div>

      {/* progress dots */}
      <div className="stepper-bar">
        {steps.map((_, idx) => (
          <span
            key={idx}
            className={
              "stepper-dot" +
              (idx === i ? " active" : idx < i ? " done" : "")
            }
          />
        ))}
      </div>

<p className="stepper-caption">
        <span className="stepper-num">Step {i + 1} of {steps.length}</span>
      </p>

      
      <div className="stepper-controls">
        <button
          className="btn-steel px-4 py-2"
          onClick={() => setI((n) => Math.max(0, n - 1))}
          disabled={i === 0}
        >
          Back
        </button>
        <button
          className="btn-ember px-4 py-2 disabled:opacity-50"
          onClick={() => setI((n) => Math.min(steps.length - 1, n + 1))}
          disabled={i === steps.length - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
}