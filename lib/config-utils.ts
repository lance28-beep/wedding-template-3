/**
 * Utility functions for working with the wedding configuration
 */

import weddingConfig from "@/config/wedding-config"

/**
 * Get the full wedding configuration
 * @returns The complete wedding configuration object
 */
export function getWeddingConfig() {
  return weddingConfig
}

/**
 * Get the couple's information
 * @returns The couple's information
 */
export function getCoupleInfo() {
  return weddingConfig.couple
}

/**
 * Get the couple's information
 * @returns The couple's information
 */
export function getCouple() {
  return weddingConfig.couple
}

/**
 * Get the wedding details
 * @returns The wedding details
 */
export function getWeddingDetails() {
  return weddingConfig.weddingDetails
}

/**
 * Get the RSVP configuration
 * @returns The RSVP configuration
 */
export function getRsvpConfig() {
  return weddingConfig.rsvpConfig
}

/**
 * Get the registry configuration
 * @returns The registry configuration
 */
export function getRegistryConfig() {
  return weddingConfig.registryConfig
}

/**
 * Get the love story events
 * @returns The love story events
 */
export function getLoveStoryEvents() {
  return weddingConfig.loveStoryEvents
}

/**
 * Get the wedding party information
 * @returns The wedding party information
 */
export function getWeddingParty() {
  return weddingConfig.weddingParty
}

/**
 * Get the FAQ questions
 * @returns The FAQ questions
 */
export function getFaqQuestions() {
  return weddingConfig.faqQuestions
}

/**
 * Get the website configuration
 * @returns The website configuration
 */
export function getWebsiteConfig() {
  return weddingConfig.websiteConfig
}

/**
 * Get the gallery images
 * @returns The gallery images
 */
export function getGalleryImages() {
  return weddingConfig.galleryImages
}

/**
 * Get the navigation links
 * @returns The navigation links
 */
export function getNavigationLinks() {
  return weddingConfig.navigationLinks
}

/**
 * Get the wedding metadata for SEO
 * @returns Object with title and description for SEO
 */
export function getWeddingMetadata() {
  const { websiteConfig, couple, weddingDetails } = weddingConfig

  return {
    title: websiteConfig.title,
    description: websiteConfig.description,
    metadataBase: 'https://lanceandrosa.com',
    openGraph: {
      title: websiteConfig.title,
      description: websiteConfig.description,
      images: [
        {
          url: websiteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: `${couple.coupleNameDisplay} Wedding`,
        },
      ],
    },
  }
}

/**
 * Get the parents information
 * @returns The parents information
 */
export function getParents() {
  return weddingConfig.parents
}
