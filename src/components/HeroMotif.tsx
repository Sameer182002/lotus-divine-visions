"use client";

import { useId } from "react";

const LOTUS_OUTER = [-78, -52, -26, 0, 26, 52, 78];
const LOTUS_INNER = [-42, -21, 0, 21, 42];

function LotusGlyph() {
  return (
    <g
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinejoin="round"
      strokeLinecap="round"
      fill="none"
    >
      {LOTUS_OUTER.map((deg) => (
        <path
          key={`outer-${deg}`}
          d="M0,0 C-26,-44 -30,-96 0,-142 C30,-96 26,-44 0,0 Z"
          transform={`rotate(${deg})`}
        />
      ))}
      {LOTUS_INNER.map((deg) => (
        <path
          key={`inner-${deg}`}
          d="M0,0 C-16,-30 -18,-64 0,-96 C18,-64 16,-30 0,0 Z"
          transform={`rotate(${deg})`}
        />
      ))}
      <circle r="7" />
    </g>
  );
}

export function HeroMotif({
  className,
  variant = "panel",
}: {
  className?: string;
  variant?: "panel" | "band";
}) {
  const uid = useId().replace(/[:]/g, "");
  const jaliId = `jali-${uid}`;
  const archId = `arch-${uid}`;

  if (variant === "band") {
    return (
      <svg
        viewBox="0 0 800 240"
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <defs>
          <pattern id={jaliId} width="34" height="34" patternUnits="userSpaceOnUse">
            <path
              d="M17,1 L33,17 L17,33 L1,17 Z"
              stroke="currentColor"
              strokeWidth="0.6"
              opacity="0.4"
              fill="none"
            />
            <circle
              cx="17"
              cy="17"
              r="4.5"
              stroke="currentColor"
              strokeWidth="0.6"
              opacity="0.4"
              fill="none"
            />
          </pattern>
          <clipPath id={archId}>
            <path d="M540,240 L540,90 Q540,10 660,10 Q780,10 780,90 L780,240 Z" />
          </clipPath>
        </defs>
        <g clipPath={`url(#${archId})`}>
          <rect x="500" y="0" width="320" height="240" fill={`url(#${jaliId})`} />
        </g>
        <path
          d="M540,240 L540,90 Q540,10 660,10 Q780,10 780,90 L780,240"
          stroke="currentColor"
          strokeWidth="1.25"
        />
        <path d="M0,200 H520" stroke="currentColor" strokeWidth="0.75" opacity="0.3" />
        <g transform="translate(660,200) scale(0.72)">
          <LotusGlyph />
        </g>
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 400 560"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <pattern id={jaliId} width="40" height="40" patternUnits="userSpaceOnUse">
          <path
            d="M20,2 L38,20 L20,38 L2,20 Z"
            stroke="currentColor"
            strokeWidth="0.7"
            opacity="0.35"
            fill="none"
          />
          <circle
            cx="20"
            cy="20"
            r="5.5"
            stroke="currentColor"
            strokeWidth="0.7"
            opacity="0.35"
            fill="none"
          />
        </pattern>
        <clipPath id={archId}>
          <path d="M50,540 L50,240 Q50,60 200,40 Q350,60 350,240 L350,540 Z" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${archId})`}>
        <rect x="0" y="0" width="400" height="560" fill={`url(#${jaliId})`} />
      </g>
      <path
        d="M50,540 L50,240 Q50,60 200,40 Q350,60 350,240 L350,540"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M76,540 L76,246 Q76,90 200,72 Q324,90 324,246 L324,540"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.5"
      />
      <path d="M200,362 L200,500" stroke="currentColor" strokeWidth="1.25" />
      <path
        d="M200,430 C170,430 150,450 140,478"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.7"
      />
      <path
        d="M200,460 C230,460 250,478 260,504"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.7"
      />
      <g transform="translate(200,360)">
        <LotusGlyph />
      </g>
    </svg>
  );
}
