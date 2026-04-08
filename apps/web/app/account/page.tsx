"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

type CustomerProfile = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  isActive?: boolean;
  emailVerified?: boolean;
  createdAt?: string;
};

export default function AccountPage() {
  const router = useRouter();
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const token = localStorage.getItem("customer_access_token");

        if (!token) {
          router.push("/login");
          return;
        }

        const response = await fetch(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          localStorage.removeItem("customer_access_token");
          localStorage.removeItem("customer_profile");
          router.push("/login");
          return;
        }

        const data = await response.json();
        setCustomer(data);
        localStorage.setItem("customer_profile", JSON.stringify(data));
      } catch (err: any) {
        setError("Impossible de charger votre profil.");
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("customer_access_token");
    localStorage.removeItem("customer_profile");
    router.push("/");
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#f8f5f0] px-4 py-10 text-[#111111]">
        <div className="mx-auto max-w-3xl rounded-[2rem] bg-white p-8 shadow-sm">
          Chargement du compte...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#f8f5f0] px-4 py-10 text-[#111111]">
        <div className="mx-auto max-w-3xl rounded-[2rem] bg-white p-8 shadow-sm">
          <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        </div>
      </main>
    );
  }

  if (!customer) return null;

  return (
    <main className="min-h-screen bg-[#f8f5f0] px-4 py-10 text-[#111111]">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
              Mon compte
            </p>
            <h1 className="text-3xl font-extrabold">
              Bonjour {customer.firstName}
            </h1>
            <p className="mt-2 text-sm text-zinc-600">
              Gérez vos informations personnelles.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-black shadow-sm transition hover:bg-black hover:text-white"
          >
            Déconnexion
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <section className="rounded-[2rem] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-extrabold">Informations personnelles</h2>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-[#f8f5f0] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                  Prénom
                </p>
                <p className="mt-1 font-semibold">{customer.firstName}</p>
              </div>

              <div className="rounded-2xl bg-[#f8f5f0] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                  Nom
                </p>
                <p className="mt-1 font-semibold">{customer.lastName}</p>
              </div>

              <div className="rounded-2xl bg-[#f8f5f0] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                  Téléphone
                </p>
                <p className="mt-1 font-semibold">{customer.phone}</p>
              </div>

              <div className="rounded-2xl bg-[#f8f5f0] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                  Email
                </p>
                <p className="mt-1 font-semibold">{customer.email}</p>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-extrabold">Compte</h2>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-[#f8f5f0] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                  Statut
                </p>
                <p className="mt-1 font-semibold">
                  {customer.isActive ? "Compte actif" : "Compte inactif"}
                </p>
              </div>

              <div className="rounded-2xl bg-[#f8f5f0] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                  Vérification email
                </p>
                <p className="mt-1 font-semibold">
                  {customer.emailVerified ? "Vérifié" : "Non vérifié"}
                </p>
              </div>

              <div className="rounded-2xl bg-[#f8f5f0] p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                  Membre depuis
                </p>
                <p className="mt-1 font-semibold">
                  {customer.createdAt
                    ? new Date(customer.createdAt).toLocaleDateString("fr-FR")
                    : "—"}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/forgot-password"
                className="inline-flex rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-500"
              >
                Modifier mon mot de passe
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}