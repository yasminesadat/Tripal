import { Routes, Route } from "react-router-dom";
import templateRoutes from "./TemplateRoutes";
import guestRoutes from "./GuestRoutes";
import touristRoutes from "./TouristRoutes";
import RoleProtectedRoute from "./RoleProtectedRouteComponent";
import advertiserRoutes from "./AdvertiserRoutes";

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
  </Routes>
);

export default RoutesComponent;
