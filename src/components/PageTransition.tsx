import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0.85 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15, ease: "linear" }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
