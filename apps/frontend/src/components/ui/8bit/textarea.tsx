import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Textarea as ShadcnTextarea } from "@/components/ui/textarea"

export const inputVariants = cva("", {
  variants: {
    font: {
      normal: "",
      retro: "",
    },
  },
  defaultVariants: {
    font: "retro",
  },
})

export interface BitTextareaProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof inputVariants> {
  asChild?: boolean
}

function Textarea({ ...props }: BitTextareaProps) {
  const { className, font } = props

  return (
    <div className={cn("relative w-full", className)}>
      <ShadcnTextarea
        placeholder="Enter text"
        className={cn(
          "rounded-none transition-transform ring-0 border-0",
          font !== "normal",
          className
        )}
      />

      <div
        className="absolute inset-0 border-y-6 -my-1.5 border-foreground dark:border-ring pointer-events-none"
        aria-hidden="true"
      />

      <div
        className="absolute inset-0 border-x-6 -mx-1.5 border-foreground dark:border-ring pointer-events-none"
        aria-hidden="true"
      />
    </div>
  )
}

export { Textarea }
