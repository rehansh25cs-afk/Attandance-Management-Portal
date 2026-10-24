import {Router} from "express"; 
import authenticateUser from "../Middleware/auth.middleware.js";
import { getAllLeavesController, getLeavesController, requestLeaveController, updateLeaveStatusController } from "../Controllers/leaves.controller.js";


const leavesRouter = Router();



// @Route: POST /api/leaves/request-leave
// @Desc: Request a leave
// @Access: Private
leavesRouter.post("/request-leave", authenticateUser, requestLeaveController);


// @Route: GET /api/leaves/get-leaves
// @Desc: Get candidates leaves
// @Access: Private
leavesRouter.get("/get-leaves", authenticateUser, getLeavesController);




// @Route: GET /api/leaves/get-all-leaves
// @Desc: Get all leaves
// @Access: Private
leavesRouter.get("/get-all-leaves", authenticateUser, getAllLeavesController);



// @Route: PATCH /api/leaves/update-leave/:leaveId
// @Desc: Update leave status
// @Access: Private
leavesRouter.patch("/update-leave/:leaveId", authenticateUser, updateLeaveStatusController );




export default leavesRouter; 