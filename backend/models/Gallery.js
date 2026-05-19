import mongoose from 'mongoose';

const opts = { toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: true };

const gallerySchema = new mongoose.Schema({
  image: { type: String, required: true },
  title: { type: String },
  sortOrder: { type: Number, default: 0 }
}, opts);

export default mongoose.model('Gallery', gallerySchema);
