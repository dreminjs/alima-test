import { createBrowserRouter } from "react-router";
import { Dashboard } from "../modules/dashboard";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
  },
]);
