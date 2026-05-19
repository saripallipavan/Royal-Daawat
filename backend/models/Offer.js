import mongoose from 'mongoose';

const opts = { toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: true };

const offerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  discount_percentage: { type: Number },
  expiry_date: { type: Date }, // Keeping for backward compatibility
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  active: { type: Boolean, default: true },
  image: { type: String }
}, opts);

export default mongoose.model('Offer', offerSchema);
