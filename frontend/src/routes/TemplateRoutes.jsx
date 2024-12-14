import PendingPage from "@/pages/commonPagesForMultipleUsers/PendingRequest";
import RegisterPage from "../pages/pages/register";
const templateRoutes = [
  { path: "/pendingRequest", element: <PendingPage /> },
  { path: "/register", element: <RegisterPage /> },
];

export default templateRoutes;
