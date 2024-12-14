import HistoricalPlacesList from "../pages/historicalPlace/HistoricalPlacesList";
import HistoricalPlaceDetails from "../pages/historicalPlace/HistoricalPlaceDetails";
import HistoricalPlaces from "../pages/commonPagesForMultipleUsers/HistoricalPlaces"
const historicalPlaceRoutes = [
  { path: "/historicalPlaces", element: <HistoricalPlaces  /> },
  {path: "/historicalPlace/tourismGoverner",element: <HistoricalPlacesList />,},
  { path: "/historical-places/:id", element: <HistoricalPlaceDetails /> },
];

export default historicalPlaceRoutes;