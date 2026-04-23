import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const egyptianButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-display text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-gold-light shadow-gold-glow border border-gold-dark/50",
        hero:
          "bg-gradient-to-r from-gold-dark via-primary to-gold-light text-primary-foreground hover:shadow-[0_0_40px_hsl(var(--gold)/0.5)] border-2 border-gold-light/30 tracking-wider uppercase",
        lapis:
          "bg-lapis text-secondary-foreground hover:bg-lapis-light border border-lapis-light/30",
        ghost:
          "text-primary hover:bg-primary/10 border border-transparent hover:border-primary/30",
        outline:
          "border-2 border-primary bg-transparent text-primary hover:bg-primary/10",
        turquoise:
          "bg-turquoise text-accent-foreground hover:bg-turquoise-glow border border-turquoise-glow/50",
        papyrus:
          "bg-papyrus text-obsidian hover:bg-papyrus-dark border border-sandstone/50",
        danger:
          "bg-terracotta text-foreground hover:bg-terracotta/80 border border-terracotta/50",
        museum:
          "bg-card text-card-foreground hover:bg-muted border-2 border-gold/50 text-lg py-6 px-8",
        nav:
          "bg-gold/20 text-primary border border-gold/30 hover:bg-gold/30 hover:text-foreground transition-all",
      },
      size: {
        default: "h-10 px-6 py-2 rounded-md",
        sm: "h-9 px-4 text-xs rounded-md",
        lg: "h-12 px-8 text-base rounded-lg",
        xl: "h-14 px-10 text-lg rounded-lg",
        icon: "h-10 w-10 rounded-md",
        museum: "h-16 px-12 text-xl rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface EgyptianButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof egyptianButtonVariants> {
  shimmer?: boolean;
}

/**
 * EgyptianButton Component
 * Memoized to prevent unnecessary re-renders when parent state changes.
 */
const EgyptianButton = React.memo(React.forwardRef<HTMLButtonElement, EgyptianButtonProps>(
  ({ className, variant, size, shimmer = false, children, ...props }, ref) => {
    return (
      <button
        className={cn(egyptianButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {shimmer && (
          <span className="absolute inset-0 bg-shimmer-gold animate-shimmer" />
        )}
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      </button>
    );
  }
));
EgyptianButton.displayName = "EgyptianButton";

export { EgyptianButton, egyptianButtonVariants };
