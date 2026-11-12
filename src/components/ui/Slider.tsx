"use client";

import { useId, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  /** Visible value next to the label. */
  display: string;
  /** Spoken value for screen readers (aria-valuetext). */
  valueText: string;
  /** Labels under the track for min and max. */
  minLabel?: string;
  maxLabel?: string;
  className?: string;
}

/**
 * Native range input: full keyboard support (arrows, Page Up/Down, Home/End)
 * and screen reader semantics come for free; aria-valuetext adds units.
 */
export function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  display,
  valueText,
  minLabel,
  maxLabel,
  className,
}: SliderProps) {
  const id = useId();
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-label-md">
          {label}
        </label>
        <span className="text-h3 tabular-nums" aria-hidden="true">
          {display}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={valueText}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mm-range"
        style={{ "--fill": `${pct}%` } as CSSProperties}
      />
      {(minLabel || maxLabel) && (
        <div className="flex justify-between text-caption text-muted" aria-hidden="true">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
      )}
    </div>
  );
}
