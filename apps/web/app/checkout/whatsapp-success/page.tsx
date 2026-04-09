"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, MessageCircle, Home } from "lucide-react";
import { useCartStore } from "@/store/cart-store";

function sanitizePhone(phone: string) {
  return phone.replace(/[^\d]/g, "");
}

function formatPrice(value: string | number) {
  const amount = typeof value === "string" ? Number(value) : value;

  if (Number.isNaN(amount)) return `${value} FCFA`;

  return new Intl.NumberFormat("fr-FR").format(amount) + " FCFA";
}

export default function WhatsAppSuccessPage() {
  const searchParams = useSearchParams();
  const clearCart = useCartStore((state) => state.clearCart);

  const orderNumber = searchParams.get("orderNumber") || "";
  const customerName = searchParams.get("name") || "";
  const customerPhone = searchParams.get("phone") || "";
  const total = searchParams.get("total") || "0";

  const whatsappNumber =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "0022377453217";

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  const whatsappText = useMemo(() => {
    const lines = [
      "Bonjour YOYO SERVICES 👋",
      "",
      "Je viens de créer une commande sur votre boutique.",
      orderNumber ? `Référence : ${orderNumber}` : "",
      customerName ? `Nom : ${customerName}` : "",
      customerPhone ? `Téléphone : ${customerPhone}` : "",
      total ? `Montant : ${formatPrice(total)}` : "",
      "",
      "Je vous contacte pour poursuivre la confirmation de ma commande.",
    ].filter(Boolean);

    return lines.join("\n");
  }, [orderNumber, customerName, customerPhone, total]);

  const whatsappUrl = useMemo(() => {
    return `https://wa.me/${sanitizePhone(
      whatsappNumber
    )}?text=${encodeURIComponent(whatsappText)}`;
  }, [whatsappNumber, whatsappText]);

  return (
    <main className="min-h-screen bg-[#f8f5f0] px-4 py-10 text-[#111111]">
      <div className="mx-auto max-w-3xl rounded-[2rem] bg-white p-6 shadow-sm md:p-10">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>

          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">
            Commande enregistrée
          </p>

          <h1 className="mt-3 text-3xl font-extrabold leading-tight md:text-5xl">
            Votre commande a bien été créée
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-zinc-600 md:text-base">
            Votre commande est maintenant enregistrée dans le système.
            <br />
            Dernière étape : cliquez sur{" "}
            <span className="font-semibold text-black">Ouvrir WhatsApp</span>{" "}
            pour poursuivre la confirmation avec YOYO SERVICES.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <div className="rounded-[1.75rem] bg-[#f1ede8] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Référence
            </p>
            <p className="mt-3 break-words text-2xl font-extrabold">
              {orderNumber || "—"}
            </p>
          </div>

          <div className="rounded-[1.75rem] bg-black p-5 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
              Total
            </p>
            <p className="mt-3 text-2xl font-extrabold">
              {formatPrice(total)}
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-[1.75rem] bg-[#f1ede8] p-6">
          <h2 className="text-2xl font-extrabold">Informations client</h2>

          <div className="mt-5 grid gap-4 text-sm md:grid-cols-2">
            <div>
              <p className="text-zinc-500">Nom</p>
              <p className="mt-1 font-semibold text-black">
                {customerName || "—"}
              </p>
            </div>

            <div>
              <p className="text-zinc-500">Téléphone</p>
              <p className="mt-1 font-semibold text-black">
                {customerPhone || "—"}
              </p>
            </div>

            <div>
              <p className="text-zinc-500">Paiement</p>
              <p className="mt-1 font-semibold text-black">
                À la boutique / confirmation WhatsApp
              </p>
            </div>

            <div>
              <p className="text-zinc-500">Statut</p>
              <p className="mt-1 font-semibold text-orange-600">
                En attente de confirmation WhatsApp
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-green-600 px-6 text-sm font-semibold text-white transition hover:bg-green-700"
          >
            <MessageCircle className="h-5 w-5" />
            Ouvrir WhatsApp
          </a>

          <Link
            href="/"
            className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-6 text-sm font-semibold text-black transition hover:bg-black hover:text-white"
          >
            <Home className="h-5 w-5" />
            Retour à l’accueil
          </Link>
        </div>

        <div className="mt-6 rounded-[1.5rem] border border-orange-200 bg-orange-50 p-4 text-sm leading-7 text-zinc-700">
          <span className="font-semibold text-black">Important :</span> votre
          commande est déjà enregistrée. Le bouton WhatsApp permet maintenant de
          prévenir la boutique et de poursuivre la confirmation.
        </div>
      </div>
    </main>
  );
}