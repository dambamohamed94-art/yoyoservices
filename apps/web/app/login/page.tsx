"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    try {
      setIsSubmitting(true);

      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Erreur lors de la connexion");
      }

      localStorage.setItem("customer_access_token", data.accessToken);
      localStorage.setItem("customer_profile", JSON.stringify(data.customer));

      router.push("/");
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f8f5f0] px-4 py-10 text-[#111111]">
      <div className="mx-auto max-w-md rounded-[2rem] bg-white p-6 shadow-sm md:p-8">
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
            Mon compte
          </p>
          <h1 className="text-3xl font-extrabold">Connexion</h1>
          <p className="mt-3 text-sm text-zinc-600">
            Connectez-vous à votre espace YOYO SERVICES.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-semibold">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="votre@email.com"
              className="h-12 w-full rounded-2xl border border-black/10 px-4 outline-none transition focus:border-orange-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Mot de passe
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, password: e.target.value }))
              }
              placeholder="********"
              className="h-12 w-full rounded-2xl border border-black/10 px-4 outline-none transition focus:border-orange-400"
            />
          </div>

          {error ? (
            <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`mt-2 h-12 w-full rounded-full text-sm font-semibold text-white transition ${
              isSubmitting
                ? "cursor-not-allowed bg-zinc-300"
                : "bg-black hover:bg-orange-500"
            }`}
          >
            {isSubmitting ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-zinc-500 hover:text-black"
          >
            Mot de passe oublié ?
          </Link>
        </div>

        <div className="mt-6 text-center text-sm text-zinc-600">
          Pas encore de compte ?{" "}
          <Link
            href="/register"
            className="font-semibold text-orange-500 hover:underline"
          >
            Créer un compte
          </Link>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm font-medium text-zinc-500 hover:text-black"
          >
            ← Retour à l’accueil
          </Link>
        </div>
      </div>
    </main>
  );
}