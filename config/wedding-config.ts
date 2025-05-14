import type { WeddingConfig } from "@/types/wedding-config"

/**
 * Wedding Configuration
 *
 * This file contains all the wedding-related details used throughout the website.
 * Update this file to make changes across the entire website.
 */

// Couple Information
export const couple = {
  partner1: {
    firstName: "Daniel",
    lastName: "Padilla",
    fullName: "Daniel Padilla",
    email: "daniel@example.com",
    phone: "+1 (555) 123-4567",
    bio: "Daniel John Elago Ford, known professionally as Daniel Padilla, is a Filipino actor and singer. He is a recipient of multiple accolades across television, film, and music, including the FAMAS Award for Best Actor and PMPC Star Award for Movie Actor of the Year, as well as three World Music Awards nominations.",
    image: "/img/groom.png",
    role: "Groom",
  },
  partner2: {
    firstName: "Kathryn",
    lastName: "Bernardo",
    fullName: "Kathryn Bernardo",
    email: "kathryn@example.com",
    phone: "+1 (555) 987-6543",
    bio: "She is the youngest of four siblings and was raised by her parents, Luzviminda and Teodore Bernardo. Initially, Bernardo was raised as a member of Iglesia ni Cristo. However, it is believed that she converted to born again around 2016",
    image: "/img/bride.png",
    role: "Bride",
  },
  // For display in various places (e.g., "Lance & Rosa")
  coupleNameDisplay: "Daniel & Kathryn",
  // For more formal displays (e.g., "Lance Johnson & Rosa Smith")
  coupleFullNameDisplay: "Daniel Padilla & Kathryn Bernardo",
  // For possessive forms (e.g., "Lance & Rosa's Wedding")
  coupleNamePossessive: "Daniel & Kathryn's",
  // Hashtag for social media
  hashtag: "#DanielAndKathryn2024",
}

// Parents Information
export const parents = {
  groomParents: {
    father: {
      name: "Rommel Padilla",
      role: "Father of the Groom",
      image: "/images/groom-father.jpg",
      relationship: "Father",
    },
    mother: {
      name: "Karla Estrada",
      role: "Mother of the Groom",
      image: "/images/groom-mother.jpg",
      relationship: "Mother",
    },
  },
  brideParents: {
    father: {
      name: "James Doe",
      role: "Father of the Bride",
      image: "/images/bride-father.jpg",
      relationship: "Father",
    },
    mother: {
      name: "Elizabeth Doe",
      role: "Mother of the Bride",
      image: "/images/bride-mother.jpg",
      relationship: "Mother",
    },
  },
}

// Wedding Details
export const weddingDetails = {
  date: "2025-08-12T16:00:00", // ISO format for easy date manipulation
  dateDisplay: "August 12, 2025",
  timeDisplay: "4:00 PM",
  rsvpDeadline: "2025-07-15",
  rsvpDeadlineDisplay: "July 15, 2025",

  // Ceremony
  ceremony: {
    startTime: "16:00",
    startTimeDisplay: "4:00 PM",
    endTime: "17:30",
    endTimeDisplay: "5:30 PM",
    venue: {
      name: "Sunset Gardens",
      address: "123 Wedding Lane, City, State, 12345",
      googleMapsUrl: "https://maps.google.com/?q=Sunset+Gardens",
      phone: "+1 (555) 555-5555",
      website: "https://www.sunsetgardens.com",
      coordinates: {
        latitude: 34.0522,
        longitude: -118.2437,
      },
    },
  },

  // Reception
  reception: {
    startTime: "18:00",
    startTimeDisplay: "6:00 PM",
    endTime: "23:00",
    endTimeDisplay: "11:00 PM",
    venue: {
      name: "Sunset Gardens Ballroom",
      address: "123 Wedding Lane, City, State, 12345",
      googleMapsUrl: "https://maps.google.com/?q=Sunset+Gardens",
      phone: "+1 (555) 555-5555",
      website: "https://www.sunsetgardens.com",
      coordinates: {
        latitude: 34.0522,
        longitude: -118.2437,
      },
    },
  },

  // Dress Code
  dressCode: "Formal Attire",
  dressCodeDescription:
    "Men are encouraged to wear suits or tuxedos, and women can wear cocktail dresses or evening gowns. The color theme is blush and gold, so feel free to incorporate these colors into your outfit if you wish.",

  // Additional Information
  additionalInfo: "Parking is available at the venue. The ceremony will be held outdoors, weather permitting.",
}

