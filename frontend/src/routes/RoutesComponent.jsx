import { Routes, Route } from "react-router-dom";
import RoleProtectedRoute from "./RoleProtectedRouteComponent";

import templateRoutes from "./TemplateRoutes";
import guestRoutes from "./GuestRoutes";
import touristRoutes from "./TouristRoutes";
import advertiserRoutes from "./AdvertiserRoutes";
import adminRoutes from "./AdminRoutes";
import sellerRoutes from "./SellerRoutes";
import tourguideRoutes from "./TourguideRoutes";
import governorRoutes from "./GovernorRoutes";
const RoutesComponent = () => (
  <Routes>
    {[...guestRoutes, ...templateRoutes].map((route, index) => (
      <Route key={index} path={route.path} element={route.element} />
    ))}
    {touristRoutes.map((route, index) => (
      <Route
        key={`tourist-${index}`}
        path={route.path}
        element={
          <RoleProtectedRoute
            element={route.element}
            requiredRoles={["Tourist"]}
          />
        }
      />
    ))}
    {advertiserRoutes.map((route, index) => (
      <Route
        key={`advertiser-${index}`}
        path={route.path}
        element={
          <RoleProtectedRoute
            element={route.element}
            requiredRoles={["Advertiser"]}
          />
        }
      />
    ))}
    {adminRoutes.map((route, index) => (
      <Route
        key={`admin-${index}`}
        path={route.path}
        element={
          <RoleProtectedRoute
            element={route.element}
            requiredRoles={["Admin"]}
          />
        }
      />
    ))}
    {sellerRoutes.map((route, index) => (
      <Route
        key={`seller-${index}`}
        path={route.path}
        element={
          <RoleProtectedRoute
            element={route.element}
            requiredRoles={["Seller"]}
          />
        }
      />
    ))}
    {tourguideRoutes.map((route, index) => (
      <Route
        key={`tourguide-${index}`}
        path={route.path}
        element={
          <RoleProtectedRoute
            element={route.element}
            requiredRoles={["Tour Guide"]}
          />
        }
      />
    ))}
    {governorRoutes.map((route, index) => (
      <Route
        key={`governor-${index}`}
        path={route.path}
        element={
          <RoleProtectedRoute
            element={route.element}
            requiredRoles={["Tourism Governor"]}
          />
        }
      />
    ))}
  </Routes>
);

export default RoutesComponent;
