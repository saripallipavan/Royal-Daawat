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
  const { title, subtitle, sortOrder, image } = req.body;
  const finalImage = req.file ? `uploads/${req.file.filename}` : image;

  if (!finalImage) {
    return res.status(400).json({ error: 'Image is required' });
  }

  try {
    const newGallery = await Gallery.create({ 
      title, 
      subtitle: subtitle || '',
      image: finalImage,
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
    if (galleryItem.image && !galleryItem.image.startsWith('data:')) {
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

export const putGallery = async (req, res) => {
  const { id } = req.params;
  const { title, subtitle, sortOrder, image } = req.body;
  const finalImage = req.file ? `uploads/${req.file.filename}` : image;

  try {
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (subtitle !== undefined) updateData.subtitle = subtitle;
    if (sortOrder !== undefined) updateData.sortOrder = sortOrder ? Number(sortOrder) : 0;
    if (finalImage !== undefined) {
      // Find the old one first to delete the old physical file if a new image is uploaded
      if (finalImage && !finalImage.startsWith('data:')) {
        const oldItem = await Gallery.findById(id);
        if (oldItem && oldItem.image && !oldItem.image.startsWith('data:')) {
          const filePath = path.resolve(oldItem.image);
          fs.unlink(filePath, (err) => {
            if (err) console.error('Failed to delete physical file during update:', err);
          });
        }
      }
      updateData.image = finalImage;
    }

    const updatedGallery = await Gallery.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!updatedGallery) {
      return res.status(404).json({ error: 'Gallery item not found' });
    }
    res.status(200).json(updatedGallery);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
