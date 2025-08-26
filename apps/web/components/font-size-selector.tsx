"use client"

import { useState, useEffect } from "react"
import { Button } from "@workspace/ui/components/button"
import { Type, Minus, Plus } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"

type FontSize = "prose-sm" | "prose-base" | "prose-lg" | "prose-xl"

interface FontSizeSelectorProps {
  onSizeChange: (size: FontSize) => void
}

const fontSizeOptions: { value: FontSize; label: string; description: string }[] = [
  { value: "prose-sm", label: "Small", description: "Compact reading" },
  { value: "prose-base", label: "Default", description: "Standard size" },
  { value: "prose-lg", label: "Large", description: "Comfortable reading" },
  { value: "prose-xl", label: "Extra Large", description: "Easy on the eyes" },
]

export function FontSizeSelector({ onSizeChange }: FontSizeSelectorProps) {
  const [selectedSize, setSelectedSize] = useState<FontSize>("prose-base")

  useEffect(() => {
    // Load saved preference from localStorage
    const saved = localStorage.getItem("blog-font-size") as FontSize
    if (saved && fontSizeOptions.some(opt => opt.value === saved)) {
      setSelectedSize(saved)
      onSizeChange(saved)
    }
  }, [onSizeChange])

  const handleSizeChange = (size: FontSize) => {
    setSelectedSize(size)
    localStorage.setItem("blog-font-size", size)
    onSizeChange(size)
  }

  const currentOption = fontSizeOptions.find(opt => opt.value === selectedSize)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" title="Adjust font size">
          <Type className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {fontSizeOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => handleSizeChange(option.value)}
            className={`flex flex-col items-start py-2 ${
              selectedSize === option.value ? "bg-accent" : ""
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <span className="font-medium">{option.label}</span>
              {option.value === "prose-sm" && <Minus className="h-3 w-3 text-muted-foreground" />}
              {option.value === "prose-xl" && <Plus className="h-3 w-3 text-muted-foreground" />}
            </div>
            <span className="text-xs text-muted-foreground">{option.description}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Alternative inline button group version
export function FontSizeButtonGroup({ onSizeChange }: FontSizeSelectorProps) {
  const [selectedSize, setSelectedSize] = useState<FontSize>("prose-base")

  useEffect(() => {
    const saved = localStorage.getItem("blog-font-size") as FontSize
    if (saved && fontSizeOptions.some(opt => opt.value === saved)) {
      setSelectedSize(saved)
      onSizeChange(saved)
    }
  }, [onSizeChange])

  const handleSizeChange = (size: FontSize) => {
    setSelectedSize(size)
    localStorage.setItem("blog-font-size", size)
    onSizeChange(size)
  }

  return (
    <div className="flex items-center gap-1 border rounded-md p-1">
      <Button
        variant={selectedSize === "prose-sm" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => handleSizeChange("prose-sm")}
        className="h-7 px-2"
        title="Small text"
      >
        <Type className="h-3 w-3" />
      </Button>
      <Button
        variant={selectedSize === "prose-base" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => handleSizeChange("prose-base")}
        className="h-7 px-2"
        title="Default text"
      >
        <Type className="h-4 w-4" />
      </Button>
      <Button
        variant={selectedSize === "prose-lg" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => handleSizeChange("prose-lg")}
        className="h-7 px-2"
        title="Large text"
      >
        <Type className="h-5 w-5" />
      </Button>
      <Button
        variant={selectedSize === "prose-xl" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => handleSizeChange("prose-xl")}
        className="h-7 px-2"
        title="Extra large text"
      >
        <Type className="h-6 w-6" />
      </Button>
    </div>
  )
}