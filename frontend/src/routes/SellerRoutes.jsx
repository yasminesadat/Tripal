import SellerHome from "../pages/seller/SellerHome";
import SellerProducts from "../pages/seller/SellerProducts";
import SellerProductCreation from "../pages/seller/SellerProductCreation";
import SellerProductEdit from "../pages/seller/SellerProductEdit";
import SellerViewProduct from "../pages/seller/SellerViewProduct";
// import SellerProfile from "../pages/seller/SellerProfile";
// import CreateSeller from "../pages/seller/sellerCreateProfile";
// import PendingPage from "../pages/seller/PendingPage"

const sellerRoutes = [
  { path: "/seller", element: <SellerHome /> },
  { path: "/seller/view-products", element: <SellerProducts /> },
  { path: "/seller/edit-product/:id", element: <SellerProductEdit /> },
  { path: "/seller/create-product", element: <SellerProductCreation /> },
  { path: "/seller/view-products/product/:id", element: <SellerViewProduct /> },
  // { path: "/seller/profile", element: <SellerProfile /> },
  // { path: "/create-seller", element: <CreateSeller /> },
  // { path: "/seller/pending", element: <PendingPage /> },
];

export default sellerRoutes;
