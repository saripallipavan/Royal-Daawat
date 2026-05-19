import mongoose from 'mongoose';

const opts = { toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: true };

const menuSchema = new mongoose.Schema({
  food_name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  image: { type: String },
  category: { type: String },
  rating: { type: Number, default: 0 },
  availability: { type: Boolean, default: true },
  dietary_preference: { type: String, enum: ['Veg', 'Non Veg'], default: 'Non Veg' }
}, opts);

export default mongoose.model('Menu', menuSchema);
