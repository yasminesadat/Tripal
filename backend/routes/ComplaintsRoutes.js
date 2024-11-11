const express = require("express");
const router = express.Router();
const { createComplaint,getComplaintsByTourist,getAllComplaints,getComplaintById,updateComplaintStatus,replyToComplaint } = require('../controllers/ComplaintsController')

router.post("/complaint/:id", createComplaint); //tourist id
router.get('/complaints/tourist/:id', getComplaintsByTourist); //tourist id
router.get('/complaints', getAllComplaints);
router.get('/complaints/:id', getComplaintById); //complaint id
router.put('/complaint/status/:id', updateComplaintStatus); //complaint id
router.put('/complaint/reply/:id', replyToComplaint); //complaint id






module.exports = router;
