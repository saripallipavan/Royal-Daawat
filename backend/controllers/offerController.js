import Offer from '../models/Offer.js';

export const getOffers = async (req, res) => {
  try {
    const offers = await Offer.find().sort({ createdAt: -1 });
    res.status(200).json(offers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const postOffer = async (req, res) => {
  const { title, description, discount_percentage, expiry_date, startDate, endDate, active, link } = req.body;
  const image = req.file ? `uploads/${req.file.filename}` : null;

  try {
    const newOffer = await Offer.create({ 
      title, description, discount_percentage, expiry_date, startDate, endDate, active, image, link 
    });
    res.status(201).json(newOffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const putOffer = async (req, res) => {
  const { id } = req.params;
  const { title, description, discount_percentage, expiry_date, startDate, endDate, active, link } = req.body;
  const updateData = { title, description, discount_percentage, expiry_date, startDate, endDate, active, link };
  
  if (req.file) {
    updateData.image = `uploads/${req.file.filename}`;
  }

  try {
    const updatedOffer = await Offer.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedOffer) {
      return res.status(404).json({ error: 'Offer not found' });
    }
    res.status(200).json(updatedOffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteOffer = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedOffer = await Offer.findByIdAndDelete(id);
    if (!deletedOffer) {
      return res.status(404).json({ error: 'Offer not found' });
    }
    res.status(200).json({ message: 'Offer deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
