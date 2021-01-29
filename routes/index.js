const { Router } = require('express');
const { getUserStatus, checkAuthentication } = require('../controllers/user'); 
const { saveHotel, getAllHotels, getHotel, editHotel } = require('../controllers/hotel')
const Hotel = require('../models/hotel');
const User = require('../models/hotel');
const router = Router();

router.get('/', getUserStatus, async (req, res) => { 
    let hotels = await getAllHotels();

    if(!req.isLoggedIn) {
        req.user = {}
        req.user.username = "guest"
    }
    res.render('home', { 
    isLoggedIn:  req.isLoggedIn,
    name: req.user.username,
    hotels: hotels
    });    
});

router.get('/create', checkAuthentication, getUserStatus, async (req, res) => {  
    res.render('create', { 
    isLoggedIn:  req.isLoggedIn, 
    name: req.user.username
    });    
});

router.get('/details/:id', checkAuthentication, getUserStatus, async (req, res) => {  
    const id = req.params.id;

    const hotel = await getHotel(id);
    
    const isOwner = hotel.owner.toString() === req.user._id.toString();
    const isBooked = hotel.usersBookedARoom.filter(x => x.toString() === req.user._id.toString())
    res.render('details', { 
    isLoggedIn:  req.isLoggedIn, 
    name: req.user.username,
    ...hotel,
    isOwner,
    isBooked
    });    
});

router.get('/edit/:id', checkAuthentication, getUserStatus, async (req, res) => {
    const id = req.params.id;
    const hotel = await getHotel(id);
    res.render('edit', {
        isLoggedIn: req.isLoggedIn,
        name: req.user.username,
        ...hotel
    });
});

router.post('/edit/:id', checkAuthentication, async (req, res) => {
    const { id } = req.params;
    const { name, city, freeRooms, imageUrl} = req.body;

    if(name.length < 4) {
        return res.render('create', {
            error: true,
            errorMessage: "Hotel name must be at least 4 chars long!"
        });
    };

    if(city.length < 3) {
        return res.render('create', {
            error: true,
            errorMessage: "City name must be at least 3 chars long!"
        });
    };

    if(!imageUrl.startsWith('http') || !imageUrl.startsWith('https')) {
        return res.render('create', {
            error: true,
            errorMessage: "Image URL is invalid!"
        });
    };

    if(freeRooms < 1 || freeRooms > 100) {
        return res.render('create', {
            error: true,
            errorMessage: "Rooms must be between 1 and 100!"
        });
    };

    await Hotel.findByIdAndUpdate(id, { 
            name, city, freeRooms,imageUrl
    });

    res.redirect('/')
})

router.post('/create', checkAuthentication, async (req, res) => {
    const { name, city, imageUrl, freeRooms } = req.body;

    if(name.length < 4) {
        return res.render('create', {
            error: true,
            errorMessage: "Hotel name must be at least 4 chars long!"
        });
    };

    if(city.length < 3) {
        return res.render('create', {
            error: true,
            errorMessage: "City name must be at least 3 chars long!"
        });
    };

    if(!imageUrl.startsWith('http') || !imageUrl.startsWith('https')) {
        return res.render('create', {
            error: true,
            errorMessage: "Image URL is invalid!"
        });
    };

    if(freeRooms < 1 || freeRooms > 100) {
        return res.render('create', {
            error: true,
            errorMessage: "Rooms must be between 1 and 100!"
        });
    };

    const { _id } = req.user;
    const hotel = new Hotel({ name, city, imageUrl, freeRooms, owner: _id });

    try {
        await hotel.save()
        res.redirect('/')
    } catch (e) {
        return res.render('create', {
            error: true,
            errorMessage: "Error! Please try again!"
        });
    };
});

router.get('/book/:id', checkAuthentication, async (req, res) => {
    const hotelId = req.params.id;

    const { _id } = req.user;

    await Hotel.findByIdAndUpdate(hotelId, {
        $addToSet: {
            usersBookedARoom: [_id]
        }
    });

    res.redirect(`/details/${hotelId}`);
});

router.get('/delete/:id', checkAuthentication , async (req, res) => {
    const hotelId = req.params.id;

    await Hotel.findByIdAndDelete(hotelId);

    res.redirect('/');
});



module.exports = router;