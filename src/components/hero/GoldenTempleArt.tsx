// Line-art elevation of Sri Harmandir Sahib (Golden Temple, Amritsar), drawn from
// the classic causeway view: marble ground storey with inlaid panels and the main
// entrance, gilded upper storey with cusped windows and the triple-arched jharokha,
// projecting chhajja, parapet of small domes, corner chhatris (the right one on its
// taller tower), and the fluted onion dome on its lotus base with flanking domes.
// Everything is a single gold stroke; the platform line sits at y=184.
//
// Two layers: a faint ghost of the full drawing (always visible) and a draw layer
// whose strokes are revealed by --temple-marble (base) then --temple-gold (roofline)
// via pathLength.

type Item = string | { cx: number; cy: number; r: number };

const BASE_ITEMS = [
  "M24.6,184.0 H280.9",
  "M57.4,188.7 H266.5",
  "M53.3,184.0 V149.2 H270.6 V184.0",
  "M108.2,184.0 V158.4 Q108.2,153.5 116.8,151.8 Q125.5,153.5 125.5,158.4 V184.0",
  "M185.7,184.0 V154.3 Q185.7,141.6 200.5,139.9 Q215.2,141.6 215.2,154.3 V184.0",
  "M61.5,157.3 H77.9 V179.9 H61.5 Z",
  "M84.0,157.3 H100.4 V179.9 H84.0 Z",
  "M135.3,157.3 H151.7 V179.9 H135.3 Z",
  "M157.8,157.3 H174.2 V179.9 H157.8 Z",
  "M230.6,157.3 H255.2 V179.9 H230.6 Z",
  "M53.3,149.2 V101.0 M270.6,149.2 V101.0",
  "M66.2,134.2 V123.9 Q66.2,120.7 70.7,119.0 Q75.2,120.7 75.2,123.9 V134.2",
  "M91.8,134.2 V123.9 Q91.8,120.7 96.3,119.0 Q100.9,120.7 100.9,123.9 V134.2",
  "M106.2,134.2 V123.9 Q106.2,120.7 110.7,119.0 Q115.2,120.7 115.2,123.9 V134.2",
  "M120.5,134.2 V123.9 Q120.5,120.7 125.0,119.0 Q129.6,120.7 129.6,123.9 V134.2",
  "M158.5,134.2 V123.9 Q158.5,120.7 163.0,119.0 Q167.5,120.7 167.5,123.9 V134.2",
  "M178.3,135.4 H215.2 M178.3,112.5 H215.2",
  "M180.2,135.4 V121.5 Q180.2,117.0 185.1,115.3 Q190.0,117.0 190.0,121.5 V135.4",
  "M191.9,135.4 V121.5 Q191.9,117.0 196.8,115.3 Q201.7,117.0 201.7,121.5 V135.4",
  "M203.6,135.4 V121.5 Q203.6,117.0 208.5,115.3 Q213.4,117.0 213.4,121.5 V135.4",
  "M238.6,133.8 V121.5 Q238.6,118.6 243.9,117.0 Q249.3,118.6 249.3,121.5 V133.8",
  "M39.0,101.0 H280.9 V96.5 H39.0 Z",
];

