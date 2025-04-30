"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";
import { CartContextType, CartItem, Product } from "@/types";

type CartAction =
  | {
      type: "ADD_ITEM";
      payload: { product: Product; size: string; quantity: number };
    }
  | { type: "REMOVE_ITEM"; payload: { id: string; size: string } }
  | {
      type: "UPDATE_QUANTITY";
      payload: { id: string; size: string; quantity: number };
    }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartItem[] };

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, size, quantity } = action.payload;
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === product.id && item.size === size
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += quantity;
        return { ...state, items: updatedItems };
      } else {
        const newItem: CartItem = {
          id: product.id,
          product,
          size,
          quantity,
        };
        return { ...state, items: [...state.items, newItem] };
      }
    }

    case "REMOVE_ITEM": {
      const { id, size } = action.payload;
      const filteredItems = state.items.filter(
        (item) => !(item.id === id && item.size === size)
      );
      return { ...state, items: filteredItems };
    }

    case "UPDATE_QUANTITY": {
      const { id, size, quantity } = action.payload;
      const updatedItems = state.items
        .map((item) =>
          item.id === id && item.size === size
            ? { ...item, quantity: Math.max(0, quantity) }
            : item
        )
        .filter((item) => item.quantity > 0);
      return { ...state, items: updatedItems };
    }

    case "CLEAR_CART":
      return { ...state, items: [] };

    case "LOAD_CART":
      return { ...state, items: action.payload };

    default:
      return state;
  }
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: "LOAD_CART", payload: parsedCart });
      } catch (error) {
        // Silently handle localStorage errors
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.items));
  }, [state.items]);

  const addItem = (product: Product, size: string, quantity: number) => {
    dispatch({ type: "ADD_ITEM", payload: { product, size, quantity } });
  };

  const removeItem = (id: string, size: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { id, size } });
  };

  const updateQuantity = (id: string, size: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, size, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return state.items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const value: CartContextType = {
    items: state.items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
