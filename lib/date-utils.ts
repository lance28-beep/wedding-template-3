/**
 * Date utility functions for the wedding website
 */

import { weddingDetails } from "@/config/wedding-config"

/**
 * Calculate the time remaining until the wedding date
 * @returns Object containing days, hours, minutes, and seconds until the wedding
 */
export function getTimeUntilWedding() {
  const weddingDate = new Date(weddingDetails.date)
  const now = new Date()

  // Calculate the difference in milliseconds
  const difference = weddingDate.getTime() - now.getTime()

  // If the wedding date has passed, return zeros
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  // Calculate the time units
  const days = Math.floor(difference / (1000 * 60 * 60 * 24))
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((difference % (1000 * 60)) / 1000)

  return { days, hours, minutes, seconds }
}

/**
 * Calculate the time remaining until the RSVP deadline
 * @returns Object containing days, hours, minutes, and seconds until the RSVP deadline
 */
export function getTimeUntilRsvpDeadline() {
  const rsvpDeadline = new Date(weddingDetails.rsvpDeadline)
  const now = new Date()

  // Calculate the difference in milliseconds
  const difference = rsvpDeadline.getTime() - now.getTime()

  // If the RSVP deadline has passed, return zeros
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  // Calculate the time units
  const days = Math.floor(difference / (1000 * 60 * 60 * 24))
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((difference % (1000 * 60)) / 1000)

  return { days, hours, minutes, seconds }
}

/**
 * Format a date string in a user-friendly format
 * @param dateString - The date string to format
 * @param options - Formatting options
 * @returns Formatted date string
 */
export function formatDate(dateString: string, options: Intl.DateTimeFormatOptions = {}) {
  try {
    const defaultOptions: Intl.DateTimeFormatOptions = {
      month: "long",
      day: "numeric",
      year: "numeric",
    }

    const mergedOptions = { ...defaultOptions, ...options }
    return new Date(dateString).toLocaleDateString("en-US", mergedOptions)
  } catch (e) {
    console.error("Error formatting date:", e)
    return dateString
  }
}

/**
 * Check if the RSVP deadline has passed
 * @returns Boolean indicating if the RSVP deadline has passed
 */
export function hasRsvpDeadlinePassed() {
  const rsvpDeadline = new Date(weddingDetails.rsvpDeadline)
  const now = new Date()

  // Reset time components to compare dates only
  const deadlineDate = new Date(rsvpDeadline.getFullYear(), rsvpDeadline.getMonth(), rsvpDeadline.getDate())
  const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  // Debug logging
  console.log("Current date:", currentDate.toISOString())
  console.log("Deadline date:", deadlineDate.toISOString())
  console.log("Is deadline passed:", currentDate > deadlineDate)

  return currentDate > deadlineDate
}

/**
 * Check if the wedding date has passed
 * @returns Boolean indicating if the wedding date has passed
 */
export function hasWeddingDatePassed() {
  const weddingDate = new Date(weddingDetails.date)
  const now = new Date()
  return now > weddingDate
}

/**
 * Get formatted remaining time until RSVP deadline
 * @returns String with formatted remaining time
 */
export function getRemainingTimeUntilDeadline() {
  const timeLeft = getTimeUntilRsvpDeadline()

  if (timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0) {
    return "less than an hour"
  }

  if (timeLeft.days === 0) {
    return `${timeLeft.hours} hours and ${timeLeft.minutes} minutes`
  }

  if (timeLeft.days === 1) {
    return "1 day"
  }

  return `${timeLeft.days} days`
}
