import React, { useState, useEffect } from "react";

interface OnboardingProps {
  onDone: () => void;
}

const LS_SEEN = "hizliokur_onboarding_seen";

export const useOnboarding = () => {
  const [show, setShow] = useState<boolean>(
    () => localStorage.getItem(LS_SEEN) !== "1"
  );
  const done = () => {
    localStorage.setItem(LS_SEEN, "1");
    setShow(false);
  };
  const reopen = () => setShow(true);
  return { show, done, reopen };
};

/* ─── 3D Image component ─────────────────────────────────────── */
const Img3D: React.FC<{ src: string; alt: string }> = ({ src, alt }) => (
  <img
    src={src}
    alt={alt}
    style={{
      width: 96,
      height: 96,
      objectFit: "contain",
      pointerEvents: "none",
      filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.45))",
    }}
    draggable={false}
  />
);

/* ─── Central HO Logo ─────────────────── */
const CentralSparkle = () => (
  <svg width="64" height="64" viewBox="0 0 72 56" fill="none" style={{ filter: 'drop-shadow(0px 6px 16px rgba(139, 92, 246, 0.45))' }}>
    <defs>
      <linearGradient id="hoGradH" x1="0" y1="0" x2="37" y2="56" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#06b6d4" />
        <stop offset="100%" stopColor="#3b82f6" />
      </linearGradient>
      <linearGradient id="hoGradO" x1="21" y1="0" x2="72" y2="56" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ec4899" />
        <stop offset="100%" stopColor="#8b5cf6" />
      </linearGradient>
    </defs>
    
    {/* Base O */}
    <path fillRule="evenodd" clipRule="evenodd" d="M46 5C33.2975 5 23 15.2975 23 28C23 40.7025 33.2975 51 46 51C58.7025 51 69 40.7025 69 28C69 15.2975 58.7025 5 46 5ZM32 28C32 20.268 38.268 14 46 14C53.732 14 60 20.268 60 28C60 35.732 53.732 42 46 42C38.268 42 32 35.732 32 28Z" fill="url(#hoGradO)"/>

    {/* Overlapping H with a structural gap effect */}
    <path d="M5 9C5 6.79086 6.79086 5 9 5C11.2091 5 13 6.79086 13 9V24H31V9C31 6.79086 32.7909 5 35 5C37.2091 5 39 6.79086 39 9V47C39 49.2091 37.2091 51 35 51C32.7909 51 31 49.2091 31 47V32H13V47C13 49.2091 11.2091 51 9 51C6.79086 51 5 49.2091 5 47V9Z" fill="url(#hoGradH)" stroke="#0a0a0c" strokeWidth="3" strokeLinejoin="round"/>
  </svg>
);

/* ─── Types ──────────────────────────────────────────────────── */

interface CardDef {
  icon: React.ReactNode;
  label: string;
  labelColor: string;
}

interface DecoDot {
  x: number;
  y: number;
  size: number;
  bg: string;
}

/* ─── Orbital positions for 4 cards ──────────────────────────── */
const ORBIT_POS = [
  { x: 16, y: 22 },
  { x: 82, y: 18 },
  { x: 10, y: 68 },
  { x: 80, y: 64 },
];

/* ─── Decorative floating dots ───────────────────────────────── */
const DECO: DecoDot[] = [
  { x: 50, y: 2, size: 16, bg: "#f472b6" },
  { x: 95, y: 38, size: 22, bg: "#34d399" },
  { x: 4, y: 40, size: 16, bg: "#60a5fa" },
  { x: 56, y: 86, size: 18, bg: "#fbbf24" },
  { x: 93, y: 72, size: 14, bg: "#a78bfa" },
  { x: 5, y: 18, size: 11, bg: "#fb923c" },
  { x: 40, y: 90, size: 10, bg: "#38bdf8" },
  { x: 86, y: 18, size: 12, bg: "#f87171" },
];

