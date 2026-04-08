"use client";

import Link from "next/link";
import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      setIsSubmitting(true);

      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Erreur lors de la demande de réinitialisation"
        );
      }

      setMessage(
        data.message ||
          "Si un compte existe avec cet email, un lien de réinitialisation a été envoyé."
      );
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
            Sécurité
          </p>
          <h1 className="text-3xl font-extrabold">Mot de passe oublié</h1>
          <p className="mt-3 text-sm text-zinc-600">
            Entrez votre email pour recevoir un lien de réinitialisation.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-semibold">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              className="h-12 w-full rounded-2xl border border-black/10 px-4 outline-none transition focus:border-orange-400"
            />
          </div>

          {error ? (
            <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          ) : null}

          {message ? (
            <div className="rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-700">
              {message}
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
            {isSubmitting
              ? "Envoi en cours..."
              : "Réinitialiser le mot de passe"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="text-sm font-medium text-zinc-500 hover:text-black"
          >
            ← Retour à la connexion
          </Link>
        </div>
      </div>
    </main>
  );
}