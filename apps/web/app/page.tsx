"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "../components/home/Header";
import SearchBar from "../components/home/SearchBar";
import CategoriesSection from "../components/home/CategoriesSection";
import ProductsSection from "../components/home/ProductsSection";
import AboutSection from "../components/home/AboutSection";
import ValuesSection from "../components/home/ValuesSection";
import Footer from "../components/home/Footer";
import { getCategories, getProducts } from "../lib/api";

type Category = {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string;
  backgroundColor?: string;
  displayOrder: number;
  isActive: boolean;
};

type Product = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  quantity: number;
  stockStatus: "IN_STOCK" | "OUT_OF_STOCK";
  imageUrl?: string;
  isActive: boolean;
  isFeatured: boolean;
  categoryId: string;
};

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    async function loadData() {
      const [categoriesData, productsData] = await Promise.all([
        getCategories(),
        getProducts(),
      ]);

      setCategories(categoriesData);
      setProducts(productsData);
    }

    loadData();
  }, []);

  const categoriesMap = useMemo(() => {
    return categories.reduce<Record<string, Category>>((acc, category) => {
      acc[category.id] = category;
      return acc;
    }, {});
  }, [categories]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory = selectedCategory
        ? categoriesMap[product.categoryId]?.slug === selectedCategory
        : true;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, selectedCategory, categoriesMap]);

  const filteredCategories = useMemo(() => {
    if (!selectedCategory) return categories;
    return categories.filter((category) => category.slug === selectedCategory);
  }, [categories, selectedCategory]);

  return (
    <main className="min-h-screen bg-[#f8f5f0] text-[#111111]">
      <Header categories={categories} />

      <SearchBar
        categories={categories}
        search={search}
        selectedCategory={selectedCategory}
        onSearchChange={setSearch}
        onCategoryChange={setSelectedCategory}
      />

    <CategoriesSection categories={filteredCategories} />

      <ProductsSection
        products={filteredProducts}
        categoriesMap={categoriesMap}
      />

      <AboutSection />

      <ValuesSection />

      <Footer categories={categories} />
    </main>
  );
}