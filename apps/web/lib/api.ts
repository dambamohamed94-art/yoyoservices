const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function getCategories() {
  const response = await fetch(`${API_URL}/categories`);

  if (!response.ok) {
    throw new Error("Erreur lors du chargement des catégories");
  }

  return response.json();
}

export async function getProducts(category?: string) {
  const url = category
    ? `${API_URL}/products?category=${category}`
    : `${API_URL}/products`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Erreur lors du chargement des produits");
  }

  return response.json();
}

export async function getCategoryBySlug(slug: string) {
  const categories = await getCategories();
  return categories.find((category: { slug: string }) => category.slug === slug);
}