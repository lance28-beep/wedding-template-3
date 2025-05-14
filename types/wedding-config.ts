export interface Person {
  name: string
  role: string
  image?: string
  relationship: string
  message?: string
}

export interface Parent {
  name: string
  role: string
  image: string
  relationship: string
}

export interface Parents {
  groomParents: {
    father: Parent
    mother: Parent
  }
  brideParents: {
    father: Parent
    mother: Parent
  }
}

export interface WeddingPartyMember extends Person {
  name: string
  role: string
  image: string
  relationship: string
}

export interface Bearers {
  ringBearer: Person
  coinBearer: Person
  bibleBearer: Person
}

export interface Sponsors {
  veil: Person[]
  cord: Person[]
  candle: Person[]
  principal: Person[]
}

export interface WeddingParty {
  brideParty: WeddingPartyMember[]
  groomParty: WeddingPartyMember[]
  bearers: Bearers
  flowerGirls: WeddingPartyMember[]
  sponsors: Sponsors
}

export interface Partner {
  firstName: string
  lastName: string
  fullName: string
  email: string
  phone: string
  bio: string
  image: string
  role: string
}

export interface Couple {
  partner1: Partner
  partner2: Partner
  coupleNameDisplay: string
  coupleFullNameDisplay: string
  coupleNamePossessive: string
  hashtag: string
}

export interface LoveStoryEvent {
  date: string
  title: string
  description: string
  image: string
  location: string
  color: string
}

export interface WeddingConfig {
  couple: Couple
  parents: Parents
  weddingParty: WeddingParty
  weddingDetails: any // You can expand this type as needed
  rsvpConfig: any // You can expand this type as needed
  registryConfig: any // You can expand this type as needed
  websiteConfig: any // You can expand this type as needed
  navigationLinks: any // You can expand this type as needed
  loveStoryEvents: LoveStoryEvent[]
  faqQuestions: any // You can expand this type as needed
  galleryImages: any // You can expand this type as needed
} 