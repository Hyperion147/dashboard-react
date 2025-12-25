import { Check, X } from "lucide-react"

interface PasswordRequirementProps {
  met: boolean
  text: string
}

export default function PasswordRequirement({ met, text }: PasswordRequirementProps) {
  return (
    <div className="flex items-center gap-2 text-xs">
      {met ? <Check className="h-3 w-3 text-green-600" /> : <X className="h-3 w-3 text-destructive" />}
      <span className={met ? "text-green-600" : "text-muted-foreground"}>{text}</span>
    </div>
  )
}
