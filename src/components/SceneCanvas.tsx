"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { Color, Group, MathUtils, Mesh, MeshStandardMaterial } from "three";
import type { ModelVariant } from "./ArchitecturalModel";

type Point = [number, number, number];
type SceneProps = {
  variant: ModelVariant;
  active: boolean;
  onReady?: () => void;
  onStageChange?: (stage: number) => void;
  onUnavailable?: () => void;
};
const palette = { stone: "#e5dccd", clay: "#a96f54", frame: "#544f43", green: "#858c71", concrete: "#d0c3ad" };

function Block({ position, size, color = palette.stone, glass = false }: {
  position: Point; size: Point; color?: string; glass?: boolean;
}) {
  return <mesh position={position} castShadow={!glass} receiveShadow userData={{ finish: color }}>
    <boxGeometry args={size} />
    <meshStandardMaterial color={color} roughness={glass ? 0.18 : 0.85} metalness={glass ? 0.12 : 0}
      transparent={glass} opacity={glass ? 0.34 : 1} depthWrite={!glass} />
  </mesh>;
}

function WindowWall({ x, z, width, side = false }: { x: number; z: number; width: number; side?: boolean }) {
  return <group position={[x, 0, z]} rotation={[0, side ? Math.PI / 2 : 0, 0]}>
    <Block position={[0, 0.83, 0]} size={[width, 1.46, 0.025]} color="#a9bcb5" glass />
    {[0.12, 1.57].map(y => <Block key={y} position={[0, y, 0]} size={[width, 0.035, 0.055]} color={palette.frame} />)}
    {[-0.5, -0.25, 0, 0.25, 0.5].map(r => <Block key={r} position={[r * width, 0.84, 0]} size={[0.032, 1.5, 0.055]} color={palette.frame} />)}
  </group>;
}

function Plant({ x, z, height = 0.7 }: { x: number; z: number; height?: number }) {
  return <group position={[x, 0.1, z]}>
    <Block position={[0, height / 2, 0]} size={[0.055, height, 0.055]} color="#807059" />
    <mesh position={[0, height, 0]} castShadow>
      <icosahedronGeometry args={[height * 0.36, 1]} />
      <meshStandardMaterial color={palette.green} roughness={1} />
    </mesh>
  </group>;
}

