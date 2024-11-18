import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getUserData } from "../api/UserService";
import PropTypes from "prop-types";
import { message } from "antd";
import NotFoundPage from "@/pages/pages/404";

const RoleProtectedRoute = ({ element, requiredRoles }) => {
  const [loading, setLoading] = useState(true);
  const [redirectTo, setRedirectTo] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await getUserData();
      if (response.data.status === "success") {
        if (requiredRoles.includes(response.data.role)) {
          setRedirectTo(element);
        }
      } else if (response.message === "Token expired.") {
        message.error("Token expired. Please login again.");
        setRedirectTo(<Navigate to="/login" />);
      }
    };
    fetchUserData();
    setLoading(false);
  }, [requiredRoles, element]);

  if (loading) {
    // Render a loading indicator while data is being fetched
    return <div>Loading...</div>;
  }
  console.log("redirectt", redirectTo);
  if (!redirectTo) setRedirectTo(<NotFoundPage />);
  return redirectTo;
};

RoleProtectedRoute.propTypes = {
  element: PropTypes.element.isRequired,
  requiredRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default RoleProtectedRoute;
