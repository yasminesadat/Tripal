// import TouristHome from "../pages/tourist/TouristHome";
import TouristProfile from "../pages/tourist/TouristProfile";
// import Activities from "../pages/commonPagesForMultipleUsers/Activities";
// import TouristProfile from "../pages/tourist/TouristProfile";
import Activities from "../pages/commonPagesForMultipleUsers/Activities";
// import ActivitiesHistoryPage from "../pages/tourist/ActivitiesHistory";
// import HistoricalPlaces from "../pages/tourist/HistoricalPlaces";
// import UpcomingItineraries from "../pages/commonPagesForMultipleUsers/UpcomingItineraries";
// import TouristProducts from "../pages/tourist/TouristProducts";
// import TouristViewProduct from "../pages/tourist/TouristViewProduct";
// import PreferenceSelection from "../components/tourist/PreferenceSelection";
// import CategorySelection from "../components/tourist/CategorySelection";
import ActivityDetailsPage from "../pages/tourist/ActivityDetails";
// import ItineraryDetailsPage from "../pages/tourist/ItineraryDetails";
import ComplaintsForm from "../pages/tourist/ComplaintsForm";
import MyComplaints from "../pages/tourist/MyComplaints";
import ComplaintsReplies from "@/pages/tourist/ComplaintsReplies";
import FlightSearch from "../pages/tourist/SearchBar";
import Cart from "@/pages/tourist/Cart";
import WishList from "@/pages/tourist/WishList";
// import BookedActivitiesPage from "../pages/tourist/BookedActivities";
// import ItinerariesHistoryPage from "../pages/tourist/ItinerariesHistory";
// import Hero5 from "../components/tourist/SearchBar";
// import BookingDetails from "../components/tourist/BookingDetails";
// import Invoice from "../components/tourist/Invoice";
// import DbBooking from "../components/tourist/BookingHistory";

import TouristHome from "@/pages/tourist/TouristHome";
import FlightsList from "@/pages/tourist/FlightsList";

const touristRoutes = [
  { path: "/tourist", element: <TouristHome /> },
  { path: "/tourist/create-complaint", element: <ComplaintsForm /> },
  { path: "/tourist/view-complaints", element: <MyComplaints /> },
  { path: "/tourist/complaints-replies", element: <ComplaintsReplies /> },
  { path: "/tourist/book-flight", element: <FlightSearch /> },
  { path: "/tourist/search-flights", element: <FlightsList /> },
  { path: "/upcoming-activities", element: <Activities /> },
  // { path: "/activities-history", element: <ActivitiesHistoryPage /> },
  { path: "/tourist/profile", element: <TouristProfile /> },
  { path: "/cart", element: <Cart /> },
  { path: "/wishlist", element: <WishList /> },
  // { path: "/historical-places", element: <HistoricalPlaces /> },
  // {
  //   path: "/upcoming-itineraries",
  //   element: (
  //     <UpcomingItineraries isTourist={"isTourist"} touristBook={"book"} />
  //   ),
  // },
  // { path: "/itineraries-history", element: <ItinerariesHistoryPage /> },
  // { path: "/tourist/view-products", element: <TouristProducts /> },
  // {
  //   path: "/tourist/select-preferences/:touristId",
  //   element: <PreferenceSelection />,
  // },
  // {
  //   path: "/tourist/select-categories/:touristId",
  //   element: <CategorySelection />,
  // },
  { path: "/activity/:activityId", element: <ActivityDetailsPage /> },
  // { path: "/itinerary/:itineraryId", element: <ItineraryDetailsPage /> },
  // {
  //   path: "/tourist/view-products/product/:id",
  //   element: <TouristViewProduct />,
  // },
  // { path: "/tourist/create-complaint", element: <ComplaintsForm /> },
  // { path: "/tourist/view-Complaints", element: <MyComplaints /> },
  // {
  //   path: "/itineraries/booked-itineraries",
  //   element: (
  //     <UpcomingItineraries isTourist={"isTourist"} touristCancel={"cancel"} />
  //   ),
  // },
  // { path: "/booked-activities", element: <BookedActivitiesPage /> },
  // { path: "/tourist/book-flight", element: <FlightSearch /> },
  // { path: "/tourist/search-flight", element: <Hero5 /> },
  // { path: "/tourist/booking-summary", element: <BookingDetails /> },
  // { path: "/tourist/invoice", element: <Invoice /> },
  // { path: "/tourist/booking-history", element: <DbBooking /> },
];

export default touristRoutes;
