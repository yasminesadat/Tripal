import AdminDashboard from "../pages/admin/AdminHome";
import ActivityCategoryDetails from "../pages/admin/ActivityCategoryDetails";
import TagManager from "../pages/admin/PreferenceTags";
import AdminProducts from "../pages/admin/AdminProducts";
import AdminViewProduct from "../pages/admin/AdminViewProduct";
import AdminViewUsers from "../components/AdminViewUsers";
import CreateNewGovernor from "../components/CreateNewGovernor";
import AdminCreateNew from "../components/AdminCreateNew";

const adminRoutes = [
  { path: "/admin", element: <AdminDashboard /> },
  { path: "/activity-categories", element: <ActivityCategoryDetails /> },
  { path: "/preference-tags", element: <TagManager /> },
  { path: "/admin/view-products", element: <AdminProducts /> },
  { path: "/admin/view-products/product/:id", element: <AdminViewProduct /> },
  { path: "/adminDeleteUser", element: <AdminViewUsers /> },
  { path: "/new-admin", element: <AdminCreateNew /> },
  { path: "/new-governor", element: <CreateNewGovernor /> }
];

export default adminRoutes;
