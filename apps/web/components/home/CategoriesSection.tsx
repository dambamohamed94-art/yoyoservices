import Link from "next/link";

type Category = {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string;
  backgroundColor?: string;
};

type CategoriesSectionProps = {
  categories: Category[];
};

type CategoryUi = {
  title: string;
  subtitle: string;
  image: string;
  accent: string;
};

const CATEGORY_UI: Record<string, CategoryUi> = {
  "Produits secs": {
    title: "Produits secs",
    subtitle: "Riz • Pâtes • ...",
    image: "/categories/produit-sec.png",
    accent: "#4D9563",
  },
  Boissons: {
    title: "Boissons",
    subtitle: "Jus • Sodas • ...",
    image: "/categories/boisson.png",
    accent: "#F2D56B",
  },
  "Produits Laitiers": {
    title: "Produits laitiers",
    subtitle: "Lait • Beurre • ...",
    image: "/categories/produit-laitier.png",
    accent: "#E8F0FF",
  },
  "Légumes & Fruits": {
    title: "Fruits et légumes",
    subtitle: "Tomate • Banane • ...",
    image: "/categories/fruits-et-legumes.png",
    accent: "#F28B50",
  },
  "Viande & Poisson": {
    title: "Viandes et poissons",
    subtitle: "Bœuf • Poisson • ...",
    image: "/categories/viande-et-poisson.png",
    accent: "#D96D6D",
  },
  "Produits frais": {
    title: "Hygiène et beauté",
    subtitle: "Savon • Shampoing • ...",
    image: "/categories/hygiene-et-beaute.png",
    accent: "#F58A63",
  },
  Boulangerie: {
    title: "Entretien et nettoyage",
    subtitle: "Lessive • Spray • ...",
    image: "/categories/entretien-et-nettoyage.png",
    accent: "#7CB6D9",
  },
  "Produits surgelés": {
    title: "Epicerie sucrée & salée",
    subtitle: "Chips • Biscuits • ...",
    image: "/categories/epicerie-sucree-et-salee.png",
    accent: "#8CC7D8",
  },
  "Epicerie salée": {
    title: "Epicerie salée",
    subtitle: "Riz • Huile • ...",
    image: "/categories/epicerie-salee.png",
    accent: "#D4A373",
  },
};

function getCategoryUi(category: Category): CategoryUi {
  return (
    CATEGORY_UI[category.name] || {
      title: category.name,
      subtitle: "Découvrir",
      image: "",
      accent: category.backgroundColor || "#E5E7EB",
    }
  );
}

export default function CategoriesSection({
  categories,
}: CategoriesSectionProps) {
  return (
    <section
      id="categories"
      className="relative overflow-hidden py-14 md:py-16"
      style={{
        backgroundImage:
          "linear-gradient(rgba(248,245,240,0.84), rgba(248,245,240,0.92)), url('/bg-categories.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-10 grid gap-4 md:grid-cols-[1fr_1.2fr] md:items-end">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-orange-500">
              Univers boutique
            </p>
            <h2 className="text-4xl font-extrabold leading-none md:text-6xl">
              <span className="block text-[#1f1f1f]">Nos catégories</span>
              <span className="block text-[#4D9563]">du moment</span>
            </h2>
          </div>

          <p className="max-w-2xl text-sm leading-7 text-zinc-700 md:justify-self-end md:text-right md:text-base">
            Une présentation plus élégante, plus premium et plus immersive pour
            mettre en valeur chaque univers produit.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          {categories.map((category) => {
            const ui = getCategoryUi(category);

            return (
              <Link
                id={`cat-${category.slug}`}
                href={`/categories/${category.slug}`}
                key={category.id}
                className="group block scroll-mt-28"
              >



                <article className="overflow-hidden rounded-[1.9rem] border border-white/70 bg-white/50 shadow-[0_18px_50px_rgba(0,0,0,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(0,0,0,0.14)]">
                    <div
                      className="relative h-52 overflow-hidden md:h-64"
                      style={{
                        background: `linear-gradient(180deg, ${ui.accent}22 0%, rgba(255,255,255,0.92) 100%)`,
                      }}
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.85),transparent_55%)]" />

                      {ui.image ? (
                        <div className="absolute inset-0 flex items-center justify-center p-6 md:p-8">
                          <img
                            src={ui.image}
                            alt={ui.title}
                            className="max-h-full max-w-full object-contain drop-shadow-[0_18px_30px_rgba(0,0,0,0.18)] transition duration-500 group-hover:scale-[1.03]"
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <div className="absolute inset-0" />
                      )}

                      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/48 via-black/8 to-transparent" />

                      <div className="absolute bottom-14 left-4 right-4 md:bottom-16 md:left-5 md:right-5">
                        <h3 className="text-2xl font-extrabold tracking-tight text-[#1f1f1f] drop-shadow-[0_2px_6px_rgba(255,255,255,0.6)] md:text-3xl">
                          {ui.title}
                        </h3>
                      </div>

                      <div className="absolute bottom-3 left-4 md:left-5">
                        <div className="rotate-[-2deg] rounded-xl bg-white/95 px-4 py-2 shadow-[0_10px_24px_rgba(0,0,0,0.12)] backdrop-blur">
                          <p className="text-sm font-bold text-zinc-800 md:text-[15px]">
                            {ui.subtitle}
                          </p>
                        </div>
                      </div>
                    </div>
                  </article>




              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}