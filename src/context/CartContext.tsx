"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { CartItem, CustomerProfile, Product } from "@/types";
import { calculateCartTotals, mergeCarts, validateQuantity } from "@/lib/cart-rules";
import { DataStore } from "@/lib/store";

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  isWhatsAppModalOpen: boolean;
  openWhatsAppModal: () => void;
  closeWhatsAppModal: () => void;
  totalItems: number;
  totalQuantity: number;
  estimatedMrpTotal: number;
  customerProfile: CustomerProfile | null;
  setProfile: (profile: CustomerProfile | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const LOCAL_CART_KEY = "hrk_anonymous_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [customerProfile, setCustomerProfile] = useState<CustomerProfile | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize cart and customer profile on client mount
  useEffect(() => {
    try {
      const storedProfile = DataStore.getCustomerProfile();
      setCustomerProfile(storedProfile);

      const storedCart = localStorage.getItem(LOCAL_CART_KEY);
      let initialItems: CartItem[] = [];
      if (storedCart) {
        initialItems = JSON.parse(storedCart);
      }

      // If customer is authenticated, check for cloud/saved cart and merge safely
      if (storedProfile) {
        const savedKey = `hrk_saved_cart_${storedProfile.id}`;
        const savedCartStr = localStorage.getItem(savedKey);
        if (savedCartStr) {
          const savedItems: CartItem[] = JSON.parse(savedCartStr);
          initialItems = mergeCarts(initialItems, savedItems);
          // Persist the merged cart
          localStorage.setItem(savedKey, JSON.stringify(initialItems));
        }
      }

      setItems(initialItems);
    } catch (e) {
      console.error("Failed to load cart from local storage:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save changes to storage whenever items change
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(items));
      if (customerProfile) {
        localStorage.setItem(`hrk_saved_cart_${customerProfile.id}`, JSON.stringify(items));
      }
    } catch (e) {
      console.error("Failed to save cart to local storage:", e);
    }
  }, [items, isLoaded, customerProfile]);

  const addItem = (product: Product, quantity?: number) => {
    const minQty = product.min_order_qty || 10;
    const qtyToAdd = quantity !== undefined ? quantity : minQty;
    const val = validateQuantity(qtyToAdd, product);

    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.product.id === product.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + val.normalizedQty;
        const normalized = validateQuantity(newQty, product);
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: normalized.normalizedQty,
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            product,
            quantity: val.normalizedQty,
            added_at: Date.now(),
          },
        ];
      }
    });

    setIsDrawerOpen(true);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setItems((prev) => {
      const index = prev.findIndex((i) => i.product.id === productId);
      if (index === -1) return prev;

      const product = prev[index].product;
      const minQty = product.min_order_qty || 10;

      if (quantity < minQty) {
        // If reduced below min order qty, enforce minQty
        const updated = [...prev];
        updated[index] = { ...updated[index], quantity: minQty };
        return updated;
      }

      const val = validateQuantity(quantity, product);
      const updated = [...prev];
      updated[index] = { ...updated[index], quantity: val.normalizedQty };
      return updated;
    });
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const clearCart = () => {
    setItems([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem(LOCAL_CART_KEY);
      if (customerProfile) {
        localStorage.removeItem(`hrk_saved_cart_${customerProfile.id}`);
      }
    }
  };

  const setProfile = (profile: CustomerProfile | null) => {
    setCustomerProfile(profile);
    DataStore.setCustomerProfile(profile);

    if (profile) {
      // Merge with user's saved cart
      const savedKey = `hrk_saved_cart_${profile.id}`;
      const savedCartStr = localStorage.getItem(savedKey);
      if (savedCartStr) {
        try {
          const savedItems: CartItem[] = JSON.parse(savedCartStr);
          const merged = mergeCarts(items, savedItems);
          setItems(merged);
          localStorage.setItem(savedKey, JSON.stringify(merged));
        } catch (e) {
          console.error("Cart merge error:", e);
        }
      } else {
        // Save current items to user's new saved cart
        localStorage.setItem(savedKey, JSON.stringify(items));
      }
    }
  };

  const totals = calculateCartTotals(items);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        isDrawerOpen,
        openDrawer: () => setIsDrawerOpen(true),
        closeDrawer: () => setIsDrawerOpen(false),
        isWhatsAppModalOpen,
        openWhatsAppModal: () => setIsWhatsAppModalOpen(true),
        closeWhatsAppModal: () => setIsWhatsAppModalOpen(false),
        totalItems: totals.totalItems,
        totalQuantity: totals.totalQuantity,
        estimatedMrpTotal: totals.estimatedMrpTotal,
        customerProfile,
        setProfile,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
