import * as React from "react";
import { ChevronLeft, ChevronRight, Footprints } from "lucide-react";
import { InteractiveProductCard } from "@/components/ui/card-7";

interface Sneaker {
  id: string;
  title: string;
  description: string;
  price: string;
  imageUrl: string;
}

const SNEAKERS: Sneaker[] = [
  {
    id: "aero-runner",
    title: "Aero Runner",
    description: "Elevate Your Every Step",
    price: "$149",
    imageUrl:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "nebula-pro",
    title: "Nebula Pro",
    description: "Diseño urbano, ritmo pro",
    price: "$169",
    imageUrl:
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "crimson-dash",
    title: "Crimson Dash",
    description: "Velocidad sobre el asfalto",
    price: "$139",
    imageUrl:
      "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "asphalt-max",
    title: "Asphalt Max",
    description: "Amortiguación sin límites",
    price: "$159",
    imageUrl:
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=800&q=80",
  },
];

const AUTOPLAY_MS = 3800;
const DASH_MS = 900;
const SPEED_LINES = 7;

/** Shortest signed distance between slide `i` and the active slide on a circular track. */
function circularOffset(i: number, active: number, total: number) {
  let d = (i - active + total) % total;
  if (d > total / 2) d -= total;
  return d;
}

/**
 * 3D coverflow carousel of sneakers. The active shoe floats while "speed lines"
 * streak past it, and every slide change triggers a short dash burst.
 */
export function ShoeCarousel() {
  const total = SNEAKERS.length;
  const [active, setActive] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const [dashing, setDashing] = React.useState(false);
  const dashTimer = React.useRef<number | undefined>(undefined);

  const goTo = React.useCallback(
    (next: number) => {
      setActive(((next % total) + total) % total);
      setDashing(true);
      window.clearTimeout(dashTimer.current);
      dashTimer.current = window.setTimeout(() => setDashing(false), DASH_MS);
    },
    [total]
  );

  // Autoplay (respects prefers-reduced-motion and pauses on hover/focus)
  React.useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (paused || reduce) return;
    const id = window.setInterval(() => goTo(active + 1), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [active, paused, goTo]);

  React.useEffect(() => () => window.clearTimeout(dashTimer.current), []);

  return (
    <div
      className="shoe-stage"
      data-dashing={dashing}
      role="region"
      aria-roledescription="carrusel"
      aria-label="Tenis destacados"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* Speed lines streaking behind the shoes */}
      <div className="shoe-speed-lines" aria-hidden="true">
        {Array.from({ length: SPEED_LINES }).map((_, i) => (
          <span
            key={i}
            className="shoe-speed-line"
            style={{
              top: `${12 + i * 12}%`,
              width: `${90 + ((i * 53) % 120)}px`,
              animationDelay: `${-(i * 0.37)}s`,
              animationDuration: `${1.6 + (i % 3) * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* Slides */}
      {SNEAKERS.map((shoe, i) => {
        const o = circularOffset(i, active, total);
        const isActive = o === 0;
        const visible = Math.abs(o) <= 1;
        return (
          <div
            key={shoe.id}
            className="shoe-slide"
            data-active={isActive}
            aria-hidden={!isActive}
            style={{
              transform: `translateX(calc(-50% + var(--spread) * ${o})) translateZ(${
                -Math.abs(o) * 140
              }px) rotateY(${o * -34}deg) scale(${isActive ? 1 : 0.84})`,
              opacity: isActive ? 1 : visible ? 0.55 : 0,
              filter: isActive ? "none" : "brightness(0.55) saturate(0.8)",
              zIndex: 10 - Math.abs(o),
              pointerEvents: visible ? "auto" : "none",
            }}
            onClick={isActive ? undefined : () => goTo(i)}
            role={isActive ? undefined : "button"}
            tabIndex={isActive ? undefined : visible ? 0 : -1}
            aria-label={isActive ? undefined : `Ver ${shoe.title}`}
            onKeyDown={
              isActive
                ? undefined
                : (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      goTo(i);
                    }
                  }
            }
          >
            <div className={isActive ? "shoe-bob" : undefined}>
              <InteractiveProductCard
                className="max-w-none"
                title={shoe.title}
                description={shoe.description}
                price={shoe.price}
                imageUrl={shoe.imageUrl}
                logoUrl=""
                logo={<Footprints className="h-5 w-5 shrink-0 text-white" aria-hidden="true" />}
                slideIndex={i}
                slideCount={total}
              />
            </div>
          </div>
        );
      })}

      {/* Ground shadow that breathes with the floating shoe */}
      <div className="shoe-ground" aria-hidden="true" />

      {/* Controls */}
      <button
        type="button"
        className="shoe-nav shoe-nav-prev"
        aria-label="Tenis anterior"
        onClick={() => goTo(active - 1)}
      >
        <ChevronLeft size={22} />
      </button>
      <button
        type="button"
        className="shoe-nav shoe-nav-next"
        aria-label="Siguiente tenis"
        onClick={() => goTo(active + 1)}
      >
        <ChevronRight size={22} />
      </button>
    </div>
  );
}
