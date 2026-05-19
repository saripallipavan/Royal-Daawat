import Settings from '../models/Settings.js';

// @desc    Get restaurant settings
// @route   GET /api/settings
// @access  Public
export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne({});
    if (!settings) {
      settings = new Settings();
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update restaurant settings
// @route   PUT /api/settings
// @access  Private/Admin
export const updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne({});
    if (!settings) {
      settings = new Settings();
    }

    const {
      restaurantName,
      phoneNumber,
      address,
      openingHours,
      googleMapsUrl,
      facebookUrl,
      instagramUrl,
      tiktokUrl
    } = req.body;

    settings.restaurantName = restaurantName !== undefined ? restaurantName : settings.restaurantName;
    settings.phoneNumber = phoneNumber !== undefined ? phoneNumber : settings.phoneNumber;
    settings.address = address !== undefined ? address : settings.address;
    settings.openingHours = openingHours !== undefined ? openingHours : settings.openingHours;
    settings.googleMapsUrl = googleMapsUrl !== undefined ? googleMapsUrl : settings.googleMapsUrl;
    settings.facebookUrl = facebookUrl !== undefined ? facebookUrl : settings.facebookUrl;
    settings.instagramUrl = instagramUrl !== undefined ? instagramUrl : settings.instagramUrl;
    settings.tiktokUrl = tiktokUrl !== undefined ? tiktokUrl : settings.tiktokUrl;

    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
