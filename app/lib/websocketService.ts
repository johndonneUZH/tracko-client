// lib/websocketService.ts
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { getApiDomain } from "@/utils/domain";

let stompClient: Client | null = null;

export const connectWebSocket = (userId: string, projectId: string, onMessage: (message: any) => void) => {
  if (stompClient && stompClient.connected) {
    return stompClient;
  }

  const socket = new SockJS(`${getApiDomain()}/ws`);
  stompClient = new Client({
    webSocketFactory: () => socket,
    connectHeaders: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    },
    debug: (str) => console.log('STOMP:', str),
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
  });

  stompClient.onConnect = (frame) => {
    console.log('Connected to WebSocket');
    stompClient?.subscribe(`/topic/ideas/${projectId}`, (message) => {
      onMessage(JSON.parse(message.body));
    });
  };

  stompClient.onStompError = (frame) => {
    console.error('STOMP error:', frame.headers['message']);
    console.error('Additional details:', frame.body);
  };

  stompClient.onWebSocketError = (event) => {
    console.error('WebSocket error:', event);
  };

  stompClient.onDisconnect = () => {
    console.log('Disconnected from WebSocket');
  };

  stompClient.activate();
  return stompClient;
};

export const disconnectWebSocket = () => {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
  }
};

export const sendMessage = (destination: string, body: any) => {
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