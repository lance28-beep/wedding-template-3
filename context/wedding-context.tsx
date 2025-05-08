"use client"

import { createContext, useContext, type ReactNode } from "react"
import weddingConfig from "@/config/wedding-config"

// Create the context
const WeddingContext = createContext(weddingConfig)

// Provider component
export function WeddingProvider({ children }: { children: ReactNode }) {
  return <WeddingContext.Provider value={weddingConfig}>{children}</WeddingContext.Provider>
}

// Hook to use the wedding context
export function useWedding() {
  const context = useContext(WeddingContext)
  if (context === undefined) {
    throw new Error("useWedding must be used within a WeddingProvider")
  }
  return context
}

// Export individual hooks for specific parts of the config
export function useCouple() {
  return useWedding().couple
}

export function useWeddingDetails() {
  return useWedding().weddingDetails
}

export function useRsvpConfig() {
  return useWedding().rsvpConfig
}

export function useRegistryConfig() {
  return useWedding().registryConfig
}

export function useLoveStoryEvents() {
  return useWedding().loveStoryEvents
}

export function useWeddingParty() {
  return useWedding().weddingParty
}

export function useFaqQuestions() {
  return useWedding().faqQuestions
}

export function useWebsiteConfig() {
  return useWedding().websiteConfig
}

export function useGalleryImages() {
  return useWedding().galleryImages
}

export function useNavigationLinks() {
  return useWedding().navigationLinks
}
