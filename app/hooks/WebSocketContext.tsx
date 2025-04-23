"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useState,
} from "react";
import { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getApiDomain } from "@/utils/domain";

/* ---------- TYPES ---------- */
type MessageCallback = (msg: IMessage) => void;
type ConnectionState = "connecting" | "connected" | "disconnected" | "error";

interface TopicEntry {
  callback: MessageCallback;
  subscription?: StompSubscription;
}

interface WebSocketContextType {
  subscribe: (topic: string, callback: MessageCallback) => void;
  unsubscribe: (topic: string) => void;
  send: <T>(destination: string, body: T) => void;
  connectionState: ConnectionState;
  isConnected: boolean;
}

/* ---------- CONTEXT ---------- */
const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const clientRef = useRef<Client | null>(null);
  const topicsRef = useRef<Record<string, TopicEntry>>({});
  const [connectionState, setConnectionState] = useState<ConnectionState>("disconnected");

  const isConnected = useMemo(() => connectionState === "connected", [connectionState]);

  // Initialize WebSocket connection
  useEffect(() => {
    const apiDomain = getApiDomain().endsWith('/') 
    ? getApiDomain().slice(0, -1) 
    : getApiDomain();
    
    const socket = new SockJS(`${apiDomain}/ws`, {
      transports: ['websocket'],
      timeout: 5000,
    });
  
    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: sessionStorage.getItem("token") || "",
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => console.debug("[WS]", str),
    });

    client.onConnect = () => {
      console.log("✅ WebSocket connected");
      setConnectionState("connected");
      
      // Resubscribe to all topics when reconnecting
      Object.entries(topicsRef.current).forEach(([topic, entry]) => {
        if (!entry.subscription) {
          entry.subscription = client.subscribe(topic, entry.callback);
        }
      });
    };

    client.onDisconnect = () => {
      console.log("❌ WebSocket disconnected");
      setConnectionState("disconnected");
    };

    client.onStompError = (frame) => {
      console.error("STOMP protocol error:", frame.headers.message);
      setConnectionState("error");
    };

    client.onWebSocketError = (event) => {
      console.error("WebSocket error:", event);
      setConnectionState("error");
    };

    setConnectionState("connecting");
    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
      topicsRef.current = {};
    };
  }, []);

  const subscribe = useCallback((topic: string, callback: MessageCallback) => {
    const client = clientRef.current;
    if (!client) return;

    // Unsubscribe first if already subscribed
    if (topicsRef.current[topic]?.subscription) {
      topicsRef.current[topic].subscription?.unsubscribe();
    }

    // Store the callback
    topicsRef.current[topic] = { callback };

    // Subscribe immediately if connected
    if (client.connected) {
      topicsRef.current[topic].subscription = client.subscribe(topic, callback);
      console.log(`🔔 Subscribed to ${topic}`);
    }
  }, []);

  const unsubscribe = useCallback((topic: string) => {
    topicsRef.current[topic]?.subscription?.unsubscribe();
    delete topicsRef.current[topic];
    console.log(`🔕 Unsubscribed from ${topic}`);
  }, []);

  const send = useCallback(<T,>(destination: string, body: T) => {
    const client = clientRef.current;
    if (!client?.connected) {
      console.error("Cannot send message - WebSocket not connected");
      return;
    }

    client.publish({
      destination: `/app${destination.startsWith("/") ? "" : "/"}${destination}`,
      body: JSON.stringify(body),
    });
  }, []);

  const contextValue = useMemo(
    () => ({
      subscribe,
      unsubscribe,
      send,
      connectionState,
      isConnected,
    }),
    [subscribe, unsubscribe, send, connectionState, isConnected]
  );

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};