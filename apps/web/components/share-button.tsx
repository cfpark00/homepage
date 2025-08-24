"use client"

import { Button } from "@workspace/ui/components/button"
import { Share2 } from "lucide-react"
import { toast } from "sonner"

interface ShareButtonProps {
  url: string
  title?: string
  className?: string
  variant?: "default" | "outline" | "ghost" | "secondary"
  size?: "default" | "sm" | "lg" | "icon"
}

export function ShareButton({ 
  url, 
  title = "Share", 
  className = "",
  variant = "ghost",
  size = "sm"
}: ShareButtonProps) {
  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const fullUrl = `${window.location.origin}${url}`
    
    try {
      await navigator.clipboard.writeText(fullUrl)
      toast.success("Link copied to clipboard!")
    } catch (err) {
      console.error('Failed to copy link:', err)
      toast.error("Failed to copy link")
    }
  }

  return (
    <Button 
      onClick={handleShare} 
      variant={variant}
      size={size}
      className={className}
      title="Copy link"
    >
      <Share2 className="h-4 w-4" />
      {size !== "icon" && <span className="ml-1">{title}</span>}
    </Button>
  )
}