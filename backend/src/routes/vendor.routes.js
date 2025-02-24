import express from "express";
import {
  addListing,
  updateListing,
  deleteListing,
  getVendorBookings,
  updateBookingStatus,
  getVendorAnalytics,
  addUnit,
  updateUnit,
  deleteUnit,
  getAllVendorsListings
} from "../controllers/vendor.controller.js"
import { verifyToken, authorizeVendor } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
const router = express.Router();
router.get("/listings/:vendorId",getAllVendorsListings);
router.post("/", verifyToken, authorizeVendor, upload.single("image"), addListing);
router.patch("/:listingId", verifyToken, authorizeVendor, upload.single("image"), updateListing);
router.delete("/:listingId", verifyToken, authorizeVendor, deleteListing);
router.get("/bookings", verifyToken, authorizeVendor, getVendorBookings);
router.patch("/bookings/:bookingId", verifyToken, authorizeVendor, updateBookingStatus);
router.get("/analytics", verifyToken, authorizeVendor, getVendorAnalytics);
router.post("/unit/:listingId", verifyToken, authorizeVendor, addUnit); 
router.patch("/unit/:unitId", verifyToken, authorizeVendor, updateUnit); 
router.delete("/unit/:unitId", verifyToken, authorizeVendor, deleteUnit); 
export default router;
