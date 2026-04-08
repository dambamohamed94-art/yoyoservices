"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();

  const reference = searchParams.get("reference") || "N/A";
  const firstName = searchParams.get("firstName") || "";
  const lastName = searchParams.get("lastName") || "";
  const phone = searchParams.get("phone") || "";
  const district = searchParams.get("district") || "";
  const total = searchParams.get("total") || "0";

  const whatsappNumber =
    process.env.NEXT_PUBLIC_STORE_WHATSAPP || "22377453217";
  const storeName = process.env.NEXT_PUBLIC_STORE_NAME || "YOYO SERVICES";

  const message = `Bonjour ${storeName},
Ma commande ${reference} a bien été validée.

Nom : ${firstName} ${lastName}
Téléphone : ${phone}
Quartier : ${district}
Total : ${total} FCFA

Merci.`;

  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <main className="min-h-screen bg-[#f8f5f0] px-4 py-10 text-[#111111]">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-[2rem] bg-white p-6 shadow-sm md:p-10">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-3xl">
            ✓
          </div>

          <div className="text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
              Paiement validé
            </p>
            <h1 className="text-3xl font-extrabold md:text-4xl">
              Commande confirmée
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-zinc-600 md:text-base">
              Votre commande a bien été enregistrée. Vous pouvez maintenant
              conserver votre référence ou informer la boutique via WhatsApp.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl bg-[#f8f5f0] p-5">
              <p className="text-xs uppercase tracking-wider text-zinc-500">
                Référence
              </p>
              <p className="mt-2 text-lg font-extrabold text-black">
                {reference}
              </p>
            </div>

            <div className="rounded-3xl bg-black p-5 text-white">
              <p className="text-xs uppercase tracking-wider text-white/60">
                Total
              </p>
              <p className="mt-2 text-lg font-extrabold">{total} FCFA</p>
            </div>
          </div>

          <div className="mt-6 rounded-3xl bg-[#f8f5f0] p-5">
            <h2 className="text-lg font-extrabold">Informations client</h2>

            <div className="mt-4 grid gap-3 text-sm text-zinc-700 md:grid-cols-2">
              <p>
                <span className="font-semibold">Nom :</span> {firstName}{" "}
                {lastName}
              </p>
              <p>
                <span className="font-semibold">Téléphone :</span> {phone}
              </p>
              <p>
                <span className="font-semibold">Quartier :</span> {district}
              </p>
              <p>
                <span className="font-semibold">Paiement :</span> Orange Money
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-2">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="flex h-12 items-center justify-center rounded-full bg-green-600 text-sm font-semibold text-white transition hover:bg-green-700"
            >
              Informer la boutique via WhatsApp
            </a>

            <Link
              href="/"
              className="flex h-12 items-center justify-center rounded-full border border-black/10 bg-white text-sm font-semibold transition hover:bg-black hover:text-white"
            >
              Retour à l’accueil
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}