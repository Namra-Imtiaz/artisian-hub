const User = require("../models/User");
const bcrypt = require('bcryptjs');
const { sanitizeUser } = require("../utils/SanitizeUser");
const { generateToken } = require("../utils/GenerateToken");
const PasswordResetToken = require("../models/PasswordResetToken");

exports.signup = async (req, res) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        
        // If user already exists
        if (existingUser) {
            return res.status(400).json({ "message": "User already exists" });
        }

        // Hashing the password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashedPassword;

        // Creating new user
        const createdUser = new User(req.body);
        await createdUser.save();

        // Getting secure user info
        const secureInfo = sanitizeUser(createdUser);

        // Generating JWT token
        const token = generateToken(secureInfo);

        // Sending JWT token in the response cookies
        res.cookie('token', token, {
            sameSite: process.env.PRODUCTION === 'true' ? "None" : 'Lax',
            maxAge: new Date(Date.now() + (parseInt(process.env.COOKIE_EXPIRATION_DAYS * 24 * 60 * 60 * 1000))),
            httpOnly: true,
            secure: process.env.PRODUCTION === 'true'
        });

        res.status(201).json(sanitizeUser(createdUser));

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error occurred during signup, please try again later" });
    }
};

exports.login = async (req, res) => {
    try {
        // Checking if user exists
        const existingUser = await User.findOne({ email: req.body.email });

        // If exists and password matches the hash
        if (existingUser && (await bcrypt.compare(req.body.password, existingUser.password))) {
            // Getting secure user info
            const secureInfo = sanitizeUser(existingUser);

            // Generating JWT token
            const token = generateToken(secureInfo);

            // Sending JWT token in the response cookies
            res.cookie('token', token, {
                sameSite: process.env.PRODUCTION === 'true' ? "None" : 'Lax',
                maxAge: new Date(Date.now() + (parseInt(process.env.COOKIE_EXPIRATION_DAYS * 24 * 60 * 60 * 1000))),
                httpOnly: true,
                secure: process.env.PRODUCTION === 'true'
            });
            return res.status(200).json(sanitizeUser(existingUser));
        }

        res.clearCookie('token');
        return res.status(404).json({ message: "Invalid Credentials" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Some error occurred while logging in, please try again later' });
    }
};

// Removed verifyOtp and resendOtp functions as they are no longer needed

exports.forgotPassword = async (req, res) => {
    let newToken;
    try {
        // Check if user provided email exists
        const isExistingUser = await User.findOne({ email: req.body.email });

        // If email does not exist, return a 404 response
        if (!isExistingUser) {
            return res.status(404).json({ message: "Provided email does not exist" });
        }

        await PasswordResetToken.deleteMany({ user: isExistingUser._id });

        // Generate a password reset token
        const passwordResetToken = generateToken(sanitizeUser(isExistingUser), true);

        // Hash the token
        const hashedToken = await bcrypt.hash(passwordResetToken, 10);

        // Save hashed token in PasswordResetToken collection
        newToken = new PasswordResetToken({
            user: isExistingUser._id,
            token: hashedToken,
            expiresAt: Date.now() + parseInt(process.env.OTP_EXPIRATION_TIME)
        });
        await newToken.save();

        // Send the password reset link to the user's email
        await sendMail(isExistingUser.email, 'Password Reset Link', `<p>Click the following link to reset your password: <a href=${process.env.ORIGIN}/reset-password/${isExistingUser._id}/${passwordResetToken}>Reset Password</a></p>`);

        res.status(200).json({ message: `Password reset link sent to ${isExistingUser.email}` });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error occurred while sending password reset mail' });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        // Check if user exists
        const isExistingUser = await User.findById(req.body.userId);

        // If user does not exist, return a 404 response
        if (!isExistingUser) {
            return res.status(404).json({ message: "User does not exist" });
        }

        // Fetch the reset password token by userId
        const isResetTokenExisting = await PasswordResetToken.findOne({ user: isExistingUser._id });

        // If token does not exist, return a 404 response
        if (!isResetTokenExisting) {
            return res.status(404).json({ message: "Reset link is not valid" });
        }

        // If token has expired, delete it and respond accordingly
        if (isResetTokenExisting.expiresAt < new Date()) {
            await PasswordResetToken.findByIdAndDelete(isResetTokenExisting._id);
            return res.status(404).json({ message: "Reset link has expired" });
        }

        // If token matches and is not expired, reset the user password
        if (await bcrypt.compare(req.body.token, isResetTokenExisting.token)) {
            await PasswordResetToken.findByIdAndDelete(isResetTokenExisting._id);
            await User.findByIdAndUpdate(isExistingUser._id, { password: await bcrypt.hash(req.body.password, 10) });
            return res.status(200).json({ message: "Password updated successfully" });
        }

        return res.status(404).json({ message: "Reset link has expired" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error occurred while resetting the password, please try again later" });
    }
};

exports.logout = async (req, res) => {
    try {
        res.cookie('token', '', { maxAge: 0, sameSite: process.env.PRODUCTION === 'true' ? "None" : 'Lax', httpOnly: true, secure: process.env.PRODUCTION === 'true' });
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.log(error);
    }
};

exports.checkAuth = async (req, res) => {
    try {
        if (req.user) {
            const user = await User.findById(req.user._id);
            return res.status(200).json(sanitizeUser(user));
        }
        res.sendStatus(401);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
};
