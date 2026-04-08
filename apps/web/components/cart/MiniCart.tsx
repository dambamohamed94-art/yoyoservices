"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ShoppingBag, Trash2, X } from "lucide-react";
import { useCartStore } from "../../store/cart-store";

type MiniCartProps = {
  isOpen: boolean;
  onClose: () => void;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function MiniCart({ isOpen, onClose }: MiniCartProps) {
  const router = useRouter();

  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const totalPrice = useCartStore((state) => state.totalPrice());

  const [customerFirstName, setCustomerFirstName] = useState("");
  const [customerLastName, setCustomerLastName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerDistrict, setCustomerDistrict] = useState("");
  const [isSubmittingWhatsApp, setIsSubmittingWhatsApp] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const safeItems = isMounted ? items : [];
  const safeTotalPrice = isMounted ? totalPrice : 0;

  const whatsappNumber =
    process.env.NEXT_PUBLIC_STORE_WHATSAPP || "22377453217";
  const storeName = process.env.NEXT_PUBLIC_STORE_NAME || "YOYO SERVICES";

  const totalItems = useMemo(
    () => safeItems.reduce((sum, item) => sum + item.quantity, 0),
    [safeItems]
  );

  const canSubmitWhatsApp =
    safeItems.length > 0 &&
    customerFirstName.trim() &&
    customerLastName.trim() &&
    customerPhone.trim() &&
    customerDistrict.trim();

  async function handleWhatsAppCheckout() {
    if (!canSubmitWhatsApp) return;

    try {
      setIsSubmittingWhatsApp(true);

      const response = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: {
            firstName: customerFirstName,
            lastName: customerLastName,
            phone: customerPhone,
            district: customerDistrict,
          },
          items: safeItems,
          paymentMethod: "PAY_AT_STORE",
          validationCode: null,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création de la commande WhatsApp");
      }

      const data = await response.json();

      clearCart();
      onClose();

      const params = new URLSearchParams({
        orderNumber: data.reference ?? "",
        name: `${customerFirstName} ${customerLastName}`.trim(),
        phone: customerPhone,
        district: customerDistrict,
        total: String(data.totalAmount ?? 0),
      });

      router.push(`/checkout/whatsapp-success?${params.toString()}`);
    } catch (error) {
      console.error("Erreur commande WhatsApp:", error);
      alert("Impossible d’envoyer la commande à la boutique.");
    } finally {
      setIsSubmittingWhatsApp(false);
    }
  }

  const message = useMemo(() => {
    const lines = [
      `Bonjour ${storeName},`,
      "",
      "Je souhaite préparer ce panier et régler en magasin :",
      "",
      ...safeItems.map(
        (item) =>
          `- ${item.name} x${item.quantity} = ${item.price * item.quantity} FCFA`
      ),
      "",
      `Total : ${safeTotalPrice} FCFA`,
      "",
      "Informations client :",
      `Prénom : ${customerFirstName}`,
      `Nom : ${customerLastName}`,
      `Téléphone : ${customerPhone}`,
      `Quartier : ${customerDistrict}`,
      "",
      "Mode de paiement : règlement à la boutique",
    ];

    return lines.join("\n");
  }, [
    safeItems,
    safeTotalPrice,
    customerFirstName,
    customerLastName,
    customerPhone,
    customerDistrict,
    storeName,
  ]);

  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] bg-black/45 backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col border-l border-black/5 bg-white shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="border-b border-black/5 px-5 py-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-500">
                Panier
              </p>
              <h2 className="mt-1 text-xl font-extrabold">Votre sélection</h2>
              <p className="mt-1 text-xs text-zinc-500">
                {totalItems} article(s) • préparation rapide
              </p>
            </div>

            <button
              onClick={onClose}
              className="rounded-full border border-black/10 p-2 transition hover:bg-black hover:text-white"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="rounded-[2rem] bg-[#f8f5f0] p-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
                <ShoppingBag size={22} />
              </div>
              <h3 className="text-lg font-extrabold">Panier vide</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                Ajoute quelques produits pour préparer ta commande.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[1.5rem] border border-black/5 bg-[#f8f5f0] p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-bold">{item.name}</p>
                        <p className="mt-1 text-xs text-zinc-500">
                          {item.quantity} × {item.price} FCFA
                        </p>
                        <p className="mt-2 text-sm font-extrabold text-orange-500">
                          {item.quantity * item.price} FCFA
                        </p>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white transition hover:bg-black hover:text-white"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-[2rem] bg-[#f8f5f0] p-4">
                <h3 className="mb-4 text-sm font-extrabold">
                  Informations client pour WhatsApp
                </h3>

                <div className="grid gap-3">
                  <input
                    value={customerFirstName}
                    onChange={(e) => setCustomerFirstName(e.target.value)}
                    placeholder="Prénom"
                    className="h-11 rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none focus:border-orange-400"
                  />
                  <input
                    value={customerLastName}
                    onChange={(e) => setCustomerLastName(e.target.value)}
                    placeholder="Nom"
                    className="h-11 rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none focus:border-orange-400"
                  />
                  <input
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Téléphone"
                    className="h-11 rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none focus:border-orange-400"
                  />
                  <input
                    value={customerDistrict}
                    onChange={(e) => setCustomerDistrict(e.target.value)}
                    placeholder="Quartier"
                    className="h-11 rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none focus:border-orange-400"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        <div className="border-t border-black/5 px-5 py-4">
          <div className="mb-4 rounded-[1.5rem] bg-black px-4 py-4 text-white">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70">Total</span>
              <span className="text-xl font-extrabold">{safeTotalPrice} FCFA</span>
            </div>
          </div>

          <div className="grid gap-3">
            <button
              onClick={handleWhatsAppCheckout}
              disabled={!canSubmitWhatsApp || isSubmittingWhatsApp}
              className={`flex h-12 items-center justify-center rounded-full text-sm font-semibold transition ${
                !canSubmitWhatsApp || isSubmittingWhatsApp
                  ? "cursor-not-allowed bg-zinc-200 text-zinc-500"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              {isSubmittingWhatsApp
                ? "Envoi à la boutique..."
                : "Valider via WhatsApp"}
            </button>

            <Link
              href={items.length ? "/checkout" : "#"}
              onClick={items.length ? onClose : undefined}
              className={`flex h-12 items-center justify-center gap-2 rounded-full text-sm font-semibold transition ${
                items.length
                  ? "bg-orange-500 text-white hover:bg-orange-600"
                  : "pointer-events-none bg-zinc-200 text-zinc-500"
              }`}
            >
              Payer via Orange Money
              <ArrowRight size={16} />
            </Link>

            {canSubmitWhatsApp && (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="flex h-12 items-center justify-center rounded-full border border-black/10 text-sm font-semibold transition hover:bg-black hover:text-white"
              >
                Prévisualiser le message WhatsApp
              </a>
            )}

            <button
              onClick={clearCart}
              className="h-12 rounded-full border border-black/10 text-sm font-semibold transition hover:bg-black hover:text-white"
            >
              Vider le panier
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}