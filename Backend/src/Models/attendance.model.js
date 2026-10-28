import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    checkInTime: {
        type: Date,
        required: true,
        default: Date.now,
    },
    checkOutTime: {
        type: Date,
        required: false,
    },
    hoursWorked: {
        type: Number,
        required: false,
    },
    status: {
        type: String,
        enum: ["Present", "Absent", "On Leave", "Late"],
        default: "Present"
    }

}, { timestamps: true });


const attendanceModel = mongoose.model("attendance", attendanceSchema);
export default attendanceModel;
