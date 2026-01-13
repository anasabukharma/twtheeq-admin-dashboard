import { io, Socket } from 'socket.io-client';

const BACKEND_URL = 'https://qa-data-center.com';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(BACKEND_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
      console.log('[Socket] Connected to backend');
    });

    socket.on('disconnect', () => {
      console.log('[Socket] Disconnected from backend');
    });

    socket.on('connect_error', (error) => {
      console.error('[Socket] Connection error:', error);
    });
  }

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