/* ─── Slide data ─────────────────────────────────────────────── */
const SLIDES: Array<{
  title: [string, string];
  subtitle: string;
  cards: CardDef[];
}> = [
  {
    title: ["Oku, anla,", "ilham al"],
    subtitle:
      "HızlıOkur ile okuma hızını 2\u20133 katına çıkar. Aynı sürede çok daha fazlasını oku.",
    cards: [
      {
        icon: <Img3D src="/images/books-3d.png" alt="Books" />,
        label: "Hız Kazan",
        labelColor: "#a5d8ff",
      },
      {
        icon: <Img3D src="/images/target-3d.png" alt="Target" />,
        label: "Tam Odak",
        labelColor: "#b2f2bb",
      },
      {
        icon: <Img3D src="/images/phone-3d.png" alt="Phone" />,
        label: "Her Yerde",
        labelColor: "#d0bfff",
      },
      {
        icon: <Img3D src="/images/stars-3d.png" alt="Stars" />,
        label: "AI Destekli",
        labelColor: "#ffec99",
      },
    ],
  },
  {
    title: ["Kelimeler", "sana gelir"],
    subtitle:
      "RSVP tekniği göz hareketini sıfırlar. Her kelime sabit odak noktasında belirir, sen sadece okursun.",
    cards: [
      {
        icon: <Img3D src="/images/eye-3d.png" alt="Eye" />,
        label: "Sabit Bakış",
        labelColor: "#a5d8ff",
      },
      {
        icon: <Img3D src="/images/lightning-3d.png" alt="Lightning" />,
        label: "500 WPM",
        labelColor: "#ffec99",
      },
      {
        icon: <Img3D src="/images/openbook-3d.png" alt="Open Book" />,
        label: "Daha Fazlası",
        labelColor: "#b2f2bb",
      },
      {
        icon: <Img3D src="/images/brain-3d.png" alt="Brain" />,
        label: "Derin Anlayış",
        labelColor: "#d0bfff",
      },
    ],
  },
  {
    title: ["İçeriğini", "sen seç"],
    subtitle:
      "PDF yükle, metin yapıştır ya da Gemini AI ile anında Türkçe pratik okuma metni oluştur.",
    cards: [
      {
        icon: <Img3D src="/images/pdf-3d.png" alt="PDF" />,
        label: "PDF Yükle",
        labelColor: "#ffc9c9",
      },
      {
        icon: <Img3D src="/images/clipboard-3d.png" alt="Clipboard" />,
        label: "Metin Yapıştır",
        labelColor: "#a5d8ff",
      },
      {
        icon: <Img3D src="/images/robot-3d.png" alt="Robot" />,
        label: "AI ile Oluştur",
        labelColor: "#d0bfff",
      },
      {
        icon: <Img3D src="/images/rocket-3d.png" alt="Rocket" />,
        label: "Hemen Başla",
        labelColor: "#ffec99",
      },
    ],
  },
];

/* ─── Orbit Item (card + label, positioned on orbital ring) ─── */
const OrbitItem: React.FC<{
  card: CardDef;
  pos: { x: number; y: number };
  visible: boolean;
  idx: number;
}> = ({ card, pos, visible, idx }) => (
  <div
    style={{
      position: "absolute",
      left: `${pos.x}%`,
      top: `${pos.y}%`,
      transform: "translate(-50%, -50%)",
      zIndex: 2,
      opacity: visible ? 1 : 0,
      transition: `opacity 450ms ease ${
        idx * 80
      }ms, transform 550ms cubic-bezier(0.34,1.56,0.64,1) ${idx * 80}ms`,
    }}
  >
    <div
      style={{
        animation: visible
          ? `obFloat 3.5s ease-in-out ${idx * 0.6}s infinite`
          : "none",
      }}
    >
      <div
        style={{
          width: 100,
          height: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {card.icon}
      </div>
      <div style={{ marginTop: 6, display: "flex", justifyContent: "center" }}>
        <span
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 12,
            fontWeight: 700,
            color: card.labelColor,
            letterSpacing: "0.02em",
            whiteSpace: "nowrap",
            textShadow: "0 2px 8px rgba(0,0,0,0.6)",
          }}
        >
          {card.label}
        </span>
      </div>
    </div>
  </div>
);

