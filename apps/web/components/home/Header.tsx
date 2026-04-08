"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Globe, Menu, X } from "lucide-react";
import CartBadge from "../cart/CartBadge";
import MiniCart from "../cart/MiniCart";

type Category = {
  id: string;
  name: string;
  slug: string;
};

type HeaderProps = {
  categories: Category[];
};

type CustomerProfile = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
};

export default function Header({ categories }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  function handleLogout() {
    localStorage.removeItem("customer_access_token");
    localStorage.removeItem("customer_profile");
    setCustomer(null);
    window.location.href = "/";
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsCategoriesOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setIsMounted(true);

    const storedProfile = localStorage.getItem("customer_profile");

    if (storedProfile) {
      try {
        setCustomer(JSON.parse(storedProfile));
      } catch {
        setCustomer(null);
      }
    }
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto mt-3 max-w-6xl px-4 md:px-6">
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-[2rem] border border-black/5 bg-white/90 px-4 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMenuOpen((prev) => !prev)}
                className="rounded-full border border-black/10 p-2 lg:hidden"
              >
                {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>

              <Link
                href="/"
                className="flex items-center gap-3 transition hover:opacity-90"
              >
                <div className="relative h-20 w-20 rounded-2xl bg-white p-1 shadow-sm md:h-24 md:w-24">
                  <Image
                    src="/logo.png"
                    alt="YOYO SERVICES"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 96px, 112px"
                    priority
                  />
                </div>

                <div className="hidden sm:block leading-tight">
                  <p className="text-xl font-extrabold tracking-tight md:text-2xl">
                    <span className="text-[#4D9563]">YOYO</span>{" "}
                    <span className="text-[#F97316]">SERVICES</span>
                  </p>
                  <p className="text-xs text-zinc-500">Bamako - Mali</p>
                </div>
              </Link>
            </div>

            <nav className="hidden items-center justify-center gap-8 text-sm font-semibold text-zinc-700 lg:flex">
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsCategoriesOpen((prev) => !prev)}
                  className="flex items-center gap-1 rounded-full px-3 py-2 transition hover:bg-[#f8f5f0] hover:text-[#4D9563]"
                >
                  Catégories <ChevronDown size={16} />
                </button>

                {isCategoriesOpen && (
                  <div className="absolute left-1/2 top-12 w-72 -translate-x-1/2 rounded-2xl border border-black/5 bg-white p-3 shadow-[0_18px_50px_rgba(0,0,0,0.12)]">
                    <div className="mb-2 px-3 pt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
                      Explorer
                    </div>

                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/categories/${category.slug}`}
                        onClick={() => setIsCategoriesOpen(false)}
                        className="block rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-[#f8f5f0] hover:text-[#F97316]"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <a
                href="#produits"
                className="rounded-full px-3 py-2 transition hover:bg-[#f8f5f0] hover:text-[#F97316]"
              >
                Produits
              </a>

              <a
                href="#qui-sommes-nous"
                className="rounded-full px-3 py-2 transition hover:bg-[#f8f5f0] hover:text-[#4D9563]"
              >
                Qui sommes-nous
              </a>
            </nav>

            <div className="hidden items-center justify-end gap-2.5 lg:flex">
              <a
                href="#"
                className="rounded-full border border-black/10 p-2 transition hover:bg-black hover:text-white"
              >
                <Globe size={16} />
              </a>

              <a
                href="#"
                className="rounded-full border border-black/10 px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-black hover:text-white"
              >
                TikTok
              </a>

              {isMounted && customer ? (
                <div className="flex items-center gap-2">
                  <Link
                    href="/account"
                    className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 shadow-sm transition hover:bg-black hover:text-white"
                  >
                    Bonjour {customer.firstName}
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 shadow-sm transition hover:bg-black hover:text-white"
                  >
                    Déconnexion
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 shadow-sm transition hover:bg-black hover:text-white"
                >
                  Mon compte
                </Link>
              )}

              <div className="rounded-full bg-gradient-to-r from-[#4D9563] to-[#F97316] p-[1px] shadow-md">
                <div className="rounded-full bg-white">
                  <CartBadge onClick={() => setIsCartOpen(true)} />
                </div>
              </div>
            </div>
          </div>

          {isMenuOpen && (
            <div className="mt-3 rounded-[1.75rem] border border-black/5 bg-white px-4 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.06)] lg:hidden">
              <div className="flex flex-col gap-3 text-sm font-semibold text-zinc-700">
                <details className="rounded-xl border border-black/5 p-3">
                  <summary className="cursor-pointer">Catégories</summary>
                  <div className="mt-3 flex flex-col gap-2">
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/categories/${category.slug}`}
                        onClick={() => setIsMenuOpen(false)}
                        className="text-sm"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </details>

                <a href="#produits" onClick={() => setIsMenuOpen(false)}>
                  Produits
                </a>

                <a href="#qui-sommes-nous" onClick={() => setIsMenuOpen(false)}>
                  Qui sommes-nous
                </a>

                {isMounted && customer ? (
                  <>
                    <Link
                      href="/account"
                      onClick={() => setIsMenuOpen(false)}
                      className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-zinc-700"
                    >
                      Bonjour {customer.firstName}
                    </Link>

                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleLogout();
                      }}
                      className="text-left"
                    >
                      Déconnexion
                    </button>
                  </>
                ) : (
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    Mon compte
                  </Link>
                )}

                <div className="pt-2">
                  <CartBadge onClick={() => setIsCartOpen(true)} />
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <MiniCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}