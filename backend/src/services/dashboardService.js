const Record = require('../models/Record');

exports.getAnalytics = async () => {
    const [totals, categoryTotals, monthlyTrends, recentActivity] = await Promise.all([
        Record.aggregate([
            { $group: { _id: '$type', totalAmount: { $sum: '$amount' } } }
        ]),
        Record.aggregate([
            { $group: { _id: { type: '$type', category: '$category' }, totalAmount: { $sum: '$amount' } } }
        ]),
        Record.aggregate([
            {
                $group: {
                    _id: { year: { $year: "$date" }, month: { $month: "$date" }, type: "$type" },
                    totalAmount: { $sum: '$amount' }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]),
        Record.find().sort({ date: -1 }).limit(5).populate('createdBy', 'name')
    ]);

    let totalIncome = 0;
    let totalExpense = 0;
    
    totals.forEach((item) => {
        if (item._id === 'income') totalIncome = item.totalAmount;
        if (item._id === 'expense') totalExpense = item.totalAmount;
    });

    return {
        totalIncome,
        totalExpense,
        netBalance: totalIncome - totalExpense,
        categoryTotals: categoryTotals.map(t => ({ type: t._id.type, category: t._id.category, amount: t.totalAmount })),
        monthlyTrends: monthlyTrends.map(t => ({ year: t._id.year, month: t._id.month, type: t._id.type, amount: t.totalAmount })),
        recentActivity
    };
};
