"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { getWeddingParty, getCouple } from "@/lib/config-utils"

export default function WeddingParty() {
  const { brideParty, groomParty } = getWeddingParty()
  const couple = getCouple()

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
    <div className="space-y-16">
      {/* Bride's Party */}
      <div>
        <h3 className="text-2xl font-serif text-center mb-8 text-rose-700">{couple.partner2.role}'s Party</h3>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {brideParty.map((member, index) => (
            <motion.div key={index} className="text-center" variants={itemVariants}>
              <div className="relative w-48 h-48 mx-auto mb-4 overflow-hidden rounded-full group">
                <Image
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 192px"
                />
              </div>
              <h4 className="text-xl font-medium">{member.name}</h4>
              <p className="text-rose-600 font-medium">{member.role}</p>
              <p className="text-gray-600">{member.relationship}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Groom's Party */}
      <div>
        <h3 className="text-2xl font-serif text-center mb-8 text-rose-700">{couple.partner1.role}'s Party</h3>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {groomParty.map((member, index) => (
            <motion.div key={index} className="text-center" variants={itemVariants}>
              <div className="relative w-48 h-48 mx-auto mb-4 overflow-hidden rounded-full group">
                <Image
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 192px"
                />
              </div>
              <h4 className="text-xl font-medium">{member.name}</h4>
              <p className="text-rose-600 font-medium">{member.role}</p>
              <p className="text-gray-600">{member.relationship}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
