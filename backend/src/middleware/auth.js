const jwt = require('jsonwebtoken');
const AppError = require('../utils/errors');
const User = require('../models/User');

const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return next(new AppError('You are not logged in! Please log in.', 401));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_dev');
        const currentUser = await User.findById(decoded.id);
        
        if (!currentUser) return next(new AppError('User no longer exists.', 401));
        if (currentUser.status !== 'active') return next(new AppError('Account disabled.', 403));

        req.user = currentUser;
        next();
    } catch (err) {
        if (err.name === 'JsonWebTokenError') return next(new AppError('Invalid token.', 401));
        if (err.name === 'TokenExpiredError') return next(new AppError('Token expired.', 401));
        next(err);
    }
};

module.exports = { protect };
