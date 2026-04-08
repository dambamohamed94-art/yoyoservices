"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "../../store/cart-store";

export default function CheckoutPage() {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const totalPrice = useCartStore((state) => state.totalPrice());
  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    district: "",
    orangeCode: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isFormValid = useMemo(() => {
    return (
      form.firstName.trim() &&
      form.lastName.trim() &&
      form.phone.trim() &&
      form.district.trim() &&
      form.orangeCode.trim() &&
      items.length > 0
    );
  }, [form, items]);

  async function handleSubmit() {
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer: {
              firstName: form.firstName,
              lastName: form.lastName,
              phone: form.phone,
              district: form.district,
            },
            items,
            paymentMethod: "ORANGE_MONEY",
            validationCode: form.orangeCode,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la création de la commande");
      }

      const data = await response.json();

      clearCart();

      const params = new URLSearchParams({
        reference: data.reference ?? "",
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        district: form.district,
        total: String(data.totalAmount ?? 0),
      });

      router.push(`/checkout/success?${params.toString()}`);
    } catch (error) {
      console.error("Erreur commande:", error);
      alert("Une erreur est survenue lors de la création de la commande.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isMounted) {
    return (
      <main className="min-h-screen bg-[#f8f5f0] px-4 py-10 text-[#111111]">
        <div className="mx-auto max-w-5xl rounded-[2rem] bg-white p-8 shadow-sm">
          Chargement du panier...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f5f0] px-4 py-10 text-[#111111]">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="mb-6 inline-flex rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold shadow-sm transition hover:bg-black hover:text-white"
        >
          ← Retour à l’accueil
        </Link>

        <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[2rem] bg-white p-6 shadow-sm md:p-8">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
              Paiement
            </p>

            <h1 className="text-3xl font-extrabold">
              Orange Money sans compte
            </h1>

            <p className="mt-3 text-sm leading-7 text-zinc-600">
              Finalisez votre panier avec Orange Money en renseignant vos
              informations et votre code de validation.
            </p>

            <div className="mt-8 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Prénom
                  </label>
                  <input
                    value={form.firstName}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                    }
                    className="h-12 w-full rounded-2xl border border-black/10 px-4 outline-none focus:border-orange-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Nom
                  </label>
                  <input
                    value={form.lastName}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        lastName: e.target.value,
                      }))
                    }
                    className="h-12 w-full rounded-2xl border border-black/10 px-4 outline-none focus:border-orange-400"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Téléphone
                </label>
                <input
                  value={form.phone}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                  placeholder="+223..."
                  className="h-12 w-full rounded-2xl border border-black/10 px-4 outline-none focus:border-orange-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Quartier
                </label>
                <input
                  value={form.district}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      district: e.target.value,
                    }))
                  }
                  className="h-12 w-full rounded-2xl border border-black/10 px-4 outline-none focus:border-orange-400"
                />
              </div>

              <div className="rounded-3xl bg-[#f8f5f0] p-4">
                <p className="text-sm font-semibold text-zinc-700">
                  Paiement Orange Money
                </p>
                <p className="mt-2 text-sm leading-7 text-zinc-600">
                  Le client paie avec le code marchand de la boutique, puis
                  saisit ici son code de validation Orange Money.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Code de validation Orange Money
                </label>
                <input
                  value={form.orangeCode}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      orangeCode: e.target.value,
                    }))
                  }
                  placeholder="Ex: OM-123456"
                  className="h-12 w-full rounded-2xl border border-black/10 px-4 outline-none focus:border-orange-400"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={!isFormValid || isSubmitting}
                className={`mt-2 h-12 w-full rounded-full text-sm font-semibold text-white transition ${
                  !isFormValid || isSubmitting
                    ? "cursor-not-allowed bg-zinc-300"
                    : "bg-orange-500 hover:bg-orange-600"
                }`}
              >
                {isSubmitting ? "Validation en cours..." : "Valider le paiement"}
              </button>
            </div>
          </section>

          <aside className="rounded-[2rem] bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-xl font-extrabold">Résumé de commande</h2>

            <div className="mt-6 space-y-3">
              {items.length === 0 ? (
                <div className="rounded-3xl bg-[#f8f5f0] p-5 text-sm text-zinc-600">
                  Aucun article dans le panier.
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-3xl bg-[#f8f5f0] p-4"
                  >
                    <p className="font-bold">{item.name}</p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {item.quantity} × {item.price} FCFA
                    </p>
                    <p className="mt-2 text-sm font-extrabold text-orange-500">
                      {item.quantity * item.price} FCFA
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className="mt-6 rounded-3xl bg-black p-5 text-white">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/70">Total</span>
                <span className="text-xl font-extrabold">
                  {totalPrice} FCFA
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}