// First, create a new file for WebSocket service
// lib/websocketService.js

import { Client } from '@stomp/stompjs';

let stompClient = null;

export const connectWebSocket = (userId) => {
  if (stompClient) {
    return stompClient;
  }

  // Create new STOMP client
  stompClient = new Client({
    brokerURL: 'ws://your-backend-url/ws', // Replace with your actual backend URL
    connectHeaders: {
      Authorization: localStorage.getItem('token') // If you need to send auth token
    },
    debug: function (str) {
      console.log('STOMP: ' + str);
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
  });

  // Client successfully connected
  stompClient.onConnect = function (frame) {
    console.log('Connected to WebSocket: ' + frame);
    
    // Subscribe to updates for this user
    stompClient.subscribe(`/topic/users/${userId}`, function (message) {
      console.log('Received message for user:', message.body);
      // Handle incoming messages here
    });
    
    // You can add project-specific subscriptions
    // stompClient.subscribe(`/topic/projects/${projectId}`, function (message) {...});
  };

  // Connection error handling
  stompClient.onStompError = function (frame) {
    console.error('STOMP error:', frame.headers['message']);
    console.error('Additional details:', frame.body);
  };

  stompClient.activate();
  return stompClient;
};

export const disconnectWebSocket = () => {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
    console.log('Disconnected from WebSocket');
  }
};

export const sendMessage = (destination, body) => {
  if (!stompClient || !stompClient.connected) {
    console.error('STOMP client not connected');
    return false;
  }
  
  stompClient.publish({
    destination: destination,
    body: JSON.stringify(body)
  });
  
  return true;
};