const ROOF_ITEMS = [
  "M77.9,96.5 V82.5 H215.2 V96.5",
  "M81.2,82.5 C80.8,79.7 82.4,78.0 84.0,76.4 C85.7,78.0 87.3,79.7 86.9,82.5",
  "M84.0,76.4 V73.9",
  "M90.8,82.5 C90.4,79.7 92.0,78.0 93.7,76.4 C95.3,78.0 97.0,79.7 96.6,82.5",
  "M93.7,76.4 V73.9",
  "M100.4,82.5 C100.0,79.7 101.7,78.0 103.3,76.4 C105.0,78.0 106.6,79.7 106.2,82.5",
  "M103.3,76.4 V73.9",
  "M110.1,82.5 C109.7,79.7 111.3,78.0 113.0,76.4 C114.6,78.0 116.2,79.7 115.8,82.5",
  "M113.0,76.4 V73.9",
  "M119.7,82.5 C119.3,79.7 120.9,78.0 122.6,76.4 C124.2,78.0 125.9,79.7 125.5,82.5",
  "M122.6,76.4 V73.9",
  "M129.4,82.5 C128.9,79.7 130.6,78.0 132.2,76.4 C133.9,78.0 135.5,79.7 135.1,82.5",
  "M132.2,76.4 V73.9",
  "M139.0,82.5 C138.6,79.7 140.2,78.0 141.9,76.4 C143.5,78.0 145.1,79.7 144.7,82.5",
  "M141.9,76.4 V73.9",
  "M148.6,82.5 C148.2,79.7 149.9,78.0 151.5,76.4 C153.1,78.0 154.8,79.7 154.4,82.5",
  "M151.5,76.4 V73.9",
  "M158.3,82.5 C157.8,79.7 159.5,78.0 161.1,76.4 C162.8,78.0 164.4,79.7 164.0,82.5",
  "M161.1,76.4 V73.9",
  "M167.9,82.5 C167.5,79.7 169.1,78.0 170.8,76.4 C172.4,78.0 174.0,79.7 173.6,82.5",
  "M170.8,76.4 V73.9",
  "M177.5,82.5 C177.1,79.7 178.8,78.0 180.4,76.4 C182.0,78.0 183.7,79.7 183.3,82.5",
  "M180.4,76.4 V73.9",
  "M187.2,82.5 C186.8,79.7 188.4,78.0 190.0,76.4 C191.7,78.0 193.3,79.7 192.9,82.5",
  "M190.0,76.4 V73.9",
  "M196.8,82.5 C196.4,79.7 198.0,78.0 199.7,76.4 C201.3,78.0 202.9,79.7 202.5,82.5",
  "M199.7,76.4 V73.9",
  "M206.4,82.5 C206.0,79.7 207.7,78.0 209.3,76.4 C210.9,78.0 212.6,79.7 212.2,82.5",
  "M209.3,76.4 V73.9",
  "M45.1,96.5 V68.2 H77.9 V96.5",
  "M45.1,80.5 H77.9",
  "M215.2,96.5 V68.2 H270.6 V96.5",
  "M215.2,80.5 H270.6",
  "M51.2,68.2 V52.2",
  "M61.5,68.2 V52.2",
  "M71.8,68.2 V52.2",
  "M51.9,68.2 V60.0 Q51.9,55.9 56.4,54.2 Q60.9,55.9 60.9,60.0 V68.2",
  "M62.1,68.2 V60.0 Q62.1,55.9 66.6,54.2 Q71.1,55.9 71.1,60.0 V68.2",
  "M47.6,52.2 H75.4",
  "M48.8,49.7 H74.2 M47.6,52.2 V49.7 M75.4,52.2 V49.7",
  "M51.7,49.7 C50.0,48.1 49.2,48.7 49.2,44.6 C49.2,36.4 57.8,39.1 61.5,37.4 C65.2,39.1 73.8,36.4 73.8,44.6 C73.8,48.7 73.0,48.1 71.3,49.7",
  "M61.5,37.4 C59.8,41.1 56.6,40.5 56.6,49.7",
  "M61.5,37.4 C63.2,41.1 66.4,40.5 66.4,49.7",
  "M61.5,37.4 V27.2",
  { cx: 61.5, cy: 35.0, r: 2.2 },
  { cx: 61.5, cy: 31.3, r: 1.5 },
  "M232.7,68.2 V52.2",
  "M242.9,68.2 V52.2",
  "M253.2,68.2 V52.2",
  "M233.3,68.2 V60.0 Q233.3,55.9 237.8,54.2 Q242.3,55.9 242.3,60.0 V68.2",
  "M243.5,68.2 V60.0 Q243.5,55.9 248.0,54.2 Q252.6,55.9 252.6,60.0 V68.2",
  "M229.0,52.2 H256.9",
  "M230.2,49.7 H255.6 M229.0,52.2 V49.7 M256.9,52.2 V49.7",
  "M233.1,49.7 C231.4,48.1 230.6,48.7 230.6,44.6 C230.6,36.4 239.2,39.1 242.9,37.4 C246.6,39.1 255.2,36.4 255.2,44.6 C255.2,48.7 254.4,48.1 252.8,49.7",
  "M242.9,37.4 C241.2,41.1 238.0,40.5 238.0,49.7",
  "M242.9,37.4 C244.6,41.1 247.8,40.5 247.8,49.7",
  "M242.9,37.4 V27.2",
  { cx: 242.9, cy: 35.0, r: 2.2 },
  { cx: 242.9, cy: 31.3, r: 1.5 },
  "M89.2,76.4 V63.7 H148.6 V76.4",
  "M89.2,76.4 H148.6",
  "M99.2,76.0 V69.8 Q99.2,67.8 104.5,66.1 Q109.9,67.8 109.9,69.8 V76.0",
  "M113.6,76.0 V69.8 Q113.6,67.8 118.9,66.1 Q124.2,67.8 124.2,69.8 V76.0",
  "M127.9,76.0 V69.8 Q127.9,67.8 133.2,66.1 Q138.6,67.8 138.6,69.8 V76.0",
  "M89.2,63.7 Q94.1,59.2 99.1,63.7 Q104.0,59.2 109.0,63.7 Q113.9,59.2 118.9,63.7 Q123.9,59.2 128.8,63.7 Q133.8,59.2 138.7,63.7 Q143.7,59.2 148.6,63.7",
  "M95.3,61.0 V59.2 H142.5 V61.0",
  "M96.8,59.2 C95.1,57.5 91.2,54.8 91.2,50.8 C91.2,42.6 115.2,36.6 118.9,35.0 C122.6,36.6 146.6,42.6 146.6,50.8 C146.6,54.8 142.7,57.5 141.0,59.2",
  "M118.9,35.0 C113.9,38.7 104.5,49.9 104.5,59.2",
  "M118.9,35.0 C116.4,38.7 111.7,49.9 111.7,59.2",
  "M118.9,35.0 C121.4,38.7 126.1,49.9 126.1,59.2",
  "M118.9,35.0 C123.9,38.7 133.2,49.9 133.2,59.2",
  "M118.9,35.0 V14.9",
  { cx: 118.9, cy: 32.9, r: 3.2 },
  { cx: 118.9, cy: 28.4, r: 2.2 },
  { cx: 118.9, cy: 23.5, r: 1.6 },
  "M80.6,63.7 C78.9,62.0 78.9,62.4 78.9,58.3 C78.9,50.1 80.4,52.4 84.0,50.8 C87.7,52.4 89.2,50.1 89.2,58.3 C89.2,62.4 89.2,62.0 87.5,63.7",
  "M84.0,50.8 V46.0",
  { cx: 84.0, cy: 48.5, r: 1.4 },
  "M150.3,63.7 C148.6,62.0 148.6,62.4 148.6,58.3 C148.6,50.1 150.1,52.4 153.8,50.8 C157.4,52.4 158.9,50.1 158.9,58.3 C158.9,62.4 158.9,62.0 157.2,63.7",
  "M153.8,50.8 V46.0",
  { cx: 153.8, cy: 48.5, r: 1.4 },
];

