import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  // Public routes that don't require auth
  const isPublicRoute = 
    path === '/' ||
    path.startsWith('/auth/') ||
    path.includes('/s/') // Share token routes are public
  
  // Update session for all routes
  const response = await updateSession(request)
  
  // For non-public routes, check authentication
  if (!isPublicRoute) {
    // The updateSession function handles auth checking
    // If user is not authenticated, it will redirect to login
  }
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}