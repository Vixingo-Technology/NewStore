"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { CheckCircle, ArrowLeft, ShoppingBag } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    // Clear the cart when the success page loads
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-green-600" />
            <h2 className="mt-4 text-2xl font-bold text-gray-900">
              Payment Successful!
            </h2>
            <p className="mt-2 text-gray-600">
              Thank you for your purchase. Your order has been confirmed.
            </p>

            {sessionId && (
              <p className="mt-2 text-sm text-gray-500">
                Session ID: {sessionId}
              </p>
            )}
          </div>

          <div className="mt-8 space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h3 className="text-sm font-medium text-blue-800">
                What&apos;s Next?
              </h3>
              <ul className="mt-2 text-sm text-blue-700 space-y-1">
                <li>• You&apos;ll receive an email confirmation shortly</li>
                <li>
                  • We&apos;ll process your order and ship it within 2-3
                  business days
                </li>
                <li>• You can track your order using the email we sent</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/"
                className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <ArrowLeft className="h-4 w-4" />
                Continue Shopping
              </Link>

              <Link
                href="/products"
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
              >
                <ShoppingBag className="h-4 w-4" />
                Browse More Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          Loading...
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
