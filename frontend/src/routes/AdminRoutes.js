import AdminDashboard from "../components/admin/AdminDashboard";
import ActivityCategoryDetails from "../components/admin/ActivityCategoryDetails";

const adminRoutes = [
  { path: "/admin", element: <AdminDashboard /> },
  { path: "/adminActivityCategories", element: <ActivityCategoryDetails /> },
];

export default adminRoutes;
