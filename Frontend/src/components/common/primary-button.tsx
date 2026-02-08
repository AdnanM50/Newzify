import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type VariantProps } from "class-variance-authority";
import React from "react";

interface PrimaryButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const PrimaryButton = React.forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  (props, ref) => {
    const { className, variant, size, asChild = false, children, ...rest } = props;
    return (
      <Button
        ref={ref}
        variant={variant as any}
        size={size as any}
        asChild={asChild}
        className={cn(
          "bg-gray-800 text-white border border-gray-800 hover:bg-gray-900 hover:text-white h-10 px-4 font-semibold transition-colors rounded-md",
          className
        )}
        {...rest}
      >
        {children}
      </Button>
    );
  }
);

PrimaryButton.displayName = "PrimaryButton";
