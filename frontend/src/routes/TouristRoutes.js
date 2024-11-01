import TouristHome from "../pages/tourist/TouristHome";
import TouristProfile from "../pages/tourist/TouristProfile";
import UpcomingActivities from "../pages/tourist/UpcomingActivities";
import HistoricalPlaces from "../pages/tourist/HistoricalPlaces";
import Itineraries from "../pages/tourist/Itineraries";
import TouristProducts from "../pages/tourist/TouristProducts";
import TouristViewProduct from "../pages/tourist/TouristViewProduct";
import PreferenceSelection from "../components/tourist/PreferenceSelection";
import CategorySelection from "../components/tourist/CategorySelection";

const TouristRoutes = [
  { path: "/tourist", element: <TouristHome /> },
  { path: "/upcoming-activities", element: <UpcomingActivities /> },
  { path: "/tourist-profile/:id", element: <TouristProfile /> },
  { path: "/historical-places", element: <HistoricalPlaces /> },
  { path: "/itineraries", element: <Itineraries /> },
  { path: "/tourist/view-products", element: <TouristProducts /> },
  { path: "/tourist/select-preferences", element: <PreferenceSelection /> },
  { path: "/tourist/select-categories", element: <CategorySelection /> },
  {
    path: "/tourist/view-products/product/:id",
    element: <TouristViewProduct />,
  },
];

export default TouristRoutes;
