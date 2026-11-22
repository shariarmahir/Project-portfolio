"use client";
import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

export const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & { label: string }
>(({ className, label, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn("relative flex w-full touch-none select-none items-center py-3", className)}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-1.5 w-full grow rounded-full bg-tint-2">
      <SliderPrimitive.Range className="absolute h-full rounded-full bg-navy" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      aria-label={label}
      className="block size-6 rounded-full border-[5px] border-navy bg-helios transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cobalt/30"
    />
  </SliderPrimitive.Root>
));
Slider.displayName = "Slider";
