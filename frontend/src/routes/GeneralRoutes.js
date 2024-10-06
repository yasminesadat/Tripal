import Home from "../pages/Home";
import TagManager from "../components/admin/PreferenceTagComponent";

const generalRoutes = [
  { path: "/", element: <Home /> },
  { path: "/preference-tags", element: <TagManager /> },
];

export default generalRoutes;
