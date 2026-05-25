// Zero-dependency security middlewares for Royal Daawat

// 1. API Rate Limiting
const rateLimitWindow = 15 * 60 * 1000; // 15 minutes
const rateLimitMax = 300; // Max 300 requests per window per IP
const ipRequests = new Map();

export const rateLimiter = (req, res, next) => {
  // Exclude health checks from rate limiting
  if (req.path === '/health' || req.path === '/') {
    return next();
  }

  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const now = Date.now();

  if (!ipRequests.has(ip)) {
    ipRequests.set(ip, []);
  }

  const requestTimestamps = ipRequests.get(ip);
  const activeTimestamps = requestTimestamps.filter(timestamp => now - timestamp < rateLimitWindow);
  
  if (activeTimestamps.length >= rateLimitMax) {
    return res.status(429).json({
      message: 'Too many requests from this IP address. Please try again after 15 minutes.'
    });
  }

  activeTimestamps.push(now);
  ipRequests.set(ip, activeTimestamps);
  next();
};

// 2. MongoDB Query Injection Protection
const cleanObject = (obj) => {
  if (obj && typeof obj === 'object') {
    for (const key in obj) {
      if (key.startsWith('$')) {
        delete obj[key];
      } else {
        cleanObject(obj[key]);
      }
    }
  }
};

export const mongoSanitize = (req, res, next) => {
  cleanObject(req.body);
  cleanObject(req.query);
  cleanObject(req.params);
  next();
};

// 3. XSS HTML String Escaping
const sanitizeHtml = (str) => {
  if (typeof str !== 'string') return str;
  return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
};

const sanitizeObject = (obj) => {
  if (obj && typeof obj === 'object') {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = sanitizeHtml(obj[key]);
      } else if (typeof obj[key] === 'object') {
        sanitizeObject(obj[key]);
      }
    }
  }
};

export const xssProtection = (req, res, next) => {
  // We sanitize body inputs only to avoid corrupting query params or route paths
  sanitizeObject(req.body);
  next();
};
