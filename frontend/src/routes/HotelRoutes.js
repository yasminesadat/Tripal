import BookingPages from "../pages/BookingHotels/BookingConfirmation";
import Map from "../pages/BookingHotels/Components/Map";
import CreditCard from "../pages/BookingHotels/Components/Payment";
import HeaderSerch from "../pages/BookingHotels/Components/SearchEngine";
import HotelDetails from "../pages/BookingHotels/HotelDetails";
import TourList1 from "../pages/BookingHotels/HotelList";
import HotelFetcher from "../pages/BookingHotels/SearchHotel";
import Hero6 from "../pages/BookingHotels/SearchHotel2";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const hotelRoutes = [
    { path: "/hotel", element: <HotelFetcher /> },
    {path:"/hotel2",element:<Hero6/>},
    {path:"/hotelList",element:<TourList1/>},
    {path:"/hotelList/:cityCode", element:<TourList1/>},
    {path:"/hotelDetails/:name/:hotelID", element:<HotelDetails/>},
    {path:"/map",element:<Map/>},
    // {path:"/searchEngine",element:<HeaderSerch/>},
    {path:"/confirmBooking/:hotelID/:name/:singlePrice/:singleNumber/:doublePrice/:doubleNumber/:triplePrice/:tripleNumber/:boardType/:checkIn/:checkOut",element:<BookingPages/>},

    {path:"/payment",element:<CreditCard/>}
  //  <Route path="/map" element={<Map/>} />

  

  
  
  
  
  
  ];
  
  export default hotelRoutes;