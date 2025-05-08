"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Check,
  Loader2,
  Heart,
  ExternalLink,
  RefreshCw,
  Plus,
  Minus,
  AlertTriangle,
  Clock,
  Users,
  Mail,
  MessageSquare,
  Edit,
  Save,
  Trash2,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import InfiniteGuestMarquee from "@/components/infinite-guest-marquee"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import { v4 as uuidv4 } from "uuid"
import { getRsvpConfig, getWeddingDetails, getCoupleInfo } from "@/lib/config-utils"
import { hasRsvpDeadlinePassed, getRemainingTimeUntilDeadline } from "@/lib/date-utils"

// Get configuration
const rsvpConfig = getRsvpConfig()
const weddingDetails = getWeddingDetails()
const coupleInfo = getCoupleInfo()

// Form schema
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  attending: z.enum(["yes", "no"], {
    required_error: "Please select if you're attending",
  }),
  guestCount: z
    .string()
    .refine((val) => !isNaN(Number.parseInt(val)), {
      message: "Please enter a valid number",
    })
    .refine((val) => Number.parseInt(val) >= 1, {
      message: "Minimum 1 guest",
    })
    .refine((val) => Number.parseInt(val) <= rsvpConfig.maxGuestCount, {
      message: `Maximum ${rsvpConfig.maxGuestCount} guests`,
    }),
  additionalGuests: z
    .array(
      z.object({
        name: z.string().min(2, { message: "Guest name must be at least 2 characters" }),
        relationship: z.string().optional(),
      }),
    )
    .optional(),
  dietaryRestrictions: z.string().optional(),
  songRequest: z.string().optional(),
  message: z.string().optional(),
})

// RSVP Entry type
type RSVPEntry = {
  id: string
  name: string
  email: string
  attending: "yes" | "no"
  guestCount: number
  additionalGuests?: { name: string; relationship?: string }[]
  dietaryRestrictions?: string
  songRequest?: string
  message?: string
  date: string
  source: "api" | "local"
}

// Meal option type
type MealOption = {
  id: string
  name: string
  description: string
  dietaryInfo: string[]
}

// Sample meal options
const mealOptions: MealOption[] = [
  {
    id: "chicken",
    name: "Herb Roasted Chicken",
    description: "Tender chicken breast with rosemary and thyme, served with roasted vegetables",
    dietaryInfo: ["Gluten-Free"],
  },
  {
    id: "beef",
    name: "Filet Mignon",
    description: "Premium cut beef with red wine reduction, served with garlic mashed potatoes",
    dietaryInfo: ["Gluten-Free"],
  },
  {
    id: "fish",
    name: "Grilled Salmon",
    description: "Fresh Atlantic salmon with lemon butter sauce, served with wild rice pilaf",
    dietaryInfo: ["Gluten-Free", "Pescatarian"],
  },
  {
    id: "vegetarian",
    name: "Vegetable Wellington",
    description: "Roasted vegetables wrapped in puff pastry, served with a tomato coulis",
    dietaryInfo: ["Vegetarian"],
  },
  {
    id: "vegan",
    name: "Stuffed Bell Peppers",
    description: "Bell peppers filled with quinoa, black beans, and vegetables",
    dietaryInfo: ["Vegan", "Gluten-Free"],
  },
]

