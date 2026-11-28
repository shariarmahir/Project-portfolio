"use client";
import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogTitle = DialogPrimitive.Title;
export const DialogDescription = DialogPrimitive.Description;

/** Right-hand glass drawer. */
export const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & { closeLabel?: string }
>(({ className, children, closeLabel = "Close references", ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-[80] bg-black/55 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "glass-strong fixed inset-y-0 right-0 z-[81] flex h-full w-full max-w-2xl flex-col !rounded-none border-y-0 border-r-0",
        "data-[state=open]:animate-in data-[state=open]:slide-in-from-right data-[state=open]:duration-500 data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=closed]:duration-300",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="glass absolute right-5 top-5 grid size-11 place-items-center rounded-full text-ink transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-helios-300">
        <X className="size-5" />
        <span className="sr-only">{closeLabel}</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));
SheetContent.displayName = "SheetContent";

/** Centred glass modal. */
export const ModalContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & { closeLabel?: string }
>(({ className, children, closeLabel = "Close", ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-md data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "glass-strong fixed left-1/2 top-1/2 z-[81] w-[calc(100%-2rem)] max-w-[480px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-panel focus:outline-none",
        "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:duration-300 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-white/10 text-ink transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-helios-300">
        <X className="size-5" />
        <span className="sr-only">{closeLabel}</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));
ModalContent.displayName = "ModalContent";
