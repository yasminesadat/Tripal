import TouristProfile from "../pages/tourist/TouristProfile";
import Activities from "../pages/commonPagesForMultipleUsers/Activities";
import Itineraries from "../pages/commonPagesForMultipleUsers/Itineraries";
// import HistoricalPlaces from "../pages/tourist/HistoricalPlaces";
import TouristProducts from "../pages/tourist/TouristProducts";
import TouristViewProduct from "../pages/tourist/TouristViewProduct";
// import PreferenceSelection from "../components/tourist/PreferenceSelection";
// import CategorySelection from "../components/tourist/CategorySelection";
// import ItineraryDetailsPage from "../pages/tourist/ItineraryDetails";
import ComplaintsForm from "../pages/tourist/ComplaintsForm";
import MyComplaints from "../pages/tourist/MyComplaints";
import ComplaintsReplies from "@/pages/tourist/ComplaintsReplies";
import FlightSearch from "../pages/tourist/SearchBar";
import Cart from "@/pages/tourist/Cart";
// import Invoice from "../components/tourist/Invoice";
import DbBooking from "@/pages/tourist/BookingHistory";
import TouristHome from "@/pages/tourist/TouristHome";
import FlightsList from "@/pages/tourist/FlightsList";
import FlightBookingDetails from "@/pages/tourist/FlightBookingDetails";
import FlightInvoice from "@/pages/tourist/FlightInvoice";
import BookingPages from "../pages/BookingHotels/BookingConfirmation";
import HotelDetails from "../pages/BookingHotels/HotelDetails";
import TourList1 from "../pages/BookingHotels/HotelList";
import Hero6 from "../pages/BookingHotels/SearchHotel2";
import BookmarkedEvents from "../pages/tourist/bookmarked"
import WishListPage from "@/pages/tourist/WishList";
import FlightCheckout from "@/pages/tourist/FlightChekoutSuccess";
import PreferenceSelection from "@/pages/tourist/PreferenceSelection";
import CategorySelection from "@/pages/tourist/CategorySelection";

import Checkout from "../pages/tourist/Checkout";
import BookingPagesStripe from "@/pages/BookingHotels/HotelStripeSuccess";
import SuccessPage from "@/components/activity/activitySingle/SuccessPage";
import OrderSuccessPage from "@/pages/tourist/OrderSuccessPage";



const touristRoutes = [
  { path: "/tourist", element: <TouristHome /> },
  { path: "/tourist/create-complaint", element: <ComplaintsForm /> },
  { path: "/tourist/view-complaints", element: <MyComplaints /> },
  { path: "/tourist/complaints-replies", element: <ComplaintsReplies /> },
  { path: "/tourist/book-flight", element: <FlightSearch /> },
  { path: "/tourist/search-flights", element: <FlightsList /> },
  { path: "/upcoming-activities", element: <Activities /> },
  { path: "/tourist/profile", element: <TouristProfile /> },
  { path: "/cart", element: <Cart /> },
  { path: "/tourist/booking-summary", element: <FlightBookingDetails /> },
  { path: "/tourist/invoice", element: <FlightInvoice /> },
  { path: "/upcoming-itineraries", element: <Itineraries /> },
  { path: "/bookmarked-events", element: <BookmarkedEvents /> },
  // { path: "/historical-places", element: <HistoricalPlaces /> },
  { path: "/tourist/view-products", element: <TouristProducts /> },
  // {
  //   path: "/tourist/select-preferences/:touristId",
  //   element: <PreferenceSelection />,
  // },
  // {
  //   path: "/tourist/select-categories/:touristId",
  //   element: <CategorySelection />,
  // },
  // { path: "/itinerary/:itineraryId", element: <ItineraryDetailsPage /> },
  {
    path: "/tourist/view-products/product/:id",
    element: <TouristViewProduct />,
  },
  {path:"/checkout",
    element:<Checkout/>
  },
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
  { path: "/tourist/booking-history", element: <DbBooking /> },
  { path: "/hotel2", element: <Hero6 /> },
  { path: "/hotelList/:cityCode/:dates1/:dates2", element: <TourList1 /> },
  { path: "/hotelDetails/:cityCode/:name/:hotelID/:dates1/:dates2", element: <HotelDetails /> },
  { path: "/confirmBooking/:cityCode/:hotelID/:name/:singlePrice/:singleNumber/:doublePrice/:doubleNumber/:triplePrice/:tripleNumber/:boardType/:checkIn/:checkOut/:currency/:exchangeRate", element: <BookingPages /> },
  { path: "/wishlist", element: <WishListPage /> },
  { path: "/success", element: <FlightCheckout /> },
  { path: "/tourist/preferences", element: <PreferenceSelection /> },
  { path: "/tourist/select-categories", element: <CategorySelection /> },
  { path: "/successHotel", element: <BookingPagesStripe /> },
  { path: "/success/resource", element: <SuccessPage /> },
  { path: "products-payment-success", element: <OrderSuccessPage /> }


];

export default touristRoutes;