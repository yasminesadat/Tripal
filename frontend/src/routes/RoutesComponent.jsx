import { Routes, Route } from "react-router-dom";
import templateRoutes from "./TemplateRoutes";
const allRoutes = [
  ...templateRoutes,
  // ...adminRoutes,
  // ...touristRoutes,
  // ...advertiserRoutes,
  // ...sellerRoutes,
  // ...tourguideRoutes,
  // ...historicalPlaceRoutes,
  // ...governorRoutes,
  // ...guestRoutes,
  // ...hotelRoutes
];

const RoutesComponent = () => (
  <Routes>
    {allRoutes.map((route, index) => (
      <Route key={index} path={route.path} element={route.element} />
    ))}
  </Routes>
);

export default RoutesComponent;
