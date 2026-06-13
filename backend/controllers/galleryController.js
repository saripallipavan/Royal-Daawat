import Gallery from '../models/Gallery.js';
import fs from 'fs';
import path from 'path';

export const getGallery = async (req, res) => {
  try {
    const galleryItems = await Gallery.find().sort({ sortOrder: 1, createdAt: -1 });
    res.status(200).json(galleryItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const postGallery = async (req, res) => {
  const { title, subtitle, sortOrder } = req.body;
  const image = req.file ? req.file.path : null;

  if (!image) {
    return res.status(400).json({ error: 'Image is required' });
  }

  try {
    const newGallery = await Gallery.create({ 
      title, 
      subtitle: subtitle || '',
      image,
      sortOrder: sortOrder ? Number(sortOrder) : 0
    });
    res.status(201).json(newGallery);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteGallery = async (req, res) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id);
    if (!galleryItem) {
      return res.status(404).json({ error: 'Gallery item not found' });
    }

    // Try to delete physical file
    if (galleryItem.image) {
      const filePath = path.resolve(galleryItem.image);
      fs.unlink(filePath, (err) => {
        if (err) console.error('Failed to delete physical file:', err);
      });
    }

    await galleryItem.deleteOne();
    res.status(200).json({ message: 'Gallery item deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
