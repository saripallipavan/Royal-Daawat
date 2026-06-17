import mongoose from 'mongoose';

const settingsSchema = mongoose.Schema({
  restaurantName: { type: String, default: 'Royal Daawat' },
  phoneNumber: { type: String, default: '+01425 476563' },
  address: { type: String, default: '14 Market Pl, Ringwood BH24 1AW' },
  openingHours: { type: String, default: 'Monday – Sunday : 05 PM – 11 PM' },
  googleMapsUrl: { type: String, default: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2516.3268800985556!2d-1.7946950232497645!3d50.84351336154673!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4873998f804597b9%3A0xe53bcbeab7d73010!2s14%20Market%20Pl%2C%20Ringwood%20BH24%201AW%2C%20UK!5e0!3m2!1sen!2sus!4v1715844857416!5m2!1sen!2sus' },
  facebookUrl: { type: String, default: 'https://www.facebook.com/people/Royal-Daawat/61565689980459/?mibextid=LQQJ4d&rdid=hgQhiVuThkWuTs0e&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1kUkV4EWVqiogDHF%2F%3Fmibextid%3DLQQJ4d' },
  instagramUrl: { type: String, default: 'https://www.instagram.com/royaldaawatuk/?igsh=MXUwODF4dmpnNmthNA%3D%3D#' },
  tiktokUrl: { type: String, default: 'https://www.tiktok.com/@royaldaawatuk' },
  orderOnlineUrl: { type: String, default: '' },
  tableReservationsUrl: { type: String, default: '' },
  bookOnlineUrl: { type: String, default: '' },
  giftCardPurchaseUrl: { type: String, default: '' },
  customLinks: [
    {
      label: { type: String, default: '' },
      url: { type: String, default: '' }
    }
  ],
  signatureDishes: [
    {
      name: { type: String, default: '' },
      price: { type: String, default: '' },
      desc: { type: String, default: '' },
      img: { type: String, default: '' }
    }
  ],
  chefRecommendations: [
    {
      name: { type: String, default: '' },
      desc: { type: String, default: '' },
      img: { type: String, default: '' }
    }
  ],
  galleryPreviewSlides: [
    {
      title: { type: String, default: '' },
      subtitle: { type: String, default: '' },
      desc: { type: String, default: '' },
      img: { type: String, default: '' }
    }
  ],
  popupBanners: {
    festive: {
      title: { type: String, default: '' },
      description: { type: String, default: '' },
      img: { type: String, default: '' },
      link: { type: String, default: '' },
      buttonText: { type: String, default: 'Learn More' }
    },
    slowDay: {
      title: { type: String, default: '' },
      description: { type: String, default: '' },
      img: { type: String, default: '' },
      link: { type: String, default: '' },
      buttonText: { type: String, default: 'Learn More' }
    },
    firstTime: {
      title: { type: String, default: '' },
      description: { type: String, default: '' },
      img: { type: String, default: '' },
      link: { type: String, default: '' },
      buttonText: { type: String, default: 'Learn More' }
    },
    catering: {
      title: { type: String, default: '' },
      description: { type: String, default: '' },
      img: { type: String, default: '' },
      link: { type: String, default: '' },
      buttonText: { type: String, default: 'Learn More' }
    },
    operational: {
      title: { type: String, default: '' },
      description: { type: String, default: '' },
      img: { type: String, default: '' },
      link: { type: String, default: '' },
      buttonText: { type: String, default: 'Learn More' }
    }
  },
  heroImages: {
    type: [String],
    default: [
      "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&q=80&w=1600",
      "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1600"
    ]
  },
  activePopupOccasion: { type: String, default: 'none' }
}, { timestamps: true });

const Settings = mongoose.model('Settings', settingsSchema);

export default Settings;
