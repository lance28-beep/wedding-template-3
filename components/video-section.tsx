"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  SkipBack,
  SkipForward,
  Share2,
  Download,
  Heart,
  MessageSquare,
  ChevronRight,
  ChevronLeft,
  Info,
  Calendar,
  MapPin,
  Clock,
  Film,
  Copy,
} from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatDate } from "@/lib/date-utils"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

// Define video types
type VideoMetadata = {
  id: string
  title: string
  description: string
  thumbnail: string
  src: string
  duration: string
  date: string
  location: string
  videographer: string
  tags: string[]
  type: 'local' | 'youtube'
}

// Sample prenup videos data
const prenupVideos: VideoMetadata[] = [
  {
    id: "main-video",
    title: "Our Love Story",
    description:
      "A beautiful journey through our relationship, from our first meeting to the proposal. This video captures the essence of our love story and the moments that led us to forever.",
    thumbnail: "/img/background.png",
    src: "/videos/prenupVideo.mp4",
    duration: "3:45",
    date: "2024-04-15",
    location: "Sunset Beach, Hawaii",
    videographer: "Eternal Moments Films",
    tags: ["Love Story", "Highlights", "Beach"],
    type: 'local'
  },
  {
    id: "behind-scenes",
    title: "Behind the Scenes",
    description:
      "Take a peek at the fun moments during our prenup photoshoot. Laughter, bloopers, and candid moments that show our authentic connection.",
    thumbnail: "/img/background2.png",
    src: "https://youtu.be/LCtxTeWFkQg",
    duration: "2:18",
    date: "2024-04-15",
    location: "Sunset Beach, Hawaii",
    videographer: "Eternal Moments Films",
    tags: ["Behind the Scenes", "Fun", "Candid"],
    type: 'youtube'
  },
  {
    id: "proposal",
    title: "The Proposal",
    description:
      "The magical moment when he got down on one knee and asked the question that would change our lives forever.",
    thumbnail: "/img/background3.png",
    src: "/videos/6965830-hd_1920_1080_30fps.mp4",
    duration: "4:22",
    date: "2023-12-10",
    location: "Uluwatu Beach, Bali",
    videographer: "Eternal Moments Films",
    tags: ["Proposal", "Emotional", "Sunset"],
    type: 'local'
  },
]

