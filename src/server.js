const dns = require('dns');
const app = require('./app');
const env = require('./config/env');
const connectDB = require('./config/db');

// Some ISPs (notably several in India) don't resolve DNS SRV records
// correctly for Node's default resolver, even though `nslookup` on the same
// machine works fine — this breaks the mongodb+srv:// connection string.
// Pointing Node explicitly at Google's DNS sidesteps that without requiring
// an OS-level DNS change. Harmless to leave in even once it's not needed.
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Catch synchronous programmer errors that happen outside Express's
// request/response cycle (e.g. bad top-level code) before anything else runs.
process.on('uncaughtException', (err) => {
  // eslint-disable-next-line no-console
  console.error('UNCAUGHT EXCEPTION 💥 Shutting down...');
  // eslint-disable-next-line no-console
  console.error(err.name, err.message);
  process.exit(1);
});

connectDB();

const server = app.listen(env.port, () => {
  // eslint-disable-next-line no-console
  console.log(`[server] Running in ${env.nodeEnv} mode on port ${env.port}`);
});

// Catch unhandled promise rejections (e.g. a failed DB call not wrapped in
// catchAsync) and shut down gracefully instead of leaving the process in a
// corrupted state.
process.on('unhandledRejection', (err) => {
  // eslint-disable-next-line no-console
  console.error('UNHANDLED REJECTION 💥 Shutting down...');
  // eslint-disable-next-line no-console
  console.error(err.name, err.message);
  server.close(() => process.exit(1));
});
