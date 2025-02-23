import { Router } from "express";
import { browseListings,
    viewListingDetails,
    bookListingUnit,
    bookingHistory,
    writeReview,
     registerUser ,
     loginUser,logoutUser} from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
const router=Router();
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyToken,logoutUser);
router.get("/listings", browseListings);
router.get("/listings/:listingId", viewListingDetails); 
router.post("/bookings/:listingId/:unitId", verifyToken, bookListingUnit);
router.get("/bookings/history", verifyToken, bookingHistory); 
router.post("/reviews/:bookingId", verifyToken, writeReview);
export default router