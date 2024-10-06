import AdvertiserProfile from "../pages/advertiser/AdvertiserProfile";
import AdvertiserForm from "../pages/advertiser/AdvertiserProfileForm"; 

const advertiserRoutes = [
  { path: "/advertiser/:id", element: <AdvertiserProfile /> }, // View
  { path: "/update-advertiser/:id", element: <AdvertiserForm isUpdate={true} /> }, 
  { path: "/create-advertiser", element: <AdvertiserForm isUpdate={false} /> }, 
];

export default advertiserRoutes;
