import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

// Store password in environment variable (add to .env.local)
const THOUGHTS_PASSWORD = process.env.THOUGHTS_PASSWORD || "thoughts2025"

// Simple token generation
function generateToken() {
  return crypto.randomBytes(32).toString("hex")
}

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    
    if (password === THOUGHTS_PASSWORD) {
      // Generate a session token
      const token = generateToken()
      
      // In production, you might want to store this token in a database
      // For simplicity, we'll just return it and rely on client-side storage
      return NextResponse.json({ 
        success: true, 
        token 
      })
    } else {
      return NextResponse.json({ 
        success: false, 
        error: "Invalid password" 
      }, { status: 401 })
    }
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: "Server error" 
    }, { status: 500 })
  }
}

// Verify token endpoint (optional, for extra security)
export async function GET(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "")
  
  // For a simple implementation, any non-empty token is considered valid
  // In production, you'd verify against stored tokens
  if (token && token.length === 64) {
    return NextResponse.json({ valid: true })
  }
  
  return NextResponse.json({ valid: false }, { status: 401 })
}