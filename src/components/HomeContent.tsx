"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, type CSSProperties, type ReactNode } from "react";
import ArchitecturalModel from "@/components/ArchitecturalModel";
import EditorialMotion, { useActiveStep } from "@/components/EditorialMotion";
import useProcessBoundary from "@/components/useProcessBoundary";
import { architect, projects } from "@/data/portfolio";

type Service = string | { title: string; text?: string; description?: string };
type Channel = { label: string; value: string; href: string };

const LAYOUTS = ["a", "b", "c"] as const;

const PROCESS_STEPS = [
  {
    title: "Escuta e contexto",
    text: "Conversas, visita e levantamento. Antes de qualquer traço, entender rotinas, desejos, orientação solar e o que o lugar já propõe.",
  },
  {
    title: "Conceito e estudos",
    text: "Croquis, diagramas e maquetes de estudo testam implantação, cheios e vazios, até que uma ideia central passe a orientar as escolhas seguintes.",
  },
  {
    title: "Desenvolvimento",
    text: "Plantas, cortes e detalhes amadurecem junto com a definição de materiais, luz e mobiliário, dando precisão ao que o conceito anunciou.",
  },
  {
    title: "Representação e apresentação",
    text: "Desenhos, imagens e modelos organizam o projeto em uma narrativa clara, para que cada decisão possa ser lida, discutida e compartilhada.",
  },
];

/*
 * Entrada curta ao rolar. O conteúdo nasce visível; EditorialMotion só arma o estado
 * inicial depois da hidratação e apenas para o que ainda está abaixo da dobra.
 */
