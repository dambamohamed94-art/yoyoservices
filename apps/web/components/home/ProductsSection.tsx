import AddToCartButton from "../cart/AddToCartButton";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

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

type Category = {
  id: string;
  name: string;
  slug: string;
};

type ProductsSectionProps = {
  products: Product[];
  categoriesMap: Record<string, Category>;
};

export default function ProductsSection({
  products,
  categoriesMap,
}: ProductsSectionProps) {
  return (
    <section id="produits" className="mx-auto max-w-7xl px-4 py-14 md:px-6">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
            Sélection maison
          </p>
          <h2 className="text-3xl font-extrabold md:text-4xl">
            Nos produits
          </h2>
        </div>

        <p className="text-sm text-zinc-500">{products.length} produit(s)</p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
        {products.map((product) => (
          <article
            key={product.id}
            className="group overflow-hidden rounded-[1.5rem] border border-black/5 bg-white p-3 shadow-[0_10px_28px_rgba(0,0,0,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(0,0,0,0.10)]"
          >
            <div className="relative overflow-hidden rounded-[1.25rem] bg-gradient-to-b from-[#f8fafb] to-[#eef2f4]">
              <div className="absolute left-3 top-3 z-10">
                <span
                  className={`rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] md:text-[10px] ${
                    product.stockStatus === "OUT_OF_STOCK"
                      ? "bg-red-100 text-red-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {product.stockStatus === "OUT_OF_STOCK"
                    ? "Rupture"
                    : "Disponible"}
                </span>
              </div>

           <div className="relative overflow-hidden rounded-[1.25rem] bg-white ring-1 ring-black/5">
                <div className="absolute left-3 top-3 z-10">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] md:text-[10px] ${
                      product.stockStatus === "OUT_OF_STOCK"
                        ? "bg-red-100 text-red-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {product.stockStatus === "OUT_OF_STOCK"
                      ? "Rupture"
                      : "Disponible"}
                  </span>
                </div>

                <div className="flex h-40 items-center justify-center bg-[#f7f7f5] p-3 md:h-44">
                  {product.imageUrl ? (
                    <img
                      src={`${API_URL}${product.imageUrl}`}
                      alt={product.name}
                      className="h-full w-full object-contain transition duration-500 group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-center text-xs font-semibold text-zinc-500">
                      {product.name}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-3">
              <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-500 md:text-[11px]">
                {categoriesMap[product.categoryId]?.name ?? "Catégorie"}
              </p>

              <h3 className="mt-1 line-clamp-2 min-h-[42px] text-sm font-bold leading-5 text-zinc-900 md:min-h-[46px] md:text-[15px]">
                {product.name}
              </h3>

              <div className="mt-3 flex items-end justify-between gap-2">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-zinc-400">
                    Prix
                  </p>
                  <p className="text-base font-extrabold text-orange-500 md:text-lg">
                    {product.price} FCFA
                  </p>
                </div>
              

                
              </div>

              <AddToCartButton
                id={product.id}
                name={product.name}
                price={product.price}
                disabled={product.stockStatus === "OUT_OF_STOCK"}
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}