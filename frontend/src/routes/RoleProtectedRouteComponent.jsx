import { useEffect, useState, useRef } from "react";
import { Navigate } from "react-router-dom";
import { getUserData } from "../api/UserService";
import PropTypes from "prop-types";
import { message } from "antd";
import NotFoundPage from "@/pages/pages/404";
import Spinner from "@/components/common/Spinner";

const RoleProtectedRoute = ({ element, requiredRoles }) => {
  const [loading, setLoading] = useState(true);
  const [redirectTo, setRedirectTo] = useState(null);
  const errorDisplayed = useRef(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserData();
        if (response.data.status === "success") {

          if (requiredRoles.includes(response.data.role)) {
            console.log("HEYYY", response);
            setRedirectTo(element);
          } else {
            setRedirectTo(<NotFoundPage />);
          }
        } else if (response.data.message === "Token expired.") {
          if (!errorDisplayed.current) {
            message.error("Token expired. Please log in again.");
            errorDisplayed.current = true;
          }
          setRedirectTo(<Navigate to="/login" />);
        } else {
          setRedirectTo(<NotFoundPage />);
        }
      } catch (error) {
        if (!errorDisplayed.current) {
          message.error("An error occurred. Please log in again.");
          errorDisplayed.current = true;
        }
        setRedirectTo(<Navigate to="/login" />);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [requiredRoles, element]);

  if (loading) {
    // Render a loading indicator while data is being fetched
    return <Spinner />;
  }

  return redirectTo;
};

RoleProtectedRoute.propTypes = {
  element: PropTypes.element.isRequired,
  requiredRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default RoleProtectedRoute;