// ─── Site: Sarovar enclosure, causeway and shrine island ─────────────────────
// Shallow oblique view. The shrine (untouched paths above) is scaled and placed
// upright on its island via SHRINE_TRANSFORM, its base on the enclosure's vertical
// centre (y≈152): its platform line sits on the causeway's top rail and the
// island slab on its bottom rail, so the causeway merges into the shrine base. The far edge is interrupted where the shrine stands in front of it.
const SHRINE_TRANSFORM = "translate(78.4,46) scale(0.56)";

// Enclosure: two parallel outlines (walkway edge + water edge).
const SITE_WATER: Item[] = [
  "M4,197 H316 L300,108 H229.9 M108.2,108 H40 L4,197",
  "M18,190 H302 L290,115 H229.9 M108.2,115 H48 L18,190",
];

// Quiet water suggestion: three thin lines following the enclosure's perspective,
// broken around the shrine and causeway.
const SITE_RIPPLES: Item[] = [
  "M64,132 H98 M240,132 H282",
  "M48,166 H140 M172,166 H290",
  "M92,181 H262",
];

// Island slab under the shrine platform, ending at the shrine's width.
const SITE_ISLAND: Item[] = ["M92.2,149 V155 H235.7 V149"];

// Causeway: straight, horizontal, on the enclosure centreline, from the left
// water edge to the shrine platform, with a paved rhythm.
const CAUSEWAY_Y = 152;
const CAUSEWAY_X0 = 33; // on the inner (water) edge of the left walkway
const CAUSEWAY_X1 = 92.2; // shrine platform
const SITE_CAUSEWAY: Item[] = [
  `M${CAUSEWAY_X0},${CAUSEWAY_Y - 3} H${CAUSEWAY_X1}`,
  `M${CAUSEWAY_X0},${CAUSEWAY_Y + 3} H${CAUSEWAY_X1}`,
  ...Array.from({ length: 6 }, (_, i) => {
    const x = CAUSEWAY_X0 + 8 + i * 8;
    return `M${x},${CAUSEWAY_Y - 3} V${CAUSEWAY_Y + 3}`;
  }),
];

