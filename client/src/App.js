import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Eventlayout from "./Layout/Eventlayout";
import RootLayout from "./Layout/RootLayout";
import EditEventPage from "./pages/EditEventPage";
import ErrorPage from "./pages/ErrorPage";
import EventDetailPage, {
  loader as eventDetailLoader,
  action as eventDeleteAction,
} from "./pages/EventDetailPage";
import EventsPage, { loader as eventsLoader } from "./pages/EventsPage";
import HomePage from "./pages/HomePage";
import NewEventPage from "./pages/NewEventPage";
import { action as eventFunction } from "./components/EventForm";
import Authentication, {action as authAction} from "./pages/Authentication";
import {action as logoutAction} from './pages/Logout';
import { checkAuthAction, getAuthToken } from "./util/auth";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    id: 'root',
    loader: getAuthToken,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "events",
        element: <Eventlayout />,
        children: [
          {
            index: true,
            element: <EventsPage />,
            loader: eventsLoader,
          },
          {
            path: ":eventId",
            id: "event-detail",
            loader: eventDetailLoader,
            children: [
              {
                index: true,
                element: <EventDetailPage />,
                action: eventDeleteAction,
              },
              {
                path: "edit",
                element: <EditEventPage />,
                action: eventFunction,
                loader: checkAuthAction,
              },
            ],
          },
          {
            path: "new",
            element: <NewEventPage />,
            action: eventFunction,
            loader: checkAuthAction,
          },
        ],
      },
      {
        path: "auth",
        element: <Authentication />,
        action: authAction,
      },
      {
        path: '/logout',
        action: logoutAction,
      }
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
