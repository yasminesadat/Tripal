import HotelDetails from "../pages/BookingHotels/HotelDetails";
import TourList1 from "../pages/BookingHotels/HotelList";
import HotelFetcher from "../pages/BookingHotels/SearchHotel";
import Hero6 from "../pages/BookingHotels/SearchHotel2";

const hotelRoutes = [
    { path: "/hotel", element: <HotelFetcher /> },
    {path:"/hotel2",element:<Hero6/>},
    {path:"/hotelList",element:<TourList1/>},
    {path:"/hotelList/:cityCode", element:<TourList1/>},
    {path:"/hotelDetails", element:<HotelDetails/>}
  

  
  
  
  
  
  ];
  
  export default hotelRoutes;