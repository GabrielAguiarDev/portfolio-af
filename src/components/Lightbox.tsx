"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { GalleryImage } from "@/data/portfolio";
export default function Lightbox({ images }: { images: GalleryImage[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const close = () => {
    dialog.current?.close();
    setIndex(null);
    opener.current?.focus();
  };
  useEffect(() => {
    if (index === null) return;
    const el = dialog.current;
    if (!el) return;
    if (!el.open) el.showModal();
    closeButton.current?.focus();
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = old;
    };
  }, [index !== null]);
  const move = (step: number) =>
    setIndex((i) =>
      i === null ? null : (i + step + images.length) % images.length,
    );
  return (
    <>
      <div className="project-gallery">
        {images.map((im, i) => (
          <button
            key={`${im.src}-${i}`}
            className={`project-gallery__item ${im.type === "plan" ? "project-gallery__item--wide" : ""}`}
            onClick={(e) => {
              opener.current = e.currentTarget;
              setIndex(i);
            }}
            aria-label={`Aumentar imagem: ${im.alt}`}
          >
            <Image
              src={im.src}
              alt={im.alt}
              width={1400}
              height={1000}
              sizes={im.type === "plan" ? "(max-width: 900px) 100vw, 70vw" : "(max-width: 768px) 100vw, 50vw"}
            />
            <span>
              {im.caption} <span aria-hidden="true">↗</span>
            </span>
          </button>
        ))}
      </div>
      <dialog
        ref={dialog}
        className="lightbox"
        aria-label="Galeria ampliada"
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            e.preventDefault();
            move(1);
          }
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            move(-1);
          }
        }}
      >
        {index !== null && (
          <>
            <button
              ref={closeButton}
              className="lightbox__close"
              onClick={close}
              aria-label="Fechar galeria"
            >
              Fechar ×
            </button>
            <span className="lightbox__counter" aria-live="polite">
              {index + 1} / {images.length}
            </span>
            <figure className="lightbox__figure">
              <Image
                className="lightbox__image"
                src={images[index].src}
                alt={images[index].alt}
                width={1800}
                height={1200}
                sizes="95vw"
              />
              <figcaption className="lightbox__caption">
                {images[index].caption}
              </figcaption>
            </figure>
            {images.length > 1 && <button
              className="lightbox__nav lightbox__nav--prev"
              onClick={() => move(-1)}
              aria-label="Imagem anterior"
            >
              ←
            </button>}
            {images.length > 1 && <button
              className="lightbox__nav lightbox__nav--next"
              onClick={() => move(1)}
              aria-label="Próxima imagem"
            >
              →
            </button>}
          </>
        )}
      </dialog>
    </>
  );
}