function Layer({ items, className, draw }: { items: Item[]; className?: string; draw?: string }) {
  const style = draw
    ? { strokeDasharray: 1, strokeDashoffset: `calc(1 - var(${draw}, 1))` }
    : undefined;
  return (
    <g className={className}>
      {items.map((it, i) =>
        typeof it === "string" ? (
          <path
            key={i}
            d={it}
            pathLength={draw ? 1 : undefined}
            vectorEffect="non-scaling-stroke"
            style={style}
          />
        ) : (
          <circle
            key={i}
            cx={it.cx}
            cy={it.cy}
            r={it.r}
            pathLength={draw ? 1 : undefined}
            vectorEffect="non-scaling-stroke"
            style={style}
          />
        ),
      )}
    </g>
  );
}

export function GoldenTempleArt({
  className,
  ...rest
}: { className?: string } & Record<`data-${string}`, string>) {
  return (
    <svg
      {...rest}
      viewBox="0 0 320 208"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      focusable="false"
    >
      <g className="text-[var(--hero-gold)]">
        {/* ghost of the full drawing */}
        <g className="opacity-[0.38]">
          <Layer items={SITE_RIPPLES} />
          <Layer items={SITE_WATER} />
          <Layer items={SITE_ISLAND} />
          <Layer items={SITE_CAUSEWAY} />
          <g transform={SHRINE_TRANSFORM}>
            <Layer items={BASE_ITEMS} />
            <Layer items={ROOF_ITEMS} />
          </g>
        </g>
        {/* drawn layer: site and shrine base first, roofline second */}
        <Layer items={SITE_RIPPLES} className="opacity-30" draw="--temple-marble" />
        <Layer items={SITE_WATER} className="opacity-60" draw="--temple-marble" />
        <Layer items={SITE_ISLAND} draw="--temple-marble" />
        <Layer items={SITE_CAUSEWAY} draw="--temple-marble" />
        <g transform={SHRINE_TRANSFORM}>
          <Layer items={BASE_ITEMS} draw="--temple-marble" />
          <Layer items={ROOF_ITEMS} draw="--temple-gold" />
        </g>
      </g>
    </svg>
  );
}
