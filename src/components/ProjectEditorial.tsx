import type { CSSProperties } from "react";
import type { Project } from "@/data/portfolio";
import styles from "./ProjectEditorial.module.css";

type Study = NonNullable<Project["study"]>;

// Deliberately schematic: these drawings explain an idea, not dimensions or execution.
function Diagram({ kind, step }: { kind: Study["diagram"]; step: number }) {
  const ink = "#252522", clay = "#a66f57", paper = "#f4f1eb";
  return (
    <svg viewBox="0 0 320 230" aria-hidden="true" fill="none" strokeLinecap="square">
      <path d="M28 202H292M28 197V207M292 197V207" stroke={ink} strokeOpacity=".25" />
      {kind === "courtyard" && <>
        <rect x="53" y="37" width="214" height="141" fill="#ddd8cc" stroke={ink} strokeWidth="2" />
        {step > 0 && <>
          <rect x="125" y="79" width="70" height="62" fill={paper} stroke={clay} strokeWidth="2" />
          <circle cx="160" cy="110" r="17" fill="#8e967c" fillOpacity=".3" stroke="#78836a" />
          <path d="M145 110H175M160 95V125" stroke="#78836a" />
        </>}
        {step > 1 && <>
          <path d="M110 37V79M110 141V178M210 37V79M210 141V178M53 106H110M210 106H267" stroke={ink} strokeWidth="3" />
          <path d="M102 157H219V65H102V157" stroke={clay} strokeDasharray="4 5" />
          <path d="M217 157L210 151M217 157L210 163" stroke={clay} />
        </>}
      </>}
      {kind === "planes" && <>
        <rect x="43" y="42" width="234" height="135" fill="#e4dfd5" stroke={ink} strokeWidth="2" />
        <path d="M43 106H277" stroke={ink} strokeOpacity=".2" strokeDasharray="3 5" />
        {step > 0 && <>
          <path d="M123 42V118M203 103V177" stroke={clay} strokeWidth="5" />
          <path d="M102 144H159V74H222" stroke={ink} strokeDasharray="4 5" />
          <path d="M221 74L214 68M221 74L214 80" stroke={ink} />
        </>}
        {step > 1 && <>
          <rect x="61" y="59" width="42" height="60" fill="#c7ad88" fillOpacity=".55" stroke="#947659" />
          <rect x="145" y="57" width="34" height="36" fill="#f4f1eb" stroke={ink} strokeOpacity=".5" />
          <circle cx="243" cy="140" r="15" fill="#c7ad88" fillOpacity=".55" stroke="#947659" />
          <path d="M143 167H181V141H143Z" stroke={ink} strokeOpacity=".5" />
        </>}
      </>}
      {kind === "pavilion" && <>
        <path d="M46 153L113 179L276 110L209 84Z" fill="#d3cbbb" stroke={ink} strokeWidth="1.5" />
        {step > 0 && <>
          {[[65, 145], [120, 167], [164, 103], [220, 125], [258, 105], [204, 91]].map(([x, y]) =>
            <path key={`${x}-${y}`} d={`M${x} ${y}V${y - 64}`} stroke={ink} strokeWidth="2.5" />)}
        </>}
        {step > 1 && <>
          <path d="M46 82L113 108L276 39L209 13Z" fill="#e4dfd5" stroke={ink} strokeWidth="1.5" />
          <path d="M46 82V89L113 115L276 46V39M113 108V115" stroke={ink} strokeOpacity=".5" />
          <path d="M35 168L44 162M287 123L278 117" stroke={clay} strokeWidth="2" />
        </>}
      </>}
    </svg>
  );
}

export function ConceptSequence({ study }: { study: Study }) {
  return <div className={styles.sequence}>
    <ol className={styles.gestures}>
      {study.gestures.map((gesture, index) => <li key={gesture.title} data-reveal="rise">
        <div className={styles.drawing}><Diagram kind={study.diagram} step={index} /></div>
        <div className={styles.gestureHeading}>
          <span className="eyebrow">{String(index + 1).padStart(2, "0")}</span>
          <h3>{gesture.title}</h3>
        </div>
        <p>{gesture.text}</p>
      </li>)}
    </ol>
    <p className={styles.note}>Diagramas conceituais demonstrativos, sem escala. Explicam a proposta; não representam documentação técnica ou as fotografias de referência.</p>
  </div>;
}

export function MaterialStudy({ study }: { study: Study }) {
  return <div className={styles.materials}>
    <ul className={styles.palette}>
      {study.materials.map(material => <li key={material.name} data-reveal="rise">
        <div className={`${styles.swatch} ${(styles[material.texture] ?? "")}`} style={{ "--material": material.color } as CSSProperties} aria-hidden="true" />
        <h3>{material.name}</h3>
        <p>{material.use}</p>
      </li>)}
    </ul>
    <p className={styles.note}>Paleta de intenção do estudo. As amostras são esquemáticas e não especificam produtos ou acabamentos executivos.</p>
  </div>;
}
