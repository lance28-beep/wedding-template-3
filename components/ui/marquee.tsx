"use client"

import type * as React from "react"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

type MarqueeProps = {
  children: React.ReactNode
  className?: string
  reverse?: boolean
  pauseOnHover?: boolean
  vertical?: boolean
  speed?: number
}

export function Marquee({
  children,
  className,
  reverse = false,
  pauseOnHover = false,
  vertical = false,
  speed = 40,
}: MarqueeProps) {
  const [duration, setDuration] = useState(speed)
  const containerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  // Adjust animation duration based on content size
  useEffect(() => {
    const calculateDuration = () => {
      if (!containerRef.current || !innerRef.current) return

      const containerSize = vertical ? containerRef.current.offsetHeight : containerRef.current.offsetWidth

      const contentSize = vertical ? innerRef.current.scrollHeight : innerRef.current.scrollWidth

      // Adjust duration based on content size (larger content = slower scroll)
      const calculatedDuration = (contentSize / containerSize) * speed
      setDuration(calculatedDuration)
    }

    calculateDuration()
    window.addEventListener("resize", calculateDuration)

    return () => {
      window.removeEventListener("resize", calculateDuration)
    }
  }, [children, speed, vertical])

  return (
    <div
      ref={containerRef}
      className={cn("group overflow-hidden", vertical ? "h-full" : "w-full", className)}
      style={
        {
          "--duration": `${duration}s`,
          "--gap": "1rem",
        } as React.CSSProperties
      }
    >
      <div
        ref={innerRef}
        className={cn(
          "flex min-w-full shrink-0 gap-[--gap] py-4",
          vertical && "flex-col",
          reverse ? "animate-marquee-reverse" : "animate-marquee",
          pauseOnHover && "group-hover:[animation-play-state:paused]",
        )}
      >
        {children}
        {children}
      </div>
    </div>
  )
}
