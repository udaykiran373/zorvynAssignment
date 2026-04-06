const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['Viewer', 'Analyst', 'Admin'], default: 'Viewer' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.methods.comparePassword = async function(candidate) {
    return await bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', UserSchema);
