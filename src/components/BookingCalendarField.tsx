"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useState } from "react";
import type { DayButton } from "react-day-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { isoToLocalDate, localDateToISO } from "@/lib/booking-dates";
import { cn } from "@/lib/utils";

// One controlled calendar, themed for Hotel Lotus Divine, shared by every Check-In /
// Check-Out field on the site (homepage bar and /booking). Never falls back to the native
// OS date picker — the visible field is always a button that opens this popover.

const calendarClassNames = {
  months: "flex flex-col",
  month: "flex flex-col gap-3",
  month_caption: "flex items-center justify-center h-9 font-display text-brown text-[15px]",
  nav: "absolute inset-x-0 top-0 flex items-center justify-between px-0.5",
  button_previous:
    "h-8 w-8 flex items-center justify-center rounded-full text-brown/50 hover:bg-champagne/70 hover:text-brown transition-colors disabled:opacity-25 disabled:pointer-events-none disabled:hover:bg-transparent",
  button_next:
    "h-8 w-8 flex items-center justify-center rounded-full text-brown/50 hover:bg-champagne/70 hover:text-brown transition-colors disabled:opacity-25 disabled:pointer-events-none disabled:hover:bg-transparent",
  weekdays: "flex",
  weekday: "flex-1 eyebrow text-taupe text-[9px] text-center pb-1",
  week: "flex w-full mt-1",
  day: "flex-1 p-0.5",
  outside: "invisible",
  hidden: "invisible",
};

function BookingDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <button
      ref={ref}
      type="button"
      data-day={day.date.toLocaleDateString()}
      className={cn(
        "flex aspect-square w-full items-center justify-center rounded-full font-sans text-[13px] text-brown transition-colors",
        "hover:bg-champagne/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60",
        modifiers.today && !modifiers.selected && "font-semibold ring-1 ring-gold/50",
        modifiers.selected && "bg-gold font-semibold text-brown hover:bg-gold",
        modifiers.disabled && "pointer-events-none text-brown/20 hover:bg-transparent",
        className,
      )}
      {...props}
    />
  );
}

export interface BookingCalendarFieldProps {
  value: string;
  onChange: (iso: string) => void;
  min: string;
  trigger: ReactNode;
  align?: "start" | "center" | "end";
}

export function BookingCalendarField({
  value,
  onChange,
  min,
  trigger,
  align = "start",
}: BookingCalendarFieldProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        align={align}
        sideOffset={10}
        collisionPadding={12}
        className="w-[19.5rem] max-w-[calc(100vw-1.5rem)] rounded-2xl border border-brown/10 bg-ivory p-4 shadow-gold"
      >
        <Calendar
          mode="single"
          selected={value ? isoToLocalDate(value) : undefined}
          onSelect={(date) => {
            if (!date) return;
            onChange(localDateToISO(date));
            setOpen(false);
          }}
          disabled={(date) => localDateToISO(date) < min}
          defaultMonth={isoToLocalDate(value || min)}
          showOutsideDays={false}
          className="w-full p-0 [--cell-size:2.5rem]"
          classNames={calendarClassNames}
          components={{ DayButton: BookingDayButton }}
        />
      </PopoverContent>
    </Popover>
  );
}
