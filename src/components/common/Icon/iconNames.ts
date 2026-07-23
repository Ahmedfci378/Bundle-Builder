/**
 * Central registry of icon names used by built-in components (chevrons,
 * remove buttons, etc.). Catalog-driven icons (e.g. a category's own icon)
 * still come straight from data — this file only covers icons that are
 * part of the component library's own chrome, so that string literal never
 * gets duplicated across files.
 */
export const ICON = {
  CHEVRON_DOWN: 'chevron-down',
  CHEVRON_UP: 'chevron-up',
  CHECK_CIRCLE_FILL: 'check-circle-fill',
  TRASH: 'trash3',
  PLUS: 'plus-lg',
  MINUS: 'dash-lg',
  CART_CHECK: 'cart-check',
  SHIELD_CHECK: 'shield-check',
  TRUCK: 'truck',
} as const;
