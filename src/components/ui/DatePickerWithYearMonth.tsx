import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@repo/ui/button";
import { Calendar } from "@repo/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/popover";
import { cn } from "@repo/ui/lib";

interface DatePickerWithYearMonthProps {
  date?: Date;
  onDateChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  fromYear?: number;
  toYear?: number;
}

export function DatePickerWithYearMonth({
  date,
  onDateChange,
  placeholder = "Pick a date",
  disabled = false,
  className,
  fromYear = 1950,
  toYear = new Date().getFullYear(),
}: DatePickerWithYearMonthProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onDateChange}
          captionLayout="dropdown"
          fromYear={fromYear}
          toYear={toYear}
          defaultMonth={date}
          disabled={(date) => date > new Date() || date < new Date(fromYear, 0, 1)}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
