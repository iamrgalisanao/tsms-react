import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// Define buttonVariants as a constant
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-white shadow hover:text-[#ffcccc] hover:font-bold active:bg-[#cc0000] active:translate-y-0.5",
        destructive:
          "bg-destructive text-white shadow-sm hover:text-destructive/50 hover:font-bold active:translate-y-0.5",
        outline:
          "border border-input bg-background shadow-sm hover:text-primary hover:border-primary hover:font-bold active:translate-y-0.5",
        secondary:
          "bg-secondary text-white shadow-sm hover:text-secondary/50 hover:font-bold active:translate-y-0.5",
        ghost: "hover:text-primary hover:underline hover:font-bold",
        link: "text-primary underline-offset-4 hover:underline hover:font-bold",
        success:
          "bg-success text-white shadow-sm hover:text-success/50 hover:font-bold active:translate-y-0.5",
        warning:
          "bg-warning text-white shadow-sm hover:text-warning/50 hover:font-bold active:translate-y-0.5",
        info: "bg-info text-white shadow-sm hover:text-info/50 hover:font-bold active:translate-y-0.5",
        pitx: "bg-pitx-red text-white shadow-sm hover:text-[#ffcccc] hover:font-bold active:bg-[#cc0000] active:translate-y-0.5",
        pitxBlue:
          "bg-secondary text-white shadow-sm hover:text-secondary/50 hover:font-bold active:translate-y-0.5",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button };
export default Button;
export { buttonVariants };
