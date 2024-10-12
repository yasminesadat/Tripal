const complaints = require('../models/Complaint');
const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const Tourist = require('../models/Tourist');

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

module.exports = {
    createComplaint
};
