import HomePage5 from "@/pages/homes/home-5";
import ActivityDetailsPage from "../pages/tourist/ActivityDetails";
//import ItineraryDetailsPage from "../pages/tourist/ItineraryDetails";
import LoginPage from "@/pages/pages/login";

const guestRoutes = [
  { path: "/", element: <HomePage5 /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/activities/:activityId", element: <ActivityDetailsPage /> },
  // { path: "/itineraries/:itineraryId", element: <ItineraryDetailsPage /> },
];

export default guestRoutes;
