"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Lock } from "lucide-react"

export function BetaPasswordGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Check if already authenticated
    const storedData = localStorage.getItem("beta-auth")
    if (storedData) {
      try {
        const { token, expiry } = JSON.parse(storedData)
        // Check if token hasn't expired
        if (token && expiry && new Date().getTime() < expiry) {
          setIsAuthenticated(true)
        } else {
          // Clear expired token
          localStorage.removeItem("beta-auth")
        }
      } catch {
        localStorage.removeItem("beta-auth")
      }
    }
    setIsLoading(false)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(false)
    
    try {
      const response = await fetch("/api/beta-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Store the token with 30-day expiration
        const authData = {
          token: data.token,
          expiry: new Date().getTime() + (30 * 24 * 60 * 60 * 1000) // 30 days
        }
        localStorage.setItem("beta-auth", JSON.stringify(authData))
        setIsAuthenticated(true)
        setError(false)
      } else {
        setError(true)
        setPassword("")
      }
    } catch (err) {
      setError(true)
      setPassword("")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return null
  }

  if (!isAuthenticated) {
    return (
      <div className="container py-8 md:py-12">
        <div className="mx-auto max-w-md">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Lock className="h-6 w-6" />
              </div>
              <CardTitle>Beta Research Access</CardTitle>
              <CardDescription>
                This area contains preliminary research findings. Please enter the access password to continue.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className={error ? "border-red-500" : ""}
                    autoFocus
                  />
                  {error && (
                    <p className="text-sm text-red-500">
                      Incorrect password. Please try again.
                    </p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Verifying..." : "Access Beta Research"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return <>{children}</>
}