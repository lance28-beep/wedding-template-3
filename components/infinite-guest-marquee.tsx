"use client"

import { useRef } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Users, Calendar } from "lucide-react"
import { Marquee } from "@/components/ui/marquee"

type RSVPEntry = {
  id: string
  name: string
  email: string
  guestCount: number
  message?: string
  date: string
  source: "api" | "local"
}

type InfiniteGuestMarqueeProps = {
  guests: RSVPEntry[]
  speed?: number
  pauseOnHover?: boolean
  className?: string
}

export default function InfiniteGuestMarquee({
  guests,
  speed = 40,
  pauseOnHover = true,
  className,
}: InfiniteGuestMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null)

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

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    } catch (e) {
      return dateString
    }
  }

  // If no guests, show placeholder
  if (guests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-500">No guests have RSVP'd yet</p>
      </div>
    )
  }

  // Create guest cards
  const guestCards = guests.map((guest) => (
    <div
      key={guest.id}
      className="relative w-full cursor-pointer overflow-hidden rounded-xl border p-4 mb-4
      border-rose-100 bg-white hover:bg-rose-50 shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex flex-row items-center gap-3">
        <Avatar className={`h-10 w-10 ${getAvatarColor(guest.name)}`}>
          <AvatarFallback>{getInitials(guest.name)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <div className="text-sm font-medium">{guest.name}</div>
          <div className="flex items-center">
            <Badge variant="outline" className="text-xs mr-2 bg-white">
              <Users className="h-3 w-3 mr-1" />
              {guest.guestCount}
            </Badge>
            <p className="text-xs text-gray-500 truncate max-w-[120px]">{guest.email}</p>
          </div>
        </div>
      </div>
      {guest.message && (
        <blockquote className="mt-3 text-sm italic text-gray-600 border-l-2 border-rose-200 pl-3">
          "{guest.message}"
        </blockquote>
      )}
      <div className="flex items-center text-xs text-gray-400 mt-2">
        <Calendar className="h-3 w-3 mr-1" />
        <span>{formatDate(guest.date)}</span>
      </div>
    </div>
  ))

  return (
    <div ref={containerRef} className={`relative h-[500px] overflow-hidden ${className}`}>
      <Marquee vertical pauseOnHover={pauseOnHover} speed={speed} className="px-4">
        {guestCards}
      </Marquee>

      {/* Gradient overlays for smooth fade effect */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white to-transparent z-10"></div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent z-10"></div>
    </div>
  )
}
