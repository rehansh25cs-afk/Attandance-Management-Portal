import { configureStore } from "@reduxjs/toolkit";
import announcementsReducer from "../Features/Announcements/state/announcements.slice";
import authReducer from "../Features/Auth/state/auth.slice";
import tasksReducer from "../Features/Tasks/state/tasks.slice";
import leavesReducer from "../Features/Leave/state/leaves.slice";
import attendanceReducer from "../Features/Attendance/state/attendance.slice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        announcements: announcementsReducer,
        tasks: tasksReducer,
        leaves: leavesReducer,
        attendance: attendanceReducer
    },
});