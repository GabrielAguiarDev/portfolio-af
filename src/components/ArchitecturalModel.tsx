"use client";

import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import SceneCanvas from "./SceneCanvas";

export type ModelVariant = "hero" | "process" | "exploded";
type Point = [number, number, number];
const project = ([x, y, z]: Point) => [400 + (x - z) * 48, 365 + (x + z) * 23 - y * 66];
const polygon = (points: Point[]) => points.map(p => project(p).join(",")).join(" ");

function StaticBlock({ at, size, color = "#e6ded0", opacity = 1 }: { at: Point; size: Point; color?: string; opacity?: number }) {
  const [x, y, z] = at, [w, h, d] = size;
  const a: Point = [x - w / 2, y + h / 2, z - d / 2];
  const b: Point = [x + w / 2, y + h / 2, z - d / 2];
  const c: Point = [x + w / 2, y + h / 2, z + d / 2];
  const e: Point = [x - w / 2, y + h / 2, z + d / 2];
  const lower = (p: Point): Point => [p[0], p[1] - h, p[2]];
  return <g opacity={opacity} stroke="#8f8270" strokeWidth="0.6" strokeLinejoin="round">
    <polygon points={polygon([e, c, lower(c), lower(e)])} fill={color} />
    <polygon points={polygon([b, c, lower(c), lower(b)])} fill={color} />
    <polygon points={polygon([a, b, c, e])} fill={color} />
    <polygon points={polygon([b, c, lower(c), lower(b)])} fill="#6b6358" opacity="0.13" stroke="none" />
  </g>;
}

function StaticModel({ variant }: { variant: ModelVariant }) {
  const roofHeight = variant === "exploded" ? 3.35 : variant === "process" ? 1.68 : 2.65;
  return <svg viewBox="0 0 800 600" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <StaticBlock at={[0, -0.21, 0]} size={[7.4, 0.16, 5.6]} color="#d7ccb9" />
    <StaticBlock at={[0, 0, 0]} size={[6.4, 0.15, 4.6]} color="#d0c3ad" />
    <StaticBlock at={[0, 0.105, 0.1]} size={[2.35, 0.055, 2.85]} color="#94997d" />
    {[-0.7, -0.1, 0.5, 1.1].map(z => <StaticBlock key={z} at={[-0.6, 0.16, z]} size={[0.63, 0.035, 0.38]} />)}
    <StaticBlock at={[0, 0.85, -2.1]} size={[6, 1.5, 0.12]} />
    <StaticBlock at={[-3, 0.85, 0]} size={[0.12, 1.5, 4.3]} color="#ac755c" />
    <StaticBlock at={[3, 0.85, 0]} size={[0.12, 1.5, 4.3]} />
    <StaticBlock at={[-2.1, 0.7, -0.5]} size={[1.7, 1.2, 0.08]} />
    <StaticBlock at={[2.1, 0.7, 0.3]} size={[1.7, 1.2, 0.08]} color="#ac755c" />
    {[-1.2, 1.2].map(x => <g key={x}>
      <StaticBlock at={[x, 0.85, 0.1]} size={[0.03, 1.45, 2.8]} color="#a4bab3" opacity={0.48} />
      {[-1.3, -0.6, 0.1, 0.8, 1.5].map(z => <StaticBlock key={z} at={[x, 0.85, z]} size={[0.04, 1.5, 0.04]} color="#615c4f" />)}
    </g>)}
    {[{ x: 0.65, z: -0.6, h: 0.95 }, { x: 0.7, z: 0.6, h: 0.5 }].map(({ x, z, h }) => {
      const bottom = project([x, 0.12, z]), top = project([x, h, z]);
      return <g key={z}><path d={`M${bottom.join(" ")}L${top.join(" ")}`} stroke="#807059" strokeWidth="3" />
        <ellipse cx={top[0]} cy={top[1]} rx={h * 24} ry={h * 28} fill="#858c71" />
        <ellipse cx={top[0] - 4} cy={top[1] - 5} rx={h * 16} ry={h * 20} fill="#98a083" /></g>;
    })}
    {Array.from({ length: 9 }, (_, i) => <StaticBlock key={i} at={[1.1 + i * 0.21, 0.85, 2.15]} size={[0.045, 1.5, 0.16]} color="#96775a" />)}
    <StaticBlock at={[-2.1, roofHeight, 0]} size={[2.05, 0.14, 4.75]} color="#eee7db" />
    <StaticBlock at={[0, roofHeight, -1.8]} size={[2.15, 0.14, 1.15]} color="#eee7db" />
    <StaticBlock at={[2.1, roofHeight, 0]} size={[2.05, 0.14, 4.75]} color="#eee7db" />
    <StaticBlock at={[0, -0.025, 2.62]} size={[4.9, 0.1, 0.43]} color="#c0af95" />
  </svg>;
}

