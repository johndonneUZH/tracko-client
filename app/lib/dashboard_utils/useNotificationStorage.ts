/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Idea } from "@/types/idea";
import { ApiService } from "@/api/apiService";
import { useRouter } from "next/navigation";
import { connectWebSocket, disconnectWebSocket } from "../websocketService";
import { useWebSocket } from "@/hooks/WebSocketContext";

type WebSocketMessage = {
    [key: string]: unknown;
};

export function useNotification() {

    const [wsError, setWsError] = useState<string | null>(null);
    const { pendingRequests, setPendingRequests } = useWebSocket();

    const router = useRouter();

    const handleIdeaMessage = useCallback((payload: WebSocketMessage) => {
        console.log("Idea WebSocket message received:", payload);
        setPendingRequests(true);
    }, [setPendingRequests]); 

    const handleChangeMessage = useCallback((payload: WebSocketMessage) => {
        console.log("Change WebSocket message received:", payload);
        setPendingRequests(true);
    }, [setPendingRequests]); 
    
    const handleUserMessage = useCallback((payload: WebSocketMessage) => {
        console.log("User WebSocket message received:", payload);
        setPendingRequests(true);
    }, [setPendingRequests]);

    useEffect(() => {
        const projectId = sessionStorage.getItem("projectId");
        const token = sessionStorage.getItem("token");
        const userId = sessionStorage.getItem("userId");
        
        console.log("Attempting to connect WebSocket with:", { projectId, userId });
        
        if (!token || !userId || !projectId) {
            console.error("Missing credentials for WebSocket");
            setWsError("Authentication token or userId not found");
            router.push("/login");
            return;
        }
    
        connectWebSocket(
            userId, 
            projectId, 
            handleIdeaMessage,
            handleChangeMessage,
            handleUserMessage
        );
    
        return () => {
            console.log("Cleaning up WebSocket");
            disconnectWebSocket();
        };
    }, [router, handleIdeaMessage, handleChangeMessage, handleUserMessage]);
}