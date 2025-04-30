import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Product } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export function calculateDiscount(
  originalPrice: number,
  currentPrice: number
): number {
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
}

// Temporary display price adjustment without mutating data
export function getDisplayPrice(product: Product): number {
  const isRetro =
    /retro/i.test(product.title) ||
    (!!product.season &&
      /^(19\d{2}|20(0\d|1\d|2[0-3]))\//.test(product.season));

  const base = product.price;

  if (isRetro) {
    // Retro should be 85 and up (never below 85)
    return Math.max(base, 85);
  }

  // New/current jerseys should be between 60 and 85, with most in 60-70
  // Use a deterministic hash so the price band is stable per product
  const r = hashToUnit(`${product.id}|${product.title}|${product.brand || ""}`);

  let price: number;
  if (r < 0.6) {
    // 60% of items in 60-70
    const t = r / 0.6; // 0..1
    price = 60 + Math.round(t * 10); // 60..70
  } else if (r < 0.9) {
    // 30% of items in 70-80
    const t = (r - 0.6) / 0.3; // 0..1
    price = 70 + Math.round(t * 10); // 70..80
  } else {
    // 10% of items in 80-85
    const t = (r - 0.9) / 0.1; // 0..1
    price = 80 + Math.round(t * 5); // 80..85
  }

  // Ensure bounds regardless of rounding
  if (price < 60) price = 60;
  if (price > 85) price = 85;
  return price;
}

function hashToUnit(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return (hash % 1000) / 1000; // 0..0.999
}