// RSVP Configuration
export const rsvpConfig = {
  googleFormUrl:
    "https://docs.google.com/forms/d/e/1FAIpQLSejSnwGH9gZJm_JuXrVq0yd8ncHKu5ZqyMKG-4bcw2zOtWKJw/formResponse",
  googleSheetUrl:
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vSvwEIvTyS6nA_UhkWiqUwU9gNe5wfTSO144N_rul9eNrhsRE48mDLFIOmCFVhiFEBbMwCHftLvU5Dp/pubhtml",
  googleScriptUrl:
    "https://script.google.com/macros/s/AKfycbyds6WEYLzHKj-1P9NMIJllY0F1pLBgPJNCcL_CjyUM9EUAmwGVpsx4bf7AfTMgCDjU9A/exec",
  formFields: {
    name: "entry.405401269",
    email: "entry.1755234596",
    guestCount: "entry.1335956832",
    message: "entry.893740636",
  },
  maxGuestCount: 10,
  storageKey: "wedding-rsvp-entries",
}

// Registry Information
export const registryConfig = {
  message:
    "Your presence at our wedding is the greatest gift of all. However, if you wish to honor us with a gift, we've created a monetary registry to help us build our new life together.",
  paymentOptions: [
    {
      name: "GCash",
      logo: "/img/gcashLogo.png",
      accountName: "Lance Johnson",
      accountNumber: "0917 123 4567",
      QRimage: "/images/QRlogo.png",
    },
    {
      name: "Bank Transfer",
      logo: "/images/bank-logo.png",
      accountName: "Lance Johnson",
      accountNumber: "1234 5678 9012 3456",
      bankName: "Metro Bank",
    },
    {
      name: "PayMaya",
      logo: "/images/paymaya-logo.png",
      accountName: "Lance Johnson",
      accountNumber: "0917 987 6543",
      QRimage: "/img/mayalogo.png",
    },
  ],
  thankYouMessage: "Thank you for your generosity and for celebrating this special day with us.",
}

// Love Story Timeline
export const loveStoryEvents = [
  {
    date: "January 2020",
    title: "First Meeting",
    description:
      "We first met at a mutual friend's birthday party. Lance spilled his drink on Rosa's dress, and that's how our conversation started. What began as an awkward apology turned into hours of laughter and connection.",
    image: "/img/firstMeeting.png",
    location: "Skyline Rooftop Bar",
    color: "bg-pink-100 text-pink-600",
  },
  {
    date: "February 2020",
    title: "First Date",
    description:
      "Our first date was at a small coffee shop downtown. We talked for hours and didn't realize how much time had passed. The barista had to politely let us know they were closing. We walked through the park afterward, not wanting the evening to end.",
    image: "/img/first_Date.png",
    location: "Brew & Bean Café",
    color: "bg-amber-100 text-amber-600",
  },
  {
    date: "June 2021",
    title: "Moving In Together",
    description:
      "After dating for over a year, we decided to take the next step and move in together. It was a big decision that brought us even closer. Combining our furniture was a challenge, but creating our first home together was worth every moment of compromise.",
    image: "/img/moving_together.png",
    location: "Our First Apartment",
    color: "bg-blue-100 text-blue-600",
  },
  {
    date: "December 2023",
    title: "The Proposal",
    description:
      "Lance proposed during our vacation in Bali. It was sunset, and we were walking along the beach when he got down on one knee. The ring was hidden in a seashell he asked Rosa to pick up. She was completely surprised and of course said yes!",
    image: "/img/proposal.png",
    location: "Uluwatu Beach, Bali",
    color: "bg-violet-100 text-violet-600",
  },
  {
    date: "August 2024",
    title: "Wedding Day",
    description:
      "The day we've been waiting for! We're excited to celebrate our love with family and friends at Sunset Gardens. We've planned every detail to reflect our journey together and create memories that will last a lifetime.",
    image: "/img/wedding_day.png",
    location: "Sunset Gardens",
    color: "bg-rose-100 text-rose-600",
  },
]

