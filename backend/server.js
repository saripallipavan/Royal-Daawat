import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import mediaRoutes from './routes/mediaRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import offerRoutes from './routes/offerRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import connectDB from './config/db.js';
import { rateLimiter, mongoSanitize, xssProtection } from './middleware/security.js';
import User from './models/User.js';
import bcrypt from 'bcrypt';
import Settings from './models/Settings.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

const seedAdminUser = async () => {
  try {
    const adminCount = await User.countDocuments({ role: 'Admin' });
    if (adminCount === 0) {
      console.log('No admin accounts found in database. Auto-seeding default admin...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      await User.create({
        name: 'Admin Owner',
        email: 'admin@royaldaawat.com',
        password: hashedPassword,
        role: 'Admin'
      });
      console.log('Default admin account seeded successfully: admin@royaldaawat.com / admin123');
    }
  } catch (err) {
    console.error('Failed to auto-seed default admin user:', err);
  }
};

const cleanDatabaseDefaultImages = async () => {
  try {
    const settings = await Settings.findOne({});
    if (settings) {
      let modified = false;
      if (settings.heroImages && settings.heroImages.length > 0) {
        const filteredHero = settings.heroImages.filter(img => !img.startsWith('https://images.unsplash.com/photo-'));
        if (filteredHero.length !== settings.heroImages.length) {
          settings.heroImages = filteredHero;
          modified = true;
        }
      }
      if (settings.aboutImages && settings.aboutImages.length > 0) {
        const filteredAbout = settings.aboutImages.filter(img => !img.startsWith('https://images.unsplash.com/photo-'));
        if (filteredAbout.length !== settings.aboutImages.length) {
          settings.aboutImages = filteredAbout;
          modified = true;
        }
      }
      if (modified) {
        await settings.save();
        console.log('Cleaned up legacy default Unsplash images from settings database record.');
      }
    }
  } catch (err) {
    console.error('Failed to clean database default images:', err);
  }
};

connectDB().then(() => {
  seedAdminUser();
  cleanDatabaseDefaultImages();
});

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(rateLimiter);
app.use(mongoSanitize);
app.use(xssProtection);

// Serve Static Files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/', authRoutes);
app.use('/menu', menuRoutes);
app.use('/gallery', galleryRoutes);
app.use('/media', mediaRoutes);
app.use('/bookings', bookingRoutes);
app.use('/contact', contactRoutes);
app.use('/offers', offerRoutes);
app.use('/settings', settingsRoutes);
app.use('/notifications', notificationRoutes);

app.get('/health', (req, res) => {
  res.json({ message: 'Royal Daawat API is running successfully.' });
});
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Royal Daawat Backend Running Successfully 🚀"
  });
});
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(err.status || 400).json({
    message: typeof err === 'string' ? err : err.message || 'An unexpected error occurred'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
