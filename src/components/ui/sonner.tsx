import * as React from "react";

export function Sonner({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement> & Record<string, unknown>) {
  return <div className={className} {...props}>{children}</div>;
}

export default Sonner;
