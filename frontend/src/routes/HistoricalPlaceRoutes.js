import HistoricalPlaceForm from "../pages/historicalPlace/HistoricalPlaceForm";
import HistoricalPlacesList from "../pages/historicalPlace/HistoricalPlacesList";
import HistoricalPlaceDetails from "../pages/historicalPlace/HistoricalPlaceDetails";
const historicalPlaceRoutes = [
  { path: "/historicalPlace", element: <HistoricalPlaceForm state={false} /> },
  {
    path: "/historicalPlace/:id",
    element: <HistoricalPlaceForm state={true} />,
  },
  {
    path: "/historicalPlace/tourismGoverner",
    element: <HistoricalPlacesList />,
  },
  { path: "/historical-places/:id", element: <HistoricalPlaceDetails /> },
];

export default historicalPlaceRoutes;
