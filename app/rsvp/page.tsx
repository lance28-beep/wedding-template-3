import RSVPForm from "@/components/rsvp-form"
import type { Metadata } from "next"
import Image from "next/image"
import { getWeddingDetails, getCoupleInfo } from "@/lib/config-utils"
import { hasRsvpDeadlinePassed, formatDate } from "@/lib/date-utils"
import { Calendar, Clock, MapPin, Users, Heart } from "lucide-react"

export const metadata: Metadata = {
  title: "RSVP - Wedding Invitation",
  description: "RSVP to our wedding celebration",
}

export default function RSVPPage() {
  const weddingDetails = getWeddingDetails()
  const coupleInfo = getCoupleInfo()
  const isDeadlinePassed = hasRsvpDeadlinePassed()

  return (
    <main className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-rose-50/30 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-great-vibes text-rose-700 mb-4">RSVP</h1>
            <div className="w-24 h-1 bg-rose-200 mx-auto mb-6 rounded-full"></div>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Please let us know if you'll be joining us on our special day by {formatDate(weddingDetails.rsvpDeadline)}
              . We're excited to celebrate with you!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-rose-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mr-4">
                  <Calendar className="h-6 w-6 text-rose-600" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">Wedding Date</h3>
                  <p className="text-gray-600">{formatDate(weddingDetails.date)}</p>
                </div>
              </div>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mr-4">
                  <Clock className="h-6 w-6 text-rose-600" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">Ceremony Time</h3>
                  <p className="text-gray-600">{weddingDetails.ceremony.startTimeDisplay}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mr-4">
                  <MapPin className="h-6 w-6 text-rose-600" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">Venue</h3>
                  <p className="text-gray-600">{weddingDetails.ceremony.venue.name}</p>
                  <p className="text-gray-500 text-sm">{weddingDetails.ceremony.venue.address}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-rose-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mr-4">
                  <Users className="h-6 w-6 text-rose-600" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">Couple</h3>
                  <p className="text-gray-600">{coupleInfo.coupleFullNameDisplay}</p>
                </div>
              </div>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mr-4">
                  <Heart className="h-6 w-6 text-rose-600" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">Dress Code</h3>
                  <p className="text-gray-600">{weddingDetails.dressCode}</p>
                </div>
              </div>
              <div className="mt-4 p-3 bg-rose-50 rounded-lg border border-rose-100">
                <p className="text-rose-700 text-sm">
                  <strong>Note:</strong> Please RSVP by {formatDate(weddingDetails.rsvpDeadline)} to help us finalize
                  our arrangements.
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-6 -left-6 w-24 h-24 opacity-20">
              <Image src="/images/floral-divider.png" alt="Decorative element" width={100} height={100} />
            </div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 opacity-20 rotate-180">
              <Image src="/images/floral-divider.png" alt="Decorative element" width={100} height={100} />
            </div>
            <div className="bg-white shadow-md rounded-xl overflow-hidden border border-rose-100">
              <div className="bg-rose-50 p-6 border-b border-rose-100">
                <h2 className="text-2xl font-medium text-rose-800">Wedding RSVP</h2>
                <p className="text-rose-600">
                  {formatDate(weddingDetails.date)} • {weddingDetails.ceremony.venue.name} •{" "}
                  {weddingDetails.ceremony.startTimeDisplay}
                </p>
              </div>
              <div className="p-6">
                <RSVPForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