function Reveal({
  children,
  className,
  delay = 0,
  line,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  line?: "bottom" | "top";
}) {
  return (
    <div
      className={className}
      data-reveal="rise"
      data-line={line}
      style={delay ? ({ "--d": `${delay}s` } as CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}

/* Placeholders entre colchetes nos dados indicam perfil ainda não configurado. */
const isPending = (value: string | null | undefined) => !value || /^\[.*\]$/.test(value.trim());

function buildChannels(): Channel[] {
  const email = architect.email as string | null;
  const whatsapp = architect.whatsapp as string | null;
  const instagram = architect.instagram as string | null;
  const channels: Channel[] = [];

  if (email && !isPending(email)) {
    channels.push({ label: "E-mail", value: email, href: `mailto:${email}` });
  }
  if (whatsapp && !isPending(whatsapp)) {
    const digits = whatsapp.replace(/\D/g, "");
    if (digits) channels.push({ label: "WhatsApp", value: whatsapp, href: `https://wa.me/${digits}` });
  }
  if (instagram && !isPending(instagram)) {
    const handle = instagram.replace(/^https?:\/\/(www\.)?instagram\.com\//, "").replace(/^@/, "").replace(/\/$/, "");
    if (handle) channels.push({ label: "Instagram", value: `@${handle}`, href: `https://instagram.com/${handle}` });
  }
  return channels;
}

export default function HomeContent() {
  const cover = projects.find((project) => project.featured) ?? projects[0];
  const selected = projects;
  const services = architect.services as ReadonlyArray<Service>;
  const channels = buildChannels();
  const locationPending = isPending(architect.location);
  const educationPending = isPending(architect.education);
  const nameWords = architect.name.trim().split(/\s+/);
  const scope = useRef<HTMLElement>(null);
  const [stepsRef, activeStep] = useActiveStep<HTMLOListElement>();
  useProcessBoundary(stepsRef);

  return (
      <main ref={scope} id="conteudo" className="home">
        <EditorialMotion scope={scope} />

        {/* ------------------------------------------------------------ Hero */}
        <section className="hero container" aria-labelledby="hero-titulo" data-hero>
          <div className="hero__strip">
            <span className="eyebrow">Portfólio de arquitetura</span>
            <span className="eyebrow">Edição demonstrativa</span>
          </div>

          <div className="hero__stage">
            {cover && (
              <figure className="hero__media">
                <div className="hero__photo media">
                  <div className="media__shift">
                    <Image
                      src={cover.image}
                      alt="Fotografia de referência arquitetônica, sem vínculo com os estudos nem autoria da arquiteta"
                      fill
                      priority
                      sizes="(min-width: 900px) 66vw, 100vw"
                    />
                  </div>
                </div>
                <figcaption className="hero__caption">Fotografia de referência · sem vínculo de autoria</figcaption>
              </figure>
            )}

            <div className="hero__title-block">
              <p className="hero__role">
                <span>{architect.role}</span>
                {!locationPending && <span>{architect.location}</span>}
              </p>
              <h1 id="hero-titulo" className="hero__title">
                {nameWords.map((word, index) => (
                  <span key={index}>
                    {index > 0 && " "}
                    <span className="hero__word" style={{ "--i": index } as CSSProperties}>
                      {word}
                    </span>
                  </span>
                ))}
              </h1>
              {/* linha de cota: detalhe de desenho técnico */}
              <div className="hero__rule" aria-hidden="true">
                <span className="hero__rule-line" />
              </div>
            </div>

            <p className="hero__statement">
              Espaços desenhados entre <em>luz</em>, matéria e <em>tempo</em>.
            </p>

            <div className="hero__actions">
              <p className="lead">
                Arquitetura e interiores pensados a partir da escuta, do lugar e da vida cotidiana.
              </p>
              <div className="hero__cta">
                <Link className="btn btn--primary" href="/#projetos">
                  Ver projetos
                </Link>
                <Link className="btn btn--ghost" href="/#sobre">
                  Sobre a arquiteta
                </Link>
              </div>
            </div>
          </div>

          <div className="hero__study">
            <div className="hero__study-head" data-line>
              <span className="eyebrow">Fig. 01 — Maquete de estudo</span>
              <span className="demo-tag">Demonstrativo</span>
            </div>

            <div className="hero__study-stage">
              <div className="model-frame" data-reveal="mask">
                <ArchitecturalModel variant="hero" />
              </div>
            </div>

            <div className="hero__study-note">
              <p className="hero__study-title">O volume antes da matéria.</p>
              <p>
                Modelo digital de volumetria, usado para testar cheios, vazios e a entrada de luz. Estudo
                demonstrativo.
              </p>
              {/* ficha da figura; o estado da maquete é indicado dentro do próprio modelo */}
              <dl className="hero__study-specs">
                <div>
                  <dt>Tipo</dt>
                  <dd>Volumetria digital</dd>
                </div>
                <div>
                  <dt>Escala</dt>
                  <dd>Sem escala</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------- Projetos */}
        <section id="projetos" className="section" aria-labelledby="projetos-titulo">
          <div className="container">
            <Reveal className="section__head" line="bottom">
              <h2 id="projetos-titulo" className="section__title" data-parallax>
                Projetos <em>selecionados</em>
              </h2>
              <div className="section__aside">
                <span className="demo-tag">Conteúdo demonstrativo</span>
                <p>
                  Os {selected.length} estudos a seguir são exemplos ilustrativos, não construídos. As fotografias são
                  referências, sem vínculo com os estudos nem autoria da arquiteta.
                </p>
              </div>
            </Reveal>

            <nav className="project-index" aria-label="Índice dos estudos">
              <p className="eyebrow">Nesta edição</p>
              <ol>
                {selected.map((project, index) => (
                  <li key={project.slug}>
                    <a href={`#estudo-${project.slug}`}>
                      <span className="project-index__number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                      <span><strong>{project.title}</strong><small>{project.typology}</small></span>
                      <span className="project-index__arrow" aria-hidden="true">↓</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="works">
              {selected.map((project, index) => {
                const layout = LAYOUTS[index % LAYOUTS.length];
                const number = String(index + 1).padStart(2, "0");
                return (
                    <article
                      key={project.slug}
                      id={`estudo-${project.slug}`}
                      className={`work work--${layout}`}
                      aria-labelledby={`projeto-${project.slug}`}
                      data-tilt
                    >
                      <Link href={`/projetos/${project.slug}`} aria-label={`Abrir projeto ${project.title}`} className="work__media work__media--main media" data-reveal="mask" data-parallax>
                        <div className="media__shift">
                          <Image
                            src={project.image}
                            alt={`Fotografia de referência arquitetônica para o estudo ${project.title}, sem vínculo de autoria`}
                            fill
                            sizes={layout === "a" ? "(min-width: 900px) 92vw, 100vw" : "(min-width: 900px) 62vw, 100vw"}
                          />
                        </div>
                      </Link>

                      <span className="work__index" aria-hidden="true">
                        Nº {number}
                      </span>

                      {layout === "b" && <p className="work__quote">{project.concept}</p>}

                      <h3 id={`projeto-${project.slug}`} className="work__title" data-parallax>
                        <Link className="work__link" href={`/projetos/${project.slug}`}>
                          {project.title}
                        </Link>
                      </h3>

                      <div className="work__body" data-reveal="rise">
                        <p className="work__description">{project.description}</p>
                        <p className="work__meta">
                          <span>{project.typology}</span>
                          <span>{project.year}</span>
                        </p>
                        <Link className="work__more" href={`/projetos/${project.slug}`} aria-label={`Ver projeto completo: ${project.title}`}>
                          Ver projeto completo <span aria-hidden="true">↗</span>
                        </Link>
                        <p className="work__credit">Fotografia de referência · sem vínculo com o estudo.</p>
                      </div>

                    </article>
                );
              })}
            </div>

            <p className="works__foot" data-line="top">
              <span>{String(selected.length).padStart(2, "0")} estudos nesta edição</span>
              <span>
                Fotografias de referência e plantas conceituais — a substituir por registros de projetos reais.
              </span>
            </p>
          </div>
        </section>

        {/* ----------------------------------------------------------- Sobre */}
        <section id="sobre" className="section section--tint" aria-labelledby="sobre-titulo">
          <div className="container about">
            <Reveal className="about__portrait">
              {architect.portrait ? (
                <Image
                  className="about__photo"
                  src={architect.portrait.src}
                  alt={architect.portrait.alt}
                  width={architect.portrait.width}
                  height={architect.portrait.height}
                  sizes="(min-width: 900px) 30vw, (min-width: 560px) 416px, 90vw"
                />
              ) : (
              <div
                className="portrait-placeholder"
                role="img"
                aria-label="Espaço reservado para o retrato da arquiteta; fotografia ainda não fornecida."
              >
                <span className="eyebrow portrait-placeholder__label">Retrato · 4 : 5</span>
                <span className="portrait-placeholder__note">Espaço reservado para o retrato.</span>
              </div>
              )}
            </Reveal>

            <div className="about__text">
              <Reveal>
                <span className="eyebrow">Sobre</span>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 id="sobre-titulo" className="about__name">
                  A arquiteta
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="about__bio">{architect.bio}</p>
              </Reveal>
              <Reveal delay={0.15}>
                <dl className="facts">
                  <div className="facts__row">
                    <dt className="eyebrow">Nome</dt>
                    <dd className={isPending(architect.name) ? "pending" : undefined}>
                      {isPending(architect.name) ? "A preencher na configuração do perfil." : architect.name}
                    </dd>
                  </div>
                  <div className="facts__row">
                    <dt className="eyebrow">Atuação</dt>
                    <dd>{architect.role}</dd>
                  </div>
                  <div className="facts__row">
                    <dt className="eyebrow">Formação</dt>
                    <dd className={educationPending ? "pending" : undefined}>
                      {educationPending ? "A preencher na configuração do perfil." : architect.education}
                    </dd>
                  </div>
                  <div className="facts__row">
                    <dt className="eyebrow">Localização</dt>
                    <dd className={locationPending ? "pending" : undefined}>
                      {locationPending ? "Cidade e estado de atuação a informar." : architect.location}
                    </dd>
                  </div>
                  {architect.interests.length > 0 && (
                    <div className="facts__row">
                      <dt className="eyebrow">Interesses</dt>
                      <dd>
                        <ul className="facts__list">
                          {architect.interests.map((interest) => (
                            <li key={interest}>{interest}</li>
                          ))}
                        </ul>
                      </dd>
                    </div>
                  )}
                </dl>
              </Reveal>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------- Processo */}
        <section id="processo" className="section" aria-labelledby="processo-titulo">
          <div className="container">
            <Reveal className="section__head" line="bottom">
              <h2 id="processo-titulo" className="section__title" data-parallax>
                Da escuta <em>à apresentação</em>
              </h2>
              <div className="section__aside">
                <span className="demo-tag">Roteiro demonstrativo</span>
                <p>Quatro etapas de referência; o processo real será ajustado ao perfil da arquiteta.</p>
              </div>
            </Reveal>

            <div className="process">
              <figure className="process__model">
                <div className="model-frame">
                  <ArchitecturalModel variant="process" />
                </div>
                <figcaption className="process__model-caption">
                  <span>Fig. 02 — Maquete digital de estudo, demonstrativa.</span>
                  {/* espelho visual da etapa em leitura; o texto das etapas está na lista ao lado */}
                  <span className="process__state" aria-hidden="true">
                    <span>
                      {activeStep === null
                        ? `${String(PROCESS_STEPS.length).padStart(2, "0")} etapas`
                        : `Etapa ${String(activeStep + 1).padStart(2, "0")} / ${String(PROCESS_STEPS.length).padStart(2, "0")} — ${PROCESS_STEPS[activeStep].title}`}
                    </span>
                  </span>
                </figcaption>
              </figure>

              <ol ref={stepsRef} className="steps" data-active={activeStep ?? undefined}>
                {PROCESS_STEPS.map((step, index) => (
                  <li
                    key={step.title}
                    className="step"
                    data-state={activeStep === null ? undefined : index === activeStep ? "active" : "idle"}
                  >
                    <span className="step__number" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="step__title">{step.title}</h3>
                    <p className="step__text">{step.text}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* ------------------------------- Áreas de atuação (se confirmadas) */}
        {services.length > 0 && (
          <section className="section section--tint" aria-labelledby="atuacao-titulo">
            <div className="container">
              <Reveal className="section__head" line="bottom">
                <h2 id="atuacao-titulo" className="section__title" data-parallax>
                  Áreas de <em>atuação</em>
                </h2>
              </Reveal>
              <ul className="services">
                {services.map((service) => {
                  const title = typeof service === "string" ? service : service.title;
                  const text = typeof service === "string" ? undefined : (service.text ?? service.description);
                  return (
                    <li key={title} className="services__item">
                      <h3 className="services__title">{title}</h3>
                      {text && <p>{text}</p>}
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        )}

        {/* --------------------------------------------------------- Contato */}
        <section
          id="contato"
          className={services.length > 0 ? "section" : "section section--tint"}
          aria-labelledby="contato-titulo"
        >
          <div className="container contact">
            <Reveal className="contact__title-wrap">
              <span className="eyebrow">Contato</span>
            </Reveal>
            <Reveal>
              <h2 id="contato-titulo" className="contact__title" data-parallax>
                Todo projeto começa por uma <em>conversa</em>.
              </h2>
            </Reveal>

            <Reveal className="contact__panel" delay={0.1} line="top">
              {channels.length > 0 ? (
                <ul className="contact__channels">
                  {channels.map((channel) => (
                    <li key={channel.label} className="contact__channel">
                      <span className="eyebrow">{channel.label}</span>
                      <a
                        className="text-link"
                        href={channel.href}
                        {...(channel.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      >
                        {channel.value}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <>
                  <p className="contact__pending">
                    Os canais de contato serão publicados aqui assim que o perfil for configurado.
                  </p>
                  <p className="contact__note">
                    Nenhum e-mail, telefone ou rede social foi informado até o momento — por isso esta página
                    não exibe links nem formulário.
                  </p>
                </>
              )}
            </Reveal>
          </div>
        </section>
      </main>
  );
}
