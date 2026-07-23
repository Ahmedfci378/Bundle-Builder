/**
 * Mirrors Bootstrap 5's default grid breakpoints exactly. Any component
 * that needs to know "are we at lg?" in JS (not just via col-lg-* CSS)
 * reads from here — so a JS-driven layout decision can never silently
 * disagree with what the Bootstrap grid classes are doing at the same
 * breakpoint name.
 */
export const BREAKPOINTS = {
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400,
} as const;

export type BreakpointName = keyof typeof BREAKPOINTS;
