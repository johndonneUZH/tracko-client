
import { Client, IFrame, IMessage } from '@stomp/stompjs';
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
  if (stompClient && stompClient.connected) {
    return stompClient;
  }

  const socket = new SockJS(`${getApiDomain()}/ws`);
  stompClient = new Client({
    webSocketFactory: () => socket,
    connectHeaders: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    },
    debug: (str: string) => console.log('STOMP:', str),
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
  });

  stompClient.onConnect = () => {
    console.log('Connected to WebSocket');
    stompClient?.subscribe(`/topic/ideas/${projectId}`, (message: IMessage) => {
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
    stompClient.deactivate();
    stompClient = null;
  }
};

export const sendMessage = <T>(destination: string, body: T): boolean => {
  if (!stompClient || !stompClient.connected) {
    console.error('STOMP client not connected');
    return false;
  }
  
  stompClient.publish({
    destination,
    body: JSON.stringify(body)
  });
  
  return true;
};