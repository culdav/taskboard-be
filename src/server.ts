import http from 'node:http';
import app from './app.js';
import { connectDb, disconnectDb } from './config/db.js';
import { env } from './config/env.js';
import { initializeSockets } from './sockets/index.js';

const httpServer = http.createServer(app);

initializeSockets(httpServer);

async function startServer(): Promise<void> {
  await connectDb();

  httpServer.listen(env.port, () => {
    console.log(`Server listening on port ${env.port}`);
  });
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
