export const fetchProducts = async () => {
  try {
    const response = await fetch("/api/products");
    const json = await response.json();
    if (response.ok) {
      return json;
    } else {
      throw new Error("Failed to fetch products");
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    return null;
  }
};

export const searchProductsByName = async (name) => {
  try {
    const response = await fetch(
      `/api/products/search?name=${encodeURIComponent(name)}`
    );
    const json = await response.json();
    if (response.ok) {
      return json;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error searching products:", error);
    return [];
  }
};