export default function VideoSection() {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(0.7)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isHovering, setIsHovering] = useState(false)
  const [showInfoDialog, setShowInfoDialog] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [activeTab, setActiveTab] = useState("description")
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(124)
  const [commentCount] = useState(32)
  const [isBuffering, setIsBuffering] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const activeVideo = prenupVideos[activeVideoIndex]

  // Add touch controls
  const [touchStartX, setTouchStartX] = useState(0)
  const [touchStartY, setTouchStartY] = useState(0)
  const [isTouching, setIsTouching] = useState(false)

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX)
    setTouchStartY(e.touches[0].clientY)
    setIsTouching(true)
    setShowControls(true)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isTouching) return

    const touchEndX = e.changedTouches[0].clientX
    const touchEndY = e.changedTouches[0].clientY
    const deltaX = touchEndX - touchStartX
    const deltaY = touchEndY - touchStartY

    // Only handle horizontal swipes if the vertical movement is small
    if (Math.abs(deltaY) < 50) {
      if (deltaX > 50) {
        // Swipe right - go to previous video
        handlePrevVideo()
      } else if (deltaX < -50) {
        // Swipe left - go to next video
        handleNextVideo()
      } else {
        // Tap - toggle play/pause
        togglePlay()
      }
    }

    setIsTouching(false)
  }

  // Handle video events
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleTimeUpdate = () => setCurrentTime(video.currentTime)
    const handleLoadedMetadata = () => {
      setDuration(video.duration)
      setIsLoading(false)
    }
    const handleEnded = () => setIsPlaying(false)
    const handleWaiting = () => setIsBuffering(true)
    const handlePlaying = () => setIsBuffering(false)
    const handleError = (e: ErrorEvent) => {
      setError("Failed to load video. Please try again later.")
      setIsLoading(false)
      console.error("Video error:", e)
    }

    video.addEventListener("play", handlePlay)
    video.addEventListener("pause", handlePause)
    video.addEventListener("timeupdate", handleTimeUpdate)
    video.addEventListener("loadedmetadata", handleLoadedMetadata)
    video.addEventListener("ended", handleEnded)
    video.addEventListener("waiting", handleWaiting)
    video.addEventListener("playing", handlePlaying)
    video.addEventListener("error", handleError as EventListener)

    return () => {
      video.removeEventListener("play", handlePlay)
      video.removeEventListener("pause", handlePause)
      video.removeEventListener("timeupdate", handleTimeUpdate)
      video.removeEventListener("loadedmetadata", handleLoadedMetadata)
      video.removeEventListener("ended", handleEnded)
      video.removeEventListener("waiting", handleWaiting)
      video.removeEventListener("playing", handlePlaying)
      video.removeEventListener("error", handleError as EventListener)
    }
  }, [])

  // Auto-hide controls after inactivity
  useEffect(() => {
    if (!isHovering && isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false)
      }, 3000)
    }

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [isHovering, isPlaying])

  // Reset video when changing active video
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      setCurrentTime(0)
      setIsPlaying(false)
    }
  }, [activeVideoIndex])

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!containerRef.current?.contains(document.activeElement)) return

      switch (e.key) {
        case " ":
        case "k":
          e.preventDefault()
          togglePlay()
          break
        case "ArrowRight":
          e.preventDefault()
          skipForward()
          break
        case "ArrowLeft":
          e.preventDefault()
          skipBackward()
          break
        case "m":
          e.preventDefault()
          toggleMute()
          break
        case "f":
          e.preventDefault()
          toggleFullscreen()
          break
        case "ArrowUp":
          e.preventDefault()
          if (volume < 1) setVolume(Math.min(volume + 0.1, 1))
          break
        case "ArrowDown":
          e.preventDefault()
          if (volume > 0) setVolume(Math.max(volume - 0.1, 0))
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [volume])

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play().catch((err) => {
          console.error("Error playing video:", err)
        })
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
    }
    if (newVolume === 0) {
      setIsMuted(true)
    } else if (isMuted) {
      setIsMuted(false)
    }
  }

  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value[0]
      setCurrentTime(value[0])
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  const skipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 10, duration)
    }
  }

  const skipBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(videoRef.current.currentTime - 10, 0)
    }
  }

  const handleNextVideo = () => {
    setActiveVideoIndex((prevIndex) => (prevIndex + 1) % prenupVideos.length)
  }

  const handlePrevVideo = () => {
    setActiveVideoIndex((prevIndex) => (prevIndex - 1 + prenupVideos.length) % prenupVideos.length)
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
  }

  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = activeVideo.src
    link.download = `${activeVideo.title.replace(/\s+/g, "-").toLowerCase()}.mp4`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Add styles to document using useEffect
  useEffect(() => {
    const styles = `
      .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
      }
      
      .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
      }
      
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: 3px;
      }
      
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background-color: rgba(0, 0, 0, 0.3);
      }
    `

    const styleSheet = document.createElement("style")
    styleSheet.textContent = styles
    document.head.appendChild(styleSheet)

    return () => {
      document.head.removeChild(styleSheet)
    }
  }, [])

  const copyShareLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href + "#video-" + activeVideo.id)
      // You could add a toast notification here
    }
  }

  // Function to get YouTube video ID
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  // Function to get YouTube embed URL
  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = getYouTubeId(url)
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Main Video Player */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <motion.div
            ref={containerRef}
            className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onMouseMove={() => {
              setShowControls(true)
              if (controlsTimeoutRef.current) {
                clearTimeout(controlsTimeoutRef.current)
              }
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            tabIndex={0}
          >
            {/* Video Element */}
            {activeVideo.type === 'youtube' ? (
              <iframe
                src={getYouTubeEmbedUrl(activeVideo.src) || ''}
                title={activeVideo.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video 
                ref={videoRef} 
                className="w-full h-full object-contain" 
                poster={activeVideo.thumbnail} 
                playsInline
                preload="metadata"
              >
                <source src={activeVideo.src} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-20">
                <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-20">
                <div className="text-white text-center p-4">
                  <p className="text-lg font-semibold mb-2">{error}</p>
                  <Button 
                    variant="secondary" 
                    onClick={() => {
                      setError(null)
                      setIsLoading(true)
                      if (videoRef.current) {
                        videoRef.current.load()
                      }
                    }}
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            )}

            {/* Buffering Indicator */}
            {isBuffering && !isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-20">
                <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            {/* Video Controls Overlay */}
            <AnimatePresence>
              {showControls && !isLoading && !error && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 flex flex-col justify-between p-4 z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Top Controls */}
                  <div className="flex justify-between items-center">
                    <div className="text-white">
                      <h3 className="text-lg font-semibold line-clamp-1">{activeVideo.title}</h3>
                      <p className="text-sm text-gray-300 line-clamp-1">{activeVideo.videographer}</p>
                    </div>
                    <div className="flex gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-white hover:bg-white/20 rounded-full"
                              onClick={() => setShowInfoDialog(true)}
                            >
                              <Info className="h-5 w-5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Video Information</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-white hover:bg-white/20 rounded-full"
                              onClick={() => setShowShareDialog(true)}
                            >
                              <Share2 className="h-5 w-5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Share Video</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  {/* Center Play Button (only when paused) */}
                  {!isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.button
                        onClick={togglePlay}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Play className="h-8 w-8 sm:h-10 sm:w-10 text-white fill-white" />
                      </motion.button>
                    </div>
                  )}

                  {/* Bottom Controls Bar */}
                  <div className="space-y-2">
                    {/* Progress Bar */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white">{formatTime(currentTime)}</span>
                      <div className="relative flex-1 group">
                        <Slider
                          value={[currentTime]}
                          max={duration || 100}
                          step={0.1}
                          onValueChange={handleSeek}
                          className="cursor-pointer"
                        />
                        <div
                          className="absolute top-0 left-0 h-full bg-rose-500 rounded-full pointer-events-none"
                          style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-white">{formatTime(duration)}</span>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                onClick={togglePlay}
                                variant="ghost"
                                size="icon"
                                className="text-white hover:bg-white/20 rounded-full h-9 w-9 sm:h-10 sm:w-10"
                                aria-label={isPlaying ? "Pause" : "Play"}
                              >
                                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{isPlaying ? "Pause (k)" : "Play (k)"}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                onClick={skipBackward}
                                variant="ghost"
                                size="icon"
                                className="text-white hover:bg-white/20 rounded-full h-9 w-9 sm:h-10 sm:w-10"
                                aria-label="Skip backward 10 seconds"
                              >
                                <SkipBack className="h-5 w-5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Rewind 10s (←)</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                onClick={skipForward}
                                variant="ghost"
                                size="icon"
                                className="text-white hover:bg-white/20 rounded-full h-9 w-9 sm:h-10 sm:w-10"
                                aria-label="Skip forward 10 seconds"
                              >
                                <SkipForward className="h-5 w-5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Forward 10s (→)</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <div className="flex items-center ml-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  onClick={toggleMute}
                                  variant="ghost"
                                  size="icon"
                                  className="text-white hover:bg-white/20 rounded-full h-9 w-9 sm:h-10 sm:w-10"
                                  aria-label={isMuted ? "Unmute" : "Mute"}
                                >
                                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{isMuted ? "Unmute (m)" : "Mute (m)"}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <div className="w-20 hidden sm:block">
                            <Slider
                              value={[volume]}
                              max={1}
                              step={0.01}
                              onValueChange={handleVolumeChange}
                              className="cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                onClick={handleLike}
                                variant="ghost"
                                size="icon"
                                className={`rounded-full h-9 w-9 sm:h-10 sm:w-10 ${isLiked ? "text-rose-500" : "text-white hover:bg-white/20"}`}
                              >
                                <Heart className={`h-5 w-5 ${isLiked ? "fill-rose-500" : ""}`} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{isLiked ? "Unlike" : "Like"}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                onClick={handleDownload}
                                variant="ghost"
                                size="icon"
                                className="text-white hover:bg-white/20 rounded-full h-9 w-9 sm:h-10 sm:w-10"
                              >
                                <Download className="h-5 w-5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Download</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                onClick={toggleFullscreen}
                                variant="ghost"
                                size="icon"
                                className="text-white hover:bg-white/20 rounded-full h-9 w-9 sm:h-10 sm:w-10"
                                aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                              >
                                <Maximize className="h-5 w-5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Fullscreen (f)</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Video Title and Actions */}
          <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div>
              <h3 className="text-xl font-semibold line-clamp-2">{activeVideo.title}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                <span>{formatDate(activeVideo.date)}</span>
                <span className="flex items-center">
                  <Film className="h-4 w-4 mr-1" />
                  {activeVideo.videographer}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center gap-1 ${isLiked ? "text-rose-600" : ""}`}
                onClick={handleLike}
              >
                <Heart className={`h-4 w-4 ${isLiked ? "fill-rose-600" : ""}`} />
                <span>{likeCount}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => setShowInfoDialog(true)}
              >
                <MessageSquare className="h-4 w-4" />
                <span>{commentCount}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => setShowShareDialog(true)}
              >
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </Button>
            </div>
          </div>

          {/* Video Description */}
          <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
            <Tabs defaultValue="description" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="text-gray-700">
                <p className="whitespace-pre-line">{activeVideo.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {activeVideo.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-rose-100 text-rose-700 hover:bg-rose-200">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="details">
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Filming Date</h4>
                      <p className="text-gray-600">{formatDate(activeVideo.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Location</h4>
                      <p className="text-gray-600">{activeVideo.location}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Duration</h4>
                      <p className="text-gray-600">{activeVideo.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Film className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Videographer</h4>
                      <p className="text-gray-600">{activeVideo.videographer}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Video Playlist */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 h-full">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Film className="h-5 w-5 mr-2 text-rose-600" />
              Prenup Videos
            </h3>
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {prenupVideos.map((video, index) => (
                <motion.div
                  key={video.id}
                  className={`flex gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                    index === activeVideoIndex ? "bg-rose-50 border border-rose-100" : "hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    setActiveVideoIndex(index)
                    setIsLoading(true)
                    setError(null)
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="relative w-24 h-16 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={video.thumbnail}
                      alt={video.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                      <Play className="h-6 w-6 text-white" />
                    </div>
                    <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                      {video.duration}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm line-clamp-1">{video.title}</h4>
                    <p className="text-xs text-gray-500 line-clamp-1">{video.videographer}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(video.date)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Video Navigation */}
      <div className="mt-8 flex justify-between">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={handlePrevVideo}
          disabled={prenupVideos.length <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous Video
        </Button>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={handleNextVideo}
          disabled={prenupVideos.length <= 1}
        >
          Next Video
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Video Info Dialog */}
      <Dialog open={showInfoDialog} onOpenChange={setShowInfoDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{activeVideo.title}</DialogTitle>
            <DialogDescription>Video details and information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <Image
                src={activeVideo.thumbnail || "/placeholder.svg"}
                alt={activeVideo.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-3">
              <p className="text-gray-700">{activeVideo.description}</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="font-medium">Date:</span> {formatDate(activeVideo.date)}
                </div>
                <div>
                  <span className="font-medium">Duration:</span> {activeVideo.duration}
                </div>
                <div>
                  <span className="font-medium">Location:</span> {activeVideo.location}
                </div>
                <div>
                  <span className="font-medium">Videographer:</span> {activeVideo.videographer}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {activeVideo.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-rose-100 text-rose-700">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInfoDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share This Video</DialogTitle>
            <DialogDescription>Share our prenup video with friends and family</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2">
                <Label htmlFor="link" className="sr-only">
                  Link
                </Label>
                <Input
                  id="link"
                  defaultValue={typeof window !== 'undefined' ? window.location.href + "#video-" + activeVideo.id : ''}
                  readOnly
                  className="h-9"
                />
              </div>
              <Button size="sm" onClick={copyShareLink} className="px-3">
                <span className="sr-only">Copy</span>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-[#1877F2] text-white border-none hover:bg-[#1877F2]/90"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z" />
                </svg>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-[#1DA1F2] text-white border-none hover:bg-[#1DA1F2]/90"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                </svg>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-[#E60023] text-white border-none hover:bg-[#E60023]/90"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9.04 21.54c.96.29 1.93.46 2.96.46a10 10 0 0 0 10-10A10 10 0 0 0 12 2 10 10 0 0 0 2 12c0 4.25 2.67 7.9 6.44 9.34-.09-.78-.18-2.07 0-2.96l1.15-4.94s-.29-.58-.29-1.5c0-1.38.86-2.41 1.84-2.41.86 0 1.26.63 1.26 1.44 0 .86-.57 2.09-.86 3.27-.17.98.52 1.84 1.52 1.84 1.78 0 3.16-1.9 3.16-4.58 0-2.4-1.72-4.04-4.19-4.04-2.82 0-4.48 2.1-4.48 4.31 0 .86.28 1.73.74 2.3.09.06.09.14.06.29l-.29 1.09c0 .17-.11.23-.28.11-1.28-.56-2.02-2.38-2.02-3.85 0-3.16 2.24-6.03 6.56-6.03 3.44 0 6.12 2.47 6.12 5.75 0 3.44-2.13 6.2-5.18 6.2-.97 0-1.92-.52-2.26-1.13l-.67 2.37c-.23.86-.86 2.01-1.29 2.7v-.03Z" />
                </svg>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-[#25D366] text-white border-none hover:bg-[#25D366]/90"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </Button>
            </div>
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
