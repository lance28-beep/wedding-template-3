"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import { useRegistryConfig } from "@/context/wedding-context"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export default function Registry() {
  const registryConfig = useRegistryConfig()
  const { toast } = useToast()
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopiedIndex(index)
        toast({
          title: "Copied to clipboard",
          description: "The details have been copied to your clipboard.",
        })
        setTimeout(() => setCopiedIndex(null), 2000)
      },
      (err) => {
        console.error("Could not copy text: ", err)
        toast({
          title: "Failed to copy",
          description: "There was an error copying the details.",
          variant: "destructive",
        })
      },
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <p className="text-gray-700 max-w-2xl mx-auto">{registryConfig.message}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {registryConfig.paymentOptions.map((option, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-center mb-4">
              <div className="relative h-16 w-32">
                <Image
                  src={option.logo || "/placeholder.svg"}
                  alt={`${option.name} logo`}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <h4 className="text-xl font-medium text-center mb-4">{option.name}</h4>
            <div className="space-y-2 mb-6">
              {option.bankName && (
                <p className="text-gray-700 text-sm">
                  <span className="font-medium">Bank:</span> {option.bankName}
                </p>
              )}
              <p className="text-gray-700 text-sm">
                <span className="font-medium">Account Name:</span> {option.accountName}
              </p>
              <p className="text-gray-700 text-sm">
                <span className="font-medium">Account Number:</span> {option.accountNumber}
              </p>
            </div>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={() => {
                const details = `${option.name}\n${option.bankName ? `Bank: ${option.bankName}\n` : ""}Account Name: ${
                  option.accountName
                }\nAccount Number: ${option.accountNumber}`
                copyToClipboard(details, index)
              }}
            >
              <Copy size={16} />
              {copiedIndex === index ? "Copied!" : "Copy Details"}
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-gray-600 italic">{registryConfig.thankYouMessage}</p>
      </div>
    </div>
  )
}
