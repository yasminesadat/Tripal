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

import BookingPage from "../pages/pages/booking-pages";

import DBMainPage from "../pages/dashboard/db-main";
import DBBookingPage from "../pages/dashboard/db-booking";
import DBListingPage from "../pages/dashboard/db-listing";
import DBAddTourPage from "../pages/dashboard/db-add-tour";
import DBFavoritesPage from "../pages/dashboard/db-favorites";
import DBMessagesPage from "../pages/dashboard/db-messages";
import DBProfilePage from "../pages/dashboard/db-profile";

import BlogListPage1 from "../pages/blogs/blog-list-1";
import BlogListPage2 from "../pages/blogs/blog-list-2";
import BlogListPage3 from "../pages/blogs/blog-list-3";
import BlogSinglePage from "../pages/blogs/blog-single";

import DestinationsPage from "../pages/pages/destinations";
import AboutPage from "../pages/pages/about";
import HelpCenterPage from "../pages/pages/help-center";
import TermsPage from "../pages/pages/terms";
import RegisterPage from "../pages/pages/register";
import InvoicePage from "../pages/pages/invoice";
import UIElementsPage from "../pages/pages/ui-elements";
import NotFoundPage from "../pages/pages/404";
import ContactPage from "../pages/pages/contact";

const templateRoutes = [
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

  { path: "/db-main", element: <DBMainPage /> },
  { path: "/db-booking", element: <DBBookingPage /> },
  { path: "/db-listing", element: <DBListingPage /> },
  { path: "/db-add-tour", element: <DBAddTourPage /> },
  { path: "/db-favorites", element: <DBFavoritesPage /> },
  { path: "/db-messages", element: <DBMessagesPage /> },
  { path: "/db-profile", element: <DBProfilePage /> },

  { path: "/blog-list-1", element: <BlogListPage1 /> },
  { path: "/blog-list-2", element: <BlogListPage2 /> },
  { path: "/blog-list-3", element: <BlogListPage3 /> },
  { path: "/blog-single/:id", element: <BlogSinglePage /> },

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
];

export default templateRoutes;
