import { createBrowserRouter } from "react-router";
import AdminDashboard from "../Features/Dashboard/Pages/AdminDashboard";
import AdminAttandance from "../Features/Attendance/Pages/AdminAttandance";
import AdminCandidates from "../Features/Candidates/Pages/AdminCandidates";
import AdminLeave from "../Features/Leave/Pages/AdminLeave";
import AdminTasks from './../Features/Tasks/Pages/AdminTasks';
import AdminAnnouncements from "../Features/Announcements/Pages/AdminAnnouncements";
import CandidateDashboard from "../Features/Dashboard/Pages/CandidateDashboard";
import CandidateAttendance from "../Features/Attendance/Pages/CandidateAttendance";
import CandidateTasks from "../Features/Tasks/Pages/CandidateTasks";
import CandidateLeave from "../Features/Leave/Pages/CandidateLeave";
import CandidateAnnouncements from "../Features/Announcements/Pages/CandidateAnnouncements";
import Login from "../Features/Auth/Pages/Login";



export const routes = createBrowserRouter([
    // auth routes
    {
        path: "/",
        element: <Login />
    },




    // admin routes
    {
        path: "/admin/dashboard",
        element: <AdminDashboard />
    },
    {
        path: "/admin/announcements",
        element: <AdminAnnouncements />
    },
    {
        path: "/admin/attendance",
        element: <AdminAttandance />
    },
    {
        path: "/admin/candidates",
        element: <AdminCandidates />
    },
    {
        path: "/admin/leave",
        element: <AdminLeave />
    },
    {
        path: "/admin/tasks",
        element: <AdminTasks />
    },



    

    // Candidates routes
    {
        path: "/candidate/announcements",
        element: <CandidateAnnouncements />
    },
    {
        path: "/candidate/dashboard",
        element: <CandidateDashboard />
    },
    {
        path: "/candidate/attendance",
        element: <CandidateAttendance />
    },
    {
        path: "/candidate/tasks",
        element: <CandidateTasks />
    },
    {
        path: "/candidate/leave",
        element: <CandidateLeave />
    },
    
])
