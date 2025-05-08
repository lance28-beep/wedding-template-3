"use client"

import type React from "react"

import { createContext, useContext, useEffect } from "react"
import { useWebsiteConfig } from "@/context/wedding-context"

type WeddingThemeContextType = {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  headingFont: string
  bodyFont: string
}

const WeddingThemeContext = createContext<WeddingThemeContextType | undefined>(undefined)

export function WeddingThemeProvider({ children }: { children: React.ReactNode }) {
  const { themeColors, fonts } = useWebsiteConfig()

  // Apply theme colors and fonts to CSS variables
  useEffect(() => {
    // Apply primary color
    document.documentElement.style.setProperty("--primary", themeColors.primary[500])
    document.documentElement.style.setProperty("--primary-50", themeColors.primary[50])
    document.documentElement.style.setProperty("--primary-100", themeColors.primary[100])
    document.documentElement.style.setProperty("--primary-200", themeColors.primary[200])
    document.documentElement.style.setProperty("--primary-300", themeColors.primary[300])
    document.documentElement.style.setProperty("--primary-400", themeColors.primary[400])
    document.documentElement.style.setProperty("--primary-500", themeColors.primary[500])
    document.documentElement.style.setProperty("--primary-600", themeColors.primary[600])
    document.documentElement.style.setProperty("--primary-700", themeColors.primary[700])
    document.documentElement.style.setProperty("--primary-800", themeColors.primary[800])
    document.documentElement.style.setProperty("--primary-900", themeColors.primary[900])

    // Apply secondary color
    document.documentElement.style.setProperty("--secondary", themeColors.secondary[500])
    document.documentElement.style.setProperty("--secondary-50", themeColors.secondary[50])
    document.documentElement.style.setProperty("--secondary-100", themeColors.secondary[100])
    document.documentElement.style.setProperty("--secondary-200", themeColors.secondary[200])
    document.documentElement.style.setProperty("--secondary-300", themeColors.secondary[300])
    document.documentElement.style.setProperty("--secondary-400", themeColors.secondary[400])
    document.documentElement.style.setProperty("--secondary-500", themeColors.secondary[500])
    document.documentElement.style.setProperty("--secondary-600", themeColors.secondary[600])
    document.documentElement.style.setProperty("--secondary-700", themeColors.secondary[700])
    document.documentElement.style.setProperty("--secondary-800", themeColors.secondary[800])
    document.documentElement.style.setProperty("--secondary-900", themeColors.secondary[900])

    // Apply accent color
    document.documentElement.style.setProperty("--accent", themeColors.accent[500])
    document.documentElement.style.setProperty("--accent-50", themeColors.accent[50])
    document.documentElement.style.setProperty("--accent-100", themeColors.accent[100])
    document.documentElement.style.setProperty("--accent-200", themeColors.accent[200])
    document.documentElement.style.setProperty("--accent-300", themeColors.accent[300])
    document.documentElement.style.setProperty("--accent-400", themeColors.accent[400])
    document.documentElement.style.setProperty("--accent-500", themeColors.accent[500])
    document.documentElement.style.setProperty("--accent-600", themeColors.accent[600])
    document.documentElement.style.setProperty("--accent-700", themeColors.accent[700])
    document.documentElement.style.setProperty("--accent-800", themeColors.accent[800])
    document.documentElement.style.setProperty("--accent-900", themeColors.accent[900])

    // Apply fonts
    document.documentElement.style.setProperty("--heading-font", fonts.heading.family)
    document.documentElement.style.setProperty("--body-font", fonts.body.family)
  }, [themeColors, fonts])

  const value = {
    primaryColor: themeColors.primary[500],
    secondaryColor: themeColors.secondary[500],
    accentColor: themeColors.accent[500],
    headingFont: fonts.heading.family,
    bodyFont: fonts.body.family,
  }

  return <WeddingThemeContext.Provider value={value}>{children}</WeddingThemeContext.Provider>
}

export function useWeddingTheme() {
  const context = useContext(WeddingThemeContext)
  if (context === undefined) {
    throw new Error("useWeddingTheme must be used within a WeddingThemeProvider")
  }
  return context
}
