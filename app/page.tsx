"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"
import WeddingParty from "@/components/wedding-party"
import PhotoGallery from "@/components/photo-gallery"
import CountdownTimer from "@/components/countdown-timer"
import RSVPForm from "@/components/rsvp-form"
import Registry from "@/components/registry"
import FAQ from "@/components/faq"
import QRCodeSection from "@/components/qr-code-section"
import MusicPlayer from "@/components/music-player"
import CoupleStory from "@/components/couple-story"
import VideoSection from "@/components/video-section"
import Particles from "@/components/Particles"
import { ArrowDown, Calendar, Clock, MapPin } from "lucide-react"
import { getCouple, getWeddingDetails, getWebsiteConfig } from "@/lib/config-utils"
import { useState, useEffect } from "react"

type TypingEffectProps = {
  messages: string[];
  typingSpeed?: number;
  pause?: number;
  eraseSpeed?: number;
};

function TypingEffect({ messages, typingSpeed = 70, pause = 1200, eraseSpeed = 40 }: TypingEffectProps) {
  const [displayed, setDisplayed] = useState("");
  const [msgIdx, setMsgIdx] = useState(0);
  const [typing, setTyping] = useState(true);
  const [charIdx, setCharIdx] = useState(0);

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined;
    if (typing) {
      if (charIdx < messages[msgIdx].length) {
        timeout = setTimeout(() => {
          setDisplayed((prev) => prev + messages[msgIdx][charIdx]);
          setCharIdx((prev) => prev + 1);
        }, typingSpeed);
      } else {
        timeout = setTimeout(() => setTyping(false), pause);
      }
    } else {
      if (charIdx > 0) {
        timeout = setTimeout(() => {
          setDisplayed((prev) => prev.slice(0, -1));
          setCharIdx((prev) => prev - 1);
        }, eraseSpeed);
      } else {
        setTyping(true);
        setMsgIdx((prev) => (prev + 1) % messages.length);
      }
    }
    return () => clearTimeout(timeout);
  }, [typing, charIdx, msgIdx, messages, typingSpeed, pause, eraseSpeed]);

  return (
    <h3 className="text-xl md:text-2xl font-light mb-4 min-h-[2.5rem]">
      {displayed}
      <span className="inline-block w-2 animate-pulse">|</span>
    </h3>
  );
}

