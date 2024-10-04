import AdminDashboard from "../components/AdminDashboard";
import ActivityCategoryDetails from "../components/ActivityCategoryDetails";

const adminRoutes = [
  { path: "/admin", element: <AdminDashboard /> },
  { path: "/adminActivityCategories", element: <ActivityCategoryDetails /> },
];

export default adminRoutes;
