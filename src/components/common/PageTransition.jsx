import { motion } from 'framer-motion';

const variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
};

/**
 * Wraps page content in a subtle fade+slide-up animation on mount.
 * Kept short (200ms) and small (8px) so it reads as "polish", not delay.
 */
export default function PageTransition({ children }) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={variants}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