class SceneBoundary extends Component<{ children: ReactNode; fallback: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

export default function ArchitecturalModel({ variant = "hero", className = "" }: { variant?: ModelVariant; className?: string }) {
  const host = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false), [ready, setReady] = useState(false);
  const [sceneReady, setSceneReady] = useState(false), [pageVisible, setPageVisible] = useState(true);
  const [fine, setFine] = useState(false);
  const [reduce, setReduce] = useState(true), [failed, setFailed] = useState(false), [stage, setStage] = useState(0);
  const unavailable = useCallback(() => { setSceneReady(false); setFailed(true); }, []);
  const updateStage = useCallback((value: number) => setStage(value), []);
  const rendered = useCallback(() => setSceneReady(true), []);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => { setSceneReady(false); setReduce(query.matches); };
    const pointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const updatePointer = () => setFine(pointerQuery.matches);
    updatePointer(); pointerQuery.addEventListener("change", updatePointer);
    update(); query.addEventListener("change", update);
    let supported = false;
    try {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("webgl2");
      supported = Boolean(context);
      context?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch { /* The static drawing also works without a GPU. */ }
    setReady(supported);
    const observer = new IntersectionObserver(entries => setVisible(entries[0].isIntersecting));
    if (host.current) observer.observe(host.current);
    const updatePageVisibility = () => setPageVisible(document.visibilityState === "visible");
    updatePageVisibility(); document.addEventListener("visibilitychange", updatePageVisibility);
    return () => { observer.disconnect(); query.removeEventListener("change", update); pointerQuery.removeEventListener("change", updatePointer); document.removeEventListener("visibilitychange", updatePageVisibility); };
  }, []);
  const animated = ready && !reduce && !failed;
  return <div ref={host} className={className} data-architectural-model={variant}
    style={{ width: "100%", height: "100%", position: "relative", overflow: "hidden" }}
    role="group" aria-label={variant === "process" ? "Maquete arquitetônica demonstrativa de casa-pátio em quatro etapas: volume, aberturas, organização dos espaços e materiais da casa final, com vidro, brises e jardim." : "Maquete arquitetônica demonstrativa de casa-pátio: base em pedra, planos estruturais, caixilhos de vidro, divisórias, jardim e cobertura separada para revelar o interior."}>
    <div style={{ position: "absolute", inset: animated ? "0 0 56px" : 0 }} aria-hidden="true"><StaticModel variant={variant} /></div>
    {animated && <div style={{ position: "absolute", inset: "0 0 56px", opacity: sceneReady ? 1 : 0 }} aria-hidden="true">
      <SceneBoundary fallback={<StaticModel variant={variant} />} onFailure={unavailable}>
        <SceneCanvas variant={variant} active={visible && pageVisible} onReady={rendered} onStageChange={updateStage} onUnavailable={unavailable} />
      </SceneBoundary>
    </div>}
    {animated && !sceneReady && <span role="status" style={{ position: "absolute", inset: "auto 18px 16px", color: "#63615b", fontSize: "12px" }}>Preparando a maquete interativa…</span>}
    {!animated && <span style={{ position: "absolute", inset: "auto 18px 16px", color: "#63615b", fontSize: "10px" }}>Visualização estática</span>}
    {animated && sceneReady && <div aria-hidden="true" style={{ position: "absolute", inset: "auto 18px 16px", pointerEvents: "none", color: "#746c5f", fontSize: "10px", letterSpacing: "0.05em", fontFamily: "inherit" }}>
      <div style={{ display: "flex", gap: "14px", marginBottom: "8px" }}>
        {(variant === "process" ? ["Volume", "Aberturas", "Organização", "Matéria"] : ["Volume", "Interior", "Matéria"]).map((label, index) => <span key={label} style={{ opacity: stage === index ? 1 : 0.4, borderBottom: stage === index ? "1px solid #9c765d" : "1px solid transparent", paddingBottom: "3px" }}>{label}</span>)}
      </div>
      <span>{variant === "process" ? "Role para acompanhar" : "Role para abrir"}{fine && <><span style={{ opacity: 0.5 }}> / </span>Mova o mouse para explorar</>}</span>
    </div>}
  </div>;
}
