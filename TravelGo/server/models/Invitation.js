const mongoose = require('mongoose');

const typeOfActivities = ["Pending", "Accepted", "Rejected"];

const InvitationSchema = new mongoose.Schema({
    invitedEmail: String,
    itineraryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Itinerary' },
    inviter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    invitee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    token: String,
    status: {
        type: String,
        enum: typeOfActivities, 
        default: 'Pending'
    },
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Invitation', InvitationSchema);