// Wedding Party
export const weddingParty = {
  brideParty: [
    {
      name: "Sarah Johnson",
      role: "Maid of Honor",
      image: "/img/bridesmade.png",
      relationship: "Jane's sister and closest confidante",
    },
    {
      name: "Emily Wilson",
      role: "Bridesmaid",
      image: "/img/woman.png",
      relationship: "Best friend from art school",
    },
    {
      name: "Jessica Taylor",
      role: "Bridesmaid",
      image: "/img/woman.png",
      relationship: "Cousin and childhood friend",
    },
    {
      name: "Roselyn Padilla",
      role: "Bridesmaid",
      image: "/img/woman.png",
      relationship: "Cousin and childhood friend",
    },
    {
      name: "Emily Wilson",
      role: "Bridesmaid",
      image: "/img/woman.png",
      relationship: "Best friend from art school",
    },
    {
      name: "Jessica Taylor",
      role: "Bridesmaid",
      image: "/img/woman.png",
      relationship: "Cousin and childhood friend",
    },
    {
      name: "Roselyn Padilla",
      role: "Bridesmaid",
      image: "/img/woman.png",
      relationship: "Cousin and childhood friend",
    },
  ],
  groomParty: [
    {
      name: "Michael Brown",
      role: "Best Man",
      image: "/img/bestman.png",
      relationship: "John's best friend since college",
    },
    {
      name: "David Lee",
      role: "Groomsman",
      image: "/img/man.png",
      relationship: "College roommate",
    },
    {
      name: "Richard Wilson",
      role: "Groomsman",
      image: "/img/man.png",
      relationship: "Childhood friend",
    },
    {
      name: "Richard Wilson",
      role: "Groomsman",
      image: "/img/man.png",
      relationship: "Childhood friend",
    },
    {
      name: "Richard Wilson",
      role: "Groomsman",
      image: "/img/man.png",
      relationship: "Childhood friend",
    },
    
    {
      name: "Richard Wilson",
      role: "Groomsman",
      image: "/img/man.png",
      relationship: "Childhood friend",
    },
    
    {
      name: "Richard Wilson",
      role: "Groomsman",
      image: "/img/man.png",
      relationship: "Childhood friend",
    },
  ],
  bearers: {
    ringBearer: {
      name: "Tommy Wilson",
      role: "Ring Bearer",
      image: "/images/ring-bearer.jpg",
      relationship: "The groom's nephew",
    },
    coinBearer: {
      name: "Jimmy Parker",
      role: "Coin Bearer",
      image: "/images/coin-bearer.jpg",
      relationship: "The bride's nephew",
    },
    bibleBearer: {
      name: "Billy Thompson",
      role: "Bible Bearer",
      image: "/images/bible-bearer.jpg",
      relationship: "The groom's cousin",
    },
  },
  flowerGirls: [
    {
      name: "Lily Anderson",
      role: "Flower Girl",
      image: "/images/flower-girl-1.jpg",
      relationship: "The bride's niece",
    },
    {
      name: "Rose Martinez",
      role: "Flower Girl",
      image: "/images/flower-girl-2.jpg",
      relationship: "The groom's niece",
    },
  ],
  sponsors: {
    veil: [
      {
        name: "Thomas Anderson",
        role: "Veil Sponsor",
        image: "/images/veil-sponsor-1.jpg",
        relationship: "Family friend",
      },
      {
        name: "Margaret Anderson",
        role: "Veil Sponsor",
        image: "/images/veil-sponsor-2.jpg",
        relationship: "Family friend",
      },
    ],
    cord: [
      {
        name: "Robert Wilson",
        role: "Cord Sponsor",
        image: "/images/cord-sponsor-1.jpg",
        relationship: "Uncle of the groom",
      },
      {
        name: "Patricia Wilson",
        role: "Cord Sponsor",
        image: "/images/cord-sponsor-2.jpg",
        relationship: "Aunt of the groom",
      },
    ],
    candle: [
      {
        name: "William Taylor",
        role: "Candle Sponsor",
        image: "/images/candle-sponsor-1.jpg",
        relationship: "Uncle of the bride",
      },
      {
        name: "Catherine Taylor",
        role: "Candle Sponsor",
        image: "/images/candle-sponsor-2.jpg",
        relationship: "Aunt of the bride",
      },
    ],
    principal: [
      {
        name: "Thomas Anderson",
        role: "Principal Sponsor",
        image: "/images/principal-sponsor-1.jpg",
        relationship: "Godfather, Mentor and family friend",
      },
      {
        name: "Margaret Anderson",
        role: "Principal Sponsor",
        image: "/images/principal-sponsor-2.jpg",
        relationship: "Godmother, Family friend and spiritual guide",
      },
      {
        name: "William Taylor",
        role: "Principal Sponsor",
        image: "/images/principal-sponsor-3.jpg",
        relationship: "Godfather, Business mentor",
      },
      {
        name: "Patricia Taylor",
        role: "Principal Sponsor",
        image: "/images/principal-sponsor-4.jpg",
        relationship: "Godmother",
      },
    ],
  },
}

