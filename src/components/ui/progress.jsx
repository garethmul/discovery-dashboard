import * as React from "react"
import { cn } from "../../lib/utils"

// Try to import from Radix UI, but provide a fallback if the import fails
let ProgressPrimitive;
try {
  ProgressPrimitive = require("@radix-ui/react-progress");
} catch (error) {
  // Create a simple fallback implementation if the package is missing
  ProgressPrimitive = {
    Root: ({ className, value, ...props }) => (
      <div
        className={cn(
          "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
          className
        )}
        {...props}
      >
        <div
          className="h-full w-full flex-1 bg-primary transition-all"
          style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
      </div>
    ),
    displayName: 'ProgressFallback'
  };
  
  console.warn('Using fallback Progress component as @radix-ui/react-progress is not installed');
}

const Progress = React.forwardRef(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root?.displayName || 'Progress'

export { Progress } 