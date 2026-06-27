import Media from '../models/Media.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getMedia = async (req, res) => {
  try {
    const mediaItems = await Media.find().sort({ createdAt: -1 });
    res.status(200).json(mediaItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const postMedia = async (req, res) => {
  const { title, link, category, image } = req.body;
  const finalImage = req.file ? `uploads/${req.file.filename}` : image;

  try {
    const newMedia = await Media.create({ title, link, category, image: finalImage });
    res.status(201).json(newMedia);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const putMedia = async (req, res) => {
  const { id } = req.params;
  const { title, link, category, image } = req.body;
  const updateData = {};
  if (title !== undefined) updateData.title = title;
  if (link !== undefined) updateData.link = link;
  if (category !== undefined) updateData.category = category;

  const finalImage = req.file ? `uploads/${req.file.filename}` : image;
  if (finalImage !== undefined) {
    // If the old one had a physical file, we can try to clean it up
    if (finalImage && !finalImage.startsWith('data:')) {
      try {
        const oldItem = await Media.findById(id);
        if (oldItem && oldItem.image && !oldItem.image.startsWith('data:')) {
          const filePath = path.join(__dirname, '..', oldItem.image);
          fs.unlink(filePath, (err) => {
            if (err) console.error('Failed to delete physical media file:', err);
          });
        }
      } catch (err) {
        console.error('Failed to clean up old media file:', err);
      }
    }
    updateData.image = finalImage;
  }

  try {
    const updatedMedia = await Media.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedMedia) {
      return res.status(404).json({ error: 'Media item not found' });
    }
    res.status(200).json(updatedMedia);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteMedia = async (req, res) => {
  const { id } = req.params;
  try {
    const mediaItem = await Media.findById(id);
    if (!mediaItem) {
      return res.status(404).json({ error: 'Media item not found' });
    }

    if (mediaItem.image && !mediaItem.image.startsWith('data:')) {
      const filePath = path.join(__dirname, '..', mediaItem.image);
      fs.unlink(filePath, (err) => {
        if (err) console.error('Failed to delete physical media file:', err);
      });
    }

    await mediaItem.deleteOne();
    res.status(200).json({ message: 'Media item deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
