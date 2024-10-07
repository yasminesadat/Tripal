import AdminDashboard from "../pages/admin/AdminHome";
import ActivityCategoryDetails from "../pages/admin/ActivityCategoryDetails";
import TagManager from "../pages/admin/PreferenceTags";
import AdminProducts from "../pages/admin/AdminProducts";
import AdminViewProduct from "../pages/admin/AdminViewProduct";

const adminRoutes = [
  { path: "/admin", element: <AdminDashboard /> },
  { path: "/activity-categories", element: <ActivityCategoryDetails /> },
  { path: "/preference-tags", element: <TagManager /> },
  { path: "/admin/view-products", element: <AdminProducts /> },
  { path: "/admin/view-products/product/:id", element: <AdminViewProduct /> },
];

export default adminRoutes;
