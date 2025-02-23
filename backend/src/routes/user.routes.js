import { Router } from "express";
import { registerUser ,loginUser,logoutUser,bookHotelOrRestaurent} from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
const router=Router();
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyToken,logoutUser);
router.route("/booking/:placeId").post(verifyToken,bookHotelOrRestaurent);
export default router