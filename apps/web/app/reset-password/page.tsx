"use client";

import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const dynamic = "force-dynamic";

export default function ResetPasswordPage() {
  const [initialToken, setInitialToken] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get("token") || "";
    setInitialToken(tokenFromUrl);
    setToken(tokenFromUrl);
  }, []);

  const passwordsMatch = useMemo(() => {
    return confirmPassword.length > 0 && password === confirmPassword;
  }, [password, confirmPassword]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!token.trim()) {
      setError("Le lien de réinitialisation est invalide.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Erreur lors de la réinitialisation");
      }

      setMessage(data.message || "Mot de passe réinitialisé avec succès.");
      setPassword("");
      setConfirmPassword("");
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
          <h1 className="text-3xl font-extrabold">
            Réinitialiser le mot de passe
          </h1>
          <p className="mt-3 text-sm text-zinc-600">
            Choisissez un nouveau mot de passe pour sécuriser votre compte.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="hidden"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />

          {!initialToken ? (
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Code de réinitialisation
              </label>
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="h-12 w-full rounded-2xl border border-black/10 px-4 outline-none transition focus:border-orange-400"
              />
            </div>
          ) : null}

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Nouveau mot de passe
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 w-full rounded-2xl border border-black/10 px-4 pr-12 outline-none transition focus:border-orange-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Confirmer le nouveau mot de passe
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`h-12 w-full rounded-2xl border px-4 pr-12 outline-none transition ${
                  confirmPassword.length === 0
                    ? "border-black/10 focus:border-orange-400"
                    : passwordsMatch
                      ? "border-green-300 focus:border-green-400"
                      : "border-red-300 focus:border-red-400"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {confirmPassword.length > 0 ? (
              <p
                className={`mt-2 text-xs ${
                  passwordsMatch ? "text-green-600" : "text-red-600"
                }`}
              >
                {passwordsMatch
                  ? "Les mots de passe correspondent."
                  : "Les mots de passe ne correspondent pas."}
              </p>
            ) : null}
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
              ? "Réinitialisation..."
              : "Mettre à jour le mot de passe"}
          </button>
        </form>

        {message ? (
          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-sm font-semibold text-orange-500 hover:underline"
            >
              Aller à la connexion
            </Link>
          </div>
        ) : null}

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