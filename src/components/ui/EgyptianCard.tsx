import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const egyptianCardVariants = cva(
  "relative rounded-lg transition-all duration-500 overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-card border border-border shadow-card hieroglyph-pattern",
        gold:
          "bg-gradient-to-br from-card via-card to-muted border-2 border-gold/30 shadow-gold-glow",
        lapis:
          "bg-lapis-deep border border-lapis-light/30 shadow-deep",
        papyrus:
          "bg-papyrus text-obsidian border border-sandstone",
        tomb:
          "bg-tomb-gradient border border-gold/20 shadow-deep",
        interactive:
          "bg-card border border-border hover:border-gold/50 hover:shadow-gold-glow cursor-pointer group",
        museum:
          "bg-card border-4 border-gold/50 shadow-deep p-8",
      },
      padding: {
        none: "p-0",
        sm: "p-4",
        default: "p-6",
        lg: "p-8",
        xl: "p-10",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
    },
  }
);

export interface EgyptianCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof egyptianCardVariants> {
  glowOnHover?: boolean;
}

const EgyptianCard = React.forwardRef<HTMLDivElement, EgyptianCardProps>(
  ({ className, variant, padding, glowOnHover = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          egyptianCardVariants({ variant, padding }),
          glowOnHover && "hover:shadow-[0_0_30px_hsl(var(--gold)/0.3)]",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
EgyptianCard.displayName = "EgyptianCard";

const EgyptianCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-2 mb-4", className)}
    {...props}
  />
));
EgyptianCardHeader.displayName = "EgyptianCardHeader";

const EgyptianCardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "font-display text-2xl font-semibold leading-none tracking-wide text-gold-gradient",
      className
    )}
    {...props}
  />
));
EgyptianCardTitle.displayName = "EgyptianCardTitle";

const EgyptianCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-muted-foreground font-body text-lg", className)}
    {...props}
  />
));
EgyptianCardDescription.displayName = "EgyptianCardDescription";

const EgyptianCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("font-body", className)} {...props} />
));
EgyptianCardContent.displayName = "EgyptianCardContent";

export {
  EgyptianCard,
  EgyptianCardHeader,
  EgyptianCardTitle,
  EgyptianCardDescription,
  EgyptianCardContent,
  egyptianCardVariants,
};
