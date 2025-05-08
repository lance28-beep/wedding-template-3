"use client"

import type React from "react"

import { useRef, useState } from "react"
import Image from "next/image"
import { motion, useInView } from "framer-motion"
import { Heart, Calendar, MapPin, Coffee, Home, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getLoveStoryEvents } from "@/lib/config-utils"

export default function CoupleStory() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })
  const [expandedEvent, setExpandedEvent] = useState<number | null>(null)
  const events = getLoveStoryEvents()

  const toggleExpand = (index: number) => {
    if (expandedEvent === index) {
      setExpandedEvent(null)
    } else {
      setExpandedEvent(index)
    }
  }

  // Map event titles to icons
  const getEventIcon = (title: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      "First Meeting": <Heart className="h-6 w-6" />,
      "First Date": <Coffee className="h-6 w-6" />,
      "Moving In Together": <Home className="h-6 w-6" />,
      "The Proposal": <Gift className="h-6 w-6" />,
      "Wedding Day": <Calendar className="h-6 w-6" />,
    }

    return iconMap[title] || <Heart className="h-6 w-6" />
  }

  return (
    <div ref={ref} className="max-w-5xl mx-auto">
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-rose-200 via-pink-200 to-rose-200 transform -translate-x-1/2 rounded-full"></div>

        {/* Timeline events */}
        <div className="space-y-24 md:space-y-32 py-8">
          {events.map((event, index) => (
            <motion.div
              key={index}
              className={`relative flex flex-col md:flex-row ${
                index % 2 === 0 ? "md:flex-row-reverse" : ""
              } items-center`}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ scale: 1.01 }}
            >
              {/* Timeline dot and icon */}
              <div className="absolute left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full ${event.color} flex items-center justify-center shadow-md`}>
                  {getEventIcon(event.title)}
                </div>
                <div className="mt-2 px-3 py-1 rounded-full text-xs font-medium bg-white shadow-sm border border-gray-100">
                  {event.date}
                </div>
              </div>

              {/* Content */}
              <div className="w-full md:w-1/2 px-4 md:px-12 mt-16 md:mt-0">
                <motion.div
                  className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
                  whileHover={{ y: -5 }}
                >
                  <h3 className="text-2xl font-great-vibes mb-2 text-rose-600">{event.title}</h3>

                  {event.location && (
                    <div className="flex items-center text-gray-500 mb-3 text-sm">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{event.location}</span>
                    </div>
                  )}

                  <p className="text-gray-700 mb-4">
                    {expandedEvent === index
                      ? event.description
                      : `${event.description.substring(0, 100)}${event.description.length > 100 ? "..." : ""}`}
                  </p>

                  {event.description.length > 100 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpand(index)}
                      className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 p-0 h-auto"
                    >
                      {expandedEvent === index ? "Read less" : "Read more"}
                    </Button>
                  )}
                </motion.div>
              </div>

              {/* Image */}
              <div className="hidden md:block w-1/2 px-12">
                <motion.div
                  className="relative h-64 w-full overflow-hidden rounded-lg shadow-md group"
                  whileHover={{ scale: 1.03 }}
                >
                  <Image
                    src={event.image || "/placeholder.svg"}
                    alt={event.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </motion.div>
              </div>

              {/* Mobile Image - only shown on mobile */}
              <div className="block md:hidden w-full px-4 mt-4">
                <div className="relative h-48 w-full overflow-hidden rounded-lg shadow-md">
                  <Image
                    src={event.image || "/placeholder.svg"}
                    alt={event.title}
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Decorative elements */}
        <motion.div
          className="absolute -bottom-16 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, scale: 0 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
          transition={{ delay: events.length * 0.2 + 0.5, duration: 0.5 }}
        >
          <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center">
            <Heart className="h-8 w-8 text-rose-600 fill-rose-600" />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
