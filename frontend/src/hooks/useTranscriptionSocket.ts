import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface TranscriptionUpdate {
  trackId: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  midiUrl?: string;
  timestamp: string;
}

export function useTranscriptionSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [lastUpdate, setLastUpdate] = useState<TranscriptionUpdate | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    // Подключаемся к пространству имен /transcription
    const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:8000/transcription', {
      auth: { token },
      transports: ['websocket'],
    });

    socketInstance.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socketInstance.on('transcription_status_update', (data: TranscriptionUpdate) => {
      console.log('Received update:', data);
      setLastUpdate(data);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return { socket, lastUpdate };
}