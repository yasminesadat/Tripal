import ProductForm from "../pages/product/ProductForm";
import ProductList from "../pages/product/ProductList";
import ProductDetails from "../pages/product/ProductDetails";
import ProductEdit from "../pages/product/ProductEdit";

const productRoutes = [
  { path: "/view-products", element: <ProductList /> },
  { path: "/product/:id", element: <ProductDetails /> },
  { path: "/create-product", element: <ProductForm /> },
  { path: "/edit-product/:id", element: <ProductEdit /> },
];

export default productRoutes;
