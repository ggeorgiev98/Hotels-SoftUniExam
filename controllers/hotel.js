const Hotel = require('../models/hotel');

const getAllHotels = async (callback) => { 
    let hotels = await Hotel.find().lean();
    hotels = hotels.sort((a,b) => {
        return b.freeRooms - a.freeRooms
    });

    return hotels;
};

const saveHotel = async (req, res) => {

}

const getHotel = async (id) => {
    const hotel = await Hotel.findById(id).lean();
    return hotel;
}

const editHotel = async (id, data) => {
    await Hotel.findByIdAndUpdate(id, {
        $addToSet: {
            ...data
        }
    });
}



module.exports = {
    getAllHotels,
    getHotel,
    editHotel
}