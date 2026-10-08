"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { inView, scroll } from "motion";

const REDUCED = "(prefers-reduced-motion: reduce)";
const FINE_POINTER = "(hover: hover) and (pointer: fine)";

/*
 * Movimento editorial da home, numa única estratégia: o Motion (scroll + inView) apenas
 * escreve variáveis e atributos; quem desenha é o CSS. O conteúdo nasce visível no HTML e
 * só recebe o estado "pending" depois da hidratação, e apenas o que ainda está abaixo da
 * dobra. Com prefers-reduced-motion nada é ligado.
 *
 *   [data-reveal] / [data-line]  → data-enter="pending" → "in" ao entrar na tela
 *   [data-parallax]              → --p de -1 a 1 enquanto o elemento cruza a tela
 *   [data-hero]                  → --hp de 0 a 1 na primeira tela rolada
 *   [data-tilt]                  → --mx / --my com a posição do ponteiro fino
 */
function start(root: HTMLElement) {
  const cleanups: Array<() => void> = [];
  const fold = window.innerHeight * 0.9;

  root.querySelectorAll<HTMLElement>("[data-reveal], [data-line]").forEach((element) => {
    if (element.getBoundingClientRect().top < fold) return;
    element.dataset.enter = "pending";
    cleanups.push(
      inView(
        element,
        () => {
          element.dataset.enter = "in";
        },
        { margin: "0px 0px -10% 0px" },
      ),
      () => {
        delete element.dataset.enter;
      },
    );
  });

  root.querySelectorAll<HTMLElement>("[data-parallax]").forEach((element) => {
    cleanups.push(
      // dois argumentos: o Motion só chama quando a rolagem muda, sem laço por quadro
      scroll(
        (progress: number, _info: unknown) => {
          element.style.setProperty("--p", (progress * 2 - 1).toFixed(3));
        },
        { target: element, offset: ["start end", "end start"] },
      ),
      () => {
        element.style.removeProperty("--p");
      },
    );
  });

  const hero = root.querySelector<HTMLElement>("[data-hero]");
  const bar = document.createElement("span");
  bar.className = "scroll-progress";
  bar.setAttribute("aria-hidden", "true");
  document.body.append(bar);
  cleanups.push(
    scroll((progress: number, _info: unknown) => {
      bar.style.setProperty("--scroll", progress.toFixed(4));
      hero?.style.setProperty("--hp", Math.min(window.scrollY / window.innerHeight, 1).toFixed(3));
    }),
    () => {
      bar.remove();
      hero?.style.removeProperty("--hp");
    },
  );

  if (window.matchMedia(FINE_POINTER).matches) {
    root.querySelectorAll<HTMLElement>("[data-tilt]").forEach((element) => {
      const move = (event: PointerEvent) => {
        const rect = element.getBoundingClientRect();
        element.style.setProperty("--mx", (((event.clientX - rect.left) / rect.width) * 2 - 1).toFixed(3));
        element.style.setProperty("--my", (((event.clientY - rect.top) / rect.height) * 2 - 1).toFixed(3));
      };
      const leave = () => {
        element.style.removeProperty("--mx");
        element.style.removeProperty("--my");
      };
      element.addEventListener("pointermove", move);
      element.addEventListener("pointerleave", leave);
      cleanups.push(() => {
        element.removeEventListener("pointermove", move);
        element.removeEventListener("pointerleave", leave);
        leave();
      });
    });
  }

  return () => cleanups.forEach((cleanup) => cleanup());
}

export default function EditorialMotion({ scope }: { scope: RefObject<HTMLElement | null> }) {
  useEffect(() => {
    const root = scope.current;
    if (!root) return;

    const query = window.matchMedia(REDUCED);
    let stop: (() => void) | undefined;
    const sync = () => {
      stop?.();
      stop = query.matches ? undefined : start(root);
    };

    sync();
    query.addEventListener("change", sync);
    return () => {
      query.removeEventListener("change", sync);
      stop?.();
    };
  }, [scope]);

  return null;
}

/*
 * Etapa em leitura: o item que cruza a faixa central da tela. É estado, não movimento,
 * por isso continua valendo com prefers-reduced-motion (as transições é que somem).
 */
export function useActiveStep<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const list = ref.current;
    if (!list) return;

    const stops = Array.from(list.children).map((item, index) =>
      inView(
        item,
        () => {
          setActive(index);
          // devolver uma função mantém a observação viva para as reentradas
          return () => {};
        },
        { margin: "-45% 0px -45% 0px" },
      ),
    );
    return () => stops.forEach((stop) => stop());
  }, []);

  return [ref, active] as const;
}
