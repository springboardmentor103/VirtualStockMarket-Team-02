const express = require('express');
const router = express.Router();
const user = require('../Models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken');

router.post('/loginuser',
[
    body('username', 'Username must be at least 3 characters long').isLength({ min: 3 }),
    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success:false, message: errors.array()[0].msg });
        }
        const { username, password } = req.body;
        try {
            
            const userData = await user.findOne({ username });
            
            
            if (!userData) {
                return res.status(400).json({ success: false, message: 'Username Invalid' });
            }

            const isMatch = await bcrypt.compare(password, userData.password);
            
            if (!isMatch) {
                return res.status(400).json({ success: false,message: 'password Invalid' });
            }
            const tokenid={
                _id:userData._id,
                username:userData.username,
                password:userData.password
            }
            
            const authToken = jwt.sign(tokenid,process.env.SECRET,{expiresIn:'4h'}); 
            return res.json({ success: true, authToken });
        } catch (error) {
            console.error(error);
            res.status(500).send('Server Error');
        }
    });

module.exports = router;
