const User = require('../models/User');
const AppError = require('../utils/errors');

exports.findAllUsers = async () => {
    return await User.find().select('-password');
};

exports.findUserById = async (id) => {
    const user = await User.findById(id).select('-password');
    if (!user) throw new AppError('No user found with that ID', 404);
    return user;
};

exports.updateUser = async (id, data) => {
    if (data.password) throw new AppError('This route is not for password updates.', 400);

    const user = await User.findByIdAndUpdate(id, data, { new: true, runValidators: true }).select('-password');
    if (!user) throw new AppError('No user found with that ID', 404);
    return user;
};

exports.deleteUser = async (id) => {
    const user = await User.findByIdAndDelete(id);
    if (!user) throw new AppError('No user found with that ID', 404);
    return user;
};
