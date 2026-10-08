import type { Metadata } from "next";
import Link from "next/link";
import HomeLink from "@/components/HomeLink";
export const metadata: Metadata = {
  title: "Página não encontrada",
  description:
    "A página procurada não foi encontrada. Explore os estudos demonstrativos do portfólio.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main id="conteudo" className="not-found container">
      <p className="not-found__code eyebrow">404 · Página não encontrada</p>
      <h1 className="not-found__title">Um caminho fora da planta.</h1>
      <p className="not-found__text">
        Não encontramos esta página. O endereço pode ter mudado ou estar incompleto.
        Você pode voltar ao início ou conhecer os projetos selecionados.
      </p>
      <div className="not-found__actions">
        <HomeLink className="btn btn--primary">Voltar ao início</HomeLink>
        <Link className="btn btn--ghost" href="/#projetos">Explorar projetos <span aria-hidden="true">↗</span></Link>
      </div>
    </main>
  );
}
