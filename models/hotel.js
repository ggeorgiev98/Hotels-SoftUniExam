const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema.Types; 

const HotelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    
    city: {
        type: String,
        required: true
    },

    imageUrl: {
        type: String,
        required: true
    },

    freeRooms: {
        type: Number,
        required: true
    },

    usersBookedARoom: [{
        type: ObjectId,
        ref: 'User'
    }],

    owner: {
        type: ObjectId,
        ref: 'User'
    }
    
    
})

module.exports = mongoose.model('Hotel', HotelSchema);
