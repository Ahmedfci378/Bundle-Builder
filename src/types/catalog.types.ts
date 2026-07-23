export type CategoryId = string;
export type ProductId = string;
export type VariantId = string;
export type DiscountRuleId = string;
export type ShippingMethodId = string;

export type BadgeTone = 'primary' | 'success' | 'info' | 'warning' | 'danger' | 'neutral';
export interface BadgeData {
  label: string;
  tone: BadgeTone;
}

export interface LearnMore {
  label?: string;
  url: string;
}

export type SelectionMode = 'single' | 'multi';

export interface Category {
  id: CategoryId;
  slug: string;
  name: string;
  order: number;
  selectionMode: SelectionMode;
  required: boolean;
  minSelectedQuantity: number;
  description?: string;
  icon?: string;
}

export interface Variant {
  id: VariantId;
  sku: string;
  name: string;
  attributes: Record<string, string>;
  price: number;
  compareAtPrice?: number;
  /** STOCK quantity for this specific variant — independent per variant. */
  quantity: number;
  image?: string;
  swatch?: string;
}

interface ProductBase {
  id: ProductId;
  slug: string;
  categoryId: CategoryId;
  name: string;
  description: string;
  image: string;
  learnMore?: LearnMore;
  badge?: BadgeData;
}

export interface SimpleProduct extends ProductBase {
  hasVariants: false;
  sku: string;
  price: number;
  compareAtPrice?: number;
  /** Stock; omitted entirely means unlimited (e.g. a subscription Plan). */
  quantity?: number;
}

export interface VariantProduct extends ProductBase {
  hasVariants: true;
  defaultVariantId: VariantId;
  variants: Variant[];
}

export type Product = SimpleProduct | VariantProduct;

export type DiscountRuleType =
  | 'BUNDLE_COMPLETE'
  | 'TIERED_BY_ITEM_COUNT'
  | 'CATEGORY_MIN_QUANTITY'
  | 'FIXED_PRODUCT_DISCOUNT';

export interface DiscountRule {
  id: DiscountRuleId;
  type: DiscountRuleType;
  label: string;
  value: number;
  condition?: Record<string, unknown>;
}

export interface ShippingMethod {
  id: ShippingMethodId;
  label: string;
  cost: number;
  freeThreshold?: number;
  estimatedDays?: string;
}

export interface GlobalConfig {
  currency: string;
  locale: string;
  lowStockThreshold: number;
  maxQuantityPerVariant: number;
  defaultLearnMoreLabel: string;
  outOfStockLabel: string;
}

export interface CatalogPayload {
  schemaVersion: string;
  config: GlobalConfig;
  categories: Category[];
  products: Product[];
  discountRules: DiscountRule[];
  shippingMethods: ShippingMethod[];
}
