import { createBrowserRouter } from "react-router";
import App from "../layout/App";
import HomePage from "../../features/home/HomePage";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDetails from "../../features/activities/details/ActivityDetail";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />, // Root route component (hostname:port)
        children: [
            {path: '', element: <HomePage />}, // (hostname:port/)
            {path: 'activities', element: <ActivityDashboard />}, // (hostname:port/activities)
            {path: 'activities/:id', element: <ActivityDetails />},
            {path: 'createActivity', element: <ActivityForm key='create' />}, // (hostname:port/createActivity)
            {path: 'manage/:id', element: <ActivityForm />}
        ]
    }
])