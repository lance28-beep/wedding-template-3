import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    // Path to the PDF file
    const filePath = path.join(process.cwd(), "public", "invitation.pdf")

    // Read the file
    const fileBuffer = fs.readFileSync(filePath)

    // Return the file as a response
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="Sarah-Michael-Wedding-Invitation.pdf"',
      },
    })
  } catch (error) {
    console.error("Error serving PDF:", error)
    return NextResponse.json({ error: "Failed to download invitation" }, { status: 500 })
  }
}
