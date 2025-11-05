"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { PostureData, RiskLevel } from "@/types";

interface UseWebSocketReturn {
  data: PostureData | null;
  isConnected: boolean;
  error: string | null;
  reconnect: () => void;
}

export function useWebSocket(url: string): UseWebSocketReturn {
  const [data, setData] = useState<PostureData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket Connected");
        setIsConnected(true);
        setError(null);
      };

      ws.onmessage = (event) => {
        try {
          const postureData: PostureData = JSON.parse(event.data);
          setData(postureData);
        } catch (err) {
          console.error("Failed to parse message:", err);
        }
      };

      ws.onerror = (event) => {
        console.error("WebSocket Error:", event);
        setError("WebSocket connection error");
      };

      ws.onclose = () => {
        console.log("WebSocket Disconnected");
        setIsConnected(false);

        // 자동 재연결 (5초 후)
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log("Attempting to reconnect...");
          connect();
        }, 5000);
      };
    } catch (err) {
      console.error("Failed to create WebSocket:", err);
      setError("Failed to establish connection");
    }
  }, [url]);

  const reconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    connect();
  }, [connect]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  return { data, isConnected, error, reconnect };
}
