"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"

type MarqueeProps = {
  guests: Array<{
    name: string
    guestCount: number
  }>
  speed?: number
  direction?: "up" | "down"
  pauseOnHover?: boolean
}

export default function GuestMarquee({ guests, speed = 25, direction = "up", pauseOnHover = true }: MarqueeProps) {
  const [duplicatedGuests, setDuplicatedGuests] = useState<typeof guests>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerHeight, setContainerHeight] = useState(0)
  const [contentHeight, setContentHeight] = useState(0)
  const contentRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  // Get random pastel color for avatar
  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-rose-100 text-rose-600",
      "bg-pink-100 text-pink-600",
      "bg-purple-100 text-purple-600",
      "bg-blue-100 text-blue-600",
      "bg-teal-100 text-teal-600",
      "bg-green-100 text-green-600",
      "bg-amber-100 text-amber-600",
    ]
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }

  // Duplicate guests to create seamless loop
  useEffect(() => {
    if (guests.length === 0) return

    // Duplicate the guest list to ensure continuous scrolling
    const duplicated = [...guests, ...guests, ...guests]
    setDuplicatedGuests(duplicated)
  }, [guests])

  // Measure container and content heights
  useEffect(() => {
    if (!containerRef.current || !contentRef.current) return

    const measureHeights = () => {
      const containerHeight = containerRef.current?.clientHeight || 0
      const contentHeight = contentRef.current?.clientHeight || 0
      setContainerHeight(containerHeight)
      setContentHeight(contentHeight)
    }

    measureHeights()
    window.addEventListener("resize", measureHeights)

    return () => {
      window.removeEventListener("resize", measureHeights)
    }
  }, [duplicatedGuests])

  // Calculate animation duration based on content height and speed
  const duration = contentHeight / speed

  // If no guests, show placeholder
  if (guests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-500">No guests have RSVP'd yet</p>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden h-64 rounded-lg border border-gray-200 bg-white"
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Gradient overlays for smooth fade effect */}
      <div className="absolute top-0 left-0 right-0 h-12 z-10 bg-gradient-to-b from-white to-transparent pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 right-0 h-12 z-10 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>

      <motion.div
        ref={contentRef}
        className="pt-12 pb-12"
        animate={{
          y: direction === "up" ? [0, containerHeight - contentHeight] : [containerHeight - contentHeight, 0],
        }}
        transition={{
          duration: isPaused ? 0 : duration,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
          ease: "linear",
        }}
      >
        {duplicatedGuests.map((guest, index) => (
          <div
            key={`${guest.name}-${index}`}
            className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
          >
            <Avatar className={`h-10 w-10 ${getAvatarColor(guest.name)}`}>
              <AvatarFallback>{getInitials(guest.name)}</AvatarFallback>
            </Avatar>
            <span className="font-medium flex-1">{guest.name}</span>
            <Badge variant="outline" className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{guest.guestCount}</span>
            </Badge>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
