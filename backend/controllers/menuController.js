import Menu from '../models/Menu.js';

export const getMenu = async (req, res) => {
  try {
    const menuItems = await Menu.find();
    res.status(200).json(menuItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const postMenu = async (req, res) => {
  const { food_name, price, description, category, rating, availability, dietary_preference } = req.body;
  const image = req.file ? `uploads/${req.file.filename}` : null;

  try {
    const newMenu = await Menu.create({ 
      food_name, price, description, image, category, rating, availability, dietary_preference 
    });
    res.status(201).json(newMenu);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const putMenu = async (req, res) => {
  const { id } = req.params;
  const { food_name, price, description, category, rating, availability, dietary_preference } = req.body;
  const image = req.file ? `uploads/${req.file.filename}` : undefined;

  try {
    const updateData = { food_name, price, description, category, rating, availability, dietary_preference };
    if (image !== undefined) updateData.image = image;

    const updatedMenu = await Menu.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!updatedMenu) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    res.status(200).json(updatedMenu);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteMenu = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedMenu = await Menu.findByIdAndDelete(id);
    if (!deletedMenu) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    res.status(200).json({ message: 'Menu item deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
