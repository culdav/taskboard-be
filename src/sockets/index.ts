import type { Server as HttpServer } from 'node:http';
import type { Server as SocketIOServer } from 'socket.io';
import { createSocketServer } from '../config/socket';
import { registerBoardSocketHandlers } from './board.socket';

export function initializeSockets(httpServer: HttpServer): SocketIOServer {
  const io = createSocketServer(httpServer);
  registerBoardSocketHandlers(io);
  return io;
}
