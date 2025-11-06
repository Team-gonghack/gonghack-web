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
      console.log("블루투스 디바이스 연결 완료:", device.name);
    } catch (err) {
      // 사용자가 연결을 취소한 경우
      if (err instanceof Error && err.message.includes("User cancelled")) {
        console.log("사용자가 블루투스 연결을 취소했습니다.");
        // 오류로 표시하지 않음
        setError(null);
      } else {
        console.error("블루투스 연결 오류:", err);
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
    const heartRate = event.target.value.getUint8(0);
    const postureScore = event.target.value.getUint8(1); // 0~100 자세 평가 점수
    const statusCode = event.target.value.getUint8(2); // 0: 걷기, 1: 뛰기, 2: 멈춤

    // 상태 코드를 활동 상태로 매핑
    let activityState: ActivityState = "stopped";
    if (statusCode === 0) {
      activityState = "walking";
    } else if (statusCode === 1) {
      activityState = "running";
    } else if (statusCode === 2) {
      activityState = "stopped";
    }

    console.log(
      "BPM:",
      heartRate,
      "| 자세 점수:",
      postureScore,
      "| 상태:",
      activityState
    );

    // 자세 점수를 기반으로 정확도 계산 (0~100 범위 유지)
    const accuracy = postureScore;

    const newData: WearableData = {
      accuracy: accuracy,
      heartRate: heartRate,
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
            console.log("Notification 중지 중 오류 (무시됨):", err.message);
          });
        }
      }

      if (deviceRef.current?.gatt?.connected) {
        deviceRef.current.gatt.disconnect();
        console.log("블루투스 디바이스 연결 해제");
      } else {
        console.log("이미 연결이 해제된 상태입니다.");
      }
    } catch (err) {
      console.log("연결 해제 중 오류 (무시됨):", err);
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
