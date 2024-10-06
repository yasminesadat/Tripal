import AdminDashboard from "../components/AdminDashboard";
import ActivityCategoryDetails from "../components/ActivityCategoryDetails";
import AdminViewUsers from "../components/AdminViewUsers";
import CreateNewGovernor from "../components/CreateNewGovernor";
import AdminCreateNew from "../components/AdminCreateNew";


const adminRoutes = [
  { path: "/admin", element: <AdminDashboard /> },
  { path: "/adminActivityCategories", element: <ActivityCategoryDetails /> },
  { path: "/adminDeleteUser", element: <AdminViewUsers /> },
  { path: "/new-admin", element: <AdminCreateNew /> },
  { path: "/new-governor", element: <CreateNewGovernor /> }
];

export default adminRoutes;
