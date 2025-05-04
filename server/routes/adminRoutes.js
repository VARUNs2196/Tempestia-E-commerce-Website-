const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const { getUsers, changeRole, getVendorRequests } = require("../controllers/adminController");

router.get("/users", protect, authorize("admin"), getUsers);
router.get("/vendor-requests", protect, authorize("admin"), getVendorRequests);
router.put("/role/:id", protect, authorize("admin"), changeRole);

module.exports = router;
