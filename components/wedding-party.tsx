"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { getWeddingParty, getCouple, getParents } from "@/lib/config-utils"
import type { WeddingPartyMember, Person } from "@/types/wedding-config"
import { cn } from "@/lib/utils"
import MemberModal from "./ui/modal"

export default function WeddingParty() {
  const { brideParty, groomParty, bearers, flowerGirls, sponsors } = getWeddingParty()
  const couple = getCouple()
  const parents = getParents()
  const [selectedMember, setSelectedMember] = useState<Person | null>(null)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  const PartyMember = ({ member }: { member: Person }) => (
    <motion.div 
      className="text-center group cursor-pointer" 
      variants={itemVariants}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      onClick={() => setSelectedMember(member)}
    >
      <div className="relative w-48 h-48 mx-auto mb-4 overflow-hidden rounded-full ring-4 ring-rose-100 group-hover:ring-rose-200 transition-all duration-300">
        <Image
          src={member.image || "/placeholder.svg"}
          alt={member.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 192px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-white text-sm font-medium">View Details</span>
        </div>
      </div>
      <h4 className="text-xl font-medium text-gray-800 group-hover:text-rose-600 transition-colors duration-300">{member.name}</h4>
      <p className="text-rose-600 font-medium">{member.role}</p>
      <p className="text-gray-600 text-sm mt-1">{member.relationship}</p>
    </motion.div>
  )

  const PartySection = ({ title, members, columns = 4 }: { title: string; members: Person[]; columns?: number }) => (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-b from-rose-50/50 to-transparent -z-10" />
      <div className="absolute inset-0 bg-[url('/floral-pattern.png')] opacity-5 -z-10" />
      <h3 className="text-3xl font-serif text-center mb-12 text-rose-700 relative">
        <span className="relative z-10">
          {title}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-1 bg-rose-200 rounded-full" />
        </span>
      </h3>
      <motion.div
        className={cn(
          "grid gap-8",
          columns === 4 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" :
          columns === 3 ? "grid-cols-1 sm:grid-cols-3" :
          "grid-cols-1 sm:grid-cols-2"
        )}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {members.map((member, index) => (
          <PartyMember key={index} member={member} />
        ))}
      </motion.div>
    </div>
  )

  const SponsorSection = ({ title, sponsors }: { title: string; sponsors: Person[] }) => (
    <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
      <h4 className="text-2xl font-serif text-center mb-8 text-rose-600">{title}</h4>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {sponsors.map((sponsor, index) => (
          <PartyMember key={index} member={sponsor} />
        ))}
      </motion.div>
    </div>
  )

  return (
    <div className="space-y-24 py-16">
      {/* Parents Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-rose-50/50 to-transparent -z-10" />
        <div className="absolute inset-0 bg-[url('/floral-pattern.png')] opacity-5 -z-10" />
        <h3 className="text-4xl font-serif text-center mb-12 text-rose-700 relative">
          <span className="relative z-10">
            Our Beloved Parents
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-1 bg-rose-200 rounded-full" />
          </span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Groom's Parents */}
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
            <h4 className="text-2xl font-serif text-center mb-8 text-rose-600">{couple.partner1.firstName}'s Parents</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <PartyMember member={parents.groomParents.father} />
              <PartyMember member={parents.groomParents.mother} />
            </div>
          </div>
          {/* Bride's Parents */}
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
            <h4 className="text-2xl font-serif text-center mb-8 text-rose-600">{couple.partner2.firstName}'s Parents</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <PartyMember member={parents.brideParents.father} />
              <PartyMember member={parents.brideParents.mother} />
            </div>
          </div>
        </div>
      </div>

      {/* Bride's Party */}
      <PartySection title={`${couple.partner2.firstName}'s Party`} members={brideParty} />

      {/* Groom's Party */}
      <PartySection title={`${couple.partner1.firstName}'s Party`} members={groomParty} />

      {/* Bearers */}
      <PartySection title="Our Special Bearers" members={[bearers.ringBearer, bearers.coinBearer, bearers.bibleBearer]} columns={3} />

      {/* Flower Girls */}
      <PartySection title="Our Precious Flower Girls" members={flowerGirls} columns={2} />

      {/* Sponsors */}
      <div className="space-y-16">
        <h3 className="text-4xl font-serif text-center mb-12 text-rose-700 relative">
          <span className="relative z-10">
            Our Sponsors
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-1 bg-rose-200 rounded-full" />
          </span>
        </h3>
        
        <SponsorSection title="Veil Sponsors" sponsors={sponsors.veil} />
        <SponsorSection title="Cord Sponsors" sponsors={sponsors.cord} />
        <SponsorSection title="Candle Sponsors" sponsors={sponsors.candle} />
        
        {/* Principal Sponsors */}
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
          <h4 className="text-2xl font-serif text-center mb-8 text-rose-600">Principal Sponsors</h4>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {sponsors.principal.map((sponsor, index) => (
              <PartyMember key={index} member={sponsor} />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Modal */}
      <MemberModal
        isOpen={!!selectedMember}
        onClose={() => setSelectedMember(null)}
        member={selectedMember}
      />
    </div>
  )
}
