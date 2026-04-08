const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/errors');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret_dev', { expiresIn: '90d' });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    res.cookie('token', token, {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    });
    user.password = undefined;
    res.status(statusCode).json({ status: 'success', token, data: { user } });
};

exports.register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        // In local development, we permit any role provisioning
        const newUser = await User.create({ name, email, password, role: role || 'Viewer' });
        createSendToken(newUser, 201, res);
    } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.comparePassword(password))) {
            return next(new AppError('Incorrect email or password', 401));
        }
        if (user.status !== 'active') {
            return next(new AppError('Account is inactive', 403));
        }

        createSendToken(user, 200, res);
    } catch (err) { next(err); }
};

exports.logout = (req, res) => {
    res.cookie('token', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    });
    res.status(200).json({ status: 'success' });
};
