//routes
import ProductForm from "../pages/product/ProductForm";
import ProductList from "../pages/product/ProductList";
import ProductDetails from "../pages/product/ProductDetails";

const productRoutes = [
  { path: "/view-products", element: <ProductList /> },
  { path: "/product/:id", element: <ProductDetails /> },
  { path: "/create-product", element: <ProductForm /> },
  { path: "/edit-product/:id", element: <ProductForm /> },
];

export default productRoutes;
