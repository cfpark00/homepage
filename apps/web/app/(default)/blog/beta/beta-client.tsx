"use client"

import { useBetaAuth } from "@/components/beta-password-guard"
import { Button } from "@workspace/ui/components/button"
import { FlaskConical, Unlock, X } from "lucide-react"

export function BetaHeader() {
  const { isAuthenticated, removeAccess } = useBetaAuth()

  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <FlaskConical className="h-6 w-6 text-muted-foreground" />
          <h1 className="text-3xl sm:text-4xl font-bold">Beta Research</h1>
        </div>
        {isAuthenticated && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Unlock className="h-4 w-4 text-green-600" />
              <span>Unlocked</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={removeAccess}
              className="h-8 text-xs text-red-600 hover:text-red-700"
            >
              <X className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">Remove Access</span>
              <span className="sm:hidden">Remove</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}