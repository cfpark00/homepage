import * as React from "react"
import { cn } from "../lib/utils"
import { AlertTriangle } from "lucide-react"

export interface WarningCardProps extends React.HTMLAttributes<HTMLDivElement> {
  showIcon?: boolean
}

const WarningCard = React.forwardRef<HTMLDivElement, WarningCardProps>(
  ({ className, children, showIcon = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex gap-2 rounded-lg border border-orange-200 bg-orange-50 p-3 text-sm text-orange-800 dark:border-orange-900/50 dark:bg-orange-950/20 dark:text-orange-200",
          className
        )}
        {...props}
      >
        {showIcon && (
          <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-500 mt-0.5 flex-shrink-0" />
        )}
        <span>{children}</span>
      </div>
    )
  }
)
WarningCard.displayName = "WarningCard"

export { WarningCard }