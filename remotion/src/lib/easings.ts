/**
 * Premium easings for Flier Studio motion.
 * Brand rule: ease-out-quint for UI / hero; no bounce, no spin.
 */

export const easeOutQuint = (t: number): number => 1 - Math.pow(1 - t, 5)

export const easeInOutCubic = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

/** Soft settle into rest — still no overshoot. */
export const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3)

/** Sharper cut for the Signal slice. */
export const easeInOutQuint = (t: number): number =>
  t < 0.5 ? 16 * Math.pow(t, 5) : 1 - Math.pow(-2 * t + 2, 5) / 2
