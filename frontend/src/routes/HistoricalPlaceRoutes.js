import HistoricalPlaceForm from "../pages/historicalPlace/HistoricalPlaceForm";
import HistoricalPlacesList from '../pages/historicalPlace/HistoricalPlacesList';

const historicalPlaceRoutes = [

  { path: "/historicalPlace", element: <HistoricalPlaceForm state={false} /> },
  { path: "/historicalPlace/:id", element: <HistoricalPlaceForm state={true} /> },
  { path: "/historicalPlace/tourismGoverner", element: <HistoricalPlacesList /> }

];

export default historicalPlaceRoutes;
