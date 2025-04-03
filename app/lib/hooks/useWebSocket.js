// lib/hooks/useWebSocket.js
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Client } from '@stomp/stompjs';

export const useWebSocket = (serverUrl, userId, projectId) => {
  const [client, setClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);

  // Connect to WebSocket
  useEffect(() => {
    if (!serverUrl || !userId) return;
    console.log("serverUrl: ", serverUrl)
    console.log("localStorage.getItem('token')", localStorage.getItem('token'))
    const stompClient = new Client({
      brokerURL: serverUrl,
      connectHeaders: {
        Authorization: typeof window !== 'undefined' && localStorage.getItem('token') 
        ? `Bearer ${localStorage.getItem('token')}` 
        : '',
      },
      debug: function (str) {
        console.log('STOMP: ' + str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    stompClient.onConnect = (frame) => {
      console.log('Connected to WebSocket:', frame);
      setConnected(true);
      setError(null);
      
      // Subscribe to user-specific channel
      stompClient.subscribe(`/topic/users/${userId}`, (message) => {
        try {
          const data = JSON.parse(message.body);
          setMessages(prev => [...prev, data]);
        } catch (e) {
          console.error('Error parsing message:', e);
        }
      });
      
      // Subscribe to project-specific channel if projectId exists
      if (projectId) {
        stompClient.subscribe(`/topic/projects/${projectId}`, (message) => {
          try {
            const data = JSON.parse(message.body);
            setMessages(prev => [...prev, data]);
          } catch (e) {
            console.error('Error parsing message:', e);
          }
        });
      }
    };

    stompClient.onStompError = (frame) => {
      console.error('STOMP error:', frame.headers['message']);
      console.error('Additional details:', frame.body);
      setError(`Connection error: ${frame.headers['message']}`);
      setConnected(false);
    };

    stompClient.onWebSocketClose = () => {
      console.log('WebSocket connection closed');
      setConnected(false);
    };

    // Activate the client
    stompClient.activate();
    setClient(stompClient);

    // Clean up on unmount
    return () => {
      if (stompClient) {
        stompClient.deactivate();
        setClient(null);
        setConnected(false);
      }
    };
  }, [serverUrl, userId, projectId]);

  // Send message function
  const sendMessage = useCallback((destination, body) => {
    if (!client || !connected) {
      setError('Not connected to WebSocket');
      return false;
    }
    
    try {
      client.publish({
        destination: destination,
        body: JSON.stringify(body)
      });
      return true;
    } catch (e) {
      console.error('Error sending message:', e);
      setError(`Error sending message: ${e.message}`);
      return false;
    }
  }, [client, connected]);

  // Clear messages
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    connected,
    sendMessage,
    messages,
    clearMessages,
    error
  };
};