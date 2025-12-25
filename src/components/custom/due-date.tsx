import { useState } from "react"
import { Popover, PopoverTrigger, PopoverContent } from "@repo/ui/popover"
import { Calendar } from "@repo/ui/calendar"
import { Button } from "@repo/ui/button"
import { format } from "date-fns"

type DueDatePickerProps = {
  dueDate: string
  setDueDate: (date: string) => void
}

export function DueDatePicker({ dueDate, setDueDate }: DueDatePickerProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full pl-3 text-left font-normal"
        >
          {dueDate ? format(new Date(dueDate), "PPP") : "Pick a date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="center">
        <Calendar
          mode="single"
          selected={dueDate ? new Date(dueDate) : undefined}
          onSelect={(date) => {
            setDueDate(date?.toISOString().substring(0, 10) || "")
            setOpen(false)
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
