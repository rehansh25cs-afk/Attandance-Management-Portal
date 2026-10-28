import announcementModel from "../Models/announcements.model.js";


export const createAnnouncement = async (req, res) => {
    try {
        const { category, title, body, pinned } = req.body;

        const newAnnouncement = await announcementModel.create({
            category,
            title,
            body,
            pinned,
            author: req.user.name
        });

        return res.status(201).json({
            message: "Announcement created successfully",
            announcement: newAnnouncement,
            status: "success"
        })
    }catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
            status: "error"
        })
    }
        
}


export const pinAnnouncement = async (req, res) => {

    try{

        const {id} = req.params;

        const announcement = await announcementModel.findById(id);

        if(!announcement){
            return res.status(404).json({
                message: "Announcement not found",
                status: "error"
            })
        }

        announcement.pinned = !announcement.pinned;

        await announcement.save();

        return res.status(200).json({
            message: "Announcement pinned status updated successfully",
            announcement: announcement,
            status: "success"
        })
        
    }catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
            status: "error"
        })
    }
    
}



export const getAllAnnouncements = async (req, res) => {

    try {

        const announcements = await announcementModel.find().sort({ time: -1 });

        if(!announcements){
            return res.status(404).json({
                message: "No announcements found",
                status: "error"
            })
        }

        return res.status(200).json({
            message: "Announcements fetched successfully",
            announcements: announcements,
            status: "success"
        })
        
    }catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
            status: "error"
        })
    }
    
}




export const deleteAnnouncement = async(req, res) => {

    try{
        const { id } = req.params;

        const announcement = await announcementModel.findById(id);

        if(!announcement){
            return res.status(404).json({
                message: "Announcement not found",
                status: "error"
            })
        }

        await announcementModel.findByIdAndDelete(id);

        return res.status(200).json({
            message: "Announcement deleted successfully",
            status: "success"
        })

    }catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
            status: "error"
        })
    }
    
}