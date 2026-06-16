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
      tiktokUrl,
      orderOnlineUrl,
      tableReservationsUrl,
      bookOnlineUrl,
      customLinks,
      signatureDishes,
      chefRecommendations,
      galleryPreviewSlides,
      popupBanners,
      activePopupOccasion
    } = req.body;

    settings.restaurantName = restaurantName !== undefined ? restaurantName : settings.restaurantName;
    settings.phoneNumber = phoneNumber !== undefined ? phoneNumber : settings.phoneNumber;
    settings.address = address !== undefined ? address : settings.address;
    settings.openingHours = openingHours !== undefined ? openingHours : settings.openingHours;
    settings.googleMapsUrl = googleMapsUrl !== undefined ? googleMapsUrl : settings.googleMapsUrl;
    settings.facebookUrl = facebookUrl !== undefined ? facebookUrl : settings.facebookUrl;
    settings.instagramUrl = instagramUrl !== undefined ? instagramUrl : settings.instagramUrl;
    settings.tiktokUrl = tiktokUrl !== undefined ? tiktokUrl : settings.tiktokUrl;
    settings.orderOnlineUrl = orderOnlineUrl !== undefined ? orderOnlineUrl : settings.orderOnlineUrl;
    settings.tableReservationsUrl = tableReservationsUrl !== undefined ? tableReservationsUrl : settings.tableReservationsUrl;
    settings.bookOnlineUrl = bookOnlineUrl !== undefined ? bookOnlineUrl : settings.bookOnlineUrl;
    settings.customLinks = customLinks !== undefined ? customLinks : settings.customLinks;
    settings.signatureDishes = signatureDishes !== undefined ? signatureDishes : settings.signatureDishes;
    settings.chefRecommendations = chefRecommendations !== undefined ? chefRecommendations : settings.chefRecommendations;
    settings.galleryPreviewSlides = galleryPreviewSlides !== undefined ? galleryPreviewSlides : settings.galleryPreviewSlides;
    settings.popupBanners = popupBanners !== undefined ? popupBanners : settings.popupBanners;
    settings.activePopupOccasion = activePopupOccasion !== undefined ? activePopupOccasion : settings.activePopupOccasion;

    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
