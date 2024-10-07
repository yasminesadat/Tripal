import AdminDashboard from "../pages/admin/AdminHome";
import ActivityCategoryDetails from "../pages/admin/ActivityCategoryDetails";
import TagManager from "../pages/admin/PreferenceTags";
import AdminProducts from "../pages/admin/AdminProducts";
import AdminViewProduct from "../pages/admin/AdminViewProduct";
import AdminViewUsers from "../components/AdminViewUsers";
import CreateNewGovernor from "../components/CreateNewGovernor";
import AdminCreateNew from "../components/CreateNewAdmin";

const adminRoutes = [
  { path: "/admin", element: <AdminDashboard /> },
  { path: "/adminActivityCategories", element: <ActivityCategoryDetails /> },
];

export default adminRoutes;