// FAQ Questions
export const faqQuestions = [
  {
    question: "What is the dress code for the wedding?",
    answer: weddingDetails.dressCodeDescription,
  },
  {
    question: "Can I bring a plus one?",
    answer:
      "We have allocated a certain number of guests for our wedding. Please refer to your invitation to see if a plus one is included. If your invitation does not specify a plus one, we kindly ask that you respect our wishes and attend solo.",
  },
  {
    question: "Are children welcome at the wedding?",
    answer:
      "While we love your little ones, our wedding is an adult-only affair. We hope this gives you an opportunity to let loose and enjoy the evening. If you need help finding childcare, please let us know and we'll be happy to provide recommendations.",
  },
  {
    question: "What time should I arrive at the ceremony?",
    answer: `The ceremony will begin promptly at ${weddingDetails.ceremony.startTimeDisplay}. We recommend arriving at least 30 minutes early to find parking, get seated, and settle in before the ceremony begins.`,
  },
  {
    question: "Will there be transportation provided between the ceremony and reception?",
    answer:
      "Yes, we will provide shuttle service between the ceremony and reception venues. The shuttles will depart from the ceremony venue starting at 5:30 PM and will run continuously until 6:30 PM.",
  },
  {
    question: "How do I RSVP?",
    answer: `You can RSVP through our website by clicking the 'RSVP' button in the navigation menu. Please RSVP by ${weddingDetails.rsvpDeadlineDisplay}, so we can finalize our arrangements.`,
  },
  {
    question: "Is there parking available at the venue?",
    answer:
      "Yes, complimentary parking is available at both the ceremony and reception venues. Valet parking will also be available at the reception venue for a fee.",
  },
  {
    question: "What if I have dietary restrictions?",
    answer:
      "We want everyone to enjoy the meal at our reception. Please indicate any dietary restrictions or allergies when you RSVP, and we will do our best to accommodate your needs.",
  },
]

