import * as React from "react";

export function Toaster({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement> & { [key: string]: unknown }) {
  return <div className={className} {...props}>{children}</div>;
}

export default Toaster;
