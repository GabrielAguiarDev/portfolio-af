import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/data/portfolio";
import Lightbox from "@/components/Lightbox";
import ArchitecturalModel from "@/components/ArchitecturalModel";
import ProjectExperience from "@/components/ProjectExperience";
import { ConceptSequence, MaterialStudy } from "@/components/ProjectEditorial";
export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((p) => p.slug === slug);
  if (!p) return { title: "Projeto não encontrado" };
  return {
    title: p.title,
    description: `${p.description} ${p.nature}.`,
    alternates: { canonical: `/projetos/${p.slug}` },
    openGraph: {
      title: p.title,
      description: p.description,
      images: [{ url: p.image, alt: p.gallery[0].alt }],
    },
  };
}
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = projects.find((p) => p.slug === slug);
  if (!p) notFound();
  const next = projects[(projects.indexOf(p) + 1) % projects.length];
  return (
    <ProjectExperience>
      <section className="project-hero container">
        <Link href="/#projetos" className="text-link">
          ← Todos os projetos
        </Link>
        <div className="project-opening">
          <div className="project-opening__copy">
            <p className="eyebrow">Estudo {String(projects.indexOf(p) + 1).padStart(2, "0")} / {p.typology}</p>
            <h1 className="project-hero__title">{p.title}</h1>
            <p className="lead">{p.description}</p>
            <p className="project-opening__nature">{p.nature}</p>
            <a href="#ideia" className="text-link">Ler a proposta ↓</a>
          </div>
          <figure className="project-hero__media project-opening__image" data-reveal="mask" data-parallax>
            <div className="project-opening__photo media">
              <div className="media__shift">
                <Image src={p.image} alt={p.gallery[0].alt} fill priority sizes="(min-width: 900px) 60vw, 100vw" />
              </div>
            </div>
            <figcaption>{p.gallery[0].caption}</figcaption>
          </figure>
        </div>
        <dl className="project-meta">
          <div>
            <dt>Tipologia</dt>
            <dd>{p.typology}</dd>
          </div>
          <div>
            <dt>Natureza</dt>
            <dd>{p.nature}</dd>
          </div>
          {p.year && (
            <div>
              <dt>Data / etapa</dt>
              <dd>{p.year}</dd>
            </div>
          )}
          {(
            [
              ["Local", p.location],
              ["Área", p.area],
              ["Autoria", p.author],
              ["Participação", p.participation],
              ["Status", p.status],
            ] as const
          )
            .filter(([, value]) => value)
            .map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
        </dl>
      </section>
      <section id="ideia" className="project-section container project-intent" aria-labelledby="ideia-titulo">
        <h2 id="ideia-titulo" className="project-section__label" data-line="top">Ponto de partida</h2>
        <div className="project-section__body">
          <div className="project-intent__pair">
            <div data-reveal="rise"><h3>O desafio</h3><p>{p.challenge}</p></div>
            <div data-reveal="rise"><h3>O conceito</h3><p>{p.concept}</p></div>
          </div>
        </div>
      </section>
      {p.study && (
        <section className="project-section container project-diagrams" aria-labelledby="gestos-titulo">
          <h2 id="gestos-titulo" className="project-section__label" data-line="top">A ideia em três gestos</h2>
          <div className="project-section__body"><ConceptSequence study={p.study} /></div>
        </section>
      )}
      <section className="project-section container" aria-labelledby="decisoes-titulo">
        <h2 id="decisoes-titulo" className="project-section__label" data-line="top">Decisões arquitetônicas</h2>
        <div className="project-section__body project-observations">
          <figure className="project-observations__image" data-reveal="mask">
            <Image src={p.detailImage} alt={p.gallery[1].alt} width={1400} height={1000} sizes="(min-width: 900px) 42vw, 100vw" />
            <figcaption>{p.gallery[1].caption}</figcaption>
          </figure>
          <ol className="project-observations__notes">
            {p.decisions.map((decision, index) => (
              <li key={decision.title} data-reveal="rise" data-line="top">
                <span className="eyebrow">{String(index + 1).padStart(2, "0")}</span>
                <h3>{decision.title}</h3><p>{decision.text}</p>
              </li>
            ))}
          </ol>
          <p className="project-observations__note">A imagem é uma referência de atmosfera e materialidade; as decisões descrevem o estudo demonstrativo, não a obra fotografada.</p>
        </div>
      </section>
      {p.study && (
        <section className="project-section container" aria-labelledby="materiais-titulo">
          <h2 id="materiais-titulo" className="project-section__label" data-line="top">Matéria e atmosfera</h2>
          <div className="project-section__body"><MaterialStudy study={p.study} /></div>
        </section>
      )}
      <section id="organizacao" className="project-section container" aria-labelledby="planta-titulo">
        <h2 id="planta-titulo" className="project-section__label" data-line="top">Organização espacial</h2>
        <div className="project-section__body project-drawing">
          <p className="project-drawing__intro">A planta aproxima a ideia da organização dos espaços. Selecione o desenho para ampliar e examinar o conjunto.</p>
          <Lightbox images={p.gallery.filter(image => image.type === "plan")} />
        </div>
      </section>
      <section className="container project-reference-gallery" aria-labelledby="referencias-titulo">
        <p className="eyebrow">Referências visuais</p>
        <h2 id="referencias-titulo">Luz, textura <em>e escala.</em></h2>
        <Lightbox images={p.gallery.filter(image => image.type !== "plan")} />
      </section>
      {p.slug === projects[0].slug && (
        <section className="project-section container">
          <h2 className="project-section__label">Ler o volume</h2>
          <div className="project-section__body">
            <p className="lead">
              Cobertura, volumes e base: a separação das camadas revela a lógica
              de uma maquete conceitual.
            </p>
            <p>
              Modelo geométrico demonstrativo independente, sem correspondência
              técnica com a planta ou as fotografias de referência. Role para
              afastar a cobertura; com movimento reduzido, a vista permanece
              estática.
            </p>
            <div
              className="model-frame"
              style={{ height: "clamp(320px, 50vw, 540px)" }}
            >
              <ArchitecturalModel variant="exploded" />
            </div>
          </div>
        </section>
      )}
      <section className="project-section container">
        <h2 className="project-section__label">Novos caminhos</h2>
        <div className="project-section__body">
          <figure className="project-hero__media">
            <Image
              src={p.detailImage}
              alt={p.gallery[1].alt}
              width={1800}
              height={1200}
              sizes="(max-width:768px) 100vw, 70vw"
            />
            <figcaption>{p.gallery[1].caption}</figcaption>
          </figure>
          <p className="lead">Cada espaço começa com uma conversa.</p>
          <Link className="btn btn--primary" href="/#contato">
            Conhecer os canais de contato ↗
          </Link>
        </div>
      </section>
      <nav className="project-nav container" aria-label="Próximo projeto">
        <Link className="project-nav__link" href={`/projetos/${next.slug}`}>
          <span className="eyebrow">Próximo estudo</span>
          <span>{next.title} ↗</span>
        </Link>
        <Link className="text-link" href="/#projetos">
          Todos os projetos
        </Link>
      </nav>
    </ProjectExperience>
  );
}
