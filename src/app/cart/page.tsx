"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import { formatPrice, getDisplayPrice } from "@/lib/utils";
import YupooImage from "@/components/YupooImage";
import {
  Minus,
  Plus,
  Trash2,
  ArrowLeft,
  ShoppingBag,
  Shield,
  Truck,
  CreditCard,
  Lock,
  X,
} from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } =
    useCart();
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const handleQuantityChange = (
    id: string,
    size: string,
    newQuantity: number
  ) => {
    setIsUpdating(`${id}-${size}`);
    updateQuantity(id, size, newQuantity);
    setTimeout(() => setIsUpdating(null), 500);
  };

  const handleRemoveItem = (id: string, size: string) => {
    removeItem(id, size);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-24">
          <div className="text-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full mx-auto mb-6 flex items-center justify-center">
              <ShoppingBag className="h-10 w-10 sm:h-12 sm:w-12 text-yellow-200" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-yellow-200 mb-3">
              Your cart is empty
            </h2>
            <p className="text-sm sm:text-base text-gray-300 mb-8 max-w-2xl mx-auto px-4">
              Looks like you haven&apos;t added any items to your cart yet.
              Start shopping to discover amazing jerseys!
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-200 to-yellow-100 text-black px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold hover:from-yellow-200 hover:to-yellow-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Mobile Header */}
      <div className="lg:hidden bg-gradient-to-br from-gray-900 to-black border-b border-gray-700 sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/products"
              className="flex items-center gap-2 text-gray-300 hover:text-yellow-200 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium text-sm">Back</span>
            </Link>
            <div className="text-center">
              <h1 className="text-lg font-bold text-yellow-200">Cart</h1>
              <p className="text-xs text-gray-400">
                {items.length} {items.length === 1 ? "item" : "items"}
              </p>
            </div>
            <div className="w-16"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block bg-gradient-to-br from-gray-900 to-black border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/products"
                className="flex items-center gap-2 text-gray-300 hover:text-yellow-200 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="font-medium">Continue Shopping</span>
              </Link>
            </div>
            <div className="text-right">
              <h1 className="text-2xl font-bold text-yellow-200">
                Shopping Cart
              </h1>
              <p className="text-sm text-gray-400">
                {items.length} {items.length === 1 ? "item" : "items"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl border border-gray-700 overflow-hidden">
              <div className="p-4 sm:p-6 lg:p-8 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900">
                <h2 className="text-lg sm:text-xl font-bold text-yellow-200 flex items-center gap-3">
                  <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-200" />
                  Your Items ({items.length})
                </h2>
              </div>

              <div className="divide-y divide-gray-700">
                {items.map((item, index) => (
                  <div
                    key={`${item.id}-${item.size}`}
                    className="p-4 sm:p-6 lg:p-8 hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                      {/* Product Image */}
                      <div className="w-full sm:w-24 lg:w-32 h-24 sm:h-24 lg:h-32 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl sm:rounded-2xl overflow-hidden flex-shrink-0 shadow-md sm:shadow-lg mx-auto sm:mx-0">
                        <YupooImage
                          src={item.product.images[0]}
                          alt={item.product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-3 sm:mb-4">
                          <div className="flex-1">
                            <h3 className="text-base sm:text-lg font-bold text-white mb-2">
                              <Link
                                href={`/products/${item.product.id}`}
                                className="hover:text-yellow-200 transition-colors line-clamp-2"
                              >
                                {item.product.title}
                              </Link>
                            </h3>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400 mb-3">
                              <span className="bg-yellow-500/20 text-yellow-200 px-2 sm:px-3 py-1 rounded-full font-medium">
                                Size: {item.size}
                              </span>
                              <span className="bg-gray-700 text-gray-300 px-2 sm:px-3 py-1 rounded-full font-medium">
                                {item.product.brand}
                              </span>
                            </div>
                            <p className="text-base sm:text-lg font-bold text-yellow-200 bg-gray-800 px-3 py-2 rounded-lg sm:rounded-xl inline-block">
                              {formatPrice(getDisplayPrice(item.product))}
                            </p>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => handleRemoveItem(item.id, item.size)}
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/20 rounded-lg sm:rounded-xl transition-all duration-300 ml-2"
                          >
                            <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                          </button>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between sm:justify-start gap-4">
                          <span className="text-sm font-semibold text-gray-300">
                            Quantity:
                          </span>
                          <div className="flex items-center bg-gray-700 rounded-lg sm:rounded-xl p-1 shadow-inner">
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item.id,
                                  item.size,
                                  item.quantity - 1
                                )
                              }
                              disabled={
                                item.quantity <= 1 ||
                                isUpdating === `${item.id}-${item.size}`
                              }
                              className="p-2 hover:bg-gray-600 rounded-md sm:rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-gray-300 hover:text-yellow-200"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-3 sm:px-4 py-2 text-sm font-bold min-w-[2.5rem] sm:min-w-[3rem] text-center bg-gray-800 rounded-md sm:rounded-lg shadow-sm text-yellow-200 border border-gray-600">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item.id,
                                  item.size,
                                  item.quantity + 1
                                )
                              }
                              disabled={
                                isUpdating === `${item.id}-${item.size}`
                              }
                              className="p-2 hover:bg-gray-600 rounded-md sm:rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-gray-300 hover:text-yellow-200"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Clear Cart Button */}
              <div className="p-4 sm:p-6 lg:p-8 border-t border-gray-700 bg-gray-800/40">
                <button
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-700 text-sm font-semibold hover:bg-red-50 px-4 py-2 rounded-lg sm:rounded-xl transition-all duration-300"
                >
                  Clear All Items
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl border border-gray-700 p-4 sm:p-6 lg:p-8 lg:sticky lg:top-8">
              <h2 className="text-lg sm:text-xl font-bold text-yellow-200 mb-4 sm:mb-6 flex items-center gap-3">
                <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-200" />
                Order Summary
              </h2>

              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                <div className="flex justify-between items-center py-2 sm:py-3">
                  <span className="text-sm sm:text-base text-gray-300 font-medium">
                    Subtotal ({items.length} items)
                  </span>
                  <span className="font-bold text-sm sm:text-base text-yellow-200">
                    {formatPrice(
                      items.reduce(
                        (sum, item) =>
                          sum + getDisplayPrice(item.product) * item.quantity,
                        0
                      )
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 sm:py-3">
                  <span className="text-sm sm:text-base text-gray-300 font-medium flex items-center gap-2">
                    <Truck className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                    Shipping
                  </span>
                  <span className="font-bold text-green-600 text-sm sm:text-base">
                    FREE
                  </span>
                </div>
                <div className="border-t border-gray-700 pt-3 sm:pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-base sm:text-lg font-bold text-yellow-200">
                      Total
                    </span>
                    <span className="text-lg sm:text-xl font-bold text-yellow-200">
                      {formatPrice(
                        items.reduce(
                          (sum, item) =>
                            sum + getDisplayPrice(item.product) * item.quantity,
                          0
                        )
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full bg-gradient-to-r from-yellow-200 to-yellow-100 text-black py-3 sm:py-4 px-6 rounded-xl sm:rounded-2xl font-bold hover:from-yellow-200 hover:to-yellow-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-center block mb-4 text-sm sm:text-base"
              >
                Proceed to Checkout
              </Link>

              {/* Trust Indicators */}
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-300">
                  <Lock className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                  <span>Secure checkout powered by Stripe</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-300">
                  <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                  <span>100% secure payment processing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
