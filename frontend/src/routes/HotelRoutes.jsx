import BookingPages from "../pages/BookingHotels/BookingConfirmation";
import Map from "../pages/BookingHotels/Components/Map";
import CreditCard from "../pages/BookingHotels/Components/Payment";
import HotelDetails from "../pages/BookingHotels/HotelDetails";
import HotelFetcher from "../pages/BookingHotels/SearchHotel";
import Hero6 from "../pages/BookingHotels/SearchHotel2";
import TourList1 from "../pages/BookingHotels/HotelList";

const hotelRoutes = [
  { path: "/hotel", element: <HotelFetcher /> },
  { path: "/hotel2", element: <Hero6 /> },
  { path: "/hotelList/:cityCode/:dates1/:dates2", element: <TourList1 /> },
  {
    path: "/hotelDetails/:cityCode/:name/:hotelID/:dates1/:dates2",
    element: <HotelDetails />,
  },
  { path: "/map", element: <Map /> },
  // {path:"/searchEngine",element:<HeaderSerch/>},
  {
    path: "/confirmBooking/:cityCode/:hotelID/:name/:singlePrice/:singleNumber/:doublePrice/:doubleNumber/:triplePrice/:tripleNumber/:boardType/:checkIn/:checkOut/:currency/:exchangeRate",
    element: <BookingPages />,
  },

  { path: "/payment", element: <CreditCard /> },
  //  <Route path="/map" element={<Map/>} />
];

export default hotelRoutes;