function Building({ variant, active, onStageChange, onUnavailable }: SceneProps) {
  const group = useRef<Group>(null), roof = useRef<Group>(null), floor = useRef<Group>(null);
  const mass = useRef<Group>(null), partitions = useRef<Group>(null), details = useRef<Group>(null);
  const target = useRef({ progress: 0, x: 0, y: 0 });
  const current = useRef({ progress: 0, x: 0, y: 0 });
  const finishes = useRef<{ material: MeshStandardMaterial; color: Color }[]>([]);
  const { gl, invalidate, camera } = useThree();

  useEffect(() => {
    const host = gl.domElement.closest<HTMLElement>("[data-architectural-model]");
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const read = () => {
      const section = host?.closest(variant === "process" ? ".process" : ".hero__study") || host;
      const rect = section?.getBoundingClientRect();
      if (rect) {
        const viewport = window.innerHeight;
        target.current.progress = MathUtils.clamp(variant === "process"
          ? (viewport * 0.65 - rect.top) / Math.max(1, rect.height - viewport * 0.35)
          : (viewport * 0.64 - rect.top) / Math.max(1, rect.height * 0.8), 0, 1);
        if (variant === "process" && window.innerWidth < 900 && host) {
          // On touch layouts the model precedes the stacked steps, so its short
          // sequence follows its own visible passage instead of offscreen text.
          const modelRect = host.getBoundingClientRect();
          target.current.progress = MathUtils.clamp(
            (viewport * 0.65 - modelRect.top) / Math.max(1, modelRect.height * 0.7), 0, 1,
          );
        } else if (variant === "process") {
          const steps = section?.querySelectorAll(".steps > li");
          if (steps && steps.length > 1) {
            const first = steps[0].getBoundingClientRect();
            const last = steps[steps.length - 1].getBoundingClientRect();
            const firstCenter = first.top + first.height / 2;
            const lastCenter = last.top + last.height / 2;
            target.current.progress = MathUtils.clamp((viewport * 0.5 - firstCenter) / Math.max(1, lastCenter - firstCenter), 0, 1);
          }
        }
        const p = target.current.progress;
        onStageChange?.(variant === "process" ? (p < 1 / 6 ? 0 : p < 0.5 ? 1 : p < 5 / 6 ? 2 : 3) : (p < 0.3 ? 0 : p < 0.78 ? 1 : 2));
      }
      invalidate();
    };
    const pointer = (event: PointerEvent) => {
      if (!active || !fine.matches || !host) return;
      const rect = host.getBoundingClientRect();
      target.current.x = MathUtils.clamp((event.clientX - rect.left) / rect.width * 2 - 1, -1, 1);
      target.current.y = MathUtils.clamp((event.clientY - rect.top) / rect.height * 2 - 1, -1, 1);
      invalidate();
    };
    const leave = () => { target.current.x = 0; target.current.y = 0; invalidate(); };
    const lost = (event: Event) => { event.preventDefault(); onUnavailable?.(); };
    finishes.current = [];
    group.current?.traverse(object => {
      if (object instanceof Mesh && object.material instanceof MeshStandardMaterial && object.userData.finish)
        finishes.current.push({ material: object.material, color: new Color(object.userData.finish) });
    });
    read();
    // Resume at the current scroll position, without replaying an offscreen
    // animation or recreating the renderer, buffers and shader programs.
    current.current.progress = target.current.progress;
    if (!active) {
      target.current.x = 0; target.current.y = 0;
      current.current.x = 0; current.current.y = 0;
    }
    if (active) {
      window.addEventListener("scroll", read, { passive: true });
      window.addEventListener("resize", read);
      host?.addEventListener("pointermove", pointer, { passive: true });
      host?.addEventListener("pointerleave", leave);
    }
    gl.domElement.addEventListener("webglcontextlost", lost);
    return () => {
      window.removeEventListener("scroll", read); window.removeEventListener("resize", read);
      host?.removeEventListener("pointermove", pointer); host?.removeEventListener("pointerleave", leave);
      gl.domElement.removeEventListener("webglcontextlost", lost);
    };
  }, [gl, invalidate, variant, active, onStageChange, onUnavailable]);

  const neutral = useRef(new Color("#ddd4c5"));
  useFrame((_, delta) => {
    const c = current.current, t = target.current;
    const dt = Math.min(delta, 0.1);
    c.progress = MathUtils.damp(c.progress, t.progress, 6, dt);
    c.x = MathUtils.damp(c.x, t.x, 7, dt); c.y = MathUtils.damp(c.y, t.y, 7, dt);
    const p = c.progress;
    if (group.current) { group.current.rotation.y = -0.22 + p * 0.3 + c.x * 0.15; group.current.rotation.x = c.y * 0.045; }
    const opening = variant === "process" ? MathUtils.smoothstep(p, 0.15, 0.48) * (1 - MathUtils.smoothstep(p, 0.72, 0.96)) : MathUtils.smoothstep(p, 0.05, 0.9);
    if (roof.current) roof.current.position.y = variant === "exploded" ? 1.45 + opening * 0.4 : opening * 1.65;
    if (floor.current) floor.current.position.y = variant === "exploded" ? 0.4 + opening * 0.18 : opening * 0.13;
    if (mass.current) { const reveal = 1 - MathUtils.smoothstep(p, 0.12, 0.34); mass.current.scale.y = Math.max(0.001, reveal); mass.current.visible = reveal > 0.003; }
    if (partitions.current) {
      const reveal = variant === "process" ? MathUtils.smoothstep(p, 0.38, 0.66) : 1;
      partitions.current.scale.y = Math.max(0.001, reveal); partitions.current.visible = reveal > 0.003;
    }
    if (details.current) details.current.visible = variant !== "process" || p > 0.27;
    if (variant === "process") {
      const finish = MathUtils.smoothstep(p, 0.68, 0.96);
      for (const item of finishes.current) item.material.color.copy(neutral.current).lerp(item.color, finish);
    }
    camera.position.set(8 + c.x * 0.35 + p * 0.45, 7.2 - c.y * 0.25 + p * 0.25, 9 - p * 0.35);
    camera.lookAt(0, 0.9, 0);
    if (active && Math.abs(c.progress - t.progress) + Math.abs(c.x - t.x) + Math.abs(c.y - t.y) > 0.0005) invalidate();
  });

  return <group ref={group}>
    <Block position={[0, -0.23, 0]} size={[7.4, 0.14, 5.6]} color="#d7ccb9" />
    <Block position={[0, -0.12, 0]} size={[6.9, 0.08, 5.15]} color="#e5ded2" />
    <group ref={floor}>
      <Block position={[0, 0, 0]} size={[6.4, 0.16, 4.6]} color={palette.concrete} />
      <Block position={[0, 0.095, 0.1]} size={[2.35, 0.05, 2.85]} color="#95977c" />
      {[-0.7, -0.1, 0.5, 1.1].map(z => <Block key={z} position={[-0.6, 0.135, z]} size={[0.63, 0.035, 0.38]} color="#e4d9c5" />)}
      <Plant x={0.62} z={-0.67} height={0.93} /><Plant x={0.7} z={0.55} height={0.47} />
      <Block position={[0.6, 0.16, 1.03]} size={[0.9, 0.13, 0.3]} color={palette.green} />
      {/* Thin structural planes keep rooms readable once the roof lifts. */}
      <Block position={[-3, 0.84, 0]} size={[0.13, 1.52, 4.4]} color={palette.clay} />
      <Block position={[3, 0.84, 0]} size={[0.13, 1.52, 4.4]} />
      <Block position={[0, 0.84, -2.1]} size={[6, 1.52, 0.13]} />
      <Block position={[-2.08, 0.84, 2.1]} size={[1.9, 1.52, 0.13]} color={palette.clay} />
      {[-1.25, 1.25].flatMap(x => [-1.3, 1.55].map(z => <Block key={`${x}:${z}`} position={[x, 0.84, z]} size={[0.075, 1.52, 0.075]} color={palette.frame} />))}
      <group ref={details}>
        <WindowWall x={-1.2} z={0.1} width={2.8} side /><WindowWall x={1.2} z={0.1} width={2.8} side />
        <WindowWall x={0} z={-1.35} width={2.4} /><WindowWall x={1.8} z={2.1} width={2.3} />
        {Array.from({ length: 9 }, (_, i) => <Block key={i} position={[1.08 + i * 0.21, 0.85, 2.18]} size={[0.045, 1.52, 0.18]} color="#947659" />)}
      </group>
      <group ref={partitions}>
        <Block position={[-2.12, 0.71, -0.5]} size={[1.7, 1.25, 0.08]} />
        <Block position={[2.13, 0.71, 0.28]} size={[1.7, 1.25, 0.08]} color={palette.clay} />
        <Block position={[0.15, 0.71, -1.73]} size={[0.08, 1.25, 0.62]} />
        <Block position={[-2.28, 0.26, 0.7]} size={[0.55, 0.34, 1.42]} color="#b5a48d" />
        <Block position={[2.17, 0.28, -0.88]} size={[1, 0.38, 0.62]} color="#b5a48d" />
      </group>
      {variant === "process" && <group ref={mass}>
        <Block position={[-2.08, 0.85, 0]} size={[1.76, 1.54, 4.2]} />
        <Block position={[2.08, 0.85, 0]} size={[1.76, 1.54, 4.2]} />
        <Block position={[0, 0.85, -1.73]} size={[2.4, 1.54, 0.74]} />
      </group>}
    </group>
    <group ref={roof}>
      <Block position={[-2.1, 1.68, 0]} size={[2.05, 0.14, 4.75]} />
      <Block position={[2.1, 1.68, 0]} size={[2.05, 0.14, 4.75]} />
      <Block position={[0, 1.68, -1.8]} size={[2.15, 0.14, 1.15]} />
      {[-2.1, 2.1].map(x => <Block key={x} position={[x, 1.765, 0]} size={[1.86, 0.03, 4.52]} color="#f0e9dd" />)}
    </group>
    <Block position={[0, -0.035, 2.62]} size={[4.9, 0.11, 0.43]} color="#c0af95" />
  </group>;
}

