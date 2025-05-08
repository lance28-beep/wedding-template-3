"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { motion, AnimatePresence } from "framer-motion"

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [expanded, setExpanded] = useState(false)
  const [songTitle, setSongTitle] = useState("Wedding Song")
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio("/music/wedding-song.mp3")
    audioRef.current.loop = true
    audioRef.current.volume = volume

    // Auto-play on component mount (with user interaction requirement handled)
    const handleUserInteraction = () => {
      if (audioRef.current) {
        audioRef.current.play().catch(() => {
          // Autoplay was prevented, we'll need user interaction
          setIsPlaying(false)
        })
        setIsPlaying(true)
        // Remove event listeners after first interaction
        document.removeEventListener("click", handleUserInteraction)
        document.removeEventListener("touchstart", handleUserInteraction)
      }
    }

    document.addEventListener("click", handleUserInteraction, { once: true })
    document.addEventListener("touchstart", handleUserInteraction, { once: true })

    return () => {
      // Cleanup
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      document.removeEventListener("click", handleUserInteraction)
      document.removeEventListener("touchstart", handleUserInteraction)
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch(() => {
          // Playback was prevented
          console.log("Playback prevented. User interaction needed.")
        })
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
    if (newVolume === 0) {
      setIsMuted(true)
    } else if (isMuted) {
      setIsMuted(false)
    }
  }

  return (
    <motion.div
      className="bg-white/90 backdrop-blur-sm rounded-full shadow-lg p-3 transition-all duration-300 hover:bg-white"
      whileHover={{ scale: 1.05 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
    >
      <div className="flex items-center gap-2">
        <Button
          onClick={togglePlay}
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full bg-rose-100 text-rose-600 hover:bg-rose-200 hover:text-rose-700"
          aria-label={isPlaying ? "Pause music" : "Play music"}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </Button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Button
                onClick={toggleMute}
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full text-gray-600 hover:bg-gray-100"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </Button>

              <div className="w-24">
                <Slider
                  defaultValue={[0.5]}
                  max={1}
                  step={0.01}
                  value={[volume]}
                  onValueChange={handleVolumeChange}
                  className="cursor-pointer"
                  aria-label="Volume control"
                />
              </div>

              <div className="text-xs text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis max-w-[100px]">
                {songTitle}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-gray-600 hover:bg-gray-100 px-2"
          aria-label={expanded ? "Hide music controls" : "Show music controls"}
        >
          {expanded ? "Close" : "Music"}
        </Button>
      </div>
    </motion.div>
  )
}
