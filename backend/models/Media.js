import mongoose from 'mongoose';

const opts = { toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: true };

const mediaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  link: { type: String },
  category: { type: String },
  image: { type: String }
}, opts);

export default mongoose.model('Media', mediaSchema);