/* ─── Main component ─────────────────────────────────────────── */
export const Onboarding: React.FC<OnboardingProps> = ({ onDone }) => {
  const [slide, setSlide] = useState(0);
  const [cardsVisible, setCardsVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    setCardsVisible(false);
    const t = setTimeout(() => setCardsVisible(true), 80);
    return () => clearTimeout(t);
  }, [slide]);

  const isLast = slide === SLIDES.length - 1;
  const current = SLIDES[slide];

  const next = () => {
    if (isLast) {
      setLeaving(true);
      setTimeout(onDone, 280);
      return;
    }
    setSlide((s) => s + 1);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9998,
        background: "#0a0a0c",
        display: "flex",
        flexDirection: "column",
        opacity: leaving ? 0 : 1,
        transition: "opacity 280ms ease",
        overflow: "hidden",
      }}
    >
      {/* ── Orbit scene ─────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          position: "relative",
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        {/* Orbit ring 1 (inner) */}
        <div
          style={{
            position: "absolute",
            top: "46%",
            left: "50%",
            width: 190,
            height: 190,
            transform: "translate(-50%, -50%)",
            borderRadius: "50%",
            border: "1.5px solid rgba(255,255,255,0.10)",
          }}
        />

        {/* Orbit ring 2 (outer) */}
        <div
          style={{
            position: "absolute",
            top: "46%",
            left: "50%",
            width: 340,
            height: 340,
            transform: "translate(-50%, -50%)",
            borderRadius: "50%",
            border: "1.5px solid rgba(255,255,255,0.10)",
          }}
        />

        {/* Warm radial glow behind sparkle */}
        <div style={{
          position: 'absolute', top: '46%', left: '50%',
          width: 160, height: 160,
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(6,182,212,0.06) 50%, transparent 70%)',
          borderRadius: '50%',
        }} />

        {/* Central sparkle */}
        <div
          style={{
            position: "absolute",
            top: "46%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 3,
            animation: "obPulse 3s ease-in-out infinite",
          }}
        >
          <CentralSparkle />
        </div>

        {/* Floating cards on orbital positions */}
        {current.cards.map((card, i) => (
          <OrbitItem
            key={`${slide}-${i}`}
            card={card}
            pos={ORBIT_POS[i]}
            visible={cardsVisible}
            idx={i}
          />
        ))}

        {/* Decorative colored dots */}
        {DECO.map((dot, i) => (
          <div
            key={`deco-${i}`}
            style={{
              position: "absolute",
              left: `${dot.x}%`,
              top: `${dot.y}%`,
              width: dot.size,
              height: dot.size,
              borderRadius: "50%",
              background: dot.bg,
              opacity: cardsVisible ? 0.55 : 0,
              transition: `opacity 600ms ease ${350 + i * 90}ms`,
              animation: cardsVisible
                ? `obFloat 4.5s ease-in-out ${i * 0.8}s infinite`
                : "none",
              boxShadow: `0 4px 14px rgba(0,0,0,0.25)`,
            }}
          />
        ))}
      </div>

      {/* ── Bottom content ──────────────────────────────────── */}
      <div
        style={{
          flexShrink: 0,
          padding: "0 28px 36px",
          background: "linear-gradient(to top, #0a0a0c 55%, transparent)",
        }}
      >
        {/* Title */}
        <div
          key={`title-${slide}`}
          style={{
            textAlign: "center",
            marginBottom: 10,
            animation: "obFadeUp 400ms cubic-bezier(0.22,1,0.36,1) both",
          }}
        >
          <span
            style={{
              display: "block",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "clamp(32px, 9vw, 44px)",
              fontWeight: 800,
              lineHeight: 1.1,
              color: "#ffffff",
              letterSpacing: "-0.6px",
            }}
          >
            {current.title[0]}
          </span>
          <span
            style={{
              display: "block",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "clamp(32px, 9vw, 44px)",
              fontWeight: 800,
              lineHeight: 1.1,
              color: "#ffffff",
              letterSpacing: "-0.6px",
            }}
          >
            {current.title[1]}
          </span>
        </div>

        {/* Subtitle */}
        <p
          key={`sub-${slide}`}
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 14,
            fontWeight: 500,
            color: "rgba(255,255,255,0.45)",
            lineHeight: 1.7,
            marginBottom: 28,
            textAlign: "center",
            animation: "obFadeUp 420ms 90ms cubic-bezier(0.22,1,0.36,1) both",
          }}
        >
          {current.subtitle}
        </p>

        {/* Dots + circular button */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                style={{
                  width: i === slide ? 28 : 7,
                  height: 7,
                  borderRadius: 99,
                  background:
                    i === slide ? "#ffffff" : "rgba(255,255,255,0.18)",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transition: "all 300ms ease",
                }}
              />
            ))}
          </div>

          <button
            onClick={next}
            onMouseDown={(e) =>
              (e.currentTarget.style.transform = "scale(0.9)")
            }
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onTouchStart={(e) =>
              (e.currentTarget.style.transform = "scale(0.9)")
            }
            onTouchEnd={(e) => (e.currentTarget.style.transform = "scale(1)")}
            style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: isLast
                ? "linear-gradient(135deg,#fbbf24,#f59e0b)"
                : "#ffffff",
              color: "#000",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: isLast
                ? "0 0 28px rgba(251,191,36,0.45)"
                : "0 4px 20px rgba(255,255,255,0.15)",
              transition: "transform 150ms ease, box-shadow 200ms ease",
            }}
          >
            {isLast ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            ) : (
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            )}
          </button>
        </div>

        {/* Creator credit */}
        <div
          style={{ marginTop: 18, display: "flex", justifyContent: "center" }}
        >
          <a
            href="https://www.yunusemresalcan.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              opacity: 0.28,
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <span
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.7)",
                fontWeight: 500,
              }}
            >
              Built by
            </span>
            <span style={{ fontSize: 11, color: "#ffffff", fontWeight: 700 }}>
              Yunus Emre Salcan
            </span>
            <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
              <path
                d="M1.5 8.5L8.5 1.5M8.5 1.5H3.5M8.5 1.5V6.5"
                stroke="white"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>

      <style>{`
        @keyframes obFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes obFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes obPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          50% { transform: translate(-50%, -50%) scale(1.08); opacity: 0.85; }
        }
      `}</style>
    </div>
  );
};
