const userService = require('../services/userService');

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await userService.findAllUsers();
        res.status(200).json({ status: 'success', results: users.length, data: { users } });
    } catch (err) { next(err); }
};

exports.getUser = async (req, res, next) => {
    try {
        const user = await userService.findUserById(req.params.id);
        res.status(200).json({ status: 'success', data: { user } });
    } catch (err) { next(err); }
};

exports.updateUser = async (req, res, next) => {
    try {
        const user = await userService.updateUser(req.params.id, req.body);
        res.status(200).json({ status: 'success', data: { user } });
    } catch (err) { next(err); }
};

exports.deleteUser = async (req, res, next) => {
    try {
        await userService.deleteUser(req.params.id);
        res.status(204).json({ status: 'success', data: null });
    } catch (err) { next(err); }
};
