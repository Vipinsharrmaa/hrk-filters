import type { CartItem, Product } from "@/types";

export interface ValidationResult {
  valid: boolean;
  normalizedQty: number;
  message?: string;
}

/**
 * Validates and normalizes quantity according to HRK Filters B2B rules:
 * 1. Minimum quantity is enforced by product.min_order_qty (derived from M.O.P. in catalogue/price-list).
 * 2. If enforcePackMultiple is true, quantity is rounded up to the nearest multiple of pack_multiple_qty.
 * 3. Quantity cannot be negative or zero.
 */
export function validateQuantity(
  qty: number,
  product: Pick<Product, "min_order_qty" | "pack_multiple_qty" | "enforce_pack_multiple">
): ValidationResult {
  const minQty = Math.max(1, product.min_order_qty || 1);
  const multiple = Math.max(1, product.pack_multiple_qty || minQty);

  if (isNaN(qty) || qty <= 0) {
    return {
      valid: false,
      normalizedQty: minQty,
      message: `Quantity must be at least the Minimum Order Pack (${minQty} Pcs).`,
    };
  }

  if (qty < minQty) {
    return {
      valid: false,
      normalizedQty: minQty,
      message: `Minimum order quantity for this SKU is ${minQty} Pcs.`,
    };
  }

  if (product.enforce_pack_multiple) {
    const remainder = qty % multiple;
    if (remainder !== 0) {
      const roundedUp = Math.ceil(qty / multiple) * multiple;
      return {
        valid: false,
        normalizedQty: roundedUp,
        message: `Orders for this SKU must be in carton pack multiples of ${multiple} Pcs. Rounded up to ${roundedUp}.`,
      };
    }
  }

  return {
    valid: true,
    normalizedQty: Math.floor(qty),
  };
}

/**
 * Calculates line total for a cart item based on published MRP.
 */
export function calculateLineTotal(mrp: number, quantity: number): number {
  if (mrp < 0 || quantity <= 0) return 0;
  return Math.round(mrp * quantity * 100) / 100;
}

export interface CartTotals {
  totalItems: number;
  totalQuantity: number;
  estimatedMrpTotal: number;
}

/**
 * Calculates aggregate totals for the enquiry cart.
 */
export function calculateCartTotals(items: CartItem[]): CartTotals {
  return items.reduce<CartTotals>(
    (acc, item) => {
      acc.totalItems += 1;
      acc.totalQuantity += item.quantity;
      acc.estimatedMrpTotal += calculateLineTotal(item.product.mrp, item.quantity);
      return acc;
    },
    { totalItems: 0, totalQuantity: 0, estimatedMrpTotal: 0 }
  );
}

/**
 * Deterministic cart merge logic on customer authentication:
 * - If SKU exists in both local and server carts: take Q_merged = max(Q_local, Q_server)
 * - If SKU exists only in local: add to merged
 * - If SKU exists only in server: keep in merged
 * - Validate each resulting item against product min_order_qty
 */
export function mergeCarts(localItems: CartItem[], serverItems: CartItem[]): CartItem[] {
  const mergedMap = new Map<string, CartItem>();

  // Seed with server items
  for (const item of serverItems) {
    mergedMap.set(item.product.id, { ...item });
  }

  // Merge local items
  for (const localItem of localItems) {
    const existing = mergedMap.get(localItem.product.id);
    if (existing) {
      // Duplicate SKU: Take maximum quantity
      const mergedQty = Math.max(existing.quantity, localItem.quantity);
      const val = validateQuantity(mergedQty, existing.product);
      mergedMap.set(localItem.product.id, {
        product: existing.product,
        quantity: val.normalizedQty,
        added_at: Math.max(existing.added_at || 0, localItem.added_at || 0),
      });
    } else {
      const val = validateQuantity(localItem.quantity, localItem.product);
      mergedMap.set(localItem.product.id, {
        product: localItem.product,
        quantity: val.normalizedQty,
        added_at: localItem.added_at || Date.now(),
      });
    }
  }

  return Array.from(mergedMap.values());
}
