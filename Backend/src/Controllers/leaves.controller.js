import leavesModel from "../Models/leaves.model.js";

export const requestLeaveController = async (req, res) => {

    try {
        const { leaveType, Dates } = req.body;

        const newLeave = await leavesModel.create({
            leaveType,
            Dates,
            sentBy: req.user._id
        });

        res.status(201).json({
            success: true,
            data: newLeave
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error occurred while requesting leave",
            error: error.message
        });
    }

}




export const getLeavesController = async (req, res) => {

    try {
        const leaves = await leavesModel.find({ sentBy: req.user._id });
        res.status(200).json({
            success: true,
            data: leaves
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error occurred while fetching leaves",
            error: error.message
        });
    }
}








export const getAllLeavesController = async (req, res) => {

    try {
        const leaves = await leavesModel.find();
        res.status(200).json({
            success: true,
            data: leaves
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error occurred while fetching all leaves",
            error: error.message
        });
    }
}





export const updateLeaveStatusController = async (req, res) => {

    try {
        const { leaveId } = req.params;
        const {  status } = req.body;

        const updatedLeave = await leavesModel.findByIdAndUpdate(
            leaveId,
            { status },
            { new: true }
        );

        if (!updatedLeave) {
            return res.status(404).json({
                success: false,
                message: "Leave request not found"
            });
        }

        res.status(200).json({
            success: true,
            data: updatedLeave
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error occurred while updating leave status",
            error: error.message
        });
    }
}