import { Router } from 'express';
import { createAnnouncement, pinAnnouncement, getAllAnnouncements } from '../Controllers/announcements.controller.js';
import authenticateUser from '../Middleware/auth.middleware.js';




const announcementsRouter = Router();


// @route Post /api/announcements/create
// @desc Create a new announcement
// @access Private
announcementsRouter.post('/create', authenticateUser, createAnnouncement);




// @route Patch /api/announcements/pin/:id
// @desc Pin or unpin an announcement
// @access Private
announcementsRouter.patch("/pin/:id", authenticateUser, pinAnnouncement);




// @route Get /api/announcements/getAll
// @desc Get all announcements
// @access Private
announcementsRouter.get("/getAll", authenticateUser, getAllAnnouncements);



export default announcementsRouter;