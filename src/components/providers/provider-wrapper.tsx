"use client";

import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";

export default function ProvidersWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState<boolean>(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  //   if (!mounted) return <SessionProvider>{children}</SessionProvider>;
  if (!mounted) return children;

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      {children}
      {/* <SessionProvider>{children}</SessionProvider> */}
    </ThemeProvider>
  );
}
