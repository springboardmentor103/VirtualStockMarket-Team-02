const express = require('express');
const router = express.Router();
const user = require('../Models/User');
const { body, validationResult } = require('express-validator');
const otp=require('otp-generator');
const nodemailer=require('nodemailer');

const otpgenerate=()=>{
    return otp.generate(6);
}
const transporter = nodemailer.createTransport({
    service:'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.USER,
        pass: process.env.APP_PASSWORD
    }
});
router.post('/otpgenerate',
[
    body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid Email format')
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
            const EmailExists = await user.findOne({ email:req.body.email });
            if (!EmailExists) {
                return res.status(400).json({ success: false, message: { email: ['Use the email used for creating the account.'] } });
            }
            const otpValue = otpgenerate();
            const sendemail=await transporter.sendMail({
                from: process.env.USER,
                to: req.body.email,
                subject: 'Your OTP for Verification',
                text: `Your OTP is: ${otpValue}`
            });
            await user.updateOne({ email:req.body.email }, { otp: otpValue });

            res.status(200).json({ success: true, message: {result:['OTP sent successfully.']} });
        } catch (error) {
            console.error('Error sending OTP:', error);
            res.status(500).json({ success: false, message: {error:['Failed to send OTP.']},error });
        }
        





        
})
module.exports = router;