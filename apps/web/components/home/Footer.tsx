import Image from "next/image";
import Link from "next/link";

import { Globe } from "lucide-react";

type Category = {
  id: string;
  name: string;
  slug: string;
};

type FooterProps = {
  categories: Category[];
};

export default function Footer({ categories }: FooterProps) {
  return (
    <footer className="mt-10 bg-black text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-4 md:px-6">
        <div>
          <Link href="/" className="inline-block hover:opacity-80 transition">
              <div className="relative h-20 w-40">
                <Image
                  src="/logo.png"
                  alt="YOYO SERVICES"
                  fill
                  className="object-contain"
                />
              </div>
          </Link>
          <p className="mt-3 text-sm leading-7 text-white/70">
            Boutique alimentaire moderne pour commander, préparer et payer plus
            facilement à Bamako.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-orange-500">
            Catégories
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            {categories.map((category) => (
              <li key={category.id}>
                <a
                  href={`/categories/${category.slug}`}
                  className="transition hover:text-orange-400"
                >
                  {category.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-orange-500">
            Paiement
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            <li>Orange Money</li>
            <li>Paiement en boutique</li>
            <li>Préparation du panier</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-orange-500">
            Contact
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            <li>Bamako, Mali</li>
            <li>+223 77 45 32 17</li>
            <li>Nous suivre</li>
          </ul>

          <div className="mt-4 flex items-center gap-3">
            <a
              href="#"
              className="rounded-full border border-white/15 p-2 transition hover:bg-white hover:text-black"
            >
              <Globe size={16} />
            </a>
            <a
              href="#"
              className="rounded-full border border-white/15 px-3 py-2 text-xs transition hover:bg-white hover:text-black"
            >
              TikTok
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-white/60 md:px-6">
        © 2026 YOYO ALIMENTATION — Tous droits réservés.
      </div>
    </footer>
  );
}