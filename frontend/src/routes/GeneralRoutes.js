import Home from "../pages/Home";
import TagManager from "../components/PreferenceTagComponent";
import UpcomingActivities from "../pages/UpcomingActivities";
import TouristHomePage from "../pages/TouristHomePage";
import HistoricalPlaces from "../pages/HistoricalPlaces";

const generalRoutes = [
  { path: "/", element: <Home /> },
  { path: "/preference-tags", element: <TagManager /> },
  { path: "/upcoming-activities", element: <UpcomingActivities /> },
  { path: "/tourist-home", element: <TouristHomePage /> },
  { path: "/historical-places", element: <HistoricalPlaces /> },
];

export default generalRoutes;
