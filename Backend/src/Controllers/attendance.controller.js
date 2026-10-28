import attendanceModel from "../Models/attendance.model.js";
import userModel from "../Models/user.model.js";


export const checkInController = async(req,res) => {

    try{
        const user = req.user._id;
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const existingAttendance = await attendanceModel.findOne({
            user,
            date: { $gte: startOfDay, $lt: endOfDay },
        });

        if(existingAttendance){
            return res.status(400).json({ message: "User has already checked in today." });
        }

        const checkInTime = new Date();
        const lateAfter = new Date(checkInTime);
        lateAfter.setHours(9, 15, 0, 0);
        const status = checkInTime > lateAfter ? "Late" : "Present";

        const newAttendance = await attendanceModel.create({
            user,
            date: checkInTime,
            checkInTime,
            status,
        });

        return res.status(201).json({ message: "Check-in successful.", status: "success" , attendance: newAttendance });

    }catch(error){
        console.log(error);
        return res.status(500).json({ message: error.message || "Server error" })
    }
    
}



export const checkOutController = async(req,res) => {

    try{
        const user = req.user._id;
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const existingAttendance = await attendanceModel.findOne({
            user,
            date: { $gte: startOfDay, $lt: endOfDay },
        });

        if(!existingAttendance){
            return res.status(404).json({ message: "No attendance record found for this user." });
        }

        if (existingAttendance.checkOutTime) {
            return res.status(400).json({ message: "User has already checked out today." });
        }

        if (!existingAttendance.checkInTime) {
            return res.status(400).json({ message: "Attendance record is missing check-in time." });
        }

        const checkOutTime = new Date();
        const hoursWorked = Math.max(
            (checkOutTime - existingAttendance.checkInTime) / (1000 * 60 * 60),
            0
        );

        const updatedAttendance = await attendanceModel.findByIdAndUpdate(existingAttendance._id, { checkOutTime, hoursWorked }, { new: true });

        return res.status(200).json({ message: "Check-out successful.", status: "success", attendance: updatedAttendance });

    }catch(error){
        console.log(error);
        return res.status(500).json({ message: error.message || "Server error" })
    }
    
}



export const getAttendanceByUserController = async(req,res) => {

    try{
        const user = req.user._id;

        const attendanceRecords = await attendanceModel.find({ user }).sort({ date: -1 });

        return res.status(200).json({ message: "Attendance records fetched successfully.", status: "success", attendance: attendanceRecords });

    }catch(error){
        console.log(error);
        return res.status(500).json({ message: error.message || "Server error" })
    }

}

export const getAllAttendanceController = async (req, res) => {
    try {
        const accountTypes = [req.user.permissions, req.user.role]
            .filter(Boolean)
            .map((type) => type.toLowerCase());

        const isAdmin = accountTypes.includes("admin") || accountTypes.includes("superadmin");

        if (!isAdmin) {
            return res.status(403).json({ message: "Admin access is required." });
        }

        const { date } = req.query;
        const selectedDate = date || new Date().toISOString().slice(0, 10);
        const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(selectedDate);

        if (!dateMatch) {
            return res.status(400).json({ message: "Date must use YYYY-MM-DD format." });
        }

        const startOfDay = new Date(
            Number(dateMatch[1]),
            Number(dateMatch[2]) - 1,
            Number(dateMatch[3])
        );

        if (
            startOfDay.getFullYear() !== Number(dateMatch[1]) ||
            startOfDay.getMonth() !== Number(dateMatch[2]) - 1 ||
            startOfDay.getDate() !== Number(dateMatch[3])
        ) {
            return res.status(400).json({ message: "Date is not valid." });
        }

        const endOfDay = new Date(startOfDay);
        endOfDay.setDate(endOfDay.getDate() + 1);

        const [attendanceRecords, totalTeam] = await Promise.all([
            attendanceModel
                .find({ date: { $gte: startOfDay, $lt: endOfDay } })
                .populate("user", "name email role permissions")
                .sort({ checkInTime: 1 }),
            userModel.countDocuments({
                $or: [{ permissions: "candidate" }, { role: "candidate" }],
            }),
        ]);

        return res.status(200).json({
            message: "All attendance records fetched successfully.",
            status: "success",
            date: selectedDate,
            totalTeam,
            attendance: attendanceRecords,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message || "Server error" });
    }
};
