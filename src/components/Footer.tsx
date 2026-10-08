import Link from "next/link";
import BrandLogo from "./BrandLogo";
import HomeLink from "./HomeLink";
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner container">
        <HomeLink className="site-footer__brand">
          <BrandLogo />
        </HomeLink>
        <nav className="site-footer__nav" aria-label="Navegação do rodapé">
          <Link href="/#projetos">Projetos</Link>
          <Link href="/#contato">Contato</Link>
          <HomeLink>Voltar ao início ↑</HomeLink>
        </nav>
        <p className="site-footer__note">
          Portfólio demonstrativo. Estudos e ilustrações conceituais, sem
          atribuição de obras executadas.
          <br />© {new Date().getFullYear()} · Dados profissionais a preencher.
        </p>
      </div>
    </footer>
  );
}
