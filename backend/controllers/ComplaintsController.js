const complaints = require('../models/Complaint');
const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const Tourist = require('../models/users/Tourist');

const createComplaint = asyncHandler(async (req, res) => {
    const { title, body } = req.body;
    const { id } = req.params;

    if (!title) {
        return res.status(400).json({ message: "Complaint title is required" });
    }
    if (!body) {
        return res.status(400).json({ message: "Complaint body is required" });
    }

    try {
        const tourist = await Tourist.findById(id);
        if (!tourist) {
            return res.status(404).json({ message: "Tourist not found" });
        }

        const userName = tourist.userName;

        // Create a new complaint
        const createdComplaint = await complaints.create({
            title,
            body,
            date: new Date(),
            issuerId: id,
            issuerUserName: userName
        });

        res.status(201).json(createdComplaint);
    } catch (error) {
        console.error("Error creating complaint:", error);
        res.status(500).json({ message: "Error creating complaint" });
    }
});

const getComplaintsByTourist = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const tourist = await Tourist.findById(id);
        if (!tourist) {
            return res.status(404).json({ message: "Tourist not found" });
        }

        const touristComplaints = await complaints.find({ issuerId: id });

        if (touristComplaints.length === 0) {
            return res.status(404).json({ message: "No complaints found for this tourist" });
        }

        res.status(200).json(touristComplaints);
    } catch (error) {
        console.error("Error fetching complaints:", error);
        res.status(500).json({ message: "Error fetching complaints" });
    }
});

const getAllComplaints = asyncHandler(async (req, res) => {
    try {
        const allComplaints = await complaints.find().populate('issuerId', 'userName'); // Populate issuer's userName

        if (allComplaints.length === 0) {
            return res.status(404).json({ message: "No complaints found" });
        }

        res.status(200).json(allComplaints);
    } catch (error) {
        console.error("Error fetching complaints:", error);
        res.status(500).json({ message: "Error fetching complaints" });
    }
});

const getComplaintById = asyncHandler(async (req, res) => {
    const { id } = req.params; // The ID of the complaint from the URL

    try {
        // Find the complaint by its ID
        const complaint = await complaints.findById(id).populate('issuerId', 'userName');

        if (!complaint) {
            return res.status(404).json({ message: "Complaint not found" });
        }

        // Return the complaint details
        res.status(200).json(complaint);
    } catch (error) {
        console.error("Error fetching complaint details:", error);
        res.status(500).json({ message: "Error fetching complaint details" });
    }
});

const updateComplaintStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; //either 'pending' or 'resolved'

    if (!status || !['pending', 'resolved'].includes(status)) {
        return res.status(400).json({ message: "Status must be either 'pending' or 'resolved'" });
    }

    try {
        // Find the complaint by ID and update the status
        const updatedComplaint = await complaints.findByIdAndUpdate(
            id,
            { status },
            { new: true } // return the updated document
        );

        if (!updatedComplaint) {
            return res.status(404).json({ message: "Complaint not found" });
        }

        res.status(200).json(updatedComplaint);
    } catch (error) {
        console.error("Error updating complaint status:", error);
        res.status(500).json({ message: "Error updating complaint status" });
    }
});

const replyToComplaint = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { reply } = req.body;
    if (!reply) {
        return res.status(400).json({ message: "Reply content is required" });
    }

    try {
        // Find the complaint by ID and update the reply
        const updatedComplaint = await complaints.findByIdAndUpdate(
            id,
            { reply },
            { new: true } // return the updated document
        );

        if (!updatedComplaint) {
            return res.status(404).json({ message: "Complaint not found" });
        }

        res.status(200).json(updatedComplaint);
    } catch (error) {
        console.error("Error replying to complaint:", error);
        res.status(500).json({ message: "Error replying to complaint" });
    }
});

module.exports = {
    createComplaint,
    getComplaintsByTourist,
    getAllComplaints,
    getComplaintById,
    updateComplaintStatus,
    replyToComplaint,

};


