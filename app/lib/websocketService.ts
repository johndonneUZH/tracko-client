
import { Client, IFrame, IMessage, Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { getApiDomain } from "@/utils/domain";

type WebSocketMessage = {
  deletedId?: string;
  ideaId?: string;
  [key: string]: unknown;
};

let stompClient: Client | null = null;

export const connectWebSocket = (
  userId: string,
  projectId: string,
  onMessage: (message: WebSocketMessage) => void
): Client => {
  if (stompClient) {
    disconnectWebSocket();
  }
  const socket = new SockJS(`${getApiDomain()}/ws`);
  const token = sessionStorage.getItem('token') || '';

  stompClient = new Client({
    webSocketFactory: () => socket,
    connectHeaders: {
      Authorization: `Bearer ${token}`,
      userId: userId
    },
    debug: (str: string) => console.log('STOMP:', str),
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
  });

  stompClient.onConnect = () => {
    console.log('Connected to WebSocket');
    
    // Subscribe to project-specific topic
    stompClient?.subscribe(`/topic/projects/${projectId}/ideas`, (message: IMessage) => {
      try {
        const parsedMessage = JSON.parse(message.body) as WebSocketMessage;
        onMessage(parsedMessage);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });

  };

  stompClient.onStompError = (frame: IFrame) => {
    console.error('STOMP error:', frame.headers.message);
    console.error('Additional details:', frame.body);
  };

  stompClient.onWebSocketError = (event: Event) => {
    console.error('WebSocket error:', event);
  };

  stompClient.onDisconnect = () => {
    console.log('Disconnected from WebSocket');
  };

  stompClient.activate();
  return stompClient;
};

export const disconnectWebSocket = (): void => {
  if (stompClient) {
    stompClient.deactivate().then(() => {
      console.log('WebSocket client deactivated');
      stompClient = null;
    });
  }
};

export const sendMessage = <T>(destination: string, body: T): Promise<boolean> => {
  return new Promise((resolve) => {
    if (!stompClient || !stompClient.connected) {
      console.error('STOMP client not connected');
      resolve(false);
      return;
    }

    try {
      stompClient.publish({
        destination: `/app${destination}`, // Note the /app prefix
        body: JSON.stringify(body),
        headers: {
          'content-type': 'application/json'
        }
      });
      resolve(true);
    } catch (error) {
      console.error('Error sending message:', error);
      resolve(false);
    }
  });
};