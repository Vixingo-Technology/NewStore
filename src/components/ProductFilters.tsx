"use client";

import { useMemo, useState } from "react";
import { FilterOptions } from "@/types";
import { products } from "@/data/products";
import { Filter, X, DollarSign, Tag, Zap } from "lucide-react";

interface ProductFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

export default function ProductFilters({
  filters,
  onFiltersChange,
}: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (
    key: keyof FilterOptions,
    value: string | number | [number, number]
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      category: "All",
      priceRange: [0, 1000],
      size: "",
      brand: "All",
    });
  };

  const hasActiveFilters =
    filters.category !== "All" ||
    filters.brand !== "All" ||
    /* filters.size !== "" || */
    filters.priceRange[0] !== 0 ||
    filters.priceRange[1] !== 1000;

  // Derive filter option lists from current products data
  const categoryOptions = useMemo(() => {
    const set = new Set<string>();
    set.add("All");
    for (const p of products) {
      if (p.category) set.add(p.category);
      if (p.league) set.add(p.league);
    }
    return Array.from(set);
  }, []);

  const brandOptions = useMemo(() => {
    const set = new Set<string>();
    set.add("All");
    for (const p of products) {
      if (p.brand) set.add(p.brand);
    }
    return Array.from(set);
  }, []);

  // const sizeOptions = useMemo(() => {
  //   const set = new Set<string>();
  //   for (const p of products) {
  //     for (const s of p.sizes || []) set.add(s);
  //   }
  //   return Array.from(set).sort((a, b) => a.localeCompare(b));
  // }, []);

  return (
    <div className="h-full flex flex-col">
      {/* Header - Fixed */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-yellow-200" />
          <h2 className="text-lg font-bold text-yellow-200">Filters</h2>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-yellow-200 hover:text-yellow-100 font-medium flex items-center gap-1 transition-colors"
          >
            <X className="h-4 w-4" />
            Clear
          </button>
        )}
      </div>

      {/* Filter Content - Scrollable */}
      <div className="flex-1 overflow-y-auto space-y-8 pr-2 scrollbar-hide">
        {/* Category Filter */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Tag className="h-4 w-4 text-yellow-200" />
            <h3 className="font-semibold text-yellow-200">Category</h3>
          </div>
          <div className="space-y-3">
            {categoryOptions.map((category) => (
              <label
                key={category}
                className="flex items-center cursor-pointer group"
              >
                <input
                  type="radio"
                  name="category"
                  value={category}
                  checked={filters.category === category}
                  onChange={(e) =>
                    handleFilterChange("category", e.target.value)
                  }
                  className="h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-gray-600 bg-gray-800"
                />
                <span className="ml-3 text-sm text-white group-hover:text-yellow-200 transition-colors">
                  {category}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="h-4 w-4 text-gray-300" />
            <h3 className="font-semibold text-gray-300">Price Range</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="block text-xs text-gray-300 mb-1">Min</label>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.priceRange[0]}
                  onChange={(e) =>
                    handleFilterChange("priceRange", [
                      Number(e.target.value),
                      filters.priceRange[1],
                    ])
                  }
                  className="w-full text-white bg-gray-800 px-3 py-2 border border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300 placeholder-gray-400"
                />
              </div>
              <div className="flex items-center justify-center text-gray-400 mt-6">
                -
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-300 mb-1">Max</label>
                <input
                  type="number"
                  placeholder="1000"
                  value={filters.priceRange[1]}
                  onChange={(e) =>
                    handleFilterChange("priceRange", [
                      filters.priceRange[0],
                      Number(e.target.value),
                    ])
                  }
                  className="w-full text-white bg-gray-800 px-3 py-2 border border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Quick Price Ranges */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Under $50", range: [0, 50] },
                { label: "$50-$100", range: [50, 100] },
                { label: "$100-$200", range: [100, 200] },
                { label: "$200+", range: [200, 1000] },
              ].map(({ label, range }) => (
                <button
                  key={label}
                  onClick={() =>
                    handleFilterChange("priceRange", range as [number, number])
                  }
                  className={`px-3 py-2 text-start text-xs rounded-lg border transition-all duration-300 ${filters.priceRange[0] === range[0] &&
                      filters.priceRange[1] === range[1]
                      ? "bg-yellow-500 text-black border-yellow-500"
                      : "bg-gray-800 text-white border-gray-600 hover:border-yellow-500 hover:bg-gray-700"
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Size Filter - temporarily disabled */}
        {/**
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-4 w-4 text-gray-300" />
            <h3 className="font-semibold text-gray-300">Size</h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {sizeOptions.map((size) => (
              <label
                key={size}
                className="flex items-center cursor-pointer group"
              >
                <input
                  type="radio"
                  name="size"
                  value={size}
                  checked={filters.size === size}
                  onChange={(e) => handleFilterChange("size", e.target.value)}
                  className="h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-gray-600 bg-gray-800"
                />
                <span className="ml-2 text-sm text-white group-hover:text-yellow-200 transition-colors">
                  {size}
                </span>
              </label>
            ))}
          </div>
        </div>
        */}

        {/* Brand Filter */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-4 w-4 text-gray-300" />
            <h3 className="font-semibold text-gray-300">Brand</h3>
          </div>
          <div className="space-y-3">
            {brandOptions.map((brand) => (
              <label
                key={brand}
                className="flex items-center cursor-pointer group"
              >
                <input
                  type="radio"
                  name="brand"
                  value={brand}
                  checked={filters.brand === brand}
                  onChange={(e) => handleFilterChange("brand", e.target.value)}
                  className="h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-gray-600 bg-gray-800"
                />
                <span className="ml-3 text-sm text-white group-hover:text-yellow-200 transition-colors">
                  {brand}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="pt-6 border-t border-gray-700 pb-4">
          <h4 className="text-sm font-semibold text-yellow-200 mb-3">
            Active Filters
          </h4>
          <div className="space-y-2">
            {filters.category !== "All" && (
              <div className="flex items-center justify-between bg-gray-800 text-white px-3 py-2 rounded-lg text-sm border border-gray-700">
                <span>Category: {filters.category}</span>
                <button
                  onClick={() => handleFilterChange("category", "All")}
                  className="hover:bg-gray-700 rounded-full p-1 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            {filters.brand !== "All" && (
              <div className="flex items-center justify-between bg-gray-800 text-white px-3 py-2 rounded-lg text-sm border border-gray-700">
                <span>Brand: {filters.brand}</span>
                <button
                  onClick={() => handleFilterChange("brand", "All")}
                  className="hover:bg-gray-700 rounded-full p-1 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            {false && filters.size !== "" && (
              <div className="flex items-center justify-between bg-gray-800 text-white px-3 py-2 rounded-lg text-sm border border-gray-700">
                <span>Size: {filters.size}</span>
                <button
                  onClick={() => handleFilterChange("size", "")}
                  className="hover:bg-gray-700 rounded-full p-1 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            {(filters.priceRange[0] !== 0 ||
              filters.priceRange[1] !== 1000) && (
                <div className="flex items-center justify-between bg-gray-800 text-white px-3 py-2 rounded-lg text-sm border border-gray-700">
                  <span>
                    Price: ${filters.priceRange[0]} - ${filters.priceRange[1]}
                  </span>
                  <button
                    onClick={() => handleFilterChange("priceRange", [0, 1000])}
                    className="hover:bg-gray-700 rounded-full p-1 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
}