function SceneCamera() {
  const { size } = useThree();
  return <OrthographicCamera makeDefault position={[8, 7.2, 9]} zoom={Math.max(12, Math.min(58, size.width / 10.8, size.height / 8))}
    near={0.1} far={100} onUpdate={camera => camera.lookAt(0, 0.9, 0)} />;
}

function FirstFrame({ onReady }: { onReady: () => void }) {
  const pending = useRef<number | null>(null);
  const scheduled = useRef(false);
  useFrame(() => {
    if (scheduled.current) return;
    scheduled.current = true;
    // Reveal the canvas only after its first frame has actually been drawn.
    pending.current = requestAnimationFrame(onReady);
  });
  useEffect(() => () => {
    if (pending.current !== null) cancelAnimationFrame(pending.current);
    pending.current = null;
    scheduled.current = false;
  }, []);
  return null;
}

export default function SceneCanvas(props: SceneProps) {
  const [initialized, setInitialized] = useState(false);
  const ready = () => { setInitialized(true); props.onReady?.(); };
  const modest = typeof window !== "undefined" && (window.innerWidth < 768 || navigator.hardwareConcurrency <= 4);
  return <Canvas shadows={!modest} frameloop={!initialized || props.active ? "demand" : "never"} dpr={modest ? 1 : [1, 1.5]}
    gl={{ antialias: !modest, alpha: false, powerPreference: "low-power" }} fallback={null}>
    <color attach="background" args={["#F4F1EB"]} />
    <SceneCamera />
    <ambientLight intensity={1.6} />
    <directionalLight castShadow={!modest} position={[3, 8, 5]} intensity={2.5}
      shadow-mapSize={[1024, 1024]} shadow-camera-left={-6} shadow-camera-right={6}
      shadow-camera-top={6} shadow-camera-bottom={-6} shadow-normalBias={0.04} shadow-bias={-0.0002} />
    <Building {...props} />
    <FirstFrame onReady={ready} />
  </Canvas>;
}
