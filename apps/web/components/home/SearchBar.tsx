"use client";

import { Search } from "lucide-react";

type Category = {
  id: string;
  name: string;
  slug: string;
};

type SearchBarProps = {
  categories: Category[];
  search: string;
  selectedCategory: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
};

export default function SearchBar({
  categories,
  search,
  selectedCategory,
  onSearchChange,
  onCategoryChange,
}: SearchBarProps) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-5 md:px-6">
      <div className="flex flex-col gap-3 rounded-[2rem] border border-black/5 bg-white/80 p-3 shadow-[0_10px_30px_rgba(0,0,0,0.06)] backdrop-blur md:flex-row md:items-center md:gap-2">

        {/* INPUT SEARCH */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />

          <input
            type="text"
            placeholder="Rechercher un produit, une marque..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-12 w-full rounded-full border border-transparent bg-[#f8f5f0] pl-10 pr-4 text-sm outline-none transition focus:border-[#4D9563] focus:bg-white"
          />
        </div>

        {/* CATEGORY SELECT */}
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="h-12 rounded-full border border-transparent bg-[#f8f5f0] px-4 text-sm outline-none transition focus:border-[#F97316] focus:bg-white"
        >
          <option value="">Toutes catégories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>

        {/* FILTER */}
        <select className="h-12 rounded-full border border-transparent bg-[#f8f5f0] px-4 text-sm outline-none transition focus:border-black focus:bg-white">
          <option value="">Tous</option>
          <option value="disponible">Disponibles</option>
          <option value="rupture">En rupture</option>
        </select>

        {/* BUTTON */}
        <button className="h-12 rounded-full bg-gradient-to-r from-[#4D9563] to-[#F97316] px-6 text-sm font-semibold text-white shadow-md transition hover:scale-[1.02]">
          Rechercher
        </button>
      </div>
    </section>
  );
}