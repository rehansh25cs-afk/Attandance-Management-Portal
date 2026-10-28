import { Router } from 'express';
import {
    checkInController,
    checkOutController,
    getAllAttendanceController,
    getAttendanceByUserController,
} from '../Controllers/attendance.controller.js';
import authenticateUser from '../Middleware/auth.middleware.js';


const attendanceRouter = Router();


// @Route: POST /api/attendance/check-in
// @Desc: Check-in for attendance
// @Access: Private
attendanceRouter.post("/check-in", authenticateUser, checkInController)




// @Route: PATCH /api/attendance/check-out
// @Desc: Check-out for attendance
// @Access: Private
attendanceRouter.patch("/check-out", authenticateUser, checkOutController)




// @Route: GET /api/attendance/get-attendance
// @Desc: Get attendance for a user
// @Access: Private
attendanceRouter.get("/get-attendance", authenticateUser, getAttendanceByUserController)

// @Route: GET /api/attendance/get-all-attendance?date=YYYY-MM-DD
// @Desc: Get attendance for all candidates on a selected day
// @Access: Admin
attendanceRouter.get("/get-all-attendance", authenticateUser, getAllAttendanceController)



export default attendanceRouter;
