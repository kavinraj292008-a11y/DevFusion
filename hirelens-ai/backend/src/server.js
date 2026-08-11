import 'dotenv/config';
import app from './app.js';
import connectDB from './config/db.js';
import dns from "dns";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

import "dotenv/config";

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`[Server] HireLens Backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`[Server Error] Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();