export default function RSVPForm() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rsvpEntries, setRsvpEntries] = useState<RSVPEntry[]>([])
  const [totalGuests, setTotalGuests] = useState(0)
  const [activeTab, setActiveTab] = useState("form")
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isDeadlinePassed, setIsDeadlinePassed] = useState(false)
  const [remainingTime, setRemainingTime] = useState("")
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [formData, setFormData] = useState<z.infer<typeof formSchema> | null>(null)
  const [additionalGuestsCount, setAdditionalGuestsCount] = useState(0)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingEntry, setEditingEntry] = useState<RSVPEntry | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deletingEntry, setDeletingEntry] = useState<RSVPEntry | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredEntries, setFilteredEntries] = useState<RSVPEntry[]>([])
  const [attendanceFilter, setAttendanceFilter] = useState<"all" | "attending" | "not-attending">("all")

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      attending: "yes",
      guestCount: "1",
      additionalGuests: [],
      dietaryRestrictions: "",
      songRequest: "",
      message: "",
    },
  })

  // Initialize edit form
  const editForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      attending: "yes",
      guestCount: "1",
      additionalGuests: [],
      dietaryRestrictions: "",
      songRequest: "",
      message: "",
    },
  })

  // Watch for changes in the attending field
  const attending = form.watch("attending")
  const guestCount = form.watch("guestCount")

  // Update additional guests count when guest count changes
  useEffect(() => {
    const count = Number.parseInt(guestCount || "1", 10) - 1
    setAdditionalGuestsCount(count > 0 ? count : 0)

    // Reset additional guests array if count is 0
    if (count <= 0) {
      form.setValue("additionalGuests", [])
    } else {
      // Ensure the array has the correct number of elements
      const currentGuests = form.getValues("additionalGuests") || []
      const newGuests = [...currentGuests]

      // Add empty guests if needed
      while (newGuests.length < count) {
        newGuests.push({ name: "", relationship: "" })
      }

      // Remove extra guests if needed
      if (newGuests.length > count) {
        newGuests.length = count
      }

      form.setValue("additionalGuests", newGuests)
    }
  }, [guestCount, form])

  // Check if RSVP deadline has passed and calculate remaining time
  useEffect(() => {
    const deadlinePassed = hasRsvpDeadlinePassed()
    console.log("RSVP Deadline:", weddingDetails.rsvpDeadline)
    console.log("Current date:", new Date().toISOString())
    console.log("Is deadline passed:", deadlinePassed)
    setIsDeadlinePassed(deadlinePassed)

    if (!deadlinePassed) {
      setRemainingTime(getRemainingTimeUntilDeadline())

      // Update remaining time every minute
      const interval = setInterval(() => {
        setRemainingTime(getRemainingTimeUntilDeadline())
        // Check if deadline has passed during the interval
        if (hasRsvpDeadlinePassed()) {
          setIsDeadlinePassed(true)
          clearInterval(interval)
        }
      }, 60000)

      return () => clearInterval(interval)
    }
  }, [])

  // Filter entries when search term or attendance filter changes
  useEffect(() => {
    let filtered = [...rsvpEntries]

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (entry) => entry.name.toLowerCase().includes(term) || entry.email.toLowerCase().includes(term),
      )
    }

    // Apply attendance filter
    if (attendanceFilter === "attending") {
      filtered = filtered.filter((entry) => entry.attending === "yes")
    } else if (attendanceFilter === "not-attending") {
      filtered = filtered.filter((entry) => entry.attending === "no")
    }

    setFilteredEntries(filtered)
  }, [rsvpEntries, searchTerm, attendanceFilter])

  // Fetch RSVP entries from Google Apps Script endpoint
  const fetchAndUpdateEntries = async () => {
    setIsLoading(true)
    setIsRefreshing(true)
    setError(null)

    try {
      // Fetch from Google Apps Script endpoint
      const response = await fetch(rsvpConfig.googleScriptUrl, { cache: "no-store" })
      if (!response.ok) throw new Error("Failed to fetch guest list from Google Sheet")
      const data = await response.json()
      const rows: string[][] = data.GoogleSheetData
      if (!Array.isArray(rows) || rows.length < 2) throw new Error("No RSVP data found")

      // The first row is the header
      const header = rows[0]
      const entries = rows.slice(1)

      // Map Google Sheet rows to RSVPEntry objects
      const apiEntries: RSVPEntry[] = entries.map((row, idx) => {
        const rowObj: Record<string, string> = {}
        header.forEach((col, i) => {
          rowObj[col] = row[i] || ""
        })

        // Parse additional guests if available
        let additionalGuests: { name: string; relationship?: string }[] = []
        try {
          if (rowObj["Additional Guests"]) {
            additionalGuests = JSON.parse(rowObj["Additional Guests"])
          }
        } catch (e) {
          console.error("Failed to parse additional guests:", e)
        }

        return {
          id: `api-${idx}-${rowObj["Email"] || rowObj["Full Name"] || idx}`,
          name: rowObj["Full Name"] || "Guest",
          email: rowObj["Email"] || `no-email-${idx}@example.com`,
          attending: (rowObj["Attending"] || "yes").toLowerCase() === "yes" ? "yes" : "no",
          guestCount: Number.parseInt(rowObj["Number Of Guests"] || "1"),
          additionalGuests,
          dietaryRestrictions: rowObj["Dietary Restrictions"] || undefined,
          songRequest: rowObj["Song Request"] || undefined,
          message: rowObj["Message"] || undefined,
          date: rowObj["Timestamp"] || new Date().toISOString(),
          source: "api",
        }
      })

      // Set state directly from API
      setRsvpEntries(apiEntries)
      setTotalGuests(apiEntries.reduce((sum, entry) => (entry.attending === "yes" ? sum + entry.guestCount : sum), 0))

      // Show success toast when refreshing
      if (isRefreshing) {
        toast({
          title: "Guest list updated",
          description: `${apiEntries.length} responses loaded successfully.`,
        })
      }
    } catch (error) {
      console.error("Failed to load entries:", error)
      setError("Failed to load entries. Please try again.")

      // Try to load from localStorage as fallback
      try {
        const savedEntries = localStorage.getItem(rsvpConfig.storageKey)
        if (savedEntries) {
          const parsedEntries: RSVPEntry[] = JSON.parse(savedEntries)
          setRsvpEntries(parsedEntries)
          setTotalGuests(
            parsedEntries.reduce((sum, entry) => (entry.attending === "yes" ? sum + entry.guestCount : sum), 0),
          )
        } else {
          setRsvpEntries([])
          setTotalGuests(0)
        }
      } catch (localError) {
        console.error("Failed to load from localStorage:", localError)
        setRsvpEntries([])
        setTotalGuests(0)
      }

      if (isRefreshing) {
        toast({
          title: "Failed to update",
          description: "Could not load the latest guest list. Please try again.",
          variant: "destructive",
        })
      }
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  // Load saved entries on component mount
  useEffect(() => {
    fetchAndUpdateEntries()

    // Set up event listener for RSVP updates
    const handleRsvpUpdate = () => {
      fetchAndUpdateEntries()
    }

    window.addEventListener("rsvpUpdated", handleRsvpUpdate)

    return () => {
      window.removeEventListener("rsvpUpdated", handleRsvpUpdate)
    }
  }, [])

  // Handle form submission
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setFormData(values)
    setShowConfirmDialog(true)
  }

  // Submit form to Google Forms
  const submitRSVP = async () => {
    if (!formData) return

    setIsSubmitting(true)
    setError(null)
    setShowConfirmDialog(false)

    try {
      console.log("Submitting RSVP form...", formData)

      // Create form data for Google Form submission
      const formData2 = new URLSearchParams()
      formData2.append(rsvpConfig.formFields.name, formData.name) // Full Name
      formData2.append(rsvpConfig.formFields.email, formData.email) // Email
      formData2.append("entry.attending", formData.attending) // Attending
      formData2.append(rsvpConfig.formFields.guestCount, formData.guestCount) // Number of Guests

      // Add additional guests as JSON string
      if (formData.additionalGuests && formData.additionalGuests.length > 0) {
        formData2.append("entry.additionalGuests", JSON.stringify(formData.additionalGuests))
      }

      // Add dietary restrictions
      if (formData.dietaryRestrictions) {
        formData2.append("entry.dietaryRestrictions", formData.dietaryRestrictions)
      }

      // Add song request
      if (formData.songRequest) {
        formData2.append("entry.songRequest", formData.songRequest)
      }

      // Add message
      if (formData.message) {
        formData2.append(rsvpConfig.formFields.message, formData.message)
      }

      // Submit to Google Form using a hidden iframe
      const formElement = document.createElement("form")
      formElement.method = "POST"
      formElement.action = rsvpConfig.googleFormUrl
      formElement.target = "hidden-iframe"
      formElement.style.display = "none"

      // Add form fields
      for (const [key, value] of formData2.entries()) {
        const input = document.createElement("input")
        input.type = "hidden"
        input.name = key
        input.value = value
        formElement.appendChild(input)
      }

      // Create hidden iframe if it doesn't exist
      let iframe = document.getElementById("hidden-iframe") as HTMLIFrameElement
      if (!iframe) {
        iframe = document.createElement("iframe")
        iframe.name = "hidden-iframe"
        iframe.id = "hidden-iframe"
        iframe.style.display = "none"
        document.body.appendChild(iframe)
      }

      // Add form to document and submit
      document.body.appendChild(formElement)
      formElement.submit()
      document.body.removeChild(formElement)

      // Create a new entry from the submitted data
      const newEntry: RSVPEntry = {
        id: uuidv4(),
        name: formData.name,
        email: formData.email,
        attending: formData.attending,
        guestCount: Number.parseInt(formData.guestCount) || 1,
        additionalGuests: formData.additionalGuests,
        dietaryRestrictions: formData.dietaryRestrictions,
        songRequest: formData.songRequest,
        message: formData.message,
        date: new Date().toLocaleString("en-US", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
        }),
        source: "local",
      }

      // Get existing entries
      let existingEntries: RSVPEntry[] = []
      try {
        const savedEntries = localStorage.getItem(rsvpConfig.storageKey)
        if (savedEntries) {
          existingEntries = JSON.parse(savedEntries)
        }
      } catch (error) {
        console.error("Failed to load saved entries:", error)
      }

      // Add the new entry
      const updatedEntries = [newEntry, ...existingEntries]

      // Save to localStorage
      try {
        localStorage.setItem(rsvpConfig.storageKey, JSON.stringify(updatedEntries))
        console.log("Saved updated entries to localStorage")

        // Update state
        setRsvpEntries((prev) => [newEntry, ...prev])
        setTotalGuests((prev) =>
          formData.attending === "yes" ? prev + (Number.parseInt(formData.guestCount) || 1) : prev,
        )

        // Dispatch a custom event to notify other components of the update
        window.dispatchEvent(new Event("rsvpUpdated"))
      } catch (error) {
        console.error("Failed to save to localStorage:", error)
      }

      // Show success message and reset form
      setIsSuccess(true)
      form.reset()

      toast({
        title: "RSVP Submitted",
        description: "Thank you for your response!",
      })

      // Switch to responses tab after successful submission
      setTimeout(() => {
        setActiveTab("responses")
      }, 1500)

      // Fetch updated data after a delay to allow Google Sheets to update
      setTimeout(() => {
        fetchAndUpdateEntries()
      }, 5000) // Try after 5 seconds to get the updated list
    } catch (error) {
      console.error("Error submitting form:", error)
      setError("There was a problem submitting your RSVP. Please try again.")

      toast({
        title: "Submission failed",
        description: "There was a problem submitting your RSVP. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
      setFormData(null)
      // Reset success message after a delay
      setTimeout(() => {
        setIsSuccess(false)
      }, 5000)
    }
  }

  // Open Google Sheet in new tab
  const openGoogleSheet = () => {
    window.open(rsvpConfig.googleSheetUrl, "_blank")
  }

  // Refresh the guest list
  const refreshGuestList = () => {
    setIsRefreshing(true)
    fetchAndUpdateEntries()
  }

  // Handle edit entry
  const handleEditEntry = (entry: RSVPEntry) => {
    setEditingEntry(entry)

    // Set form values
    editForm.reset({
      name: entry.name,
      email: entry.email,
      attending: entry.attending,
      guestCount: entry.guestCount.toString(),
      additionalGuests: entry.additionalGuests || [],
      dietaryRestrictions: entry.dietaryRestrictions || "",
      songRequest: entry.songRequest || "",
      message: entry.message || "",
    })

    setShowEditDialog(true)
  }

  // Save edited entry
  const saveEditedEntry = async (values: z.infer<typeof formSchema>) => {
    if (!editingEntry) return

    setIsSubmitting(true)
    setError(null)

    try {
      // Create updated entry
      const updatedEntry: RSVPEntry = {
        ...editingEntry,
        name: values.name,
        email: values.email,
        attending: values.attending,
        guestCount: Number.parseInt(values.guestCount) || 1,
        additionalGuests: values.additionalGuests,
        dietaryRestrictions: values.dietaryRestrictions,
        songRequest: values.songRequest,
        message: values.message,
        date: new Date().toLocaleString("en-US", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
        }),
      }

      // Get existing entries
      let existingEntries: RSVPEntry[] = []
      try {
        const savedEntries = localStorage.getItem(rsvpConfig.storageKey)
        if (savedEntries) {
          existingEntries = JSON.parse(savedEntries)
        }
      } catch (error) {
        console.error("Failed to load saved entries:", error)
      }

      // Update the entry
      const updatedEntries = existingEntries.map((entry) => (entry.id === editingEntry.id ? updatedEntry : entry))

      // Save to localStorage
      try {
        localStorage.setItem(rsvpConfig.storageKey, JSON.stringify(updatedEntries))
        console.log("Saved updated entries to localStorage")

        // Update state
        setRsvpEntries(updatedEntries)
        setTotalGuests(
          updatedEntries.reduce((sum, entry) => (entry.attending === "yes" ? sum + entry.guestCount : sum), 0),
        )

        // Dispatch a custom event to notify other components of the update
        window.dispatchEvent(new Event("rsvpUpdated"))
      } catch (error) {
        console.error("Failed to save to localStorage:", error)
      }

      toast({
        title: "RSVP Updated",
        description: "Your RSVP has been successfully updated.",
      })

      setShowEditDialog(false)
      setEditingEntry(null)
    } catch (error) {
      console.error("Error updating RSVP:", error)
      setError("There was a problem updating your RSVP. Please try again.")

      toast({
        title: "Update failed",
        description: "There was a problem updating your RSVP. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle delete entry
  const handleDeleteEntry = (entry: RSVPEntry) => {
    setDeletingEntry(entry)
    setShowDeleteDialog(true)
  }

  // Confirm delete entry
  const confirmDeleteEntry = async () => {
    if (!deletingEntry) return

    try {
      // Get existing entries
      let existingEntries: RSVPEntry[] = []
      try {
        const savedEntries = localStorage.getItem(rsvpConfig.storageKey)
        if (savedEntries) {
          existingEntries = JSON.parse(savedEntries)
        }
      } catch (error) {
        console.error("Failed to load saved entries:", error)
      }

      // Remove the entry
      const updatedEntries = existingEntries.filter((entry) => entry.id !== deletingEntry.id)

      // Save to localStorage
      try {
        localStorage.setItem(rsvpConfig.storageKey, JSON.stringify(updatedEntries))
        console.log("Saved updated entries to localStorage")

        // Update state
        setRsvpEntries(updatedEntries)
        setTotalGuests(
          updatedEntries.reduce((sum, entry) => (entry.attending === "yes" ? sum + entry.guestCount : sum), 0),
        )

        // Dispatch a custom event to notify other components of the update
        window.dispatchEvent(new Event("rsvpUpdated"))
      } catch (error) {
        console.error("Failed to save to localStorage:", error)
      }

      toast({
        title: "RSVP Deleted",
        description: "The RSVP has been successfully deleted.",
      })

      setShowDeleteDialog(false)
      setDeletingEntry(null)
    } catch (error) {
      console.error("Error deleting RSVP:", error)

      toast({
        title: "Delete failed",
        description: "There was a problem deleting the RSVP. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Success animation
  if (isSuccess) {
    return (
      <motion.div
        className="text-center p-8 bg-gradient-to-br from-rose-50 to-white rounded-lg border border-rose-100 shadow-sm"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-rose-100 rounded-full"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <Check className="w-10 h-10 text-rose-600" />
        </motion.div>
        <motion.h3
          className="text-3xl font-great-vibes mb-4 text-rose-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Thank You!
        </motion.h3>
        <motion.p
          className="text-gray-700 mb-6 max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Your RSVP has been successfully submitted. We're looking forward to celebrating with you on our special day!
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            onClick={() => {
              setIsSuccess(false)
              form.reset()
              setActiveTab("form")
            }}
            variant="outline"
            className="border-rose-200 text-rose-600 hover:bg-rose-50"
          >
            Submit Another Response
          </Button>
          <Button
            onClick={() => {
              setIsSuccess(false)
              setActiveTab("responses")
            }}
            className="bg-rose-600 hover:bg-rose-700 text-white"
          >
            View All Responses
          </Button>
        </motion.div>
      </motion.div>
    )
  }

  // Create the tabs for the RSVP form
  return (
    <>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8 bg-rose-50 p-1 rounded-lg">
          <TabsTrigger
            value="form"
            className="text-base data-[state=active]:bg-white data-[state=active]:text-rose-700 data-[state=active]:shadow-sm rounded-md"
          >
            RSVP Form
          </TabsTrigger>
          <TabsTrigger
            value="responses"
            className="text-base data-[state=active]:bg-white data-[state=active]:text-rose-700 data-[state=active]:shadow-sm rounded-md"
          >
            Guest Responses
          </TabsTrigger>
        </TabsList>

        <TabsContent value="form" className="space-y-4">
          {isDeadlinePassed ? (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-rose-100">
              <div className="text-center">
                <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                <h3 className="text-2xl font-medium mb-2">RSVP Deadline Passed</h3>
                <p className="text-gray-600 mb-6">
                  The RSVP deadline ({weddingDetails.rsvpDeadlineDisplay}) has passed. If you still need to RSVP, please
                  contact us directly.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild className="bg-rose-600 hover:bg-rose-700 text-white">
                    <a href={`mailto:${getCoupleInfo().partner1.email}`}>Contact Us</a>
                  </Button>
                  <Button
                    onClick={() => setActiveTab("responses")}
                    variant="outline"
                    className="border-rose-200 text-rose-600 hover:bg-rose-50"
                  >
                    View Guest List
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-rose-100">
              {/* Deadline countdown banner */}
              <div className="mb-6 p-4 bg-rose-50 rounded-lg border border-rose-100 flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-rose-600 mr-2" />
                  <span className="text-rose-700">
                    RSVP closes in <strong>{remainingTime}</strong> ({weddingDetails.rsvpDeadlineDisplay})
                  </span>
                </div>
                <Button
                  onClick={() => setActiveTab("responses")}
                  variant="ghost"
                  size="sm"
                  className="text-rose-600 hover:bg-rose-100"
                >
                  View Guests
                </Button>
              </div>

              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-base font-medium flex items-center">
                    <span>Full Name</span> <span className="text-rose-500 ml-1">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="name"
                      {...form.register("name", {
                        required: "Please enter your name",
                        minLength: { value: 2, message: "Name must be at least 2 characters" },
                      })}
                      placeholder="Enter your full name"
                      className="h-12 pl-10 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-rose-500 border-gray-200"
                    />
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                  {form.formState.errors.name && (
                    <p className="text-sm text-rose-500 mt-1 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-base font-medium flex items-center">
                    <span>Email Address</span> <span className="text-rose-500 ml-1">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      {...form.register("email", {
                        required: "Please enter your email address",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Please enter a valid email address",
                        },
                      })}
                      placeholder="Enter your email"
                      className="h-12 pl-10 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-rose-500 border-gray-200"
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                  {form.formState.errors.email && (
                    <p className="text-sm text-rose-500 mt-1 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-medium flex items-center">
                    <span>Will you be attending?</span> <span className="text-rose-500 ml-1">*</span>
                  </Label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Controller
                      control={form.control}
                      name="attending"
                      render={({ field }) => (
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col sm:flex-row gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="attending-yes" />
                            <Label htmlFor="attending-yes" className="cursor-pointer">
                              Yes, I'll be there!
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="attending-no" />
                            <Label htmlFor="attending-no" className="cursor-pointer">
                              Sorry, I can't make it
                            </Label>
                          </div>
                        </RadioGroup>
                      )}
                    />
                  </div>
                </div>

                {attending === "yes" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="guestCount" className="text-base font-medium flex items-center">
                        <span>Number of Guests</span> <span className="text-rose-500 ml-1">*</span>
                      </Label>
                      <div className="flex items-center">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-12 w-12 rounded-r-none border-r-0"
                          onClick={() => {
                            const currentValue = Number.parseInt(form.getValues("guestCount") || "1")
                            if (currentValue > 1) {
                              form.setValue("guestCount", (currentValue - 1).toString())
                            }
                          }}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          id="guestCount"
                          type="number"
                          min="1"
                          max={rsvpConfig.maxGuestCount}
                          {...form.register("guestCount", {
                            required: "Please select the number of guests",
                            min: { value: 1, message: "Minimum 1 guest" },
                            max: {
                              value: rsvpConfig.maxGuestCount,
                              message: `Maximum ${rsvpConfig.maxGuestCount} guests`,
                            },
                          })}
                          className="h-12 text-center rounded-none border-x-0"
                          onKeyDown={(e) => {
                            // Prevent typing non-numeric characters
                            if (!/[0-9]|\Backspace|Tab|ArrowLeft|ArrowRight|\Delete/.test(e.key)) {
                              e.preventDefault()
                            }
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-12 w-12 rounded-l-none border-l-0"
                          onClick={() => {
                            const currentValue = Number.parseInt(form.getValues("guestCount") || "1")
                            if (currentValue < rsvpConfig.maxGuestCount) {
                              form.setValue("guestCount", (currentValue + 1).toString())
                            }
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      {form.formState.errors.guestCount && (
                        <p className="text-sm text-rose-500 mt-1 flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          {form.formState.errors.guestCount.message}
                        </p>
                      )}
                    </div>

                    {additionalGuestsCount > 0 && (
                      <div className="space-y-4">
                        <Label className="text-base font-medium">Additional Guest Information</Label>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
                          {Array.from({ length: additionalGuestsCount }).map((_, index) => (
                            <div
                              key={index}
                              className="space-y-2 pb-4 border-b border-gray-200 last:border-0 last:pb-0"
                            >
                              <Label htmlFor={`guest-${index}-name`} className="text-sm font-medium">
                                Guest {index + 1} Name <span className="text-rose-500">*</span>
                              </Label>
                              <Input
                                id={`guest-${index}-name`}
                                {...form.register(`additionalGuests.${index}.name` as const, {
                                  required: "Guest name is required",
                                })}
                                placeholder="Enter guest name"
                                className="h-10"
                              />
                              <Label htmlFor={`guest-${index}-relationship`} className="text-sm font-medium">
                                Relationship (Optional)
                              </Label>
                              <Input
                                id={`guest-${index}-relationship`}
                                {...form.register(`additionalGuests.${index}.relationship` as const)}
                                placeholder="e.g., Spouse, Child, Friend"
                                className="h-10"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="dietaryRestrictions" className="text-base font-medium">
                        Dietary Restrictions <span className="text-gray-400 font-normal">(Optional)</span>
                      </Label>
                      <Textarea
                        id="dietaryRestrictions"
                        {...form.register("dietaryRestrictions")}
                        placeholder="Please let us know if you or your guests have any dietary restrictions or allergies"
                        className="min-h-[80px] transition-all duration-300 focus-visible:ring-2 focus-visible:ring-rose-500 border-gray-200 resize-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="songRequest" className="text-base font-medium">
                        Song Request <span className="text-gray-400 font-normal">(Optional)</span>
                      </Label>
                      <Input
                        id="songRequest"
                        {...form.register("songRequest")}
                        placeholder="What song would get you on the dance floor?"
                        className="h-12 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-rose-500 border-gray-200"
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-base font-medium flex items-center">
                    <span>Message to the Couple</span>{" "}
                    <span className="text-gray-400 font-normal ml-2">(Optional)</span>
                  </Label>
                  <div className="relative">
                    <Textarea
                      id="message"
                      {...form.register("message")}
                      placeholder="Share your wishes or message for the couple"
                      className="min-h-[120px] pl-10 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-rose-500 border-gray-200 resize-none"
                    />
                    <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-rose-50 text-rose-700 rounded-md border border-rose-200 flex items-start">
                    <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                    <p>{error}</p>
                  </div>
                )}

                <div className="pt-4 flex justify-end">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-rose-600 hover:bg-rose-700 text-white py-6 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Heart className="mr-2 h-5 w-5" />
                        Submit RSVP
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </TabsContent>

        <TabsContent value="responses">
          <Card className="border-rose-100 shadow-sm overflow-hidden">
            <CardHeader className="bg-rose-50 border-b border-rose-100">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="flex items-center text-rose-800">
                    <span>Guest List</span>
                    <Badge variant="outline" className="ml-2 bg-white">
                      {totalGuests} {totalGuests === 1 ? "Guest" : "Guests"} Attending
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-rose-600">See who's coming to celebrate with us</CardDescription>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Input
                    placeholder="Search guests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-9 text-sm"
                  />
                  <Select
                    value={attendanceFilter}
                    onValueChange={(value) => setAttendanceFilter(value as "all" | "attending" | "not-attending")}
                  >
                    <SelectTrigger className="h-9 w-[130px]">
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Responses</SelectItem>
                      <SelectItem value="attending">Attending</SelectItem>
                      <SelectItem value="not-attending">Not Attending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading && !isRefreshing ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-rose-600" />
                  <span className="ml-2">Loading guest responses...</span>
                </div>
              ) : filteredEntries.length > 0 ? (
                <div>
                  <div className="overflow-hidden">
                    <InfiniteGuestMarquee guests={filteredEntries} speed={30} pauseOnHover={true} />
                  </div>

                  <div className="p-4">
                    <Accordion type="single" collapsible className="w-full">
                      {filteredEntries.map((entry) => (
                        <AccordionItem key={entry.id} value={entry.id}>
                          <AccordionTrigger className="hover:bg-gray-50 px-4 py-3 rounded-lg">
                            <div className="flex items-center justify-between w-full pr-4">
                              <div className="flex items-center">
                                <Avatar className="h-10 w-10 mr-3 border-2 border-rose-100">
                                  <AvatarFallback className="bg-rose-100 text-rose-600">
                                    {entry.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")
                                      .toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="text-left">
                                  <div className="font-medium">{entry.name}</div>
                                  <div className="text-sm text-gray-500">{entry.email}</div>
                                </div>
                              </div>
                              <Badge
                                variant={entry.attending === "yes" ? "default" : "outline"}
                                className={
                                  entry.attending === "yes"
                                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                                    : "border-gray-200 text-gray-600"
                                }
                              >
                                {entry.attending === "yes" ? `Attending (${entry.guestCount})` : "Not Attending"}
                              </Badge>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pb-4">
                            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h4 className="text-sm font-medium text-gray-500 mb-1">RSVP Date</h4>
                                  <p className="text-gray-700">{entry.date}</p>
                                </div>
                                {entry.attending === "yes" && (
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-500 mb-1">Guest Count</h4>
                                    <p className="text-gray-700">
                                      {entry.guestCount} {entry.guestCount === 1 ? "person" : "people"}
                                    </p>
                                  </div>
                                )}
                              </div>

                              {entry.additionalGuests && entry.additionalGuests.length > 0 && (
                                <div>
                                  <h4 className="text-sm font-medium text-gray-500 mb-2">Additional Guests</h4>
                                  <div className="space-y-2">
                                    {entry.additionalGuests.map((guest, idx) => (
                                      <div
                                        key={idx}
                                        className="flex items-center bg-white p-2 rounded border border-gray-200"
                                      >
                                        <div className="h-6 w-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xs mr-2">
                                          {idx + 1}
                                        </div>
                                        <div>
                                          <p className="font-medium text-sm">{guest.name}</p>
                                          {guest.relationship && (
                                            <p className="text-xs text-gray-500">{guest.relationship}</p>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {entry.dietaryRestrictions && (
                                <div>
                                  <h4 className="text-sm font-medium text-gray-500 mb-1">Dietary Restrictions</h4>
                                  <p className="text-gray-700">{entry.dietaryRestrictions}</p>
                                </div>
                              )}

                              {entry.songRequest && (
                                <div>
                                  <h4 className="text-sm font-medium text-gray-500 mb-1">Song Request</h4>
                                  <p className="text-gray-700">{entry.songRequest}</p>
                                </div>
                              )}

                              {entry.message && (
                                <div>
                                  <h4 className="text-sm font-medium text-gray-500 mb-1">Message</h4>
                                  <p className="text-gray-700 italic">"{entry.message}"</p>
                                </div>
                              )}

                              <div className="flex justify-end gap-2 pt-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditEntry(entry)}
                                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                >
                                  <Edit className="h-4 w-4 mr-1" />
                                  Edit
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteEntry(entry)}
                                  className="text-rose-600 border-rose-200 hover:bg-rose-50"
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-rose-500 mb-4">{error}</p>
                  <Button
                    onClick={fetchAndUpdateEntries}
                    variant="outline"
                    className="border-rose-200 text-rose-600 hover:bg-rose-50"
                  >
                    Try Again
                  </Button>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-2">No responses yet.</p>
                  <p className="text-gray-500 mb-4">Be the first to RSVP!</p>
                  <Button onClick={() => setActiveTab("form")} className="bg-rose-600 hover:bg-rose-700 text-white">
                    Submit Your RSVP
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between p-4 bg-gray-50 border-t border-gray-100">
              <Button
                onClick={refreshGuestList}
                variant="outline"
                className="border-rose-200 text-rose-600 hover:bg-rose-50"
                disabled={isRefreshing}
              >
                {isRefreshing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Refreshing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh List
                  </>
                )}
              </Button>
              <Button
                onClick={openGoogleSheet}
                variant="outline"
                className="border-rose-200 text-rose-600 hover:bg-rose-50"
              >
                <ExternalLink className="mr-2 w-4 h-4" />
                View Spreadsheet
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Your RSVP</DialogTitle>
            <DialogDescription>Please review your RSVP details before submitting.</DialogDescription>
          </DialogHeader>
          {formData && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Name</h4>
                  <p className="font-medium">{formData.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Email</h4>
                  <p>{formData.email}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">Attending</h4>
                <p className={formData.attending === "yes" ? "text-green-600 font-medium" : "text-gray-600"}>
                  {formData.attending === "yes" ? "Yes, I'll be there!" : "No, I can't make it"}
                </p>
              </div>

              {formData.attending === "yes" && (
                <>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Number of Guests</h4>
                    <p>{formData.guestCount}</p>
                  </div>

                  {formData.additionalGuests && formData.additionalGuests.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Additional Guests</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {formData.additionalGuests.map((guest, idx) => (
                          <li key={idx}>
                            {guest.name}
                            {guest.relationship && <span className="text-gray-500"> ({guest.relationship})</span>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {formData.dietaryRestrictions && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Dietary Restrictions</h4>
                      <p>{formData.dietaryRestrictions}</p>
                    </div>
                  )}

                  {formData.songRequest && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Song Request</h4>
                      <p>{formData.songRequest}</p>
                    </div>
                  )}
                </>
              )}

              {formData.message && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Message</h4>
                  <p className="italic">"{formData.message}"</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              className="sm:w-auto w-full"
            >
              Edit Response
            </Button>
            <Button
              type="button"
              onClick={submitRSVP}
              disabled={isSubmitting}
              className="bg-rose-600 hover:bg-rose-700 text-white sm:w-auto w-full"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Confirm RSVP
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit RSVP</DialogTitle>
            <DialogDescription>Update your RSVP details below.</DialogDescription>
          </DialogHeader>
          <form onSubmit={editForm.handleSubmit(saveEditedEntry)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                {...editForm.register("name", {
                  required: "Name is required",
                })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email">Email Address</Label>
              <Input
                id="edit-email"
                type="email"
                {...editForm.register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
            </div>

            <div className="space-y-2">
              <Label>Will you be attending?</Label>
              <Controller
                control={editForm.control}
                name="attending"
                render={({ field }) => (
                  <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="edit-attending-yes" />
                      <Label htmlFor="edit-attending-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="edit-attending-no" />
                      <Label htmlFor="edit-attending-no">No</Label>
                    </div>
                  </RadioGroup>
                )}
              />
            </div>

            {editForm.watch("attending") === "yes" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="edit-guestCount">Number of Guests</Label>
                  <Input
                    id="edit-guestCount"
                    type="number"
                    min="1"
                    max={rsvpConfig.maxGuestCount}
                    {...editForm.register("guestCount", {
                      required: "Guest count is required",
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-dietaryRestrictions">Dietary Restrictions</Label>
                  <Textarea
                    id="edit-dietaryRestrictions"
                    {...editForm.register("dietaryRestrictions")}
                    placeholder="Any dietary restrictions or allergies"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-songRequest">Song Request</Label>
                  <Input
                    id="edit-songRequest"
                    {...editForm.register("songRequest")}
                    placeholder="What song would get you on the dance floor?"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-message">Message</Label>
                  <Textarea
                    id="edit-message"
                    {...editForm.register("message")}
                    placeholder="Share your wishes or message for the couple"
                  />
                </div>
              </>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-rose-600 hover:bg-rose-700 text-white">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete RSVP</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this RSVP? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {deletingEntry && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarFallback className="bg-rose-100 text-rose-600">
                    {deletingEntry.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{deletingEntry.name}</p>
                  <p className="text-sm text-gray-500">{deletingEntry.email}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              className="sm:w-auto w-full"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={confirmDeleteEntry}
              className="bg-rose-600 hover:bg-rose-700 text-white sm:w-auto w-full"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete RSVP
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
