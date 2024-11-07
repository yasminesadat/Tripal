import { Routes, Route } from "react-router-dom";
import adminRoutes from "./AdminRoutes";
import touristRoutes from "./TouristRoutes";
import generalRoutes from "./GeneralRoutes";
import advertiserRoutes from "./AdvertiserRoutes";
import sellerRoutes from "./SellerRoutes";
import tourguideRoutes from "./TourguideRoutes";
import historicalPlaceRoutes from "./HistoricalPlaceRoutes";
import governorRoutes from "./GovernorRoutes";
import guestRoutes from "./GuestRoutes";
const allRoutes = [
  ...adminRoutes,
  ...touristRoutes,
  ...generalRoutes,
  ...advertiserRoutes,
  ...sellerRoutes,
  ...tourguideRoutes,
  ...historicalPlaceRoutes,
  ...governorRoutes,
  ...guestRoutes
]

const RoutesComponent = () => (
  <Routes>
    {allRoutes.map((route, index) => (
      <Route key={index} path={route.path} element={route.element} />
    ))}
  </Routes>
);

export default RoutesComponent;
