const express = require("express");
const router = express.Router();
const { deleteUser, addAdmin, getAllUsers } = require('../controllers/AdminController');

router.post("/admin/addAdmin", addAdmin);
router.delete("/admin/user/:id",deleteUser);  
router.get("/admin/users",getAllUsers);

module.exports = router;
