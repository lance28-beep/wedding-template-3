"use client"

import type React from "react"
import { useRef, useState } from "react"
import Image from "next/image"
import { motion, useInView, useScroll, useTransform } from "framer-motion"
import { Heart, Calendar, MapPin, Coffee, Home, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getLoveStoryEvents } from "@/lib/config-utils"

export default function CoupleStory() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })
  const [expandedEvent, setExpandedEvent] = useState<number | null>(null)
  const [imageLoading, setImageLoading] = useState<Record<number, boolean>>({})
  const [imageError, setImageError] = useState<Record<number, boolean>>({})
  const events = getLoveStoryEvents()

  // Scroll-based animations
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const timelineOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1])
  const timelineScale = useTransform(scrollYProgress, [0, 0.2], [0.8, 1])

  const toggleExpand = (index: number) => {
    if (expandedEvent === index) {
      setExpandedEvent(null)
    } else {
      setExpandedEvent(index)
    }
  }

  const handleImageLoad = (index: number) => {
    setImageLoading(prev => ({ ...prev, [index]: false }))
  }

  const handleImageError = (index: number) => {
    setImageLoading(prev => ({ ...prev, [index]: false }))
    setImageError(prev => ({ ...prev, [index]: true }))
  }

  // Map event titles to icons with enhanced styling
  const getEventIcon = (title: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      "First Meeting": <Heart className="h-6 w-6 text-rose-600" />,
      "First Date": <Coffee className="h-6 w-6 text-rose-600" />,
      "Moving In Together": <Home className="h-6 w-6 text-rose-600" />,
      "The Proposal": <Gift className="h-6 w-6 text-rose-600" />,
      "Wedding Day": <Calendar className="h-6 w-6 text-rose-600" />,
    }
    return iconMap[title] || <Heart className="h-6 w-6 text-rose-600" />
  }

  return (
    <div className="relative w-full">
      {/* Background Flower Decoration - True Left, Responsive Height */}
      {/* Background Flower Decoration - Left Bottom, Responsive */}
      <div
        className="absolute left-0 bottom-0 z-0 flex items-end pointer-events-none select-none h-1/2 min-h-[180px]"
        aria-hidden="true"
      >
        <Image
          src="/img/flower_zerobackground.png"
          alt="" // Decorative image; empty alt for accessibility
          width={1200}
          height={800}
          className="h-full w-auto opacity-90 drop-shadow-xl -scale-x-100"
          style={{ objectFit: 'contain' }}
          loading="lazy"
        />
      </div>

      <div ref={ref} className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 z-10">
        <motion.div
          className="relative z-10"
          style={{ opacity: timelineOpacity, scale: timelineScale }}
        >
          {/* Enhanced Timeline line with gradient and glow */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-rose-200 via-pink-200 to-rose-200 transform -translate-x-1/2 rounded-full shadow-[0_0_15px_rgba(251,113,133,0.3)]"></div>

          {/* Decorative floating elements */}
          <motion.div
            className="absolute -left-8 top-1/4 w-16 h-16 opacity-20"
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Heart className="w-full h-full text-rose-400" />
          </motion.div>

          {/* Timeline events */}
          <div className="space-y-24 md:space-y-32 py-8">
            {events.map((event, index) => (
              <motion.div
                key={index}
                className={`relative flex flex-col md:flex-row ${index % 2 === 0 ? "md:flex-row-reverse" : ""
                  } items-center`}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.2,
                  ease: [0.4, 0, 0.2, 1]
                }}
                whileHover={{ scale: 1.02 }}
              >
                {/* Enhanced Timeline dot and icon */}
                <div className="absolute left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center">
                  <motion.div
                    className={`w-14 h-14 rounded-full ${event.color} flex items-center justify-center shadow-lg`}
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {getEventIcon(event.title)}
                  </motion.div>
                  <motion.div
                    className="mt-3 px-4 py-1.5 rounded-full text-rose-600 text-sm font-medium bg-rose-50 shadow-md border border-gray-100"
                    whileHover={{ y: -2 }}
                  >
                    {event.date}
                  </motion.div>
                </div>

                {/* Enhanced Content */}
                <div className="w-full md:w-1/2 px-4 md:px-12 mt-20 md:mt-0">
                  <motion.div
                    className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                    whileHover={{ y: -5 }}
                  >
                    <h3 className="text-2xl font-great-vibes mb-3 text-rose-600 bg-rose-50 px-4 py-2 rounded-lg inline-block shadow-sm">
                      {event.title}
                    </h3>

                    {event.location && (
                      <div className="flex items-center text-gray-500 mb-4 text-sm">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{event.location}</span>
                      </div>
                    )}

                    <p className="text-gray-700 mb-4 leading-relaxed">
                      {expandedEvent === index
                        ? event.description
                        : `${event.description.substring(0, 100)}${event.description.length > 100 ? "..." : ""}`}
                    </p>

                    {event.description.length > 100 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpand(index)}
                        className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 p-0 h-auto transition-colors duration-200"
                      >
                        {expandedEvent === index ? "Read less" : "Read more"}
                      </Button>
                    )}
                  </motion.div>
                </div>

                {/* Enhanced Image with loading state */}
                <div className="hidden md:block w-1/2 px-12">
                  <motion.div
                    className="relative h-72 w-full overflow-hidden rounded-xl shadow-lg group"
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {/* Loading state */}
                    {imageLoading[index] && (
                      <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin"></div>
                      </div>
                    )}

                    {/* Error state */}
                    {imageError[index] ? (
                      <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                        <div className="text-gray-400 text-sm">Image not available</div>
                      </div>
                    ) : (
                      <Image
                        src={event.image || "/placeholder.svg"}
                        alt={event.title}
                        fill
                        className={`object-cover transition-transform duration-700 group-hover:scale-110 ${imageLoading[index] ? 'opacity-0' : 'opacity-100'
                          }`}
                        sizes="(max-width: 768px) 100vw, 50vw"
                        {...(index === 0 ? { priority: true } : { loading: "lazy" })}
                        onLoad={() => handleImageLoad(index)}
                        onError={() => handleImageError(index)}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </motion.div>
                </div>

                {/* Enhanced Mobile Image */}
                <div className="block md:hidden w-full px-4 mt-6">
                  <motion.div
                    className="relative h-56 w-full overflow-hidden rounded-xl shadow-lg"
                    whileHover={{ scale: 1.02 }}
                  >
                    {/* Loading state */}
                    {imageLoading[index] && (
                      <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin"></div>
                      </div>
                    )}

                    {/* Error state */}
                    {imageError[index] ? (
                      <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                        <div className="text-gray-400 text-sm">Image not available</div>
                      </div>
                    ) : (
                      <Image
                        src={event.image || "/placeholder.svg"}
                        alt={event.title}
                        fill
                        className={`object-cover ${imageLoading[index] ? 'opacity-0' : 'opacity-100'
                          }`}
                        sizes="100vw"
                        {...(index === 0 ? { priority: true } : { loading: "lazy" })}
                        onLoad={() => handleImageLoad(index)}
                        onError={() => handleImageError(index)}
                      />
                    )}
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
