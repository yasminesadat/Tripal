const mongoose = require('mongoose');

const ActivityCommentSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    activityId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Activity', 
        required: true 
    },
    text: { 
        type: String, 
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
});

module.exports = mongoose.model('ActivityComment', ActivityCommentSchema);
