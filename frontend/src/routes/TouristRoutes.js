import TouristHome from "../pages/tourist/TouristHome";
import TouristProfile from "../pages/tourist/TouristProfile";
import UpcomingActivities from "../pages/tourist/UpcomingActivities";
import ActivitiesHistoryPage from "../pages/tourist/ActivitiesHistory";
import HistoricalPlaces from "../pages/tourist/HistoricalPlaces";
import UpcomingItineraries from "../pages/commonPagesForMultipleUsers/UpcomingItineraries";
import TouristProducts from "../pages/tourist/TouristProducts";
import TouristViewProduct from "../pages/tourist/TouristViewProduct";
import PreferenceSelection from "../components/tourist/PreferenceSelection";
import CategorySelection from "../components/tourist/CategorySelection";
import ActivityDetailsPage from "../pages/tourist/ActivityDetails";
import ItineraryDetailsPage from "../pages/tourist/ItineraryDetails";
import ComplaintsForm from "../pages/tourist/ComplaintsForm";
import MyComplaints from "../pages/tourist/MyComplaints";
import BookedActivitiesPage from "../pages/tourist/BookedActivities";
import ItinerariesHistoryPage from "../pages/tourist/ItinerariesHistory";

const TouristRoutes = [
  { path: "/tourist", element: <TouristHome /> },
  { path: "/upcoming-activities", element: <UpcomingActivities /> },
  { path: "/activities-history", element: <ActivitiesHistoryPage /> },
  { path: "/tourist-profile/:id", element: <TouristProfile /> },
  { path: "/historical-places", element: <HistoricalPlaces /> },
  { path: "/upcoming-itineraries", element: <UpcomingItineraries  isTourist={"isTourist"} touristBook={"book"}  /> },
  { path: "/itineraries-history", element: <ItinerariesHistoryPage /> },
  { path: "/tourist/view-products", element: <TouristProducts /> },
  { path: "/tourist/select-preferences/:touristId", element: <PreferenceSelection /> },
  { path: "/tourist/select-categories/:touristId", element: <CategorySelection /> },
  { path: "/activity/:activityId", element: <ActivityDetailsPage /> },
  { path: "/itinerary/:itineraryId", element: <ItineraryDetailsPage /> },
  { path: "/tourist/view-products/product/:id", element: <TouristViewProduct /> },
  { path: "/tourist/create-complaint/:id", element: <ComplaintsForm /> },
  { path: "/tourist/view-Complaints/:id", element: <MyComplaints /> },
  { path: "/itineraries/booked-itineraries", element:<UpcomingItineraries  isTourist={"isTourist"} touristCancel={"cancel"}  /> },
  {path: "/booked-activities", element: <BookedActivitiesPage />}

];

export default TouristRoutes;