const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const complaintSchema = new Schema(
    {
        title: {
            type: String,
            required: true,

        },
        body: {
            type: String,
            required: true,

        },
        date: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            required: true,
            default: "pending"
        },
        reply: {
            type: String,
            required: true,
            default: "No reply Yet"
        },
        issuerId: {
            type: Schema.Types.ObjectId,
            ref: "Tourist",
            required: true
        },
        issuerUserName: {
            type: String,
            default: ""
        }


    },
    { timestamps: true }
);

const Complaint = mongoose.model('Complaint', complaintSchema);
module.exports = Complaint;