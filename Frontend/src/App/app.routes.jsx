import { createBrowserRouter } from "react-router";
import AdminDashboard from "../Features/Dashboard/Pages/AdminDashboard";
import AdminAttendance from "../Features/Attendance/Pages/AdminAttendance";
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
import Protected from "../Features/Auth/Components/Protected";



export const routes = createBrowserRouter([
    // auth routes
    {
        path: "/",
        element: <Login />
    },




    // admin routes
    {
        path: "/admin/dashboard",
        element: <Protected permissions={"admin"}> <AdminDashboard /></Protected>
    },
    {
        path: "/admin/announcements",
        element: <Protected permissions={"admin"}><AdminAnnouncements /></Protected>
    },
    {
        path: "/admin/attendance",
        element: <Protected permissions={"admin"}><AdminAttendance /></Protected>
    },
    {
        path: "/admin/candidates",
        element: <Protected permissions={"admin"}><AdminCandidates /></Protected>
    },
    {
        path: "/admin/leave",
        element: <Protected permissions={"admin"}><AdminLeave /></Protected>
    },
    {
        path: "/admin/tasks",
        element: <Protected permissions={"admin"}><AdminTasks /></Protected>
    },



    

    // Candidates routes
    {
        path: "/candidate/announcements",
        element: <Protected permissions={"candidate"}><CandidateAnnouncements /></Protected>
    },
    {
        path: "/candidate/dashboard",
        element: <Protected permissions={"candidate"}><CandidateDashboard /></Protected>
    },
    {
        path: "/candidate/attendance",
        element: <Protected permissions={"candidate"}><CandidateAttendance /></Protected>
    },
    {
        path: "/candidate/tasks",
        element: <Protected permissions={"candidate"}><CandidateTasks /></Protected>
    },
    {
        path: "/candidate/leave",
        element: <Protected permissions={"candidate"}><CandidateLeave /></Protected>
    },
    
])
