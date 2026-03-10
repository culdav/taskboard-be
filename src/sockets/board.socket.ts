import type { Server } from 'socket.io';

export function registerBoardSocketHandlers(io: Server): void {
  io.on('connection', (socket) => {
    socket.on('board:join', () => {
      // Placeholder for board room join logic.
    });
  });
}
