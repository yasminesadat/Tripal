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
        replies: {
            type: [
              {
                senderId: {
                  type: Schema.Types.ObjectId,
                  ref: "User",
                  required: true,
                },
                message: {
                  type: String,
                  required: true,
                },
                date: {
                  type: Date,
                  default: Date.now,
                },
              },
            ],
            default: [], // Set default to an empty array
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