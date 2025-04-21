"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getApiDomain } from "@/utils/domain";

/* ---------- TIPOS ---------- */

type MessageCB = (msg: IMessage) => void;

interface TopicEntry {
  callback: MessageCB;
  sub?: StompSubscription;
}

type WebSocketContextType = {
  subscribe: (topic: string, cb: MessageCB) => void;
  unsubscribe: (topic: string) => void;
  send: (dest: string, body: string) => void;
};

/* ---------- CONTEXT ---------- */

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const clientRef = useRef<Client | null>(null);

  const topics = useRef<Record<string, TopicEntry>>({});

  useEffect(() => {
    const socket = new SockJS(`${getApiDomain()}/ws`);
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: (str) => console.log("[WS]", str),
    });

    client.onConnect = () => {
      console.log("✅ WebSocket ");
      Object.entries(topics.current).forEach(([topic, entry]) => {
        entry.sub = client.subscribe(topic, entry.callback);
      });
    };

    client.activate();
    clientRef.current = client;

    return () => {
      Object.values(topics.current).forEach((e) => e.sub?.unsubscribe());
      client.deactivate();
    };
  }, []);

  const subscribe = useCallback((topic: string, cb: MessageCB) => {
    const client = clientRef.current;
    if (!client) return;

    topics.current[topic]?.sub?.unsubscribe();

    if (client.connected) {
      topics.current[topic] = { callback: cb, sub: client.subscribe(topic, cb) };
    } else {
      topics.current[topic] = { callback: cb };
    }
  }, []);

  const unsubscribe = useCallback((topic: string) => {
    topics.current[topic]?.sub?.unsubscribe();
    delete topics.current[topic];
  }, []);

  const send = useCallback((dest: string, body: string) => {
    clientRef.current?.publish({ destination: dest, body });
  }, []);

  const ctxValue = useMemo(
    () => ({ subscribe, unsubscribe, send }),
    [subscribe, unsubscribe, send]
  );

  return (
    <WebSocketContext.Provider value={ctxValue}>
      {children}
    </WebSocketContext.Provider>
  );
};


export const useWebSocket = () => {
  const ctx = useContext(WebSocketContext);
  if (!ctx) throw new Error("useWebSocket must be used within a WebSocketProvider");
  return ctx;
};
