import AdminDashboard from "../pages/admin/AdminHome";
import ActivityCategoryDetails from "@/pages/admin/ActivityCategory";
// import TagManager from "../pages/admin/PreferenceTags";
// import AdminProducts from "../pages/admin/AdminProducts";
// import AdminViewProduct from "../pages/admin/AdminViewProduct";
import AdminViewUsers from "../pages/admin/AdminViewUsers";
import CreateNewGovernor from "@/pages/governor/CreateNewGovernor";
import CreateNewAdmin from "@/pages/admin/CreateNewAdmin";
import ComplaintsPage from "@/pages/admin/Complaints";
import ComplaintsReplies from "@/pages/admin/ComplaintsReplies";
import TagManager from "@/pages/admin/PreferenceTags";
import Revenue from "@/pages/admin/Revenue";
import AdminChangePassword from "../pages/admin/AdminProfile";
import Requests from "../pages/admin/Requests";
// import ItineraryPage from "../pages/commonPagesForMultipleUsers/UpcomingItineraries";
import Activities from "../pages/commonPagesForMultipleUsers/Activities";

const adminRoutes = [
  { path: "/admin", element: <AdminDashboard /> },
  { path: "/activity-categories", element: <ActivityCategoryDetails /> },
  { path: "/preference-tags", element: <TagManager /> },
  // { path: "/preference-tags", element: <TagManager /> },
  // { path: "/admin/view-products", element: <AdminProducts /> },
  // { path: "/admin/view-products/product/:id", element: <AdminViewProduct /> },
  { path: "/admin/delete-user", element: <AdminViewUsers /> },
  { path: "/admin/new-governor", element: <CreateNewGovernor /> },
  { path: "/admin/new-admin", element: <CreateNewAdmin /> },
  { path: "/admin/complaints", element: <ComplaintsPage /> },
  { path: "/admin/complaints/replies", element: <ComplaintsReplies /> },
  { path: "/revenue", element: <Revenue /> },

  { path: "/admin/changepassword", element: <AdminChangePassword /> },
  { path: "/admin/requests", element: <Requests /> },
  // { path: "/admin/itineraries", element: <ItineraryPage isAdmin={"isAdmin"} />},
  {path: "/admin/activities", element: <Activities />},
];

export default adminRoutes;
