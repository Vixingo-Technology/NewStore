"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star, Truck, RefreshCw, Award, Users } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";
import { useState, useEffect } from "react";

// Animated Counter Component
function AnimatedCounter({
  end,
  duration = 2000,
  suffix = "",
}: {
  end: number;
  duration?: number;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * end);

      setCount(currentCount);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration]);

  return (
    <span className="text-3xl font-bold text-yellow-200 mb-2">
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function HomePage() {
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="min-h-full bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Hero Section */}
      <section className="relative h-[92svh] md:h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/hero.jpg"
            alt="Soccer jerseys hero background"
            fill
            className="object-cover"
            priority
          />
        </div>
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Content */}
        <div className="relative z-10 mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="">
            <div className="mb-6">
              <span className="inline-block bg-yellow-500/10 backdrop-blur-sm text-yellow-200 px-4 py-2 rounded-full text-sm font-medium mb-4">
                ⚽ Premium Authentic Jerseys
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-3 leading-tight">
              The Ultimate
              <span className="block bg-clip-text bg-gradient-to-r text-yellow-200">
                Soccer Collection
              </span>
            </h1>
            <p className="text-md mb-8 text-gray-300 max-w-2xl mx-auto">
              Discover authentic jerseys from the world&apos;s top clubs and
              leagues.
              <span className="block text-white font-medium mt-2">
                Quality that speaks for itself.
              </span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/products"
                className="group bg-white text-gray-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center gap-3"
              >
                Explore Collection
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/products"
                className="bg-transparent text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/10 transition-all duration-300 border-2 border-white/30"
              >
                View Latest Arrivals
              </Link>
            </div>
            {/* Stats Section */}
            <section className="py-16 -mx-4 sm:-mx-6 lg:-mx-8">
              <div className="w-full">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  <div className="text-center">
                    <AnimatedCounter end={500} suffix="+" />
                    <div className="text-gray-300 text-sm">
                      Authentic Jerseys
                    </div>
                  </div>
                  <div className="text-center">
                    <AnimatedCounter end={50} suffix="+" />
                    <div className="text-gray-300 text-sm">Top Clubs</div>
                  </div>
                  <div className="text-center">
                    <AnimatedCounter end={10000} suffix="+" />
                    <div className="text-gray-300 text-sm">Happy Customers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-200 mb-2">
                      24/7
                    </div>
                    <div className="text-gray-300 text-sm">
                      Customer Support
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
      <div className="bg-gradient-to-br from-gray-900 to-black">
        {/* Featured Products */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2  text-white text-sm font-medium rounded-full mb-6">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                Premium Collection
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Featured Products
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
                Handpicked premium jerseys for the ultimate fan experience
              </p>
              <Link
                href="/products"
                className="inline-flex text-black items-center px-8 py-4 bg-gradient-to-r from-yellow-200 to-yellow-100 font-semibold rounded-xl hover:from-yellow-200 hover:to-yellow-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Explore All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="group relative"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-200 to-yellow-100 rounded-2xl transform rotate-1 group-hover:rotate-2 transition-transform duration-300"></div>
                  <div className="relative bg-gray-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
                    <ProductCard product={product} />
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="text-center mt-16">
              <div className="inline-flex items-center space-x-4 text-gray-400">
                <div className="flex items-center">
                  <span className="text-sm font-medium">Free Shipping</span>
                </div>
                <div className="w-px h-4 bg-gray-600"></div>
                <div className="flex items-center">
                  <span className="text-sm font-medium">Authentic Quality</span>
                </div>
                <div className="w-px h-4 bg-gray-600"></div>
                <div className="flex items-center">
                  <span className="text-sm font-medium">Easy Returns</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      {/* Categories Section */}
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-200 to-yellow-100 text-black text-sm font-medium rounded-full mb-6">
              <span className="w-2 h-2 bg-yellow-700 rounded-full mr-2 animate-pulse"></span>
              Explore Collections
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-yellow-200 mb-6">
              Shop by Category
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover authentic jerseys from the world&apos;s most prestigious
              football leagues and teams
            </p>
          </div>

          {/* Main Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Premier League */}
            <Link
              href="/products?category=Premier%20League"
              className="group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-4"
            >
              <div className="aspect-[4/5] bg-gradient-to-br from-slate-700 via-slate-600 to-slate-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute top-6 left-6">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-3xl">🏆</span>
                  </div>
                </div>
                <div className="absolute bottom-8 left-8 right-8 text-white">
                  <h3 className="text-2xl font-bold mb-3">Premier League</h3>
                  <p className="text-white/90 text-sm mb-4 leading-relaxed">
                    England&apos;s elite competition featuring the world&apos;s
                    best clubs
                  </p>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                      20 Teams
                    </span>
                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                      Top Quality
                    </span>
                  </div>
                </div>
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
                  <div className="bg-white/20 backdrop-blur-md rounded-2xl p-3 shadow-lg">
                    <ArrowRight className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              </div>
            </Link>

            {/* La Liga */}
            <Link
              href="/products?category=La%20Liga"
              className="group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-4"
            >
              <div className="aspect-[4/5] bg-gradient-to-br from-stone-600 via-stone-500 to-stone-700 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute top-6 left-6">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-3xl">⚽</span>
                  </div>
                </div>
                <div className="absolute bottom-8 left-8 right-8 text-white">
                  <h3 className="text-2xl font-bold mb-3">La Liga</h3>
                  <p className="text-white/90 text-sm mb-4 leading-relaxed">
                    Spanish excellence with world-class talent and passion
                  </p>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                      20 Teams
                    </span>
                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                      Elite Players
                    </span>
                  </div>
                </div>
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
                  <div className="bg-white/20 backdrop-blur-md rounded-2xl p-3 shadow-lg">
                    <ArrowRight className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              </div>
            </Link>

            {/* Bundesliga */}
            <Link
              href="/products?category=Bundesliga"
              className="group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-4"
            >
              <div className="aspect-[4/5] bg-gradient-to-br from-neutral-600 via-neutral-500 to-neutral-700 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute top-6 left-6">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-3xl">🇩🇪</span>
                  </div>
                </div>
                <div className="absolute bottom-8 left-8 right-8 text-white">
                  <h3 className="text-2xl font-bold mb-3">Bundesliga</h3>
                  <p className="text-white/90 text-sm mb-4 leading-relaxed">
                    German precision and high-energy football at its finest
                  </p>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                      18 Teams
                    </span>
                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                      High Energy
                    </span>
                  </div>
                </div>
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
                  <div className="bg-white/20 backdrop-blur-md rounded-2xl p-3 shadow-lg">
                    <ArrowRight className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              </div>
            </Link>

            {/* Serie A */}
            <Link
              href="/products?category=Serie%20A"
              className="group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-4"
            >
              <div className="aspect-[4/5] bg-gradient-to-br from-zinc-700 via-zinc-600 to-zinc-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute top-6 left-6">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-3xl">🇮🇹</span>
                  </div>
                </div>
                <div className="absolute bottom-8 left-8 right-8 text-white">
                  <h3 className="text-2xl font-bold mb-3">Serie A</h3>
                  <p className="text-white/90 text-sm mb-4 leading-relaxed">
                    Italian passion and tactical brilliance on display
                  </p>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                      20 Teams
                    </span>
                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                      Tactical
                    </span>
                  </div>
                </div>
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
                  <div className="bg-white/20 backdrop-blur-md rounded-2xl p-3 shadow-lg">
                    <ArrowRight className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              </div>
            </Link>
          </div>

          {/* Additional Categories */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Champions League */}
            <Link
              href="/products?category=Champions%20League"
              className="group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-4"
            >
              <div className="aspect-[3/2] bg-gradient-to-br from-amber-700 via-amber-600 to-amber-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl">⭐</span>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-xl font-bold mb-2">Champions League</h3>
                  <p className="text-white/90 text-xs leading-relaxed">
                    Europe&apos;s elite competition with the best clubs
                  </p>
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
                  <div className="bg-white/20 backdrop-blur-md rounded-xl p-2 shadow-lg">
                    <ArrowRight className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              </div>
            </Link>

            {/* National Teams */}
            <Link
              href="/products?category=National%20Teams"
              className="group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-4"
            >
              <div className="aspect-[3/2] bg-gradient-to-br from-emerald-700 via-emerald-600 to-emerald-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl">🌍</span>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-xl font-bold mb-2">National Teams</h3>
                  <p className="text-white/90 text-xs leading-relaxed">
                    Represent your country with pride and passion
                  </p>
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
                  <div className="bg-white/20 backdrop-blur-md rounded-xl p-2 shadow-lg">
                    <ArrowRight className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-teal-500/20 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              </div>
            </Link>

            {/* Ligue 1 */}
            <Link
              href="/products?category=Ligue%201"
              className="group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-4"
            >
              <div className="aspect-[3/2] bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl">🇫🇷</span>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-xl font-bold mb-2">Ligue 1</h3>
                  <p className="text-white/90 text-xs leading-relaxed">
                    French elegance and technical brilliance
                  </p>
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
                  <div className="bg-white/20 backdrop-blur-md rounded-xl p-2 shadow-lg">
                    <ArrowRight className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              </div>
            </Link>

            {/* View All */}
            <Link
              href="/products"
              className="group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-4"
            >
              <div className="aspect-[3/2] bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl">🏪</span>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-xl font-bold mb-2">View All</h3>
                  <p className="text-white/90 text-xs leading-relaxed">
                    Browse our complete collection
                  </p>
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
                  <div className="bg-white/20 backdrop-blur-md rounded-xl p-2 shadow-lg">
                    <ArrowRight className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-500/20 to-gray-600/20 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-600 to-yellow-700 text-white text-sm font-medium rounded-full mb-6">
              <span className="w-2 h-2 bg-yellow-200 rounded-full mr-2 animate-pulse"></span>
              Why Choose Us
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-yellow-200 mb-6">
              Why Choose Nuvion?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We&apos;re committed to providing the best shopping experience
              with premium quality and exceptional service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 backdrop-blur-sm rounded-3xl mx-auto mb-6 flex items-center justify-center group-hover:from-yellow-500/30 group-hover:to-yellow-600/30 transition-all duration-300 shadow-lg">
                <Award className="h-10 w-10 text-yellow-200" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">
                Authentic Quality
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                100% authentic jerseys from official manufacturers and
                suppliers.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 backdrop-blur-sm rounded-3xl mx-auto mb-6 flex items-center justify-center group-hover:from-yellow-500/30 group-hover:to-yellow-600/30 transition-all duration-300 shadow-lg">
                <Truck className="h-10 w-10 text-yellow-200" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">
                Fast Shipping
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Free shipping on orders over $50. Get your jersey in 2-3
                business days.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 backdrop-blur-sm rounded-3xl mx-auto mb-6 flex items-center justify-center group-hover:from-yellow-500/30 group-hover:to-yellow-600/30 transition-all duration-300 shadow-lg">
                <RefreshCw className="h-10 w-10 text-yellow-200" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">
                Easy Returns
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                30-day hassle-free return policy. Not satisfied? Return it
                hassle-free.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 backdrop-blur-sm rounded-3xl mx-auto mb-6 flex items-center justify-center group-hover:from-yellow-500/30 group-hover:to-yellow-600/30 transition-all duration-300 shadow-lg">
                <Users className="h-10 w-10 text-yellow-200" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">
                Expert Support
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                24/7 customer support to help you find the perfect jersey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gradient-to-br from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-yellow-600 to-yellow-700 text-white text-sm font-medium rounded-full mb-6">
              <span className="w-2 h-2 bg-yellow-200 rounded-full mr-2 animate-pulse"></span>
              Customer Reviews
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-yellow-200 mb-6">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-300">
              Join thousands of satisfied customers worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-700/50">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                &quot;Amazing quality! The jersey feels exactly like the
                official ones. Fast shipping and great customer service.&quot;
              </p>
              <div className="font-semibold text-white">- Alex Johnson</div>
              <div className="text-sm text-gray-400">Verified Customer</div>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-700/50">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                &quot;Best place to buy authentic soccer jerseys. Huge selection
                and competitive prices. Highly recommended!&quot;
              </p>
              <div className="font-semibold text-white">- Maria Rodriguez</div>
              <div className="text-sm text-gray-400">Verified Customer</div>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-700/50">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                &quot;Perfect fit and excellent quality. The return process was
                smooth when I needed a different size.&quot;
              </p>
              <div className="font-semibold text-white">- David Chen</div>
              <div className="text-sm text-gray-400">Verified Customer</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-black">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-yellow-200 mb-6">
            Ready to Show Your Team Spirit?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of fans who trust Nuvion for their authentic
            jersey needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="group bg-gradient-to-r from-yellow-200 to-yellow-100 text-black px-8 py-4 rounded-xl font-bold text-lg hover:from-yellow-200 hover:to-yellow-100 transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center gap-3"
            >
              Start Shopping Now
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/products"
              className="bg-transparent text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all duration-300 border-2 border-yellow-200/30 hover:border-yellow-200/50"
            >
              Browse Collections
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
