import express from "express";
import { setAvailability, cancelAppointments } from "../controllers/proff.js";
import { authMiddleware } from "../middleware/auth.js"; 
import { profMiddleware } from "../middleware/auth.js"; 
import { updateAvailability } from "../controllers/proff.js";
const router = express.Router();


router.post("/availability", authMiddleware,profMiddleware, setAvailability);

// Route to update availability - Only accessible to professors
router.patch("/availability/:id", authMiddleware, updateAvailability);


// Route to cancel appointments between professor and student - Only accessible to professors
router.patch("/cancel-appointments/:studentId", authMiddleware, profMiddleware, cancelAppointments);

export default router;
