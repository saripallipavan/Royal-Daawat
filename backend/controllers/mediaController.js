import Media from '../models/Media.js';

export const getMedia = async (req, res) => {
  try {
    const mediaItems = await Media.find().sort({ createdAt: -1 });
    res.status(200).json(mediaItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const postMedia = async (req, res) => {
  const { title, link, category } = req.body;
  const image = req.file ? req.file.path : null;

  try {
    const newMedia = await Media.create({ title, link, category, image });
    res.status(201).json(newMedia);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
