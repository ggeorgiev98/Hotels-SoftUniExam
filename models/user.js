const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
const UserShcema = new mongoose.Schema({

    email: {
        type: String,
        required: true
    },

    username: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    bookedHotels: [{
        type: 'ObjectId',
        ref: 'hotel'
    }],
    
    offeredHotels: [{
        type: ObjectId,
        ref: "hotel"
    }]

})

module.exports = mongoose.model('User', UserShcema);