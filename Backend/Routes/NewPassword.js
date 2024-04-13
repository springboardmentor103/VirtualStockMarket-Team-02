const express = require('express');
const router = express.Router();
const user = require('../Models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

router.post('/newpassword',
[
    body('email').isEmail()
        .withMessage('Invalid email'),
    body('password').notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character').trim(),
    body('confirmpassword').notEmpty().withMessage('Confirm Password is required')
        .isLength({ min: 8 }).withMessage('Confirm Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .withMessage('Confirm Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character').trim()
    

],
    async (req, res) => {
        try {
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
            if (req.body.password!==req.body.confirmpassword) {
                return res.status(400).json({success:false,message:[{password:['password and confirm password are not equal.']},{confirmpassword:['password and confirm password are not equal.']}]})
            }
        
        
        
            const existemail=await user.findOne({email:req.body.email})
            if(!existemail){
               return res.status(400).json({success:false,message:[{email:['email is not exist.']}]})
            }
            const passwordMatch = await bcrypt.compare(req.body.password, existemail.password);
            if (passwordMatch) {
                return res.status(400).json({ success: false, message: [{ password: 'This password already exists. Try new one.' }] });
            }
            const salt=await bcrypt.genSalt(10);
            let secpassword=await bcrypt.hash(req.body.password,salt);
            await user.updateOne({ password:existemail.password }, { password:secpassword });
            res.status(200).json({ success: true, message: 'Password updated successfully.' });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ success: false, message: 'Internal server error.' });
        }

})
module.exports = router;
