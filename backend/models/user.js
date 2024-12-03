const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
    userId: { type: Number, unique: true },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' }, 
    createdAt: { type: Date, default: Date.now },
    address:{ type: String},
    contact:{ type: String}
});

userSchema.plugin(AutoIncrement, { inc_field: 'userId', start_seq: 1 });
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
