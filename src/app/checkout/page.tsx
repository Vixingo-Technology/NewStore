"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { formatPrice, getDisplayPrice } from "@/lib/utils";
import { CheckoutFormData } from "@/types";
import YupooImage from "@/components/YupooImage";
import {
    ArrowLeft,
    CreditCard,
    Lock,
    Shield,
    Truck,
    RefreshCw,
    CheckCircle,
    User,
    MapPin,
    Phone,
    Mail,
    ShoppingBag,
} from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
    const router = useRouter();
    const { items, getTotalPrice } = useCart();
    const [hasMounted, setHasMounted] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [formData, setFormData] = useState<CheckoutFormData>({
        email: "",
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "United States",
        phone: "",
    });

    useEffect(() => {
        setHasMounted(true);
    }, []);

    useEffect(() => {
        if (hasMounted && items.length === 0) {
            router.replace("/cart");
        }
    }, [hasMounted, items.length, router]);

    if (!hasMounted) {
        return null;
    }

    if (items.length === 0) {
        return null;
    }

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        try {
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    items,
                    customerEmail: formData.email,
                }),
            });

            const data = await response.json();

            if (response.ok && data.url) {
                // Redirect to Stripe Checkout
                window.location.href = data.url;
            } else {
                throw new Error(
                    data.error || "Failed to create checkout session",
                );
            }
        } catch (error) {
            console.error("Checkout error:", error);
            alert(
                "There was an error processing your checkout. Please try again.",
            );
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
            {/* Header */}
            <div className="bg-gradient-to-br from-gray-900 to-black border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <Link
                            href="/cart"
                            className="flex items-center gap-2 text-gray-300 hover:text-yellow-200 transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5" />
                            <span className="font-medium">Back to Cart</span>
                        </Link>
                        <div className="text-right">
                            <h1 className="text-2xl font-bold text-yellow-200">
                                Secure Checkout
                            </h1>
                            <p className="text-sm text-gray-400">
                                {items.length}{" "}
                                {items.length === 1 ? "item" : "items"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Checkout Form */}
                    <div className="lg:col-span-2 space-y-8">
                        <form onSubmit={handleSubmit}>
                            {/* Customer Information */}
                            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-xl border border-gray-700 p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                                        <User className="h-5 w-5 text-yellow-200" />
                                    </div>
                                    <h2 className="text-xl font-bold text-yellow-200">
                                        Customer Information
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label
                                            htmlFor="firstName"
                                            className="block text-sm font-semibold text-gray-300 mb-2"
                                        >
                                            First Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full text-white bg-gray-800 px-4 py-3 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300 placeholder-gray-400"
                                            placeholder="Enter your first name"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="lastName"
                                            className="block text-sm font-semibold text-gray-300 mb-2"
                                        >
                                            Last Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="lastName"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full text-white bg-gray-800 px-4 py-3 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300 placeholder-gray-400"
                                            placeholder="Enter your last name"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="block text-sm font-semibold text-gray-300 mb-2"
                                        >
                                            Email Address *
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full text-white bg-gray-800 pl-10 pr-4 py-3 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300 placeholder-gray-400"
                                                placeholder="your@email.com"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="phone"
                                            className="block text-sm font-semibold text-gray-300 mb-2"
                                        >
                                            Phone Number *
                                        </label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full text-white bg-gray-800 pl-10 pr-4 py-3 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300 placeholder-gray-400"
                                                placeholder="+1 (555) 123-4567"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl mt-6 shadow-xl border border-gray-700 p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                                        <MapPin className="h-5 w-5 text-green-400" />
                                    </div>
                                    <h2 className="text-xl font-bold text-yellow-200">
                                        Shipping Address
                                    </h2>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label
                                            htmlFor="address"
                                            className="block text-sm font-semibold text-gray-300 mb-2"
                                        >
                                            Street Address *
                                        </label>
                                        <input
                                            type="text"
                                            id="address"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full text-white bg-gray-800 px-4 py-3 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300 placeholder-gray-400"
                                            placeholder="123 Main Street"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label
                                                htmlFor="city"
                                                className="block text-sm font-semibold text-gray-300 mb-2"
                                            >
                                                City *
                                            </label>
                                            <input
                                                type="text"
                                                id="city"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full text-white bg-gray-800 px-4 py-3 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300 placeholder-gray-400"
                                                placeholder="New York"
                                            />
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="state"
                                                className="block text-sm font-semibold text-gray-300 mb-2"
                                            >
                                                State *
                                            </label>
                                            <input
                                                type="text"
                                                id="state"
                                                name="state"
                                                value={formData.state}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full text-white bg-gray-800 px-4 py-3 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300 placeholder-gray-400"
                                                placeholder="NY"
                                            />
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="zipCode"
                                                className="block text-sm font-semibold text-gray-300 mb-2"
                                            >
                                                ZIP Code *
                                            </label>
                                            <input
                                                type="text"
                                                id="zipCode"
                                                name="zipCode"
                                                value={formData.zipCode}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full text-white bg-gray-800 px-4 py-3 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300 placeholder-gray-400"
                                                placeholder="10001"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="country"
                                            className="block text-sm font-semibold text-gray-300 mb-2"
                                        >
                                            Country *
                                        </label>
                                        <select
                                            id="country"
                                            name="country"
                                            value={formData.country}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full text-white bg-gray-800 px-4 py-3 border-2 border-gray-600 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300"
                                        >
                                            <option value="United States">
                                                United States
                                            </option>
                                            <option value="Canada">
                                                Canada
                                            </option>
                                            <option value="United Kingdom">
                                                United Kingdom
                                            </option>
                                            <option value="Germany">
                                                Germany
                                            </option>
                                            <option value="France">
                                                France
                                            </option>
                                            <option value="Spain">Spain</option>
                                            <option value="Italy">Italy</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-xl border border-gray-700 p-8 sticky top-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                                    <ShoppingBag className="h-5 w-5 text-yellow-200" />
                                </div>
                                <h2 className="text-xl font-bold text-yellow-200">
                                    Order Summary
                                </h2>
                            </div>

                            {/* Items */}
                            <div className="space-y-4 mb-6">
                                {items.map((item) => (
                                    <div
                                        key={`${item.id}-${item.size}`}
                                        className="flex gap-4 p-4 bg-gray-800 rounded-xl border border-gray-700"
                                    >
                                        <div className="w-16 h-16 bg-gray-700 rounded-lg flex-shrink-0 overflow-hidden">
                                            <YupooImage
                                                src={item.product.images[0]}
                                                alt={item.product.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-white text-sm truncate">
                                                {item.product.title}
                                            </p>
                                            <p className="text-xs text-gray-300 mt-1">
                                                Size: {item.size} | Qty:{" "}
                                                {item.quantity}
                                            </p>
                                            <p className="font-bold text-yellow-200 mt-2">
                                                {formatPrice(
                                                    getDisplayPrice(
                                                        item.product,
                                                    ) * item.quantity,
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Totals */}
                            <div className="border-t border-gray-700 pt-6 space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-300">
                                        Subtotal
                                    </span>
                                    <span className="font-semibold text-yellow-200">
                                        {formatPrice(
                                            items.reduce(
                                                (sum, item) =>
                                                    sum +
                                                    getDisplayPrice(
                                                        item.product,
                                                    ) *
                                                        item.quantity,
                                                0,
                                            ),
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-300 flex items-center gap-2">
                                        <Truck className="h-4 w-4 text-green-600" />
                                        Shipping
                                    </span>
                                    <span className="font-semibold text-green-600">
                                        FREE
                                    </span>
                                </div>
                                <div className="border-t border-gray-700 pt-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-bold text-yellow-200">
                                            Total
                                        </span>
                                        <span className="text-xl font-bold text-yellow-200">
                                            {formatPrice(
                                                items.reduce(
                                                    (sum, item) =>
                                                        sum +
                                                        getDisplayPrice(
                                                            item.product,
                                                        ) *
                                                            item.quantity,
                                                    0,
                                                ),
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Checkout Button */}
                            <button
                                onClick={handleSubmit}
                                disabled={isProcessing}
                                className="w-full bg-gradient-to-r from-yellow-200 to-yellow-100 text-black py-4 px-6 rounded-2xl font-bold hover:from-yellow-200 hover:to-yellow-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl mt-6 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isProcessing ? (
                                    <>
                                        <div
                                            aria-hidden
                                            className="animate-spin rounded-full h-5 w-5 border-2 border-black border-t-transparent"
                                        ></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <CreditCard className="h-5 w-5" />
                                        Proceed to Payment
                                    </>
                                )}
                            </button>

                            {/* Trust Indicators */}
                            <div className="mt-6 space-y-3">
                                <div className="flex items-center gap-2 text-sm text-gray-300">
                                    <Lock className="h-4 w-4 text-green-600" />
                                    <span>
                                        Secure checkout powered by Stripe
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-300">
                                    <Shield className="h-4 w-4 text-blue-600" />
                                    <span>100% secure payment processing</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-300">
                                    <RefreshCw className="h-4 w-4 text-purple-600" />
                                    <span>30-day return policy</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
