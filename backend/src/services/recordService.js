const Record = require('../models/Record');
const AppError = require('../utils/errors');

exports.createRecord = async (data, userId) => {
    return await Record.create({ ...data, createdBy: userId });
};

exports.getRecords = async (query) => {
    // Pagination
    const page = query.page * 1 || 1;
    const limit = query.limit * 1 || 10;
    const skip = (page - 1) * limit;

    let filter = {};

    // Search by keyword using text index (notes, category)
    if (query.search) {
        filter.$text = { $search: query.search };
    }

    if (query.category) filter.category = query.category;
    if (query.type) filter.type = query.type;

    // Date range
    if (query.startDate || query.endDate) {
        filter.date = {};
        if (query.startDate) filter.date.$gte = new Date(query.startDate);
        if (query.endDate) filter.date.$lte = new Date(query.endDate);
    }

    const records = await Record.find(filter)
        .populate('createdBy', 'name email role')
        .skip(skip)
        .limit(limit)
        .sort({ date: -1 });

    const total = await Record.countDocuments(filter);

    return {
        records,
        pagination: {
            total,
            page,
            pages: Math.ceil(total / limit)
        }
    };
};

exports.getRecordById = async (id) => {
    const record = await Record.findById(id).populate('createdBy', 'name email');
    if (!record) throw new AppError('Record not found', 404);
    return record;
};

exports.updateRecord = async (id, data) => {
    const record = await Record.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!record) throw new AppError('Record not found', 404);
    return record;
};

exports.softDeleteRecord = async (id) => {
    const record = await Record.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
    if (!record) throw new AppError('Record not found', 404);
    return record;
};
