"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Category = {
  id: string;
  name: string;
  slug: string;
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
  category: Category;
  createdAt: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function getStockBadgeClass(status: string) {
  return status === "OUT_OF_STOCK"
    ? "bg-red-100 text-red-700"
    : "bg-green-100 text-green-700";
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  
async function loadProducts() {
  try {
    setLoading(true);

    const response = await fetch(`${API_URL}/products/admin`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}`);
    }

    const data = await response.json();
    setProducts(data);
  } catch (error) {
    console.error("Erreur chargement produits:", error);
    setProducts([]);
  } finally {
    setLoading(false);
  }
}


  async function deleteProduct(id: string) {
    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer ce produit ?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
      });

      await loadProducts();
    } catch (error) {
      console.error("Erreur suppression produit:", error);
    } finally {
      setDeletingId(null);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <main className="min-h-screen bg-[#f8f5f0] px-4 py-10 text-[#111111]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
            <div>
                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
                Admin
                </p>
                <h1 className="text-3xl font-extrabold md:text-4xl">
                Gestion des produits
                </h1>
                <p className="mt-3 text-sm text-zinc-600">
                Consultez les produits, les catégories, le stock et supprimez un
                article si nécessaire.
                </p>
            </div>

        <Link
            href="/admin/products/new"
            className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-500"
        >
            + Ajouter un produit
        </Link>
</div>

        {loading ? (
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            Chargement des produits...
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            Aucun produit trouvé.
          </div>
        ) : (
          <div className="overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-black text-white">
                  <tr>
                    <th className="px-5 py-4">Produit</th>
                    <th className="px-5 py-4">Catégorie</th>
                    <th className="px-5 py-4">Prix</th>
                    <th className="px-5 py-4">Stock</th>
                    <th className="px-5 py-4">Statut</th>
                    <th className="px-5 py-4">Mis en avant</th>
                    <th className="px-5 py-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr
                      key={product.id}
                      className={index % 2 === 0 ? "bg-white" : "bg-[#f8f5f0]"}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-14 w-14 overflow-hidden rounded-2xl bg-zinc-100">
                            {product.imageUrl ? (
                              <img
                                src={`${API_URL}${product.imageUrl}`}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            ) : null}
                          </div>

                          <div>
                            <p className="font-bold">{product.name}</p>
                            <p className="mt-1 text-xs text-zinc-500">
                              {product.slug}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">{product.category?.name}</td>

                      <td className="px-5 py-4 font-semibold text-orange-500">
                        {product.price} FCFA
                      </td>

                      <td className="px-5 py-4">{product.quantity}</td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${getStockBadgeClass(
                            product.stockStatus
                          )}`}
                        >
                          {product.stockStatus === "OUT_OF_STOCK"
                            ? "Rupture"
                            : "Disponible"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        {product.isFeatured ? "Oui" : "Non"}
                      </td>

                      <td className="px-5 py-4">
                        <button
                          disabled={deletingId === product.id}
                          onClick={() => deleteProduct(product.id)}
                          className="rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}