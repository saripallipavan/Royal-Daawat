import ContactMessage from '../models/ContactMessage.js';
import Notification from '../models/Notification.js';

export const getContact = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const postContact = async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email and message are required' });
  }

  try {
    const newMsg = await ContactMessage.create({ name, email, phone, message });

    // Create admin notification
    try {
      const adminNotif = new Notification({
        title: 'New Contact Message',
        message: `New message from ${name} (${email}).`,
        userType: 'Admin'
      });
      await adminNotif.save();
    } catch (notifErr) {
      console.error('Failed to create admin notification for contact message:', notifErr);
    }

    res.status(201).json(newMsg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
