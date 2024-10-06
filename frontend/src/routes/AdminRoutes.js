import AdminDashboard from "../pages/admin/AdminHome";
import ActivityCategoryDetails from "../pages/admin/ActivityCategoryDetails";
import TagManager from "../pages/admin/PreferenceTags";


const adminRoutes = [
  { path: "/admin", element: <AdminDashboard /> },
  { path: "/activity-categories", element: <ActivityCategoryDetails /> },
  { path: "/preference-tags", element: <TagManager /> },
];

export default adminRoutes;
