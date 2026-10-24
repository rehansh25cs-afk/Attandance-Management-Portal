import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema({

    leaveType: {
        type: String,
        enum: ["Annual Leave", "Sick Leave", "Personal Leave"],
        required: true
    },
    Dates: {
        type: String,
        required: true,
    },
    sentBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending"
    }
}, { timestamps: true });

    
    
const leavesModel = mongoose.model("leave", leaveSchema);

export default leavesModel;



