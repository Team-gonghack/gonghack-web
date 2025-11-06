"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { WearableData, ActivityState } from "@/types";

interface UseBluetoothReturn {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  wearableData: WearableData | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

export function useBluetooth(): UseBluetoothReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wearableData, setWearableData] = useState<WearableData | null>(null);
  const deviceRef = useRef<BluetoothDevice | null>(null);
  const characteristicRef = useRef<BluetoothRemoteGATTCharacteristic | null>(
    null
  );

  // 블루투스 연결
  const connect = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.bluetooth) {
      setError("이 브라우저는 Web Bluetooth를 지원하지 않습니다.");
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // 블루투스 디바이스 검색
      const device = await navigator.bluetooth.requestDevice({
        // acceptAllDevices: true,
        filters: [{ name: "ESP32_BPM_Relay" }],
        optionalServices: ["12345678-1234-5678-1234-56789abcdef0"],
      });

      deviceRef.current = device;

      // GATT 서버 연결
      const server = await device.gatt?.connect();
      if (!server) {
        throw new Error("GATT 서버 연결 실패");
      }

      // 서비스 및 특성 가져오기
      // 실제 웨어러블 디바이스의 서비스 UUID에 맞게 수정 필요
      const service = await server?.getPrimaryService(
        "12345678-1234-5678-1234-56789abcdef0"
      );
      const characteristic = await service?.getCharacteristic(
        "abcdefab-cdef-1234-5678-1234567890ab"
      );

      characteristicRef.current = characteristic;

      // 알림 시작
      await characteristic?.startNotifications();
      characteristic?.addEventListener(
        "characteristicvaluechanged",
        handleCharacteristicValueChanged
      );

      setIsConnected(true);
      console.log("✅ 블루투스 디바이스 연결 완료:", device.name);
    } catch (err) {
      // 사용자가 연결을 취소한 경우
      if (err instanceof Error && err.message.includes("User cancelled")) {
        console.log("ℹ️ 사용자가 블루투스 연결을 취소했습니다.");
        // 오류로 표시하지 않음
        setError(null);
      } else {
        console.error("❌ 블루투스 연결 오류:", err);
        // 실제 오류인 경우에만 에러 메시지 설정
        setError(
          err instanceof Error ? err.message : "블루투스 연결에 실패했습니다."
        );
      }
    } finally {
      setIsConnecting(false);
    }
  }, []);

  // 특성 값 변경 핸들러
  const handleCharacteristicValueChanged = useCallback((event: any) => {
    const value = event.target.value.getUint8(0);
    console.log("❤️ BPM:", value);

    // 심박수 기반으로 활동 상태 추정
    let activityState: ActivityState = "stopped";
    if (value >= 120) {
      activityState = "running";
    } else if (value >= 90) {
      activityState = "walking";
    }

    const newData: WearableData = {
      accuracy: 95, // 기본값
      heartRate: value,
      activityState,
      stepCount: 0, // 기본값
      timestamp: Date.now(),
    };

    setWearableData(newData);
  }, []);

  // 연결 해제
  const disconnect = useCallback(() => {
    try {
      if (characteristicRef.current) {
        characteristicRef.current.removeEventListener(
          "characteristicvaluechanged",
          handleCharacteristicValueChanged
        );

        // 연결이 되어있는 경우에만 stopNotifications 호출
        if (deviceRef.current?.gatt?.connected) {
          characteristicRef.current.stopNotifications().catch((err) => {
            console.log("ℹ️ Notification 중지 중 오류 (무시됨):", err.message);
          });
        }
      }

      if (deviceRef.current?.gatt?.connected) {
        deviceRef.current.gatt.disconnect();
        console.log("🔌 블루투스 디바이스 연결 해제");
      } else {
        console.log("ℹ️ 이미 연결이 해제된 상태입니다.");
      }
    } catch (err) {
      console.log("ℹ️ 연결 해제 중 오류 (무시됨):", err);
    } finally {
      // 상태는 항상 초기화
      setIsConnected(false);
      setWearableData(null);
      characteristicRef.current = null;
    }
  }, [handleCharacteristicValueChanged]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    isConnected,
    isConnecting,
    error,
    wearableData,
    connect,
    disconnect,
  };
}
