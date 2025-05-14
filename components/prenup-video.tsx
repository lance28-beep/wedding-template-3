"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX, RefreshCw, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { toast } from "sonner"

export default function PrenupVideo() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(0.7)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isBuffering, setIsBuffering] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const playPromiseRef = useRef<Promise<void> | null>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [showControls, setShowControls] = useState(true)

  // Auto-hide controls after inactivity
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true)
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
      controlsTimeoutRef.current = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false)
        }
      }, 3000)
    }

    document.addEventListener('mousemove', handleMouseMove)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [isPlaying])

  const togglePlay = async () => {
    if (!videoRef.current) return

    try {
      if (isPlaying) {
        videoRef.current.pause()
        setIsPlaying(false)
      } else {
        // If there's a pending play promise, wait for it to resolve
        if (playPromiseRef.current) {
          await playPromiseRef.current
        }
        
        // Store the new play promise
        playPromiseRef.current = videoRef.current.play()
        
        // Wait for the play promise to resolve
        await playPromiseRef.current
        setIsPlaying(true)
        toast.success('Video playback started')
      }
    } catch (err) {
      console.error('Error toggling play state:', err)
      const errorMessage = 'Failed to play video. Please try again.'
      setError(errorMessage)
      toast.error(errorMessage)
      setIsPlaying(false)
    } finally {
      playPromiseRef.current = null
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
      toast.info(isMuted ? 'Sound unmuted' : 'Sound muted')
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

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
      setIsLoading(false)
      setError(null)
    }
  }

  const handleSeek = (value: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value[0]
      setCurrentTime(value[0])
    }
  }

  const handleError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error('Video error:', e)
    const errorMessage = 'Failed to load video. Please try again later.'
    setError(errorMessage)
    toast.error(errorMessage)
    setIsLoading(false)
  }

  const handleCanPlay = () => {
    setIsLoading(false)
    setError(null)
    setIsBuffering(false)
  }

  const handleWaiting = () => {
    setIsBuffering(true)
  }

  const handlePlaying = () => {
    setIsBuffering(false)
  }

  const handleRetry = () => {
    setError(null)
    setIsLoading(true)
    setRetryCount(prev => prev + 1)
    if (videoRef.current) {
      videoRef.current.load()
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pause()
      }
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div className="max-w-4xl mx-auto">
      <div 
        className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-xl"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => {
          if (isPlaying) {
            setShowControls(false)
          }
        }}
      >
        <video
          ref={videoRef}
          className="w-full h-full"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onError={handleError}
          onCanPlay={handleCanPlay}
          onWaiting={handleWaiting}
          onPlaying={handlePlaying}
          playsInline
          preload="auto"
          key={retryCount} // Force reload on retry
        >
          <source src="/videos/prenupVideo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-3 text-white">Loading video...</span>
          </div>
        )}

        {/* Buffering State */}
        {isBuffering && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-3 text-white">Buffering...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="text-white text-center p-4">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-rose-500" />
              <p className="text-lg font-semibold mb-2">{error}</p>
              <Button 
                variant="secondary" 
                onClick={handleRetry}
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* Video Controls Overlay */}
        {!isLoading && !error && (
          <div 
            className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 flex flex-col justify-end p-4 transition-opacity duration-300 ${
              showControls ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Progress Bar */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-white">{formatTime(currentTime)}</span>
              <div className="relative flex-1">
                <Slider
                  value={[currentTime]}
                  max={duration || 100}
                  step={0.1}
                  onValueChange={handleSeek}
                  className="cursor-pointer"
                  disabled={isLoading || isBuffering}
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
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20 rounded-full h-9 w-9"
                  onClick={togglePlay}
                  disabled={isLoading || isBuffering}
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>

                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20 rounded-full h-9 w-9"
                    onClick={toggleMute}
                    disabled={isLoading || isBuffering}
                  >
                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </Button>
                  <div className="w-20">
                    <Slider
                      value={[volume]}
                      max={1}
                      step={0.01}
                      onValueChange={handleVolumeChange}
                      className="cursor-pointer"
                      disabled={isLoading || isBuffering}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 