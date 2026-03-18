import http from 'node:http';
import app from './app';
import { connectDb, disconnectDb } from './config/db';
import { env } from './config/env';
import { initializeSockets } from './sockets/index';
import mongoose from 'mongoose';

const httpServer = http.createServer(app);

initializeSockets(httpServer);

async function startServer(): Promise<void> {
  mongoose.connection.once('open', () => {
    console.log('MongoDB connection is open. Starting server...');
    httpServer.listen(env.port, () => {
      console.log(`Server listening on port ${env.port}`);
    });
  });

  await connectDb();
}

async function shutdown(signal: NodeJS.Signals): Promise<void> {
  console.log(`Received ${signal}. Shutting down...`);

  httpServer.close(async () => {
    await disconnectDb();
    process.exit(0);
  });
}

process.on('SIGINT', () => {
  void shutdown('SIGINT');
});

process.on('SIGTERM', () => {
  void shutdown('SIGTERM');
});

startServer().catch((error) => {
  console.error('Server startup failed:', error);
  process.exit(1);
});
