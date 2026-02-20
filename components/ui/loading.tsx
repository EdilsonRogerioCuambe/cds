"use client"

import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Dynamically import Lottie to avoid SSR issues
// Dynamically import Lottie to avoid SSR issues
const Lottie = dynamic(() => import("lottie-react"), { ssr: false }) as React.ComponentType<LottieComponentProps>;

import loadingAnimation from "../../public/animations/loading.json";

const sizeClasses = {
  sm: "w-8 h-8",
  default: "w-16 h-16",
  lg: "w-32 h-32",
  xl: "w-48 h-48",
};

interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "default" | "lg" | "xl";
  variant?: "spinner" | "page" | "section";
  text?: string;
}

export function Loading({
  className,
  size = "default",
  variant = "spinner",
  text,
  ...props
}: LoadingProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (variant === "page") {
    return (
      <div className={cn("fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm", className)} {...props}>
        <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
          <div className="relative">
             <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
             <div className={sizeClasses[size]}>
                <Lottie {...{ animationData: loadingAnimation, loop: true }} />
             </div>
          </div>
          {text && <p className="text-muted-foreground font-medium animate-pulse">{text}</p>}
        </div>
      </div>
    );
  }

  if (variant === "section") {
    return (
      <div className={cn("flex flex-col items-center justify-center py-12 min-h-[200px]", className)} {...props}>
         <div className={sizeClasses[size]}>
            <Lottie {...{ animationData: loadingAnimation, loop: true }} />
         </div>
         {text && <p className="text-muted-foreground mt-3 text-sm">{text}</p>}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center", className)} {...props}>
      <div className={sizeClasses[size]}>
        <Lottie {...{ animationData: loadingAnimation, loop: true }} />
      </div>
      {text && <span className="ml-2 text-muted-foreground">{text}</span>}
    </div>
  );
}
