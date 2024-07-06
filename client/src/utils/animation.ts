export const createGameButtonVariants = {
  hidden: { scale: 0 },
  visible: {
    scale: 1,
    transition: {
      delay: 1.5,
      duration: 1.5,
      type: "spring",
      stiffness: 300,
      damping: 8,
    },
  },
};

export const crownTransition = {
  duration: 4,
  ease: [0, 0.71, 0.2, 1.01],
  type: "spring",
  damping: 11,
  stiffness: 100,
  mass: 0.5,
  restDelta: 0.001,
  delay: 3,
};
