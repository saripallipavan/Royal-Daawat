import mongoose from 'mongoose';

const bookingSchema = mongoose.Schema({
  site: { type: String, default: 'Royal Daawat' },
  guestCount: { type: String, required: true },
  bookingDate: { type: String, required: true },
  duration: { type: String, default: '02:30' },
  bookingTime: { type: String, required: true },
  title: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  specialRequest: { type: String, default: '' },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected', 'Rescheduled'], default: 'Pending' }
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
