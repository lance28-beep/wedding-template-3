"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { getCouple, getNavigationLinks } from "@/lib/config-utils"

export default function Navbar() {
  const couple = getCouple()
  const navigationLinks = getNavigationLinks()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("home")

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }

      // Update active section based on scroll position
      const sections = document.querySelectorAll("section[id]")
      const scrollPosition = window.scrollY + 100

      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop
        const sectionHeight = (section as HTMLElement).offsetHeight
        const sectionId = section.getAttribute("id") || ""

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          setActiveSection(sectionId)
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useEffect(() => {
    // Prevent background scroll when mobile drawer is open
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const targetId = href.replace("#", "")
    const element = document.getElementById(targetId)
    if (element) {
      const offsetPosition = element.offsetTop - 80
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
      setIsMenuOpen(false)
    }
  }

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/60 backdrop-blur-md shadow-sm`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#home" className="flex items-center" onClick={(e) => handleNavClick(e, "#home")}>
            <div className="relative h-12 w-12 mr-2">
              <Image src="/img/Logo_wedding.png" alt="Wedding Logo" fill className="object-contain" />
            </div>
            <span className="font-great-vibes text-2xl text-rose-800">
              {couple.coupleNameDisplay}
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {navigationLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`hover:text-rose-600 transition-colors text-rose-800 font-medium ${
                  activeSection === link.href.substring(1) ? "text-rose-600" : ""
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMenu}
              className="text-rose-800 hover:text-rose-600 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMenuOpen(false)}
            />
            {/* Drawer */}
            <motion.div
              className="fixed top-0 right-0 min-h-screen h-full w-4/5 max-w-xs z-[9999] border-l border-white/10 bg-white backdrop-blur-2xl shadow-2xl flex flex-col px-4 py-2 rounded-l-2xl"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
            >
              {/* Enhanced X Button */}
              <button
                onClick={() => setIsMenuOpen(false)}
                className="absolute top-4 right-4 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-full p-1.5 border border-rose-200 shadow transition-colors z-10"
                aria-label="Close menu"
              >
                <X size={22} />
              </button>

              {/* Logo and Couple Name */}
              <div className="flex flex-col items-center mt-2 mb-4">
                <div className="relative h-10 w-10 mb-2">
                  <Image src="/img/Logo_wedding.png" alt="Wedding Logo" fill className="object-contain" />
                </div>
                <span className="font-great-vibes text-xl text-rose-800 mb-1">{couple.coupleNameDisplay}</span>
                <hr className="w-2/3 border-t border-rose-100 mb-1" />
              </div>

              {/* Nav Items */}
              <nav className="flex flex-col gap-1 mt-1">
                {navigationLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`flex items-center px-2 py-1.5 rounded-lg font-medium text-rose-800 text-base transition-colors transition-transform
                      ${activeSection === link.href.substring(1)
                        ? 'bg-rose-100 font-semibold'
                        : 'hover:bg-rose-50 hover:scale-[1.03]'}
                    `}
                  >
                    {link.name}
                  </a>
                ))}
                <Button
                  asChild
                  className="bg-rose-500 hover:bg-rose-600 text-white rounded-lg w-full mt-2 text-base font-semibold shadow-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <a href="#rsvp" onClick={(e) => handleNavClick(e, "#rsvp")}>RSVP Now</a>
                </Button>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
