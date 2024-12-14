import HomePage1 from "../pages/homes/home-1";
import HomePage2 from "../pages/homes/home-2";
import HomePage3 from "../pages/homes/home-3";
import HomePage4 from "../pages/homes/home-4";
import HomePage6 from "../pages/homes/home-6";
import HomePage7 from "../pages/homes/home-7";
import HomePage8 from "../pages/homes/home-8";
import HomePage9 from "../pages/homes/home-9";
import HomePage10 from "../pages/homes/home-10";

import TourListPage1 from "../pages/tour-lists/tour-list-1";
import TourListPage2 from "../pages/tour-lists/tour-list-2";
import TourListPage3 from "../pages/tour-lists/tour-list-3";
import TourListPage4 from "../pages/tour-lists/tour-list-4";
import TourListPage5 from "../pages/tour-lists/tour-list-5";
import TourListPage6 from "../pages/tour-lists/tour-list-6";
import TourListPage7 from "../pages/tour-lists/tour-list-7";
import TourListPage8 from "../pages/tour-lists/tour-list-8";
import TourListPage9 from "../pages/tour-lists/tour-list-9";
import TourListPage10 from "../pages/tour-lists/tour-list-10";

import TourSinglePage1 from "../pages/tour-singles/tour-single-1";
import TourSinglePage2 from "../pages/tour-singles/tour-single-2";
import TourSinglePage3 from "../pages/tour-singles/tour-single-3";
import TourSinglePage4 from "../pages/tour-singles/tour-single-4";
import TourSinglePage5 from "../pages/tour-singles/tour-single-5";
import PendingPage from "@/pages/commonPagesForMultipleUsers/PendingRequest";
import BookingPage from "../pages/pages/booking-pages";

import DestinationsPage from "../pages/pages/destinations";
import AboutPage from "../pages/pages/about";
import HelpCenterPage from "../pages/pages/help-center";
import TermsPage from "../pages/pages/terms";
import RegisterPage from "../pages/pages/register";
import InvoicePage from "../pages/pages/invoice";
import UIElementsPage from "../pages/pages/ui-elements";
import NotFoundPage from "../pages/pages/404";
import ContactPage from "../pages/pages/contact";
import Header3 from "@/components/layout/header/Header3";

const templateRoutes = [
  { path: "/template", element: <Header3></Header3> },
  { path: "/home-5", element: <HomePage1 /> },
  { path: "/home-2", element: <HomePage2 /> },
  { path: "/home-3", element: <HomePage3 /> },
  { path: "/home-4", element: <HomePage4 /> },
  { path: "/home-1", element: <HomePage1 /> },
  { path: "/home-6", element: <HomePage6 /> },
  { path: "/home-7", element: <HomePage7 /> },
  { path: "/home-8", element: <HomePage8 /> },
  { path: "/home-9", element: <HomePage9 /> },
  { path: "/home-10", element: <HomePage10 /> },

  { path: "/tour-list-1", element: <TourListPage1 /> },
  { path: "/tour-list-2", element: <TourListPage2 /> },
  { path: "/tour-list-3", element: <TourListPage3 /> },
  { path: "/tour-list-4", element: <TourListPage4 /> },
  { path: "/tour-list-5", element: <TourListPage5 /> },
  { path: "/tour-list-6", element: <TourListPage6 /> },
  { path: "/tour-list-7", element: <TourListPage7 /> },
  { path: "/tour-list-8", element: <TourListPage8 /> },
  { path: "/tour-list-9", element: <TourListPage9 /> },
  { path: "/tour-list-10", element: <TourListPage10 /> },

  { path: "/tour-single-1/:id", element: <TourSinglePage1 /> },
  { path: "/tour-single-2/:id", element: <TourSinglePage2 /> },
  { path: "/tour-single-3/:id", element: <TourSinglePage3 /> },
  { path: "/tour-single-4/:id", element: <TourSinglePage4 /> },
  { path: "/tour-single-5/:id", element: <TourSinglePage5 /> },

  { path: "/booking-pages", element: <BookingPage /> },

  { path: "/destinations", element: <DestinationsPage /> },
  { path: "/about", element: <AboutPage /> },
  { path: "/help-center", element: <HelpCenterPage /> },
  { path: "/terms", element: <TermsPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/invoice", element: <InvoicePage /> },
  { path: "/ui-elements", element: <UIElementsPage /> },
  { path: "/contact", element: <ContactPage /> },

  { path: "/404", element: <NotFoundPage /> },
  { path: "/*", element: <NotFoundPage /> },
  { path: "/pendingRequest", element: <PendingPage /> },
];

export default templateRoutes;
