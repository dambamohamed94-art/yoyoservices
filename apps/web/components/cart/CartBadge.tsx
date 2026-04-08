"use client";

import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "../../store/cart-store";

type CartBadgeProps = {
  onClick?: () => void;
};

export default function CartBadge({ onClick }: CartBadgeProps) {
  const totalItems = useCartStore((state) => state.totalItems());
  const totalPrice = useCartStore((state) => state.totalPrice());

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const safeTotalItems = isMounted ? totalItems : 0;
  const safeTotalPrice = isMounted ? totalPrice : 0;

  return (
    <button
      onClick={onClick}
      className="relative flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-black shadow-sm transition hover:-translate-y-0.5 hover:bg-black hover:text-white"
    >
      <ShoppingCart size={18} />
      <span className="hidden sm:inline">Panier</span>

      <span className="hidden md:inline text-xs text-zinc-500">
        {safeTotalPrice} FCFA
      </span>

      <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white">
        {safeTotalItems}
      </span>
    </button>
  );
}