"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import BrandLogo from "./BrandLogo";
import HomeLink from "./HomeLink";
export default function Header() {
  const [open, setOpen] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (open) {
      setMenuVisible(true);
      return;
    }
    if (!mobile || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMenuVisible(false);
      return;
    }
    // Keep the panel painted until the exit transition has finished.
    const timer = window.setTimeout(() => setMenuVisible(false), 320);
    return () => window.clearTimeout(timer);
  }, [open, mobile]);
  useEffect(() => {
    const query = window.matchMedia("(max-width: 719px)");
    const update = () => {
      setMobile(query.matches);
      if (!query.matches) setOpen(false);
    };
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (!open) return;
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);
  return (
    <header className="site-header" data-open={open} data-menu-visible={open || menuVisible}>
      <div className="site-header__inner container">
        <HomeLink
          className="site-header__brand"
          onClick={() => setOpen(false)}
        >
          <BrandLogo priority variant="mark" />
        </HomeLink>
        <button
          ref={toggle}
          className="site-nav__toggle"
          aria-expanded={open}
          aria-controls="site-navigation"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
        >
          {open ? "Fechar" : "Menu"}
        </button>
        <nav
          className="site-nav"
          id="site-navigation"
          aria-label="Navegação principal"
          inert={mobile && !open}
        >
          <ul className="site-nav__list">
            {[
              ["projetos", "Projetos"],
              ["sobre", "Sobre"],
              ["processo", "Processo"],
              ["contato", "Contato"],
            ].map(([id, label]) => (
              <li key={id}>
                <Link
                  className="site-nav__link"
                  href={`/#${id}`}
                  onClick={() => {
                    setOpen(false);
                    if (mobile) toggle.current?.focus({ preventScroll: true });
                  }}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
