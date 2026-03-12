import * as React from "react";

export function Avatar({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`} {...props}>{children}</div>;
}
export function AvatarImage({ src, alt, className = "" }: { src?: string; alt?: string; className?: string }) {
  return src ? <img src={src} alt={alt ?? ""} className={`aspect-square h-full w-full ${className}`} /> : null;
}
export function AvatarFallback({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`flex h-full w-full items-center justify-center rounded-full bg-muted ${className}`} {...props}>{children}</div>;
}
