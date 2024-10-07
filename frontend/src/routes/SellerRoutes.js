import SellerHome from "../pages/seller/SellerHome";
import SellerProducts from "../pages/seller/SellerProducts";
import SellerProductCreation from "../pages/seller/SellerProductCreation";
import SellerProductEdit from "../pages/seller/SellerProducEdit";
import SellerViewProduct from "../pages/seller/SellerViewProduct";
import SellerProfile from "../pages/seller/SellerProfile";
const sellerRoutes = [
  { path: "/seller", element: <SellerHome /> },
  { path: "/seller/view-products", element: <SellerProducts /> },
  { path: "/seller/edit-product/:id", element: <SellerProductEdit /> },
  { path: "/seller/create-product", element: <SellerProductCreation /> },
  { path: "/seller/view-products/product/:id", element: <SellerViewProduct /> },
  { path: "/seller/profile", element: <SellerProfile /> },
];

export default sellerRoutes;
