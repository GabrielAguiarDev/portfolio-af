"use client";

import { useRef, type ReactNode } from "react";
import EditorialMotion from "./EditorialMotion";

export default function ProjectExperience({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLElement>(null);
  return (
    <main ref={scope} id="conteudo" className="project-page">
      <EditorialMotion scope={scope} />
      {children}
    </main>
  );
}
