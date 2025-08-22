import * as React from "react"
import { cn } from "../lib/utils"

interface PageContainerProps {
  children: React.ReactNode
  className?: string
  innerClassName?: string
}

export function PageContainer({ 
  children, 
  className,
  innerClassName 
}: PageContainerProps) {
  return (
    <div className={cn("container py-8 md:py-12", className)}>
      <div className={cn("mx-auto max-w-4xl", innerClassName)}>
        {children}
      </div>
    </div>
  )
}

interface PageContainerInnerProps {
  children: React.ReactNode
  className?: string
}

// For cases where you only need the inner max-width wrapper
export function PageContainerInner({ 
  children, 
  className 
}: PageContainerInnerProps) {
  return (
    <div className={cn("mx-auto max-w-4xl", className)}>
      {children}
    </div>
  )
}