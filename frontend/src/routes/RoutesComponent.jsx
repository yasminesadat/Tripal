import { Routes, Route } from "react-router-dom";
import templateRoutes from "./TemplateRoutes";
import guestRoutes from "./GuestRoutes";
import touristRoutes from "./TouristRoutes";
import RoleProtectedRoute from "./RoleProtectedRouteComponent";
import HomePage10 from "@/pages/homes/home-10";

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
  </Routes>
);

export default RoutesComponent;
