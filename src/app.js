const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const path = require('path');

const env = require('./config/env');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler.middleware');
const notFound = require('./middlewares/notFound.middleware');
const { apiLimiter } = require('./middlewares/rateLimiter.middleware');

const app = express();

// --- Security & core middleware ---
app.use(helmet());
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(mongoSanitize()); // strips $ and . operators from user input to block NoSQL injection

if (env.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

app.use('/api', apiLimiter);

// Serve uploaded avatar images. NOTE: swap for a CDN/cloud bucket in
// production, since Render/Vercel filesystems are ephemeral.
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// --- Routes ---
app.use('/api/v1', routes);

// --- 404 + centralized error handling (must be last) ---
app.use(notFound);
app.use(errorHandler);

module.exports = app;
