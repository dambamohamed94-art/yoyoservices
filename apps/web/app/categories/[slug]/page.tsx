import Link from "next/link";
import { getCategoryBySlug, getProducts } from "../../../lib/api";

export const dynamic = "force-dynamic";

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

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let category: Category | undefined;
  let products: Product[] = [];

  try {
    category = await getCategoryBySlug(slug);
    products = await getProducts(slug);
  } catch (error) {
    console.error("Erreur lors du chargement de la catégorie :", error);
  }

  if (!category) {
    return (
      <main className="min-h-screen bg-[#f8f5f0] px-4 py-16 text-center">
        <h1 className="text-3xl font-extrabold">Catégorie introuvable</h1>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-full bg-black px-6 py-3 text-sm font-semibold text-white"
        >
          Retour à l’accueil
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f5f0] text-[#111111]">
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <Link
          href="/"
          className="mb-6 inline-flex rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold shadow-sm transition hover:bg-black hover:text-white"
        >
          ← Retour à l’accueil
        </Link>

        <div className="rounded-[2rem] bg-white p-6 shadow-sm">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
            Catégorie
          </p>
          <h1 className="text-4xl font-extrabold md:text-5xl">
            {category.name}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-600 md:text-base">
            Découvrez les produits disponibles dans la catégorie {category.name}.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 md:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-extrabold md:text-3xl">
            Produits de la catégorie
          </h2>
          <p className="text-sm text-zinc-500">{products.length} produit(s)</p>
        </div>

        {products.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
            <p className="text-zinc-600">
              Aucun produit disponible dans cette catégorie pour le moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {products.map((product) => (
              <article
                key={product.id}
                className="rounded-3xl bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex h-28 items-center justify-center overflow-hidden rounded-2xl bg-zinc-100">
                  {product.imageUrl ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}${product.imageUrl}`}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="px-3 text-center text-sm font-semibold text-zinc-700">
                      {product.name}
                    </span>
                  )}
                </div>

                <div className="mt-4">
                  <h3 className="line-clamp-2 text-sm font-bold md:text-base">
                    {product.name}
                  </h3>

                  <p className="mt-2 text-lg font-extrabold text-orange-500">
                    {product.price} FCFA
                  </p>

                  <div className="mt-3 flex justify-end">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                        product.stockStatus === "OUT_OF_STOCK"
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {product.stockStatus === "OUT_OF_STOCK"
                        ? "Rupture"
                        : "Disponible"}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}