// Website Configuration
export const websiteConfig = {
  title: `${couple.coupleNameDisplay} Wedding`,
  description: `Join us in celebrating the wedding of ${couple.coupleFullNameDisplay} on ${weddingDetails.dateDisplay}`,
  ogImage: "/images/og-image.jpg",
  themeColors: {
    primary: {
      50: "#fff1f2",
      100: "#ffe4e6",
      200: "#fecdd3",
      300: "#fda4af",
      400: "#fb7185",
      500: "#f43f5e",
      600: "#e11d48",
      700: "#be123c",
      800: "#9f1239",
      900: "#881337",
    },
    secondary: {
      50: "#fdf2f8",
      100: "#fce7f3",
      200: "#fbcfe8",
      300: "#f9a8d4",
      400: "#f472b6",
      500: "#ec4899",
      600: "#db2777",
      700: "#be185d",
      800: "#9d174d",
      900: "#831843",
    },
    accent: {
      50: "#fffbeb",
      100: "#fef3c7",
      200: "#fde68a",
      300: "#fcd34d",
      400: "#fbbf24",
      500: "#f59e0b",
      600: "#d97706",
      700: "#b45309",
      800: "#92400e",
      900: "#78350f",
    },
    neutral: {
      50: "#fafafa",
      100: "#f5f5f5",
      200: "#e5e5e5",
      300: "#d4d4d4",
      400: "#a3a3a3",
      500: "#737373",
      600: "#525252",
      700: "#404040",
      800: "#262626",
      900: "#171717",
    },
  },
  fonts: {
    heading: {
      family: "Great Vibes",
      weight: "400",
      style: "normal",
      sizes: {
        h1: "text-5xl md:text-7xl",
        h2: "text-3xl md:text-5xl",
        h3: "text-2xl md:text-3xl",
        h4: "text-xl md:text-2xl",
      },
    },
    body: {
      family: "Inter",
      weight: {
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
      },
      style: "normal",
      sizes: {
        xs: "text-xs",
        sm: "text-sm",
        base: "text-base",
        lg: "text-lg",
        xl: "text-xl",
      },
    },
  },
  spacing: {
    section: "py-16 md:py-20",
    container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
  },
  borderRadius: {
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-full",
  },
  shadows: {
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
  },
  socialMedia: {
    instagram: "https://instagram.com/lanceandrosa",
    facebook: "https://facebook.com/lanceandrosa",
  },
  contactEmail: "wedding@lanceandrosa.com",
}

// Navigation Links
export const navigationLinks = [
  { name: "Home", href: "#home" },
  { name: "Countdown", href: "#countdown" },
  { name: "Couple", href: "#couple" },
  { name: "Story", href: "#story" },
  { name: "Video", href: "#video" },
  { name: "Wedding Party", href: "#wedding-party" },
  { name: "Gallery", href: "#gallery" },
  { name: "RSVP", href: "#rsvp" },
  { name: "Registry", href: "#registry" },
  { name: "FAQ", href: "#faq" },
]

// Gallery Images
export const galleryImages = [
  {
    id: 1,
    src: "/images/gallery-1.jpg",
    alt: "Couple at sunset",
    width: 600,
    height: 400,
    span: "none",
  },
  {
    id: 2,
    src: "/images/gallery-2.jpg",
    alt: "Couple holding hands",
    width: 600,
    height: 800,
    span: "row",
  },
  {
    id: 3,
    src: "/images/gallery-3.jpg",
    alt: "Couple in the park",
    width: 600,
    height: 400,
    span: "none",
  },
  {
    id: 4,
    src: "/images/gallery-4.jpg",
    alt: "Couple walking",
    width: 600,
    height: 800,
    span: "row",
  },
  {
    id: 5,
    src: "/images/gallery-5.jpg",
    alt: "Couple at beach",
    width: 1200,
    height: 600,
    span: "col",
  },
  {
    id: 6,
    src: "/images/gallery-6.jpg",
    alt: "Couple dancing",
    width: 600,
    height: 400,
    span: "none",
  },
  {
    id: 7,
    src: "/images/gallery-7.jpg",
    alt: "Couple laughing",
    width: 600,
    height: 400,
    span: "none",
  },
  {
    id: 8,
    src: "/images/gallery-8.jpg",
    alt: "Couple at dinner",
    width: 600,
    height: 800,
    span: "row",
  },
  {
    id: 9,
    src: "/images/gallery-9.jpg",
    alt: "Couple portrait",
    width: 1200,
    height: 600,
    span: "col",
  },
]

// Export a default config object with all configurations
const weddingConfig: WeddingConfig = {
  couple,
  parents,
  weddingDetails,
  rsvpConfig,
  registryConfig,
  loveStoryEvents,
  weddingParty,
  faqQuestions,
  websiteConfig,
  galleryImages,
  navigationLinks,
}

export default weddingConfig
