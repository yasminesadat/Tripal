import SellerHome from "../pages/seller/SellerHome"
import SellerProfile from "../components/seller/SellerProfile";
const sellerRoutes = [
  { path: "/seller", element: <SellerHome /> },
  { path: "/seller/profile", element: <SellerProfile /> },
];

export default sellerRoutes;
