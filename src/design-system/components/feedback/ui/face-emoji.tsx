// src/design-system/components/feedback/ui/face-emoji.tsx

import { resolveSemanticColor } from "@/design-system/chakra/utils/chakra-system-resolver";
import type {
  FaceEmojiConfig,
  FaceEmojiProps,
  FaceEmojiVariant,
} from "@/design-system/components/feedback/types/face-emoji.type";
import { useColorMode } from "@/design-system/hooks/use-color-mode";
import { Box } from "@chakra-ui/react";

const OVERSHOOT_EASE = "cubic-bezier(0.34, 1.56, 0.64, 1)";

// ---------------------------------------------------------------------------
// Variant Definitions based on Reference Sheet (Authentic Shapes & Colors)
// ---------------------------------------------------------------------------

const CONFIGS: Record<FaceEmojiVariant, FaceEmojiConfig> = {
  // 1. [smile] -> Soft pink circle, two dot eyes, tiny curved smile
  smile: {
    defaultColor: "#fca5a5",
    colorPaletteFallback: "pink",
    renderFace: (c) => (
      <g>
        <g className={"face-blink"} style={{ transformOrigin: "50px 40px" }}>
          <circle cx={"37"} cy={"40"} r={"4.5"} fill={c} />
          <circle cx={"63"} cy={"40"} r={"4.5"} fill={c} />
        </g>
        <path
          d={"M 43 54 Q 50 59 57 54"}
          fill={"none"}
          stroke={c}
          strokeWidth={"3.5"}
          strokeLinecap={"round"}
        />
      </g>
    ),
  },

  // 2. [happy] -> Peach circle, squeezed angle eyes (> <), pink blush, open singing mouth
  happy: {
    defaultColor: "#fed7aa",
    colorPaletteFallback: "orange",
    renderFace: (c) => (
      <g>
        {/* Soft pink blush */}
        <circle cx={"24"} cy={"52"} r={"6.5"} fill={"#fca5a5"} opacity={0.6} />
        <circle cx={"76"} cy={"52"} r={"6.5"} fill={"#fca5a5"} opacity={0.6} />

        {/* Squeezed eyes (> <) */}
        <path
          d={"M 32 37 L 43 42 L 32 47"}
          fill={"none"}
          stroke={c}
          strokeWidth={"3.5"}
          strokeLinecap={"round"}
          strokeLinejoin={"round"}
        />
        <path
          d={"M 68 37 L 57 42 L 68 47"}
          fill={"none"}
          stroke={c}
          strokeWidth={"3.5"}
          strokeLinecap={"round"}
          strokeLinejoin={"round"}
        />

        {/* Open singing/laughing mouth with pink tongue */}
        <path
          d={"M 43 50 C 43 45 57 45 57 50 C 57 66 43 66 43 50 Z"}
          fill={c}
        />
        <path d={"M 45 58 C 45 64 55 64 55 58 Z"} fill={"#fb7185"} />
      </g>
    ),
  },

  // 3. [angry] -> Bright red circle, anger cross mark, sharp slanted brows, downward grimace
  angry: {
    defaultColor: "#ef4444",
    colorPaletteFallback: "red",
    renderFace: (c) => (
      <g>
        {/* Anger vein mark (💢) on top right */}
        <path
          d={
            "M 67 24 Q 73 24 73 18 M 73 18 Q 73 24 79 24 M 79 24 Q 73 24 73 30 M 73 30 Q 73 24 67 24"
          }
          stroke={"#7f1d1d"}
          strokeWidth={"2.5"}
          fill={"none"}
          strokeLinecap={"round"}
        />

        {/* Slanted angry eyebrows */}
        <line
          x1={"29"}
          y1={"38"}
          x2={"47"}
          y2={"45"}
          stroke={c}
          strokeWidth={"4"}
          strokeLinecap={"round"}
        />
        <line
          x1={"71"}
          y1={"38"}
          x2={"53"}
          y2={"45"}
          stroke={c}
          strokeWidth={"4"}
          strokeLinecap={"round"}
        />

        {/* Glaring eyes */}
        <circle cx={"39"} cy={"47"} r={"4.5"} fill={c} />
        <circle cx={"61"} cy={"47"} r={"4.5"} fill={c} />

        {/* Downward angry frown */}
        <path
          d={"M 41 66 Q 50 57 59 66"}
          fill={"none"}
          stroke={c}
          strokeWidth={"3.5"}
          strokeLinecap={"round"}
        />
      </g>
    ),
  },

  // 4. [cry] -> Sky blue circle, closed weeping eyes, twin waterfall tear streams
  cry: {
    defaultColor: "#38bdf8",
    colorPaletteFallback: "blue",
    renderFace: (c) => (
      <g>
        {/* Closed weeping eyes */}
        <line
          x1={"32"}
          y1={"38"}
          x2={"44"}
          y2={"38"}
          stroke={c}
          strokeWidth={"4"}
          strokeLinecap={"round"}
        />
        <line
          x1={"56"}
          y1={"38"}
          x2={"68"}
          y2={"38"}
          stroke={c}
          strokeWidth={"4"}
          strokeLinecap={"round"}
        />

        {/* Left waterfall tear stream */}
        <path
          d={"M 33 40 C 27 52 27 75 35 88 C 43 75 43 52 41 40 Z"}
          fill={"#bae6fd"}
        />
        <path
          d={"M 33 48 L 33 80"}
          stroke={"#ffffff"}
          strokeWidth={"2"}
          strokeLinecap={"round"}
          opacity={0.8}
        />

        {/* Right waterfall tear stream */}
        <path
          d={"M 59 40 C 57 52 57 75 65 88 C 73 75 73 52 67 40 Z"}
          fill={"#bae6fd"}
        />
        <path
          d={"M 67 48 L 67 80"}
          stroke={"#ffffff"}
          strokeWidth={"2"}
          strokeLinecap={"round"}
          opacity={0.8}
        />

        {/* Crying open mouth */}
        <path d={"M 43 54 Q 50 72 57 54 Z"} fill={"#0f172a"} />
      </g>
    ),
  },

  // 5. [embarrassed] -> Turquoise teal, forehead sweat drop, small blush, wavy mouth
  embarrassed: {
    defaultColor: "#14b8a6",
    colorPaletteFallback: "teal",
    renderFace: (c) => (
      <g>
        {/* White sweat drop on top right */}
        <path
          d={"M 74 18 C 67 28 67 36 74 38 C 81 36 81 28 74 18 Z"}
          fill={"#ffffff"}
        />

        {/* Worried tilted brows */}
        <line
          x1={"32"}
          y1={"34"}
          x2={"44"}
          y2={"38"}
          stroke={c}
          strokeWidth={"2.5"}
          strokeLinecap={"round"}
        />
        <line
          x1={"68"}
          y1={"34"}
          x2={"56"}
          y2={"38"}
          stroke={c}
          strokeWidth={"2.5"}
          strokeLinecap={"round"}
        />

        {/* Looking down/sideways eyes */}
        <circle cx={"37"} cy={"46"} r={"4"} fill={c} />
        <circle cx={"59"} cy={"46"} r={"4"} fill={c} />

        {/* Soft blush */}
        <circle cx={"26"} cy={"52"} r={"6"} fill={"#042f2e"} opacity={0.3} />
        <circle cx={"70"} cy={"52"} r={"6"} fill={"#042f2e"} opacity={0.3} />

        {/* Wavy squiggly mouth */}
        <path
          d={"M 41 60 Q 46 56 51 60 T 60 59"}
          fill={"none"}
          stroke={c}
          strokeWidth={"3"}
          strokeLinecap={"round"}
        />
      </g>
    ),
  },

  // 6. [surprised] -> Pale peach circle, high arched brows, white eyes with pinhole pupils, "o" mouth
  surprised: {
    defaultColor: "#ffedd5",
    colorPaletteFallback: "orange",
    renderFace: (c) => (
      <g>
        {/* High arched brows */}
        <path
          d={"M 32 25 Q 40 18 48 25"}
          fill={"none"}
          stroke={c}
          strokeWidth={"2.5"}
          strokeLinecap={"round"}
        />
        <path
          d={"M 52 25 Q 60 18 68 25"}
          fill={"none"}
          stroke={c}
          strokeWidth={"2.5"}
          strokeLinecap={"round"}
        />

        {/* Soft pink blush */}
        <circle cx={"24"} cy={"50"} r={"6.5"} fill={"#fca5a5"} opacity={0.6} />
        <circle cx={"76"} cy={"50"} r={"6.5"} fill={"#fca5a5"} opacity={0.6} />

        {/* Big white eyes with small black pupils */}
        <circle
          cx={"39"}
          cy={"42"}
          r={"8"}
          fill={"#ffffff"}
          stroke={c}
          strokeWidth={"1"}
        />
        <circle cx={"39"} cy={"42"} r={"3.2"} fill={c} />

        <circle
          cx={"61"}
          cy={"42"}
          r={"8"}
          fill={"#ffffff"}
          stroke={c}
          strokeWidth={"1"}
        />
        <circle cx={"61"} cy={"42"} r={"3.2"} fill={c} />

        {/* Round black "o" mouth */}
        <circle cx={"50"} cy={"64"} r={"4.5"} fill={c} />
      </g>
    ),
  },

  // 7. [wronged] -> Golden yellow circle, pleading sparkly puppy eyes, hands clasped at chin
  wronged: {
    defaultColor: "#facc15",
    colorPaletteFallback: "yellow",
    renderFace: (c) => (
      <g>
        {/* Pleading curved brows */}
        <path
          d={"M 32 34 Q 39 29 45 35"}
          fill={"none"}
          stroke={c}
          strokeWidth={"2.5"}
          strokeLinecap={"round"}
        />
        <path
          d={"M 68 34 Q 61 29 55 35"}
          fill={"none"}
          stroke={c}
          strokeWidth={"2.5"}
          strokeLinecap={"round"}
        />

        {/* Sparkling puppy eyes looking up-left */}
        <g className={"face-blink"} style={{ transformOrigin: "50px 44px" }}>
          <circle cx={"38"} cy={"44"} r={"6.5"} fill={c} />
          <circle cx={"36"} cy={"42"} r={"2.5"} fill={"#ffffff"} />
          <circle cx={"40"} cy={"46"} r={"1.2"} fill={"#ffffff"} />

          <circle cx={"62"} cy={"44"} r={"6.5"} fill={c} />
          <circle cx={"60"} cy={"42"} r={"2.5"} fill={"#ffffff"} />
          <circle cx={"64"} cy={"46"} r={"1.2"} fill={"#ffffff"} />
        </g>

        {/* Pouting mouth */}
        <path
          d={"M 46 58 Q 50 55 54 58"}
          fill={"none"}
          stroke={c}
          strokeWidth={"3"}
          strokeLinecap={"round"}
        />

        {/* Paws clasped at chin */}
        <ellipse
          cx={"43"}
          cy={"66"}
          rx={"7"}
          ry={"5"}
          fill={"#fde047"}
          stroke={c}
          strokeWidth={"1.5"}
        />
        <ellipse
          cx={"57"}
          cy={"66"}
          rx={"7"}
          ry={"5"}
          fill={"#fde047"}
          stroke={c}
          strokeWidth={"1.5"}
        />
      </g>
    ),
  },

  // 8. [shout] -> Purple circle, sharp angry eyes, wide screaming mouth with sharp fangs
  shout: {
    defaultColor: "#a855f7",
    colorPaletteFallback: "purple",
    renderFace: (c) => (
      <g>
        {/* Angry slanting brows */}
        <line
          x1={"30"}
          y1={"38"}
          x2={"47"}
          y2={"45"}
          stroke={c}
          strokeWidth={"3.5"}
          strokeLinecap={"round"}
        />
        <line
          x1={"70"}
          y1={"38"}
          x2={"53"}
          y2={"45"}
          stroke={c}
          strokeWidth={"3.5"}
          strokeLinecap={"round"}
        />

        {/* Angry white angled eyes */}
        <polygon points={"34,42 45,46 38,48"} fill={"#ffffff"} />
        <polygon points={"66,42 55,46 62,48"} fill={"#ffffff"} />

        {/* Screaming mouth with fangs */}
        <path
          d={"M 38 53 Q 50 49 62 53 Q 60 74 50 74 Q 40 74 38 53 Z"}
          fill={c}
        />
        <polygon points={"42,53 45,59 47,53"} fill={"#ffffff"} />
        <polygon points={"53,53 55,59 58,53"} fill={"#ffffff"} />
      </g>
    ),
  },

  // 9. [flushed] -> Yellow circle, intense hot pink circular blush, shy glance
  flushed: {
    defaultColor: "#fde047",
    colorPaletteFallback: "yellow",
    renderFace: (c) => (
      <g>
        {/* Shy curved brows */}
        <path
          d={"M 34 35 Q 40 31 46 36"}
          fill={"none"}
          stroke={c}
          strokeWidth={"2.5"}
          strokeLinecap={"round"}
        />
        <path
          d={"M 66 35 Q 60 31 54 36"}
          fill={"none"}
          stroke={c}
          strokeWidth={"2.5"}
          strokeLinecap={"round"}
        />

        {/* Shy eyes */}
        <circle cx={"39"} cy={"44"} r={"4"} fill={c} />
        <circle cx={"61"} cy={"44"} r={"4"} fill={c} />

        {/* Giant bright pink blush */}
        <circle cx={"25"} cy={"54"} r={"9"} fill={"#f43f5e"} opacity={0.75} />
        <circle cx={"75"} cy={"54"} r={"9"} fill={"#f43f5e"} opacity={0.75} />

        {/* Shy smile */}
        <path
          d={"M 45 57 Q 50 62 55 57"}
          fill={"none"}
          stroke={c}
          strokeWidth={"3"}
          strokeLinecap={"round"}
        />
      </g>
    ),
  },

  // 10. [yummy] -> Pink circle, smiling eyes with lashes, pink blush, tongue sticking out, hand waving
  yummy: {
    defaultColor: "#f472b6",
    colorPaletteFallback: "pink",
    renderFace: (c) => (
      <g>
        {/* Smiling closed curves with lashes */}
        <path
          d={"M 32 41 Q 40 33 48 41"}
          fill={"none"}
          stroke={c}
          strokeWidth={"3.5"}
          strokeLinecap={"round"}
        />
        <path
          d={"M 52 41 Q 60 33 68 41"}
          fill={"none"}
          stroke={c}
          strokeWidth={"3.5"}
          strokeLinecap={"round"}
        />

        {/* Pink blush */}
        <circle cx={"24"} cy={"52"} r={"6.5"} fill={"#ec4899"} opacity={0.5} />
        <circle cx={"76"} cy={"52"} r={"6.5"} fill={"#ec4899"} opacity={0.5} />

        {/* Mouth with red tongue */}
        <line
          x1={"41"}
          y1={"52"}
          x2={"59"}
          y2={"52"}
          stroke={c}
          strokeWidth={"3.5"}
          strokeLinecap={"round"}
        />
        <path
          d={"M 46 52 C 46 66 56 66 56 52 Z"}
          fill={"#ef4444"}
          stroke={c}
          strokeWidth={"1.5"}
        />

        {/* Paw on side */}
        <ellipse
          cx={"22"}
          cy={"58"}
          rx={"8"}
          ry={"6"}
          fill={"#fbcfe8"}
          stroke={c}
          strokeWidth={"1.5"}
        />
      </g>
    ),
  },

  // 11. [complacent] -> Cyan circle, cool black sunglasses with white glare, confident smirk
  complacent: {
    defaultColor: "#06b6d4",
    colorPaletteFallback: "cyan",
    renderFace: (c) => (
      <g>
        {/* Retro black sunglasses */}
        <path d={"M 22 36 L 47 36 C 47 50 30 52 22 46 Z"} fill={c} />
        <path d={"M 53 36 L 78 36 C 78 46 70 52 53 50 Z"} fill={c} />
        <line
          x1={"47"}
          y1={"38"}
          x2={"53"}
          y2={"38"}
          stroke={c}
          strokeWidth={"3"}
        />

        {/* Glare reflections */}
        <line
          x1={"26"}
          y1={"39"}
          x2={"36"}
          y2={"49"}
          stroke={"#ffffff"}
          strokeWidth={"2.5"}
          strokeLinecap={"round"}
          opacity={0.85}
        />
        <line
          x1={"57"}
          y1={"39"}
          x2={"67"}
          y2={"49"}
          stroke={"#ffffff"}
          strokeWidth={"2.5"}
          strokeLinecap={"round"}
          opacity={0.85}
        />

        {/* Confident smirk */}
        <path
          d={"M 44 63 Q 54 65 64 56"}
          fill={"none"}
          stroke={c}
          strokeWidth={"3.5"}
          strokeLinecap={"round"}
        />
      </g>
    ),
  },

  // 12. [drool] -> Pale peach circle, big red heart eyes, happy smile with white drool drip
  drool: {
    defaultColor: "#fed7aa",
    colorPaletteFallback: "pink",
    renderFace: (c) => (
      <g>
        {/* Pink blush */}
        <circle cx={"24"} cy={"54"} r={"6.5"} fill={"#fca5a5"} opacity={0.6} />
        <circle cx={"76"} cy={"54"} r={"6.5"} fill={"#fca5a5"} opacity={0.6} />

        {/* Red heart eyes */}
        <g className={"face-blink"} style={{ transformOrigin: "50px 40px" }}>
          <path
            d={
              "M 37 47 C 28 38 23 30 29 24 C 34 19 39 23 37 27 C 39 23 44 19 49 24 C 55 30 49 38 37 47 Z"
            }
            fill={"#ef4444"}
          />
          <path
            d={
              "M 63 47 C 54 38 49 30 55 24 C 60 19 65 23 63 27 C 65 23 70 19 75 24 C 81 30 75 38 63 47 Z"
            }
            fill={"#ef4444"}
          />
        </g>

        {/* Mouth with drool drip */}
        <path
          d={"M 42 56 Q 50 66 58 56"}
          fill={"none"}
          stroke={c}
          strokeWidth={"3.5"}
          strokeLinecap={"round"}
        />
        <path
          d={"M 56 59 Q 60 68 57 70 Q 54 71 54 66 Z"}
          fill={"#ffffff"}
          stroke={"#94a3b8"}
          strokeWidth={"0.5"}
        />
      </g>
    ),
  },

  // 13. [scream] -> Royal blue circle, white hands holding cheeks, Munch vertical screaming mouth
  scream: {
    defaultColor: "#2563eb",
    colorPaletteFallback: "blue",
    renderFace: (c) => (
      <g>
        {/* White hands placed against cheeks */}
        <path
          d={"M 15 48 C 15 36 24 34 26 44 L 26 66 C 24 74 15 70 15 58 Z"}
          fill={"#ffffff"}
        />
        <path
          d={"M 85 48 C 85 36 76 34 74 44 L 74 66 C 76 74 85 70 85 58 Z"}
          fill={"#ffffff"}
        />

        {/* White oval eyes with dark pupils */}
        <ellipse cx={"38"} cy={"40"} rx={"6"} ry={"8.5"} fill={"#ffffff"} />
        <circle cx={"38"} cy={"40"} r={"2.5"} fill={c} />

        <ellipse cx={"62"} cy={"40"} rx={"6"} ry={"8.5"} fill={"#ffffff"} />
        <circle cx={"62"} cy={"40"} r={"2.5"} fill={c} />

        {/* Long vertical scream mouth */}
        <ellipse cx={"50"} cy={"62"} rx={"6.5"} ry={"12"} fill={"#0f172a"} />
      </g>
    ),
  },

  // 14. [weep] -> Sky blue circle, sad eyebrows, closed weeping eyes, big single teardrop
  weep: {
    defaultColor: "#38bdf8",
    colorPaletteFallback: "blue",
    renderFace: (c) => (
      <g>
        {/* Sad downward eyebrows */}
        <line
          x1={"32"}
          y1={"38"}
          x2={"44"}
          y2={"43"}
          stroke={c}
          strokeWidth={"2.5"}
          strokeLinecap={"round"}
        />
        <line
          x1={"68"}
          y1={"38"}
          x2={"56"}
          y2={"43"}
          stroke={c}
          strokeWidth={"2.5"}
          strokeLinecap={"round"}
        />

        {/* Weeping closed eyes */}
        <path
          d={"M 33 46 Q 39 42 45 46"}
          fill={"none"}
          stroke={c}
          strokeWidth={"3.5"}
          strokeLinecap={"round"}
        />
        <path
          d={"M 55 46 Q 61 42 67 46"}
          fill={"none"}
          stroke={c}
          strokeWidth={"3.5"}
          strokeLinecap={"round"}
        />

        {/* Single teardrop falling on right */}
        <path
          d={"M 66 49 C 61 58 61 68 67 71 C 73 68 73 58 66 49 Z"}
          fill={"#ffffff"}
          stroke={"#0284c7"}
          strokeWidth={"1"}
          className={"face-tear"}
        />

        {/* Trembling sad mouth */}
        <path
          d={"M 43 62 Q 50 56 57 62"}
          fill={"none"}
          stroke={c}
          strokeWidth={"3"}
          strokeLinecap={"round"}
        />
      </g>
    ),
  },

  // 15. [speechless] -> Darker sea teal, forehead sweat drop, flat brows, half-lidded side-eye
  speechless: {
    defaultColor: "#0d9488",
    colorPaletteFallback: "teal",
    renderFace: (c) => (
      <g>
        {/* White sweat drop on top left */}
        <path
          d={"M 24 30 C 18 38 18 46 24 48 C 30 46 30 38 24 30 Z"}
          fill={"#ffffff"}
        />

        {/* Flat straight eyebrows */}
        <line
          x1={"34"}
          y1={"38"}
          x2={"48"}
          y2={"38"}
          stroke={c}
          strokeWidth={"3"}
          strokeLinecap={"round"}
        />
        <line
          x1={"54"}
          y1={"38"}
          x2={"68"}
          y2={"38"}
          stroke={c}
          strokeWidth={"3"}
          strokeLinecap={"round"}
        />

        {/* Half-lidded side eyes looking right */}
        <path d={"M 36 44 L 46 44 C 46 50 36 50 36 44 Z"} fill={c} />
        <path d={"M 56 44 L 66 44 C 66 50 56 50 56 44 Z"} fill={c} />

        {/* Flat unbothered line mouth */}
        <line
          x1={"42"}
          y1={"60"}
          x2={"60"}
          y2={"60"}
          stroke={c}
          strokeWidth={"3.5"}
          strokeLinecap={"round"}
        />
      </g>
    ),
  },

  // 16. [funnyface] -> Peach circle, wink (>), pink blush, giant red tongue hanging down
  funnyface: {
    defaultColor: "#fed7aa",
    colorPaletteFallback: "orange",
    renderFace: (c) => (
      <g>
        {/* Pink blush */}
        <circle cx={"24"} cy={"52"} r={"6.5"} fill={"#fca5a5"} opacity={0.6} />
        <circle cx={"76"} cy={"52"} r={"6.5"} fill={"#fca5a5"} opacity={0.6} />

        {/* Wink (>) on left, solid dot on right */}
        <path
          d={"M 32 40 L 42 45 L 32 50"}
          fill={"none"}
          stroke={c}
          strokeWidth={"3.5"}
          strokeLinecap={"round"}
          strokeLinejoin={"round"}
        />
        <circle cx={"62"} cy={"45"} r={"5"} fill={c} />

        {/* Mouth with giant red tongue */}
        <line
          x1={"40"}
          y1={"54"}
          x2={"60"}
          y2={"54"}
          stroke={c}
          strokeWidth={"3.5"}
          strokeLinecap={"round"}
        />
        <path
          d={"M 44 54 C 44 76 56 76 56 54 Z"}
          fill={"#ef4444"}
          stroke={c}
          strokeWidth={"2"}
        />
        <line
          x1={"50"}
          y1={"56"}
          x2={"50"}
          y2={"68"}
          stroke={"#991b1b"}
          strokeWidth={"1.5"}
        />
      </g>
    ),
  },

  // 17. [laughwithtears] -> Peach circle, smiling eyes, tears jetting out sideways, wide open grin
  laughwithtears: {
    defaultColor: "#fed7aa",
    colorPaletteFallback: "orange",
    renderFace: (c) => (
      <g>
        {/* Squeezed laughing eyes with lashes */}
        <path
          d={"M 32 42 Q 40 34 48 42"}
          fill={"none"}
          stroke={c}
          strokeWidth={"4"}
          strokeLinecap={"round"}
        />
        <path
          d={"M 52 42 Q 60 34 68 42"}
          fill={"none"}
          stroke={c}
          strokeWidth={"4"}
          strokeLinecap={"round"}
        />

        {/* Spurting side tears */}
        <path
          d={"M 28 44 C 18 42 16 50 24 52 C 28 52 28 46 28 44 Z"}
          fill={"#38bdf8"}
        />
        <path
          d={"M 72 44 C 82 42 84 50 76 52 C 72 52 72 46 72 44 Z"}
          fill={"#38bdf8"}
        />

        {/* Wide open grin with teeth and tongue */}
        <path d={"M 38 52 Q 50 74 62 52 Z"} fill={c} />
        <path
          d={"M 41 53 Q 50 56 59 53"}
          stroke={"#ffffff"}
          strokeWidth={"2"}
          fill={"none"}
        />
        <path d={"M 44 64 Q 50 60 56 64 Q 50 72 44 64 Z"} fill={"#fb7185"} />
      </g>
    ),
  },

  // 18. [wicked] -> Purple circle, devil horns on top, slanted sly brows, sly smirk
  wicked: {
    defaultColor: "#9333ea",
    colorPaletteFallback: "purple",
    renderAccessory: () => (
      <g>
        {/* Purple devil horns */}
        <path
          d={"M 22 28 C 20 14 12 8 8 12 C 12 22 18 32 26 34 Z"}
          fill={"#9333ea"}
          stroke={"#7e22ce"}
          strokeWidth={"1.5"}
        />
        <path
          d={"M 78 28 C 80 14 88 8 92 12 C 88 22 82 32 74 34 Z"}
          fill={"#9333ea"}
          stroke={"#7e22ce"}
          strokeWidth={"1.5"}
        />
      </g>
    ),
    renderFace: (c) => (
      <g>
        {/* Slanted sly brows */}
        <line
          x1={"32"}
          y1={"38"}
          x2={"46"}
          y2={"44"}
          stroke={c}
          strokeWidth={"3"}
          strokeLinecap={"round"}
        />
        <line
          x1={"68"}
          y1={"38"}
          x2={"54"}
          y2={"44"}
          stroke={c}
          strokeWidth={"3"}
          strokeLinecap={"round"}
        />

        {/* Sly glance eyes */}
        <circle cx={"41"} cy={"48"} r={"5"} fill={c} />
        <circle cx={"43"} cy={"47"} r={"1.8"} fill={"#ffffff"} />

        <circle cx={"61"} cy={"48"} r={"5"} fill={c} />
        <circle cx={"63"} cy={"47"} r={"1.8"} fill={"#ffffff"} />

        {/* Devilish smirk */}
        <path
          d={"M 42 62 Q 54 65 64 56"}
          fill={"none"}
          stroke={c}
          strokeWidth={"3.5"}
          strokeLinecap={"round"}
        />
      </g>
    ),
  },

  // 19. [facewithrollingeyes] -> Pale peach circle, thin high brows, pupils rolled up, flat mouth
  facewithrollingeyes: {
    defaultColor: "#ffedd5",
    colorPaletteFallback: "orange",
    renderFace: (c) => (
      <g>
        {/* Arched high brows */}
        <path
          d={"M 32 27 Q 40 23 48 27"}
          fill={"none"}
          stroke={c}
          strokeWidth={"2"}
          strokeLinecap={"round"}
        />
        <path
          d={"M 52 27 Q 60 23 68 27"}
          fill={"none"}
          stroke={c}
          strokeWidth={"2"}
          strokeLinecap={"round"}
        />

        {/* White eyes with pupils rolled way up */}
        <ellipse
          cx={"39"}
          cy={"44"}
          rx={"7.5"}
          ry={"8.5"}
          fill={"#ffffff"}
          stroke={c}
          strokeWidth={"1"}
        />
        <circle cx={"39"} cy={"38"} r={"3.5"} fill={c} />

        <ellipse
          cx={"61"}
          cy={"44"}
          rx={"7.5"}
          ry={"8.5"}
          fill={"#ffffff"}
          stroke={c}
          strokeWidth={"1"}
        />
        <circle cx={"61"} cy={"38"} r={"3.5"} fill={c} />

        {/* Flat unamused mouth */}
        <line
          x1={"43"}
          y1={"64"}
          x2={"57"}
          y2={"64"}
          stroke={c}
          strokeWidth={"3.5"}
          strokeLinecap={"round"}
        />
      </g>
    ),
  },

  // 20. [sulk] -> Crimson red circle, furrowed brow wrinkles, heavy glare, pouty mouth
  sulk: {
    defaultColor: "#dc2626",
    colorPaletteFallback: "red",
    renderFace: (c) => (
      <g>
        {/* Furrowed angry brow wrinkles in center */}
        <line
          x1={"47"}
          y1={"36"}
          x2={"47"}
          y2={"42"}
          stroke={c}
          strokeWidth={"2"}
          strokeLinecap={"round"}
        />
        <line
          x1={"53"}
          y1={"36"}
          x2={"53"}
          y2={"42"}
          stroke={c}
          strokeWidth={"2"}
          strokeLinecap={"round"}
        />

        {/* Heavy slanting brows */}
        <line
          x1={"30"}
          y1={"40"}
          x2={"46"}
          y2={"46"}
          stroke={c}
          strokeWidth={"3.5"}
          strokeLinecap={"round"}
        />
        <line
          x1={"70"}
          y1={"40"}
          x2={"54"}
          y2={"46"}
          stroke={c}
          strokeWidth={"3.5"}
          strokeLinecap={"round"}
        />

        {/* Glaring lids */}
        <path
          d={"M 34 48 Q 41 46 48 48"}
          fill={"none"}
          stroke={c}
          strokeWidth={"3.5"}
          strokeLinecap={"round"}
        />
        <path
          d={"M 52 48 Q 59 46 66 48"}
          fill={"none"}
          stroke={c}
          strokeWidth={"3.5"}
          strokeLinecap={"round"}
        />

        {/* Heavy sulking pout */}
        <path
          d={"M 40 66 Q 50 56 60 66"}
          fill={"none"}
          stroke={c}
          strokeWidth={"4"}
          strokeLinecap={"round"}
        />
      </g>
    ),
  },

  // 21. [thinking] -> Golden yellow circle, asymmetric brow, looking up-right, yellow hand on chin
  thinking: {
    defaultColor: "#facc15",
    colorPaletteFallback: "yellow",
    renderFace: (c) => (
      <g>
        {/* Asymmetric brows */}
        <path
          d={"M 32 32 Q 40 26 48 32"}
          fill={"none"}
          stroke={c}
          strokeWidth={"2.5"}
          strokeLinecap={"round"}
        />
        <line
          x1={"54"}
          y1={"36"}
          x2={"68"}
          y2={"38"}
          stroke={c}
          strokeWidth={"2.5"}
          strokeLinecap={"round"}
        />

        {/* Eyes glancing upward right */}
        <ellipse cx={"41"} cy={"44"} rx={"5"} ry={"6"} fill={c} />
        <circle cx={"41"} cy={"41"} r={"2"} fill={"#ffffff"} />

        <ellipse cx={"61"} cy={"44"} rx={"5"} ry={"6"} fill={c} />
        <circle cx={"61"} cy={"41"} r={"2"} fill={"#ffffff"} />

        {/* Small pursed mouth */}
        <path
          d={"M 45 58 Q 50 62 55 58"}
          fill={"none"}
          stroke={c}
          strokeWidth={"3"}
          strokeLinecap={"round"}
        />

        {/* Iconic thinking hand on chin with finger pointing up */}
        <path
          d={"M 30 68 C 26 58 28 50 33 50 C 37 50 36 58 37 66 Z"}
          fill={"#fde047"}
          stroke={c}
          strokeWidth={"2"}
        />
        <path
          d={"M 28 66 C 34 58 46 64 52 64 C 46 72 36 76 28 72 Z"}
          fill={"#fde047"}
          stroke={c}
          strokeWidth={"2"}
        />
      </g>
    ),
  },

  // 22. [lovely] -> Rose pink circle, intense red blush, angle joy eyes, cute cat "3" mouth
  lovely: {
    defaultColor: "#fb7185",
    colorPaletteFallback: "pink",
    renderFace: (c) => (
      <g>
        {/* Bright red blush */}
        <circle cx={"24"} cy={"54"} r={"8"} fill={"#f43f5e"} opacity={0.75} />
        <circle cx={"76"} cy={"54"} r={"8"} fill={"#f43f5e"} opacity={0.75} />

        {/* Squeezed angle joy eyes (> <) */}
        <path
          d={"M 32 38 L 42 43 L 32 48"}
          fill={"none"}
          stroke={c}
          strokeWidth={"3.5"}
          strokeLinecap={"round"}
          strokeLinejoin={"round"}
        />
        <path
          d={"M 68 38 L 58 43 L 68 48"}
          fill={"none"}
          stroke={c}
          strokeWidth={"3.5"}
          strokeLinecap={"round"}
          strokeLinejoin={"round"}
        />

        {/* Cute "3" cat kiss mouth */}
        <path
          d={"M 44 56 Q 47 62 50 58 Q 53 62 56 56"}
          fill={"none"}
          stroke={c}
          strokeWidth={"3.5"}
          strokeLinecap={"round"}
        />
      </g>
    ),
  },

  // 23. [greedy] -> Warm peach circle, bold dollar signs ($ $), open mouth with teeth barcode
  greedy: {
    defaultColor: "#fed7aa",
    colorPaletteFallback: "yellow",
    renderFace: (c) => (
      <g>
        {/* Bold dollar signs */}
        <text
          x={"38"}
          y={"47"}
          fontSize={"17"}
          fontWeight={"900"}
          textAnchor={"middle"}
          fill={c}
          fontFamily={"sans-serif"}
        >
          $
        </text>
        <text
          x={"62"}
          y={"47"}
          fontSize={"17"}
          fontWeight={"900"}
          textAnchor={"middle"}
          fill={c}
          fontFamily={"sans-serif"}
        >
          $
        </text>

        {/* Open mouth with vertical teeth barcode */}
        <path
          d={"M 38 56 Q 50 52 62 56 L 62 67 Q 50 73 38 67 Z"}
          fill={"#ffffff"}
          stroke={c}
          strokeWidth={"2"}
        />
        <line
          x1={"43"}
          y1={"55"}
          x2={"43"}
          y2={"68"}
          stroke={c}
          strokeWidth={"2"}
        />
        <line
          x1={"48"}
          y1={"54"}
          x2={"48"}
          y2={"70"}
          stroke={c}
          strokeWidth={"2"}
        />
        <line
          x1={"52"}
          y1={"54"}
          x2={"52"}
          y2={"70"}
          stroke={c}
          strokeWidth={"2"}
        />
        <line
          x1={"57"}
          y1={"55"}
          x2={"57"}
          y2={"68"}
          stroke={c}
          strokeWidth={"2"}
        />
      </g>
    ),
  },
};

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export const FaceEmoji = (props: FaceEmojiProps) => {
  // Props
  const {
    variant = "smile",
    transition = true,
    colorPalette: colorPaletteProp,
    size = "md",
    ...restProps
  } = props;

  // Hooks
  const { colorMode } = useColorMode();

  // Resolved Config
  const config = CONFIGS[variant] || CONFIGS.smile;

  // Resolve Background Color:
  // If user explicitly passed `colorPalette`, respect it via semantic resolver.
  // Otherwise, use the exact authentic color matching the reference image.
  const resolvedBgColor = colorPaletteProp
    ? resolveSemanticColor(`${colorPaletteProp}.solid`, colorMode) ||
      config.defaultColor
    : config.defaultColor;

  const resolvedFeatureColor = "#171717"; // Sharp dark charcoal matching reference sheet

  const SIZES_MAP = {
    sm: 40,
    md: 64,
    lg: 96,
    xl: 140,
  };

  const dimension = SIZES_MAP[size] || SIZES_MAP.md;

  return (
    <Box
      pos={"relative"}
      w={`${dimension}px`}
      h={`${dimension}px`}
      display={"inline-flex"}
      alignItems={"center"}
      justifyContent={"center"}
      flexShrink={0}
      {...restProps}
    >
      <Box
        pos={"relative"}
        w={"full"}
        h={"full"}
        transition={transition ? `all 300ms ${OVERSHOOT_EASE}` : undefined}
      >
        <svg
          viewBox={"0 0 100 100"}
          width={"100%"}
          height={"100%"}
          style={{ display: "block", overflow: "visible" }}
        >
          <style>{`
            @keyframes faceBlink {
              0%, 90%, 100% { transform: scaleY(1); }
              95% { transform: scaleY(0.1); }
            }
            @keyframes faceTear {
              0%, 100% { transform: translateY(0); opacity: 0.9; }
              50% { transform: translateY(2.5px); opacity: 1; }
            }

            .face-blink {
              animation: faceBlink 4s infinite ease-in-out;
            }
            .face-tear {
              animation: faceTear 2.5s infinite ease-in-out;
            }
          `}</style>

          {/* Exterior Accessories (e.g. Devil Horns) */}
          {config.renderAccessory &&
            config.renderAccessory(resolvedFeatureColor)}

          {/* Authentic Circle Base */}
          <circle cx={"50"} cy={"50"} r={"48"} fill={resolvedBgColor} />

          {/* Expressive Facial Features */}
          {config.renderFace(resolvedFeatureColor)}
        </svg>
      </Box>
    </Box>
  );
};
