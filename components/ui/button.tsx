import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-full font-semibold tracking-snug transition-[background-color,color,border-color,transform] duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-helios-300 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-[18px] [&_svg]:shrink-0 [&_svg]:transition-transform hover:[&_svg]:translate-x-0.5",
  {
    variants: {
      variant: {
        primary: "bg-helios text-navy-900 hover:bg-helios-300",
        navy: "glass text-ink hover:border-white/25 hover:bg-white/10",
        glass: "glass text-ink hover:border-white/25 hover:bg-white/10",
        ghost: "border border-white/25 text-ink hover:border-white/50 hover:bg-white/5",
        light: "bg-white text-navy-900 hover:bg-helios-100",
        "ghost-light": "border border-white/30 text-white hover:bg-white hover:text-navy-900",
      },
      size: {
        sm: "h-10 px-5 text-[14px]",
        md: "h-12 px-6 text-[15px]",
        lg: "h-14 px-8 text-base",
      },
    },
    defaultVariants: { variant: "glass", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
