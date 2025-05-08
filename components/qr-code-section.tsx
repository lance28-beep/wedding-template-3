import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Download, Share2 } from "lucide-react"

export default function QRCodeSection() {
  return (
    <div className="max-w-3xl mx-auto text-center">
      <p className="text-gray-700 mb-8 max-w-2xl mx-auto">
        Share our wedding website with friends and family by scanning this QR code or using the share button below.
      </p>

      <div className="flex flex-col items-center justify-center mb-8">
        <div className="relative h-64 w-64 mb-6 border-8 border-white shadow-lg">
          <Image src="/images/wedding-qr-code.png" alt="Wedding Website QR Code" fill className="object-contain" />
        </div>
        <p className="text-gray-600 text-sm">Scan with your phone camera</p>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button className="bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-2">
          <Download size={18} />
          Download QR Code
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <Share2 size={18} />
          Share Website
        </Button>
      </div>
    </div>
  )
}
