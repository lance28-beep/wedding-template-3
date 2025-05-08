"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { getTimeUntilWedding, hasWeddingDatePassed } from "@/lib/date-utils"
import { getWeddingDetails } from "@/lib/config-utils"
import CountUp from "./CountUp"

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState(getTimeUntilWedding())
  const [isWeddingPassed, setIsWeddingPassed] = useState(hasWeddingDatePassed())
  const weddingDetails = getWeddingDetails()

  useEffect(() => {
    const interval = setInterval(() => {
      const newTimeLeft = getTimeUntilWedding()
      setTimeLeft(newTimeLeft)
      setIsWeddingPassed(hasWeddingDatePassed())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const timeUnits = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ]

  if (isWeddingPassed) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8"
      >
        <h2 className="text-2xl md:text-3xl font-light text-rose-600 mb-2">
          The Wedding Has Passed
        </h2>
        <p className="text-gray-600">
          Thank you for being part of our special day!
        </p>
      </motion.div>
    )
  }

  return (
    <div className="flex flex-col items-center">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl md:text-3xl font-light text-gray-800 mb-6"
      >
        Counting down to our special day
      </motion.h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-8 text-center max-w-3xl w-full">
        {timeUnits.map((unit, index) => (
          <motion.div
            key={unit.label}
            className="flex flex-col items-center bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4 md:p-6 border border-rose-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
              borderColor: "rgb(225, 29, 72)" // rose-600
            }}
          >
            <div className="text-4xl md:text-5xl font-light mb-2 text-rose-600">
              <CountUp
                from={0}
                to={unit.value}
                duration={0.5}
                className="count-up-text"
                startWhen={true}
                separator=""
              />
            </div>
            <div className="text-xs uppercase tracking-wider text-gray-600 font-medium">
              {unit.label}
            </div>
          </motion.div>
        ))}
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-gray-600 mt-6 text-sm md:text-base"
      >
        {weddingDetails.dateDisplay} at {weddingDetails.timeDisplay}
      </motion.p>
    </div>
  )
}
