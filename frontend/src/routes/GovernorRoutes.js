import GovernorHome from "../pages/governor/GovernorHome";
import AddHistoricalPlace from "../pages/governor/AddHistoricalPlace";
import CreateHistoricalTag from "../pages/governor/CreateHistoricalTag";
import MyHistoricalPlaces from "../pages/governor/MyHistoricalPlaces";

const governorRoutes = [
  { path: "/governor", element: <GovernorHome /> },
  { path: "/add-historical-place", element: <AddHistoricalPlace /> },
  { path: "/my-historical-places", element: <MyHistoricalPlaces /> },
  { path: "/create-historical-tag", element: <CreateHistoricalTag /> },
];

export default governorRoutes;
