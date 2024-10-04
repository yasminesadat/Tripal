import ProductForm from "../pages/product/ProductForm";
import ProductList from "../pages/product/ProductList";
import ProductDetails from "../pages/product/ProductDetails";

const productRoutes = [
  { path: "/view-products", element: <ProductList /> },
  { path: "/product/:productName", element: <ProductDetails /> },
  { path: "/create-product", element: <ProductForm /> },
];

export default productRoutes;
