"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "../../store/cart-store";

type AddToCartButtonProps = {
  id: string;
  name: string;
  price: number;
  disabled?: boolean;
};

export default function AddToCartButton({
  id,
  name,
  price,
  disabled = false,
}: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const lastAddedId = useCartStore((state) => state.lastAddedId);
  const clearLastAdded = useCartStore((state) => state.clearLastAdded);

  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    if (lastAddedId === id) {
      setIsAnimated(true);

      const timer = setTimeout(() => {
        setIsAnimated(false);
        clearLastAdded();
      }, 900);

      return () => clearTimeout(timer);
    }
  }, [lastAddedId, id, clearLastAdded]);

  return (
    <button
      onClick={() => addItem({ id, name, price })}
      disabled={disabled}


      className={`mt-3 w-full rounded-full px-4 py-2.5 text-[10px] font-semibold tracking-[0.02em] transition md:text-xs ${
  disabled
    ? "cursor-not-allowed bg-zinc-200 text-zinc-500"
    : isAnimated
    ? "scale-[1.02] bg-orange-500 text-white shadow-lg"
    : "bg-black text-white hover:bg-orange-500"
}`}
    >
      {disabled ? "Indisponible" : isAnimated ? "Ajouté ✓" : "Ajouter au panier"}
    </button>
  );
}