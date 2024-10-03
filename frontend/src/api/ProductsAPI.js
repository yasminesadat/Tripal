import axios from "axios";
export const fetchProducts = async () => {
  // try {
  //   const response = await fetch("/api/products");
  //   const json = await response.json();
  //   if (response.ok) {
  //     return json;
  //   } else {
  //     console.log("error")
  //     throw new Error("Failed to fetch products");

  //   }
  // } catch (error) {
  //   console.error("Error fetching products:", error);
  //   return null;
  // }
  try {
    const products = await axios.get('http://localhost:5050/api/products');
    console.log(products);

    return products.data;
  } catch (error) {
    console.error("Can't search for products", error);
    throw error
  }
};

export const searchProductsByName = async (name) => {
  try {
    const products = await axios.get(`http://localhost:5050/api/products/search?name=${encodeURIComponent(name)}`);
    console.log(products);

    return products.data;
  } catch (error) {
    console.error("Can't search for products", error);
    throw error
  }

};
