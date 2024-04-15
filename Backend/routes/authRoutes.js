const express = require('express');
const router = express.Router();
const cors = require('cors');
const { test, registerUser, loginUser, getProfile } = require('../controllers/authController');

//middleware
router.use(
    cors({
        credentials: true,
        origin: 'http://localhost:5173'
    })
);

router.get('/', test)
router.post('/register', registerUser)
router.post('/login', (req, res) => {
    loginUser
});
router.get('/profile', (req, res) => {
    getProfile

});

module.exports = router;