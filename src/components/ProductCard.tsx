"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Heart, Eye } from "lucide-react";
import { Product } from "@/types";
import { formatPrice, calculateDiscount, getDisplayPrice } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import YupooImage from "./YupooImage";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleViewDetails = () => {
    if (!product.inStock) return;

    setIsNavigating(true);

    // Redirect to product detail page immediately
    setTimeout(() => {
      setIsNavigating(false);
      router.push(`/products/${product.id}`);
    }, 500);
  };

  return (
    <div className="group relative bg-gray-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2 border border-yellow-200/30">
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-800 to-gray-700">
        <Link href={`/products/${product.id}`}>
          <YupooImage
            src={product.images[0]}
            alt={product.title}
            width={400}
            height={400}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.isNew && (
            <span className="bg-gradient-to-r from-yellow-200 to-yellow-300 text-black text-xs px-3 py-1 rounded-full font-bold shadow-lg">
              NEW
            </span>
          )}
          {product.isOnSale && product.originalPrice && (
            <span className="bg-gradient-to-r from-yellow-150 to-yellow-200 text-black text-xs px-3 py-1 rounded-full font-bold shadow-lg">
              -{calculateDiscount(product.originalPrice, product.price)}%
            </span>
          )}
          {!product.inStock && (
            <span className="bg-gray-700 text-gray-300 text-xs px-3 py-1 rounded-full font-bold shadow-lg">
              OUT OF STOCK
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Category */}
        <p className="text-sm text-yellow-150 mb-2 font-medium uppercase tracking-wide">
          {product.category}
        </p>

        {/* Title */}
        <Link href={`/products/${product.id}`}>
          <h3 className="text-base font-bold text-white mb-2 hover:text-yellow-100 transition-colors line-clamp-2 leading-tight">
            {product.title}
          </h3>
        </Link>

        {/* Brand */}
        <p className="text-xs text-gray-400 mb-3 font-medium">
          {product.brand}
        </p>

        {/* Price */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-lg font-bold text-yellow-150">
            {formatPrice(getDisplayPrice(product))}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through font-medium">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* View Details Button */}
        <button
          onClick={handleViewDetails}
          disabled={!product.inStock || isNavigating}
          className={`
            w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 transform hover:scale-105
            ${product.inStock && !isNavigating
              ? "bg-gradient-to-r from-yellow-200 to-yellow-300 text-black hover:from-yellow-150 hover:to-yellow-200 shadow-lg hover:shadow-xl"
              : "bg-gray-700 text-gray-300 cursor-not-allowed"
            }
          `}
        >
          <ShoppingCart className="h-4 w-4" />
          {isNavigating
            ? "Loading..."
            : product.inStock
              ? "View Details"
              : "Out of Stock"}
        </button>
      </div>
    </div>
  );
}
