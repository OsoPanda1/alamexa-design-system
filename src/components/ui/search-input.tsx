import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import React from "react";

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, containerClassName, ...props }, ref) => {
    return (
      <div className={cn("relative", containerClassName)}>
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          className={cn(
            "flex h-12 w-full rounded-lg border border-border/50 bg-muted/50 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground",
            "transition-all duration-300 focus:outline-none focus:border-accent/50 focus:shadow-silver-glow focus:bg-muted",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
SearchInput.displayName = "SearchInput";

export { SearchInput };
