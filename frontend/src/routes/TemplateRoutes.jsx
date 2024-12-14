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
const templateRoutes = [
  // { path: "/template", element: <Header3></Header3> },

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

  { path: "/pendingRequest", element: <PendingPage /> },
];

export default templateRoutes;
