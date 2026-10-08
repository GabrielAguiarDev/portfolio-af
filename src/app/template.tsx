"use client";

import { useEffect, type ReactNode } from "react";
import {
  MotionConfig,
  motion,
  useAnimationControls,
  useReducedMotion,
} from "motion/react";

export default function Template({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();
  const controls = useAnimationControls();

  useEffect(() => {
    if (reducedMotion !== false) {
      controls.set({ y: 0 });
      return;
    }
    controls.set({ y: 8 });
    void controls.start({
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    });
    return () => controls.stop();
  }, [controls, reducedMotion]);

  return (
    <MotionConfig reducedMotion="user">
      <motion.div initial={false} animate={controls} style={{ opacity: 1 }}>
        {children}
      </motion.div>
    </MotionConfig>
  );
}
