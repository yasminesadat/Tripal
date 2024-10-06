import { Routes, Route } from "react-router-dom";
import adminRoutes from "./AdminRoutes";
import touristRoutes from "./TouristRoutes"
import productRoutes from "./ProductRoutes";
import generalRoutes from "./GeneralRoutes";
import advertiserRoutes from "./AdvertiserRoutes";
import sellerRoutes from "./SellerRoutes"
import tourguideRoutes from "./TourguideRoutes"

const allRoutes = [...adminRoutes, ...touristRoutes, ...productRoutes, ...generalRoutes, ...advertiserRoutes, ...sellerRoutes, ...tourguideRoutes];

const RoutesComponent = () => (
  <Routes>
    {allRoutes.map((route, index) => (
      <Route key={index} path={route.path} element={route.element} />
    ))}
  </Routes>
);

export default RoutesComponent;