export default function Home() {
  const couple = getCouple()
  const weddingDetails = getWeddingDetails()
  const { themeColors } = getWebsiteConfig()

  // Slideshow background images
  const backgroundImages = [
    "/img/background.png",
    "/img/background2.png",
    "/img/background3.png"
  ];
  const [bgIndex, setBgIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-rose-50/30">
      {/* Particles Background - Fixed Position */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Particles
          particleColors={['#f43f5e', '#f43f5e']}
          particleCount={200}
          particleSpread={20}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={false}
          alphaParticles={true}
          disableRotation={false}
        />
      </div>

      <Navbar />

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center text-center">
        {/* Rose Decorations in Corners */}
        <Image
          src="/img/flowerDeco.png"
          alt=""
          aria-hidden="true"
          width={120}
          height={120}
          className="absolute top-0 left-0 z-30 w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 rotate-80 scale-x-[-1]"
          priority
        />
        <Image
          src="/img/flowerDeco.png"
          alt=""
          aria-hidden="true"
          width={120}
          height={120}
          className="absolute top-0 right-0 z-30 w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 rotate-260"
          priority
        />
        <Image
          src="/img/flowerDeco.png"
          alt=""
          aria-hidden="true"
          width={120}
          height={120}
          className="absolute bottom-0 left-0 z-30 w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 -rotate-90 scale-x-[-1]"
          priority
        />
        <Image
          src="/img/flowerDeco.png"
          alt=""
          aria-hidden="true"
          width={120}
          height={120}
          className="absolute bottom-0 right-0 z-30 w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 rotate-90"
          priority
        />
        <div className="absolute inset-0 z-0">
          {backgroundImages.map((img, i) => (
            <Image
              key={img}
              src={img}
              alt="Wedding background"
              fill
              className={`object-cover brightness-90 transition-opacity duration-1000 ${i === bgIndex ? 'opacity-100' : 'opacity-0'}`}
              priority={i === 0}
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-black/20 z-10"></div>
        <div className="relative z-20 text-white max-w-3xl px-4 py-16">
          <div className="mb-4 flex justify-center">
            <Image
              src="/img/transparent-rose.png"
              alt="Decorative divider"
              width={120}
              height={30}
              className="opacity-80"
            />
          </div>
          <TypingEffect messages={["Finally! About time, right","We are getting married.", "You are invited.","Save the date","You're part of our story","Happily ever after starts here","Witness our \"I do\""]} />
          <h1 className="text-6xl md:text-7xl font-great-vibes mb-6">{couple.coupleNameDisplay}</h1>
          <div className="flex flex-col items-center space-y-4 mb-8">
            <div className="flex items-center space-x-1 text-sm md:text-2xl font-light">
              <Calendar className="h-5 w-5 text-white/90" />
              <span>{weddingDetails.dateDisplay}</span>
            </div>
            <div className="flex items-center space-x-1 text-sm md:text-2xl font-light">
              <MapPin className="h-5 w-5 text-white/90" />
              <span>{weddingDetails.ceremony.venue.name}</span>
            </div>
            <div className="flex items-center space-x-1 text-sm md:text-2xl font-light">
              <Clock className="h-5 w-5 text-white/90" />
              <span>{weddingDetails.ceremony.startTimeDisplay}</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <Button
              asChild
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/40 text-white rounded-none px-6 py-4 text-sm md:text-lg"
            >
              <a href="#rsvp">RSVP Now</a>
            </Button>
            <Button className="bg-rose-500/80 hover:bg-rose-500/90 backdrop-blur-sm text-white rounded-none px-6 py-4 text-sm md:text-lg">
              <a href="#couple">Our Story</a>
            </Button>
          </div>
        </div>

        {/* Scroll Down Indicator */}
        <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center animate-bounce">
          <a href="#countdown" className="text-white flex flex-col items-center">
            <span className="text-sm mb-2">Scroll Down</span>
            <ArrowDown className="h-6 w-6" />
          </a>
        </div>

        {/* Music Player (Fixed Position) */}
        <div className="fixed bottom-6 right-6 z-50">
          <MusicPlayer />
        </div>
      </section>

      {/* Countdown Section */}
      <section id="countdown" className="relative py-16 bg-gradient-to-b from-white via-rose-50 to-white overflow-visible flex flex-col items-center">
        {/* Background Flower Decoration - Responsive Positioning */}
        <div className="absolute bottom-0 left-1/2 md:left-auto md:right-0 md:bottom-8 -translate-x-1/2 md:translate-x-0 z-0 w-full md:w-auto flex justify-center md:justify-end pointer-events-none select-none">
          <Image
            src="/img/flower_zerobackground.png"
            alt="Floral wedding decoration background"
            width={600}
            height={400}
            className="w-[90vw] max-w-lg sm:max-w-xl md:max-w-xs lg:max-w-sm h-auto opacity-90 drop-shadow-xl md:opacity-80 md:w-64 md:max-w-[18rem] lg:w-80 lg:max-w-xs"
            style={{objectFit: 'contain'}}
            priority={false}
            aria-hidden="true"
          />
        </div>
        {/* Decorative Top Divider */}
        <div className="w-full flex justify-center mb-6 relative z-10">
          <div className="w-24 h-1 bg-rose-200 rounded-full" />
        </div>
        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center">
          <h2 className="text-rose-600 text-4xl md:text-5xl font-great-vibes text-center mb-4 drop-shadow-sm">Counting Down to Our Special Day</h2>
          <p className="text-center text-gray-500 text-base md:text-lg mb-8 max-w-xl">We can't wait to celebrate this beautiful moment with you. Join us as we count down to a day filled with love, laughter, and memories to cherish forever.</p>
          <div className="w-full flex justify-center mb-8">
            <CountdownTimer />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl w-full mx-auto mt-4">
            <div className="bg-white/80 rounded-xl shadow-md p-6 flex flex-col items-center border border-rose-100">
              <div className="flex justify-center items-center mb-3 w-12 h-12 bg-rose-50 rounded-full">
                <Calendar className="h-6 w-6 text-rose-600" />
              </div>
              <h3 className="text-base font-semibold mb-1 text-rose-700">Wedding Date</h3>
              <p className="text-gray-600 text-sm">{weddingDetails.dateDisplay}</p>
            </div>
            <div className="bg-white/80 rounded-xl shadow-md p-6 flex flex-col items-center border border-rose-100">
              <div className="flex justify-center items-center mb-3 w-12 h-12 bg-rose-50 rounded-full">
                <Clock className="h-6 w-6 text-rose-600" />
              </div>
              <h3 className="text-base font-semibold mb-1 text-rose-700">Wedding Ceremony</h3>
              <p className="text-gray-600 text-sm">{weddingDetails.ceremony.startTimeDisplay} - {weddingDetails.ceremony.endTimeDisplay}</p>
            </div>
            <div className="bg-white/80 rounded-xl shadow-md p-6 flex flex-col items-center border border-rose-100">
              <div className="flex justify-center items-center mb-3 w-12 h-12 bg-rose-50 rounded-full">
                <MapPin className="h-6 w-6 text-rose-600" />
              </div>
              <h3 className="text-base font-semibold mb-1 text-rose-700">{weddingDetails.ceremony.venue.name}</h3>
              <p className="text-gray-600 text-sm text-center">{weddingDetails.ceremony.venue.address}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Couple Section */}
      <section
        id="couple"
        className="relative py-20"
        style={{
          background: "radial-gradient(ellipse at center, #fff0f5 0%, #fdf6f9 60%, #f8e1e7 100%)",
        }}
      >
        {/* Subtle vignette overlay */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="w-full h-full bg-gradient-to-b from-transparent via-transparent to-rose-100 opacity-60"></div>
        </div>
        {/* Floral corners */}
        <Image
          src="/img/heart.png"
          alt=""
          width={140}
          height={140}
          className="absolute top-0 left-0 z-10 opacity-40"
          aria-hidden="true"
        />
        <Image
          src="/img/butterfly_deco.png"
          alt=""
          width={120}
          height={120}
          className="absolute bottom-0 right-0 z-10 opacity-30"
          aria-hidden="true"
        />
        {/* Section content */}
        <div className="relative z-20 container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-great-vibes text-center mb-16 text-rose-700 drop-shadow">
            The Happy Couple
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-5xl mx-auto items-center">
            {/* Partner 1 (Left) */}
            <div className="relative flex flex-col items-center text-center group">
              <div className="relative w-64 h-80 mb-6 flex items-center justify-center">
                <Image
                  src={couple.partner1.image || "/placeholder.svg"}
                  alt={couple.partner1.fullName}
                  fill
                  className="object-cover rounded-xl shadow-lg border-4 border-white transition-transform duration-300 group-hover:scale-105"
                />
                {/* Rose on left side */}
                <Image
                  src="/img/rose_deco.png"
                  alt="Rose decorative frame"
                  width={120}
                  height={240}
                  className="absolute left-[-40px] top-1/2 -translate-y-1/2 z-10 pointer-events-none select-none"
                  aria-hidden="true"
                />
              </div>
              <h3 className="text-2xl md:text-3xl font-great-vibes text-rose-700 mb-1">{couple.partner1.fullName}</h3>
              <div className="flex justify-center gap-1 mb-2">
                <span className="text-xs text-rose-400">•</span>
                <span className="text-xs text-rose-400">•</span>
                <span className="text-xs text-rose-400">•</span>
              </div>
              <p className="text-xs text-rose-500 uppercase tracking-wider mb-2">THE {couple.partner1.role.toUpperCase()}</p>
              <p className="mt-2 text-gray-700 max-w-xs mx-auto">{couple.partner1.bio}</p>
            </div>
            {/* Partner 2 (Right) */}
            <div className="relative flex flex-col items-center text-center group">
              <div className="relative w-64 h-80 mb-6 flex items-center justify-center">
                <Image
                  src={couple.partner2.image || "/placeholder.svg"}
                  alt={couple.partner2.fullName}
                  fill
                  className="object-cover rounded-xl shadow-lg border-4 border-white transition-transform duration-300 group-hover:scale-105"
                />
                {/* Rose on right side, mirrored */}
                <Image
                  src="/img/rose_deco.png"
                  alt="Rose decorative frame"
                  width={120}
                  height={240}
                  className="absolute right-[-40px] top-1/2 -translate-y-1/2 z-10 pointer-events-none select-none scale-x-[-1]"
                  aria-hidden="true"
                />
              </div>
              <h3 className="text-2xl md:text-3xl font-great-vibes text-rose-700 mb-1">{couple.partner2.fullName}</h3>
              <div className="flex justify-center gap-1 mb-2">
                <span className="text-xs text-rose-400">•</span>
                <span className="text-xs text-rose-400">•</span>
                <span className="text-xs text-rose-400">•</span>
              </div>
              <p className="text-xs text-rose-500 uppercase tracking-wider mb-2">THE {couple.partner2.role.toUpperCase()}</p>
              <p className="mt-2 text-gray-700 max-w-xs mx-auto">{couple.partner2.bio}</p>
            </div>
          </div>
          {/* Floral Divider */}
          <div className="flex justify-center mt-16">
            <Image
              src="/img/transparent-rose.png"
              alt="Floral divider"
              width={120}
              height={30}
              className="opacity-80"
              aria-hidden="true"
            />
          </div>
        </div>
      </section>

      {/* Couple Story Timeline */}
      <section id="story" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-rose-600 text-4xl text-3xl md:text-5xl font-great-vibes text-center mb-6">Our Love Story</h2>
          <p className="text-center text-gray-700 max-w-2xl mx-auto mb-16">
            Every love story is beautiful, but ours is our favorite. Here's a glimpse into our journey from the first
            meeting to our wedding day.
          </p>
          <CoupleStory />
        </div>
      </section>

      {/* Video Section */}
      <section id="video" className="py-20 bg-rose-50/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-great-vibes text-center mb-16">Our Prenup Video</h2>
          <VideoSection />
        </div>
      </section>

      {/* Wedding Party Section */}
      <section id="wedding-party" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-great-vibes text-center mb-16">Wedding Party</h2>
          <WeddingParty />
        </div>
      </section>

      {/* Photo Gallery Section */}
      <section id="gallery" className="py-20 bg-rose-50/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-great-vibes text-center mb-16">Our Moments</h2>
          <PhotoGallery />
          <div className="max-w-xl mx-auto text-center mt-12 bg-white p-8 shadow-sm">
            <p className="text-gray-600 italic">
              "A happy marriage is a long conversation which always seems too short."
            </p>
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <section id="rsvp" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-great-vibes text-center mb-16">RSVP</h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-center text-gray-700 mb-12">
              Please let us know if you'll be joining us on our special day by {weddingDetails.rsvpDeadlineDisplay}.
            </p>
            <div className="bg-white shadow-md rounded-lg p-8">
              <RSVPForm />
            </div>
          </div>
        </div>
      </section>

      {/* Registry Section */}
      <section id="registry" className="py-20 bg-rose-50/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-great-vibes text-center mb-16">Wedding Registry</h2>
          <Registry />
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-great-vibes text-center mb-16">Frequently Asked Questions</h2>
          <FAQ />
        </div>
      </section>

      {/* QR Code Section */}
      <section id="qr-code" className="py-20 bg-rose-50/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-great-vibes text-center mb-16">Share Our Website</h2>
          <QRCodeSection />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-rose-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-great-vibes mb-4">{couple.coupleNameDisplay}</h3>
          <p className="mb-6">We can't wait to celebrate with you!</p>
          <div className="flex justify-center space-x-4 mb-8">
            <a href={getWebsiteConfig().socialMedia.instagram} className="hover:text-rose-200 transition-colors">
              Instagram
            </a>
            <a href={getWebsiteConfig().socialMedia.facebook} className="hover:text-rose-200 transition-colors">
              Facebook
            </a>
            <a href={`mailto:${getWebsiteConfig().contactEmail}`} className="hover:text-rose-200 transition-colors">
              Contact Us
            </a>
          </div>
          <div className="flex justify-center mb-8">
            <Image
              src="/images/floral-divider.png"
              alt="Decorative divider"
              width={120}
              height={30}
              className="opacity-80"
            />
          </div>
          <p className="text-sm text-rose-200">
            © {new Date().getFullYear()} {couple.coupleNameDisplay} Wedding
          </p>
        </div>
      </footer>
    </main>
  )
}
