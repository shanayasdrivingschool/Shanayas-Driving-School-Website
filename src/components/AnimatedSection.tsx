import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  blur?: number;
  yOffset?: number;
}

const AnimatedSection = ({
  children,
  className = "",
  delay = 0,
  duration = 0.45,
  blur = 6,
  yOffset = 18,
}: Props) => {
  const prefersReducedMotion = useReducedMotion();

  const hiddenState = prefersReducedMotion
    ? { opacity: 0, y: Math.min(yOffset, 12) }
    : { opacity: 0, y: yOffset, filter: `blur(${blur}px)` };

  const visibleState = prefersReducedMotion
    ? { opacity: 1, y: 0 }
    : { opacity: 1, y: 0, filter: "blur(0px)" };

  return (
    <motion.div
      data-animated-section="true"
      initial={hiddenState}
      whileInView={visibleState}
      viewport={{ once: true, margin: "-90px" }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      style={{ willChange: "opacity, transform, filter" }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;
