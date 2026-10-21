import type { CartItem, WhatsAppBuyerDetails } from "@/types";
import { calculateCartTotals } from "./cart-rules";

/**
 * Normalizes phone number into clean digits required by wa.me format (e.g. "919810012345").
 */
export function sanitizePhoneForWhatsApp(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  // If user entered 10 digits in India without country code, prepend 91
  if (digits.length === 10) {
    return `91${digits}`;
  }
  return digits;
}

/**
 * Formats a professional B2B Wholesale Request For Quote (RFQ)
 * using standard WhatsApp Markdown formatting (*bold*, _italic_, `monospace`).
 */
export function formatWhatsAppMessage(
  buyer: WhatsAppBuyerDetails,
  items: CartItem[]
): string {
  const totals = calculateCartTotals(items);
  const dateStr = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const lines: string[] = [];

  // Header
  lines.push(`*HRK FILTERS — B2B WHOLESALE ENQUIRY / RFQ*`);
  lines.push(`_Date: ${dateStr}_`);
  lines.push(``);

  // Buyer Details
  lines.push(`*BUYER PROFILE:*`);
  lines.push(`• *Contact Person:* ${buyer.name}`);
  if (buyer.companyName && buyer.companyName.trim()) {
    lines.push(`• *Business / Firm:* ${buyer.companyName.trim()}`);
  }
  lines.push(`• *Business Type:* ${buyer.businessType}`);
  lines.push(`• *Location:* ${buyer.city}`);
  if (buyer.phoneNumber && buyer.phoneNumber.trim()) {
    lines.push(`• *Contact Phone:* ${buyer.phoneNumber.trim()}`);
  }
  lines.push(``);

  // Cart Items
  lines.push(`*REQUESTED ITEMS & QUANTITIES:*`);

  // Max 25 items in text message to stay safely within WhatsApp URL length limits
  const MAX_ITEMS_SHOWN = 25;
  const itemsToDisplay = items.slice(0, MAX_ITEMS_SHOWN);

  itemsToDisplay.forEach((item, index) => {
    const lineTotal = (item.product.mrp * item.quantity).toFixed(2);
    lines.push(
      `${index + 1}. *[${item.product.part_number}]* ${item.product.title}`
    );
    const detailParts: string[] = [
      `Qty: *${item.quantity} Pcs*`,
      `MRP: ₹${item.product.mrp.toFixed(2)}`,
      `Est. Total: ₹${lineTotal}`,
    ];
    lines.push(`   ${detailParts.join(" | ")}`);

    if (item.product.material_quality) {
      lines.push(`   _Spec: ${item.product.material_quality}_`);
    }
    if (item.product.oe_reference) {
      lines.push(`   _OE Ref: ${item.product.oe_reference}_`);
    }
  });

  if (items.length > MAX_ITEMS_SHOWN) {
    const remaining = items.length - MAX_ITEMS_SHOWN;
    lines.push(``);
    lines.push(
      `_(+ ${remaining} additional SKU${remaining > 1 ? "s" : ""} in cart — please request full quotation list)_`
    );
  }

  lines.push(``);

  // Commercial Summary
  lines.push(`*ENQUIRY SUMMARY:*`);
  lines.push(`• *Total SKUs:* ${totals.totalItems}`);
  lines.push(`• *Total Units:* ${totals.totalQuantity} Pcs`);
  lines.push(
    `• *Est. Total Value (Published MRP):* ₹${totals.estimatedMrpTotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  );
  lines.push(``);
  lines.push(`*Commercial Terms Note:*`);
  lines.push(
    `_Prices listed are published standard MRPs. Applicable wholesale trade discounts, GST, and logistics will be confirmed on the formal quotation by the HRK Filters factory desk._`
  );

  return lines.join("\n");
}

/**
 * Builds the complete wa.me URL with properly URL-encoded message payload.
 */
export function buildWhatsAppRFQUrl(
  recipientPhone: string,
  buyer: WhatsAppBuyerDetails,
  items: CartItem[]
): string {
  const sanitized = sanitizePhoneForWhatsApp(recipientPhone);
  const message = formatWhatsAppMessage(buyer, items);
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${sanitized}?text=${encodedText}`;
}
