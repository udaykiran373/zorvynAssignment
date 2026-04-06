const recordService = require('../services/recordService');

exports.getAllRecords = async (req, res, next) => {
    try {
        const result = await recordService.getRecords(req.query);
        res.status(200).json({ status: 'success', data: result });
    } catch (err) { next(err); }
};

exports.getRecord = async (req, res, next) => {
    try {
        const record = await recordService.getRecordById(req.params.id);
        res.status(200).json({ status: 'success', data: { record } });
    } catch (err) { next(err); }
};

exports.createRecord = async (req, res, next) => {
    try {
        const record = await recordService.createRecord(req.body, req.user.id);
        res.status(201).json({ status: 'success', data: { record } });
    } catch (err) { next(err); }
};

exports.updateRecord = async (req, res, next) => {
    try {
        const record = await recordService.updateRecord(req.params.id, req.body);
        res.status(200).json({ status: 'success', data: { record } });
    } catch (err) { next(err); }
};

exports.deleteRecord = async (req, res, next) => {
    try {
        await recordService.softDeleteRecord(req.params.id);
        res.status(204).json({ status: 'success', data: null });
    } catch (err) { next(err); }
};
