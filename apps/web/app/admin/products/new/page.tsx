"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Category = {
  id: string;
  name: string;
  slug: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function AdminNewProductPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    quantity: "",
    categoryId: "",
    imageUrl: "",
    isFeatured: false,
  });

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await fetch(`${API_URL}/categories`, {
          cache: "no-store",
        });
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Erreur chargement catégories:", error);
      } finally {
        setLoadingCategories(false);
      }
    }

    loadCategories();
  }, []);

  const isFormValid = useMemo(() => {
    return (
      form.name.trim() &&
      form.slug.trim() &&
      form.price.trim() &&
      form.quantity.trim() &&
      form.categoryId.trim()
    );
  }, [form]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!isFormValid) return;

    try {
      setIsSubmitting(true);

      let finalImageUrl = form.imageUrl || "";

      if (imageFile) {
        setUploadingImage(true);

        const formData = new FormData();
        formData.append("file", imageFile);

        const uploadResponse = await fetch(`${API_URL}/products/upload`, {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error("Erreur lors de l’upload de l’image");
        }

        const uploadData = await uploadResponse.json();
        finalImageUrl = uploadData.imageUrl;

        setUploadingImage(false);
      }

      const response = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          slug: form.slug,
          description: form.description || "",
          price: Number(form.price),
          quantity: Number(form.quantity),
          categoryId: form.categoryId,
          imageUrl: finalImageUrl,
          isFeatured: form.isFeatured,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erreur API:", errorData);
        throw new Error("Erreur lors de la création du produit");
      }

      router.push("/admin/products");
    } catch (error) {
      console.error("Erreur création produit:", error);
      alert("Impossible de créer le produit.");
    } finally {
      setUploadingImage(false);
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f8f5f0] px-4 py-10 text-[#111111]">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
              Admin
            </p>
            <h1 className="text-3xl font-extrabold md:text-4xl">
              Ajouter un produit
            </h1>
            <p className="mt-3 text-sm text-zinc-600">
              Créez un nouveau produit pour YOYO SERVICES.
            </p>
          </div>

          <Link
            href="/admin/products"
            className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold shadow-sm transition hover:bg-black hover:text-white"
          >
            ← Retour produits
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-[2rem] bg-white p-6 shadow-sm md:p-8"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Nom du produit
              </label>
              <input
                value={form.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setForm((prev) => ({
                    ...prev,
                    name,
                    slug: prev.slug ? prev.slug : slugify(name),
                  }));
                }}
                placeholder="Ex: Jus d’orange"
                className="h-12 w-full rounded-2xl border border-black/10 px-4 outline-none focus:border-orange-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Slug</label>
              <input
                value={form.slug}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, slug: slugify(e.target.value) }))
                }
                placeholder="Ex: jus-orange"
                className="h-12 w-full rounded-2xl border border-black/10 px-4 outline-none focus:border-orange-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Prix</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, price: e.target.value }))
                }
                placeholder="Ex: 1500"
                className="h-12 w-full rounded-2xl border border-black/10 px-4 outline-none focus:border-orange-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Quantité en stock
              </label>
              <input
                type="number"
                value={form.quantity}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, quantity: e.target.value }))
                }
                placeholder="Ex: 20"
                className="h-12 w-full rounded-2xl border border-black/10 px-4 outline-none focus:border-orange-400"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold">
                Catégorie
              </label>
              <select
                value={form.categoryId}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, categoryId: e.target.value }))
                }
                disabled={loadingCategories}
                className="h-12 w-full rounded-2xl border border-black/10 px-4 outline-none focus:border-orange-400"
              >
                <option value="">Choisir une catégorie</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder="Description du produit..."
                rows={4}
                className="w-full rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-orange-400"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold">
                Image du produit
              </label>

                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setImageFile(file);

                      if (file) {
                        const objectUrl = URL.createObjectURL(file);
                        setPreviewUrl(objectUrl);
                      } else {
                        setPreviewUrl("");
                      }
                    }}
                    className="block w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm"
                  />

              {previewUrl ? (
                <div className="mt-4">
                  <p className="mb-2 text-xs font-semibold text-zinc-500">
                    Aperçu image
                  </p>
                  <img
                    src={previewUrl}
                    alt="Aperçu"
                    className="h-28 w-28 rounded-2xl border border-black/10 object-cover"
                  />
                </div>
              ) : null}
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-3 rounded-2xl bg-[#f8f5f0] px-4 py-4 text-sm font-semibold">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      isFeatured: e.target.checked,
                    }))
                  }
                />
                Mettre ce produit en avant
              </label>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className={`rounded-full px-6 py-3 text-sm font-semibold text-white transition ${
                !isFormValid || isSubmitting
                  ? "cursor-not-allowed bg-zinc-300"
                  : "bg-black hover:bg-orange-500"
              }`}
            >
              {uploadingImage
                ? "Upload image..."
                : isSubmitting
                ? "Création..."
                : "Créer le produit"}
            </button>

            <Link
              href="/admin/products"
              className="rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-semibold transition hover:bg-black hover:text-white"
            >
              Annuler
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}