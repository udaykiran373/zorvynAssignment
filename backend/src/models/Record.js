const mongoose = require('mongoose');

const RecordSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    category: { type: String, required: true, index: true },
    date: { type: Date, default: Date.now, required: true, index: true },
    notes: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isDeleted: { type: Boolean, default: false } // Soft delete flag
}, { timestamps: true });

// Text indexing for fast search by keyword
RecordSchema.index({ notes: 'text', category: 'text' });

// Query middleware to automatically exclude soft deleted records
RecordSchema.pre(/^find/, function(next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});

module.exports = mongoose.model('Record', RecordSchema);
