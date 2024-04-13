const express = require('express');
const router = express.Router();
const user = require('../Models/User');
const { body, validationResult } = require('express-validator');


router.post('/otpmatching',
[
    body('otp').notEmpty().withMessage('otp is required')
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = {};
            errors.array().forEach(error => {
                if (!errorMessages[error.path]) {
                   errorMessages[error.path] = [];
                }
                errorMessages[error.path].push(error.msg);
            });
            return res.status(400).json({ success:false,message:errorMessages});
        }
        try {
            const otpExists = await user.findOne({ otp:req.body.otp });
            if (!otpExists) {
                return res.status(400).json({ success: false, message: { email: ['Enter the correct otp received in you email.'] } });
            }
            await user.updateOne({ otp:req.body.otp }, { otp: null });
            res.status(200).json({ success: true, message: 'OTP matches successfully continue to create new password.' });
        } catch (error) {
            console.error('Error matching OTP:', error);
            res.status(500).json({ success: false, message: 'Failed to match OTP.',error });
        }
        





        
})
module.exports = router;