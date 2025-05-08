"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, ZoomIn, ChevronLeft, ChevronRight, Download } from "lucide-react"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useGalleryImages } from "@/context/wedding-context"

export default function PhotoGallery() {
  const photos = useGalleryImages()
  const [selectedPhoto, setSelectedPhoto] = useState<(typeof photos)[0] | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const galleryRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(galleryRef, { once: true, amount: 0.2 })

  const openPhotoModal = (photo: (typeof photos)[0], index: number) => {
    setSelectedPhoto(photo)
    setCurrentIndex(index)
    setIsZoomed(false)
  }

  const closePhotoModal = () => {
    setSelectedPhoto(null)
    setIsZoomed(false)
  }

  const navigatePhoto = (direction: "next" | "prev") => {
    setIsZoomed(false)
    if (direction === "next") {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length)
      setSelectedPhoto(photos[(currentIndex + 1) % photos.length])
    } else {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length)
      setSelectedPhoto(photos[(currentIndex - 1 + photos.length) % photos.length])
    }
  }

  const toggleZoom = () => {
    setIsZoomed(!isZoomed)
  }

  // Touch handlers for swipe navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 100) {
      // Swipe left, go to next
      navigatePhoto("next")
    }

    if (touchStart - touchEnd < -100) {
      // Swipe right, go to previous
      navigatePhoto("prev")
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedPhoto) return

      if (e.key === "ArrowRight") {
        navigatePhoto("next")
      } else if (e.key === "ArrowLeft") {
        navigatePhoto("prev")
      } else if (e.key === "Escape") {
        closePhotoModal()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [selectedPhoto, currentIndex])

  // Animation variants for gallery items
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <>
      <motion.div
        ref={galleryRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {photos.map((photo, index) => (
          <motion.div
            key={photo.id}
            className={`relative overflow-hidden rounded-lg shadow-md cursor-pointer group ${
              photo.span === "row"
                ? "row-span-2"
                : photo.span === "col"
                  ? "sm:col-span-2"
                  : photo.span === "both"
                    ? "row-span-2 sm:col-span-2"
                    : ""
            }`}
            style={{
              height: photo.span === "row" ? "500px" : "250px",
            }}
            variants={itemVariants}
            onClick={() => openPhotoModal(photo, index)}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src={photo.src || "/placeholder.svg"}
              alt={photo.alt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ZoomIn className="text-white h-10 w-10" />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <Dialog open={!!selectedPhoto} onOpenChange={(open) => !open && closePhotoModal()}>
        <DialogContent className="max-w-5xl w-[95vw] h-[90vh] p-0 bg-black/90">
          <div
            className="relative w-full h-full flex items-center justify-center"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {selectedPhoto && (
              <div
                className={`relative w-full h-full flex items-center justify-center ${
                  isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
                }`}
                onClick={toggleZoom}
              >
                <Image
                  src={selectedPhoto.src || "/placeholder.svg"}
                  alt={selectedPhoto.alt}
                  fill
                  className={`object-contain transition-transform duration-300 ${isZoomed ? "scale-150" : "scale-100"}`}
                  sizes="90vw"
                />
              </div>
            )}

            <div className="absolute top-4 right-4 z-10 flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-black/50 text-white hover:bg-black/70"
                onClick={() => {
                  if (selectedPhoto) {
                    const link = document.createElement("a")
                    link.href = selectedPhoto.src
                    link.download = `wedding-photo-${selectedPhoto.id}.jpg`
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                  }
                }}
                aria-label="Download image"
              >
                <Download className="h-5 w-5" />
              </Button>
              <DialogClose asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-black/50 text-white hover:bg-black/70"
                  aria-label="Close dialog"
                >
                  <X className="h-6 w-6" />
                </Button>
              </DialogClose>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 text-white hover:bg-black/70"
              onClick={() => navigatePhoto("prev")}
              aria-label="Previous photo"
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 text-white hover:bg-black/70"
              onClick={() => navigatePhoto("next")}
              aria-label="Next photo"
            >
              <ChevronRight className="h-8 w-8" />
            </Button>

            <div className="absolute bottom-4 left-0 right-0 text-center text-white bg-black/50 py-2">
              <p className="text-sm">{selectedPhoto?.alt}</p>
              <p className="text-xs text-gray-300">
                {currentIndex + 1} of {photos.length}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
