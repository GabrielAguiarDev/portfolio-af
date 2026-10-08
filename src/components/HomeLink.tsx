"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";

/** Same-page navigation must also work after the visitor has scrolled. */
export default function HomeLink({ children, className, onClick }: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <Link href="/" className={className} aria-label="Voltar ao início" onClick={(event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      onClick?.();
      if (pathname !== "/") return;
      event.preventDefault();
      router.replace("/", { scroll: false });
      window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    }}>
      {children}
    </Link>
  );
}
