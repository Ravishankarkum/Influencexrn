import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true }, // ✅ added
    email: { type: String, required: true, unique: true, lowercase: true }, // ✅ lowercase
    password: { type: String, required: true },
    role: { type: String, enum: ['brand', 'influencer'], required: true, default: 'influencer' }, // ✅ default (optional)
}, { timestamps: true });

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); // ✅ added return
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
export default User;
