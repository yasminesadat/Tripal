import PendingPage from "@/pages/commonPagesForMultipleUsers/PendingRequest";
import RegisterPage from "../pages/pages/register";
import HelpCenterPage from "../pages/pages/help-center";
import NotFoundPage from "@/pages/pages/404";

const templateRoutes = [
  { path: "/pendingRequest", element: <PendingPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/help-center", element: <HelpCenterPage /> },
  { path: "/404", element: <NotFoundPage /> },
  { path: "/*", element: <NotFoundPage /> },
];

export default templateRoutes;