import mongoose from 'mongoose';

const opts = { toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: true };

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'Customer' }
}, opts);

export default mongoose.model('User', userSchema);
