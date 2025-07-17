import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <Loader2
      className={cn(
        "animate-spin text-muted-foreground",
        sizeClasses[size],
        className
      )}
    />
  );
}

interface LoadingStateProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingState({ 
  message = "Loading...", 
  size = "md", 
  className 
}: LoadingStateProps) {
  return (
    <div className={cn("flex items-center justify-center gap-2 p-4", className)}>
      <LoadingSpinner size={size} />
      <span className="text-sm text-muted-foreground">{message}</span>
    </div>
  );
}

export function PageLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <LoadingState message="Loading page..." size="lg" />
    </div>
  );
}

export function ButtonLoading({ children, isLoading }: { children: React.ReactNode; isLoading: boolean }) {
  return (
    <span className="flex items-center gap-2">
      {isLoading && <LoadingSpinner size="sm" />}
      {children}
    </span>
  );
}