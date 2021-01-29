const { Router } = require('express');
const { saveUser, verifyUser, checkGuestAccess, getUserStatus } = require('../controllers/user'); 

const router = Router();

router.get('/login', checkGuestAccess, getUserStatus, (req,res) => {
    res.render('login', { isLoggedIn: req.isLoggedIn });
});

router.get('/register', checkGuestAccess, getUserStatus, (req,res) => {
    res.render('register', { isLoggedIn: req.isLoggedIn });
});

router.get('/logout', (req,res) => {
    res.clearCookie('aid');
    res.redirect("/");
});

router.post('/register', async (req, res) => {

    const {
        email,
        username,
        password,
        rePassword
    } = req.body;

    if(!email.match(/[A-Za-z0-9]+/g)) {
        return res.render('register', {
            error: true,
            errorMessage: "The email should consist only english letters and digits!"
        });
    }

    if(username.length < 3 || !username.match(/[A-Za-z0-9]+/g)) {
        return res.render('register', {
            error: true,
            errorMessage: "The username should be at least 3 characters long and should consist only english letters and digits!"
        });
    };

    if(password !== rePassword) {
        return res.render('register', {
            error: true,
            errorMessage: "The repeat password should be equal to the password!"
        });
    }else if (password.length < 3 || !password.match(/[A-Za-z0-9]+/g)) {
        return res.render('register', {
            error: true,
            errorMessage: "The password should be at least 3 characters long and should consist only english letters and digits!"
        });
    };
    
    try {
        await saveUser(req, res);
        res.redirect('/');
    } catch(e) {
        res.render("register", {
            errorMessage: "Invalid data format!"
        });
    }
});

router.post('/login', async (req, res) => {
    const {
        username
    } = req.body;

    if(username.length < 3 || !username.match(/[A-Za-z0-9]+/g)) {
        return res.render('login', {
            error: true,
            errorMessage: "The username should be at least 3 characters long and should consist only english letters and digits!"
        });
    };

    const status = await verifyUser(req, res)
    
    if(status) {
        res.redirect('/')
    } else {
        return res.render('login', {
            error: true,
            errorMessage: 'Invalid credentials!'
        });
    }
});

module.exports = router;