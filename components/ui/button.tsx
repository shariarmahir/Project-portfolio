import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-full font-semibold tracking-snug transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-[18px] [&_svg]:shrink-0 [&_svg]:transition-transform hover:[&_svg]:translate-x-0.5",
  {
    variants: {
      variant: {
        primary: "bg-helios text-navy hover:bg-helios-600 hover:text-white",
        navy: "bg-navy text-white hover:bg-cobalt",
        ghost: "border-[1.5px] border-navy text-navy hover:bg-navy hover:text-white",
        light: "bg-white text-navy hover:bg-tint",
        "ghost-light": "border-[1.5px] border-white/70 text-white hover:bg-white hover:text-navy",
      },
      size: {
        sm: "h-10 px-5 text-[14px]",
        md: "h-12 px-6 text-[15px]",
        lg: "h-14 px-8 text-base",
      },
    },
    defaultVariants: { variant: "navy", size: "md" },
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
