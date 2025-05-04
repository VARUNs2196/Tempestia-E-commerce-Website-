const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { requestVendor, getUsers, changeRole, getVendorRequests } = require("../controllers/userController");

// User routes
router.get("/", protect, getUsers);  
router.put("/:id", protect, changeRole);  
router.get("/vendor-requests", protect, getVendorRequests); 
router.post("/request-vendor", protect, requestVendor);  

module.exports = router;
