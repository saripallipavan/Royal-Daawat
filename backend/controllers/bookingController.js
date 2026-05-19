import Booking from '../models/Booking.js';
import Notification from '../models/Notification.js';
import { sendEmail } from '../utils/emailService.js';

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Public
export const createBooking = async (req, res) => {
  try {
    const { site, guestCount, bookingDate, duration, bookingTime, title, firstName, lastName, email, phone, specialRequest } = req.body;

    const booking = new Booking({
      site, guestCount, bookingDate, duration, bookingTime, title, firstName, lastName, email, phone, specialRequest
    });

    const createdBooking = await booking.save();

    // Create admin notification
    try {
      const adminNotif = new Notification({
        title: 'New Booking Request',
        message: `New booking request from ${title} ${firstName} ${lastName} for ${guestCount} guests on ${bookingDate} at ${bookingTime}.`,
        userType: 'Admin'
      });
      await adminNotif.save();
    } catch (notifErr) {
      console.error('Failed to create admin notification for booking:', notifErr);
    }

    // Send customer email
    try {
      await sendEmail({
        to: email,
        subject: 'We received your booking request',
        text: `Dear ${title} ${firstName} ${lastName},\n\nWe have received your booking request for ${guestCount} guest(s) on ${bookingDate} at ${bookingTime}.\n\nOur team is reviewing your request and we will send you a confirmation shortly.\n\nWarm regards,\nRoyal Daawat`
      });
    } catch (emailErr) {
      console.error('Failed to send booking request email to customer:', emailErr);
    }

    res.status(201).json(createdBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({}).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id
// @access  Private/Admin
export const updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (booking) {
      const oldStatus = booking.status;
      const newStatus = req.body.status || booking.status;
      
      booking.status = newStatus;
      const updatedBooking = await booking.save();

      // Trigger email notification if status changed
      if (oldStatus !== newStatus) {
        try {
          let emailSubject = '';
          let emailText = '';

          if (newStatus === 'Approved') {
            emailSubject = 'Your table has been confirmed';
            emailText = `Dear ${booking.title} ${booking.firstName} ${booking.lastName},\n\nYour table reservation for ${booking.guestCount} guest(s) on ${booking.bookingDate} at ${booking.bookingTime} has been confirmed!\n\nWe look forward to welcoming you to Royal Daawat.\n\nWarm regards,\nRoyal Daawat`;
          } else if (newStatus === 'Rejected') {
            emailSubject = 'Selected slot unavailable';
            emailText = `Dear ${booking.title} ${booking.firstName} ${booking.lastName},\n\nWe regret to inform you that the selected slot on ${booking.bookingDate} at ${booking.bookingTime} is currently unavailable.\n\nPlease feel free to make another reservation on our website or call us directly.\n\nWarm regards,\nRoyal Daawat`;
          } else if (newStatus === 'Rescheduled') {
            emailSubject = 'Booking Rescheduled';
            emailText = `Dear ${booking.title} ${booking.firstName} ${booking.lastName},\n\nYour booking slot has been rescheduled to ${booking.bookingDate} at ${booking.bookingTime}.\n\nPlease contact us if you need further adjustments.\n\nWarm regards,\nRoyal Daawat`;
          }

          if (emailSubject) {
            await sendEmail({
              to: booking.email,
              subject: emailSubject,
              text: emailText
            });
          }
        } catch (emailErr) {
          console.error('Failed to send status update email to customer:', emailErr);
        }
      }

      res.json(updatedBooking);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private/Admin
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (booking) {
      await booking.deleteOne();
      res.json({ message: 'Booking removed' });
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
