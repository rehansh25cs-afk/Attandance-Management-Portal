import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({

    category: {
        type: String,
        enum: ["Company update", "People & culture", "Reminder"],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        default: Date.now
    },
    pinned: {
        type: Boolean,
        default: false
    },


})


const announcementModel = mongoose.model("announcement", announcementSchema);

export default announcementModel;