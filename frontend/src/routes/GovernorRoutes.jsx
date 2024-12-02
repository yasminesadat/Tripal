import GovernorHome from "../pages/governor/GovernorHome";
 import AddHistoricalPlace from "../pages/governor/CreateHistoricalPLaces";
 import HistoricalPlacesList from "../pages/commonPagesForMultipleUsers/HistoricalPlaces"
 import HistoricalPlacesDetails from "../pages/commonPagesForMultipleUsers/HistoricalPlacesDetails"
// import CreateHistoricalTag from "../pages/governor/CreateHistoricalTag";
// import MyHistoricalPlaces from "../pages/governor/MyHistoricalPlaces";
// import GovernorChangePassword from "../pages/governor/GovernorProfile";

const governorRoutes = [
  { path: "/governor", element: <GovernorHome /> },
  { path: "/add-historical-place", element: <AddHistoricalPlace /> },
 { path: "/my-historical-places", element: <HistoricalPlacesList /> },
 { path: "/update-historical-place/:id", element: <AddHistoricalPlace /> },
 { path: "/historical-places/:id", element: <HistoricalPlacesDetails /> },
  // { path: "/create-historical-tag", element: <CreateHistoricalTag /> },
  // { path: "/governor/changepassword", element: <GovernorChangePassword /> },
];

export default governorRoutes;
