"use client"

import { useEffect, useState } from "react"

interface GrassBlade {
  id: number
  x: number
  height: number
  sway: number
  delay: number
  color: string
}

export function AnimatedGrass() {
  const [grassBlades, setGrassBlades] = useState<GrassBlade[]>([])
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    // Generate grass blades
    const blades = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: (i * window.innerWidth) / 100,
      height: Math.random() * 30 + 20,
      sway: Math.random() * 2 - 1,
      delay: Math.random() * 2,
      color: `hsl(${120 + Math.random() * 40}, ${60 + Math.random() * 20}%, ${30 + Math.random() * 20}%)`,
    }))
    setGrassBlades(blades)

    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleGrassClick = (bladeId: number) => {
    setGrassBlades((prev) =>
      prev.map((blade) =>
        blade.id === bladeId ? { ...blade, sway: blade.sway * 2, height: blade.height * 1.1 } : blade,
      ),
    )
    console.log("[v0] Grass blade clicked:", bladeId)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 pointer-events-none z-5">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1920 80"
        className="absolute bottom-0"
        style={{ transform: `translateY(${scrollY * 0.1}px)` }}
      >
        {grassBlades.map((blade) => (
          <g key={blade.id}>
            <path
              d={`M ${blade.x} 80 Q ${blade.x + blade.sway * (1 + scrollY * 0.01)} ${80 - blade.height * 0.7} ${blade.x + blade.sway * 2 * (1 + scrollY * 0.01)} ${80 - blade.height}`}
              stroke={blade.color}
              strokeWidth="2"
              fill="none"
              className="cursor-pointer pointer-events-auto transition-all duration-300 hover:stroke-emerald-300"
              onClick={() => handleGrassClick(blade.id)}
              style={{
                animation: `grassSway ${3 + blade.delay}s ease-in-out infinite`,
                transformOrigin: `${blade.x}px 80px`,
              }}
            />
            {/* Grass tip */}
            <circle
              cx={blade.x + blade.sway * 2 * (1 + scrollY * 0.01)}
              cy={80 - blade.height}
              r="1"
              fill={blade.color}
              className="opacity-60"
            />
          </g>
        ))}
      </svg>

      <style jsx>{`
        @keyframes grassSway {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(2deg); }
          75% { transform: rotate(-2deg); }
        }
      `}</style>
    </div>
  )
}
