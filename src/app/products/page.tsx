"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import ProductFilters from "@/components/ProductFilters";
import { FilterOptions, Product } from "@/types";
import { Search, Grid, List, Filter, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

function ProductsContent() {
  const searchParams = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [filters, setFilters] = useState<FilterOptions>({
    category: "All",
    priceRange: [0, 1000],
    size: "",
    brand: "All",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Get category from URL params
  const categoryParam = searchParams.get("category");
  const focusParam = searchParams.get("focus");

  useEffect(() => {
    if (categoryParam) {
      setFilters((prev) => ({ ...prev, category: categoryParam }));
    }
  }, [categoryParam]);

  useEffect(() => {
    if (focusParam === "1") {
      setTimeout(() => {
        const el = document.getElementById(
          "shop-search"
        ) as HTMLInputElement | null;
        if (el) {
          el.focus();
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 0);
    }
  }, [focusParam]);

  useEffect(() => {
    let filtered = products;

    // Apply category/league filter
    if (filters.category !== "All") {
      filtered = filtered.filter(
        (product) =>
          product.category === filters.category ||
          product.league === filters.category
      );
    }

    // Apply brand filter
    if (filters.brand !== "All") {
      filtered = filtered.filter((product) => product.brand === filters.brand);
    }

    // Apply price range filter
    filtered = filtered.filter(
      (product) =>
        product.price >= filters.priceRange[0] &&
        product.price <= filters.priceRange[1]
    );

    // Apply size filter (temporarily disabled)
    // if (filters.size) {
    //   filtered = filtered.filter((product) =>
    //     product.sizes.includes(filters.size)
    //   );
    // }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product.league &&
            product.league.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (product.club &&
            product.club.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredProducts(filtered);
  }, [filters, searchTerm]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Page Header */}
      <div className="relative bg-gradient-to-r from-black to-gray-900 text-white py-16 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/shop-hero.jpg"
            alt="Shop hero background"
            fill
            className="object-cover"
            priority
          />
        </div>
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-3">
              {categoryParam
                ? `${categoryParam} Jerseys`
                : "Premium Soccer Jerseys"}
            </h1>
            <p className="text-md text-yellow-200 max-w-2xl mx-auto">
              {categoryParam
                ? `Discover authentic ${categoryParam} jerseys from top clubs`
                : "Discover authentic jerseys from the world&apos;s top clubs and leagues"}
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-200 h-5 w-5" />
              <input
                id="shop-search"
                type="text"
                placeholder="Search for jerseys, brands, or categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-yellow-500/10 backdrop-blur-sm border border-yellow-500/30 rounded-2xl text-yellow-100 placeholder-yellow-200 focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 focus:outline-none transition-all duration-300"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filters Trigger */}
          <div className="lg:hidden -mt-4 mb-4">
            <button
              onClick={() => setIsMobileFiltersOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 backdrop-blur-sm px-4 py-3 text-sm font-medium text-yellow-200 shadow-lg hover:from-yellow-500/20 hover:to-yellow-600/20 transition-all duration-300"
            >
              <Filter className="h-4 w-4" />
              Filters
            </button>
          </div>
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block lg:w-80 flex-shrink-0">
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl shadow-2xl p-6 sticky top-24 h-[calc(100vh-120px)] border border-gray-700/50">
              <ProductFilters filters={filters} onFiltersChange={setFilters} />
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-yellow-900/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Search className="h-12 w-12 text-yellow-400" />
                </div>
                <h3 className="text-lg font-bold text-yellow-300 mb-2">
                  No products found
                </h3>
                <p className="text-sm text-yellow-200 mb-6">
                  Try adjusting your search terms or filters to find what
                  you&apos;re looking for.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilters({
                      category: "All",
                      priceRange: [0, 1000],
                      size: "",
                      brand: "All",
                    });
                  }}
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-6 py-3 rounded-lg font-semibold hover:from-yellow-400 hover:to-yellow-500 transition-all duration-300"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div
                className={`grid gap-8 ${viewMode === "grid"
                    ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                    : "grid-cols-1"
                  }`}
              >
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsMobileFiltersOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-80 bg-gradient-to-br from-gray-900 to-black shadow-2xl p-6 overflow-y-auto border-l border-gray-700/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-yellow-200">Filters</h3>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="p-2 hover:bg-yellow-500/10 rounded-lg text-yellow-200 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <ProductFilters filters={filters} onFiltersChange={setFilters} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-yellow-200">Loading products...</p>
          </div>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
