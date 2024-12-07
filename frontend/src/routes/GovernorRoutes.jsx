import GovernorHome from "../pages/governor/GovernorHome";
 import AddHistoricalPlace from "../pages/governor/CreateHistoricalPLaces";
 import HistoricalPlacesList from "../pages/historicalPlace/HistoricalPlacesList";
 import HistoricalPlacesDetails from "../pages/commonPagesForMultipleUsers/HistoricalPlacesDetails";
import GovernorChangePassword from "@/pages/governor/ChangePassword";

const governorRoutes = [
  { path: "/governor", element: <GovernorHome /> },
  { path: "/add-historical-place", element: <AddHistoricalPlace /> },
  { path: "/my-historical-places", element: <HistoricalPlacesList /> },
  { path: "/update-historical-place/:id", element: <AddHistoricalPlace /> },
  { path: "/governor/changepassword", element: <GovernorChangePassword /> }



  
];

export default governorRoutes;
