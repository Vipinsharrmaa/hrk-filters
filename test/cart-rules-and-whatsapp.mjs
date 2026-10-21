import assert from "node:assert";

console.log("=== RUNNING HRK FILTERS AUTOMATED TESTS ===\n");

// --- Cart Rules Implementations (tested directly) ---
function validateQuantity(qty, product) {
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

function calculateLineTotal(mrp, quantity) {
  if (mrp < 0 || quantity <= 0) return 0;
  return Math.round(mrp * quantity * 100) / 100;
}

function calculateCartTotals(items) {
  return items.reduce(
    (acc, item) => {
      acc.totalItems += 1;
      acc.totalQuantity += item.quantity;
      acc.estimatedMrpTotal += calculateLineTotal(item.product.mrp, item.quantity);
      return acc;
    },
    { totalItems: 0, totalQuantity: 0, estimatedMrpTotal: 0 }
  );
}

function mergeCarts(localItems, serverItems) {
  const mergedMap = new Map();

  for (const item of serverItems) {
    mergedMap.set(item.product.id, { ...item });
  }

  for (const localItem of localItems) {
    const existing = mergedMap.get(localItem.product.id);
    if (existing) {
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

function sanitizePhoneForWhatsApp(phone) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    return `91${digits}`;
  }
  return digits;
}

function formatWhatsAppMessage(buyer, items) {
  const totals = calculateCartTotals(items);
  const dateStr = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const lines = [];
  lines.push(`*HRK FILTERS — B2B WHOLESALE ENQUIRY / RFQ*`);
  lines.push(`_Date: ${dateStr}_`);
  lines.push(``);

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

  lines.push(`*REQUESTED ITEMS & QUANTITIES:*`);

  const MAX_ITEMS_SHOWN = 25;
  const itemsToDisplay = items.slice(0, MAX_ITEMS_SHOWN);

  itemsToDisplay.forEach((item, index) => {
    const lineTotal = (item.product.mrp * item.quantity).toFixed(2);
    lines.push(
      `${index + 1}. *[${item.product.part_number}]* ${item.product.title}`
    );
    const detailParts = [
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

function buildWhatsAppRFQUrl(recipientPhone, buyer, items) {
  const sanitized = sanitizePhoneForWhatsApp(recipientPhone);
  const message = formatWhatsAppMessage(buyer, items);
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${sanitized}?text=${encodedText}`;
}

// --- TEST 1: validateQuantity ---
console.log("1. Testing Quantity Validation & MOQ Enforcement...");
const sampleProduct = {
  id: "test-hrk-042",
  part_number: "HRK-042",
  slug: "hrk-042",
  title: "Super Splendor Air Filter",
  category_id: "air-filter-paper",
  material_quality: "Metal Cap",
  mrp: 90.0,
  min_order_qty: 10,
  pack_multiple_qty: 10,
  enforce_pack_multiple: false,
};

const r1 = validateQuantity(5, sampleProduct);
assert.strictEqual(r1.valid, false);
assert.strictEqual(r1.normalizedQty, 10);
assert.match(r1.message || "", /Minimum order quantity/);

const r2 = validateQuantity(10, sampleProduct);
assert.strictEqual(r2.valid, true);
assert.strictEqual(r2.normalizedQty, 10);

const r3 = validateQuantity(15, sampleProduct);
assert.strictEqual(r3.valid, true);
assert.strictEqual(r3.normalizedQty, 15);

const strictProduct = { ...sampleProduct, enforce_pack_multiple: true };
const r4 = validateQuantity(15, strictProduct);
assert.strictEqual(r4.valid, false);
assert.strictEqual(r4.normalizedQty, 20);

const r5 = validateQuantity(0, sampleProduct);
assert.strictEqual(r5.valid, false);
assert.strictEqual(r5.normalizedQty, 10);
console.log("   ✓ Quantity validation and MOQ tests passed.");

// --- TEST 2: calculateLineTotal & calculateCartTotals ---
console.log("2. Testing Cart Totals & Line Calculations...");
assert.strictEqual(calculateLineTotal(90, 10), 900);
assert.strictEqual(calculateLineTotal(165.5, 20), 3310);

const testItems = [
  { product: sampleProduct, quantity: 20 },
  {
    product: {
      ...sampleProduct,
      id: "test-hrk-066",
      part_number: "HRK-066",
      mrp: 165.0,
      min_order_qty: 10,
    },
    quantity: 10,
  },
];

const totals = calculateCartTotals(testItems);
assert.strictEqual(totals.totalItems, 2);
assert.strictEqual(totals.totalQuantity, 30);
assert.strictEqual(totals.estimatedMrpTotal, 3450);
console.log("   ✓ Totals calculations passed (Total MRP = ₹3,450.00).");

// --- TEST 3: mergeCarts ---
console.log("3. Testing Cart Merging Logic (Q_merged = max(Q_local, Q_server))...");
const localCart = [
  { product: sampleProduct, quantity: 20 },
  {
    product: { ...sampleProduct, id: "test-local-only", part_number: "HRK-088" },
    quantity: 10,
  },
];

const serverCart = [
  { product: sampleProduct, quantity: 30 },
  {
    product: { ...sampleProduct, id: "test-server-only", part_number: "HRK-134" },
    quantity: 50,
  },
];

const merged = mergeCarts(localCart, serverCart);
assert.strictEqual(merged.length, 3);

const mergedHrk042 = merged.find((i) => i.product.id === sampleProduct.id);
assert.ok(mergedHrk042);
assert.strictEqual(mergedHrk042.quantity, 30);

const localOnly = merged.find((i) => i.product.id === "test-local-only");
assert.ok(localOnly);
assert.strictEqual(localOnly.quantity, 10);

const serverOnly = merged.find((i) => i.product.id === "test-server-only");
assert.ok(serverOnly);
assert.strictEqual(serverOnly.quantity, 50);
console.log("   ✓ Cart merge math and duplicate resolution passed.");

// --- TEST 4: Phone Sanitization & WhatsApp RFQ Generation ---
console.log("4. Testing Phone Sanitization & WhatsApp URL Generation...");
assert.strictEqual(sanitizePhoneForWhatsApp("+91 98100-12345"), "919810012345");
assert.strictEqual(sanitizePhoneForWhatsApp("9810012345"), "919810012345");

const buyer = {
  name: "Rajesh Sharma",
  companyName: "Sharma Auto Parts",
  businessType: "Retailer",
  city: "Jaipur, Rajasthan",
  phoneNumber: "9810012345",
};

const message = formatWhatsAppMessage(buyer, testItems);
assert.ok(message.includes("HRK FILTERS — B2B WHOLESALE ENQUIRY / RFQ"));
assert.strictEqual(message.includes("Krishna"), false);
assert.strictEqual(message.includes("Avon"), false);
assert.ok(message.includes("Rajesh Sharma"));
assert.ok(message.includes("Sharma Auto Parts"));
assert.ok(message.includes("Jaipur, Rajasthan"));
assert.ok(message.includes("Retailer"));
assert.ok(message.includes("[HRK-042]"));
assert.ok(message.includes("Qty: *20 Pcs*"));
assert.ok(message.includes("[HRK-066]"));
assert.ok(message.includes("Qty: *10 Pcs*"));

const url = buildWhatsAppRFQUrl("919810000000", buyer, testItems);
assert.ok(url.startsWith("https://wa.me/919810000000?text="));
assert.ok(!url.includes(" "));
console.log("   ✓ WhatsApp URL and RFQ message formatting passed.");

// --- TEST 5: WhatsApp 25-Item Limit Handling ---
console.log("5. Testing 25+ SKU Limit Truncation in WhatsApp RFQ...");
const largeItemList = Array.from({ length: 30 }, (_, i) => ({
  product: {
    ...sampleProduct,
    id: `p-${i}`,
    part_number: `HRK-${String(i + 1).padStart(3, "0")}`,
    title: `Filter Element #${i + 1}`,
  },
  quantity: 10,
}));

const longMessage = formatWhatsAppMessage(buyer, largeItemList);
assert.ok(longMessage.includes("[HRK-025]"));
assert.strictEqual(longMessage.includes("[HRK-026]"), false);
assert.ok(longMessage.includes("+ 5 additional SKUs in cart"));
console.log("   ✓ 25-item WhatsApp truncation logic passed.");

console.log("\nALL 5 AUTOMATED TEST SUITES PASSED PERFECTLY (100%)!");
