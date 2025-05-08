"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

export default function Invitation() {
  const { toast } = useToast()

  const handleDownload = async () => {
    try {
      const response = await fetch("/invitation")

      if (!response.ok) {
        throw new Error("Failed to download invitation")
      }

      // Get the blob from the response
      const blob = await response.blob()

      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob)

      // Create a temporary anchor element
      const a = document.createElement("a")
      a.style.display = "none"
      a.href = url
      a.download = "Sarah-Michael-Wedding-Invitation.pdf"

      // Append to the document and trigger the download
      document.body.appendChild(a)
      a.click()

      // Clean up
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "Download started",
        description: "Your invitation is downloading now.",
      })
    } catch (error) {
      console.error("Download error:", error)
      toast({
        title: "Download failed",
        description: "There was a problem downloading the invitation. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div
          className="relative h-[500px] w-full overflow-hidden rounded-lg shadow-lg"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <Image
            src="/images/invitation.jpg"
            alt="Wedding Invitation"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 500px"
          />
        </motion.div>
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-serif text-rose-700">Our Wedding Invitation</h3>
          <p className="text-gray-700">
            We are delighted to invite you to celebrate our wedding day. Please download our official invitation for all
            the details about our special day.
          </p>
          <div className="space-y-4">
            <motion.div
              className="flex items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center mr-4">
                <span className="text-rose-600 font-medium">1</span>
              </div>
              <p className="text-gray-700">Download the invitation</p>
            </motion.div>
            <motion.div
              className="flex items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center mr-4">
                <span className="text-rose-600 font-medium">2</span>
              </div>
              <p className="text-gray-700">RSVP by July 15, 2024</p>
            </motion.div>
            <motion.div
              className="flex items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center mr-4">
                <span className="text-rose-600 font-medium">3</span>
              </div>
              <p className="text-gray-700">Share with your plus one</p>
            </motion.div>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              className="bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-2 px-6 py-6 text-lg"
              onClick={handleDownload}
            >
              <Download size={20} />
              Download Invitation
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
