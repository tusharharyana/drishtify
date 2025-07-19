"use client";
import { useState, useEffect } from "react";

interface ControlsProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

export default function Controls({ canvasRef }: ControlsProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [stopFunc, setStopFunc] = useState<(() => Promise<Blob>) | null>(null);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
    
  useEffect(() => {
    const stored = localStorage.getItem("recorded-video");
    if (stored) {
      setRecordedUrl(stored);
    }
  }, []);
  useEffect(() => {
    const stored = localStorage.getItem("recorded-video");
    if (stored) {
      setRecordedUrl(stored);
    }
  }, []);

  const [toast, setToast] = useState(false);
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleStart = async () => {
    if (!canvasRef.current) return;
    const { stop } = await import("../utils/recorder").then((mod) =>
      mod.startRecording(canvasRef.current!)
    );
    setStopFunc(() => stop);
    setIsRecording(true);
  };

  const handleStop = async () => {
    if (!stopFunc) return;
    const blob = await stopFunc();
    const base64 = await blobToBase64(blob);
    setRecordedUrl(base64);
    localStorage.setItem("recorded-video", base64);
    setIsRecording(false);
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  return (
    <div className="flex gap-4 mt-6 justify-center">
      {!isRecording ? (
        <button
          onClick={handleStart}
          className="px-4 py-2 bg-green-600 text-white rounded-md shadow"
        >
          Start Recording
        </button>
      ) : (
        <button
          onClick={handleStop}
          className="px-4 py-2 bg-red-600 text-white rounded-md shadow"
        >
          Stop Recording
        </button>
      )}

      {recordedUrl && (
        <a
          href={recordedUrl}
          download="face-tracked-video.webm"
          className="px-4 py-2 bg-blue-500 text-white rounded-md shadow"
        >
          Download Video
        </a>
      )}
      {toast && (
        <div className="mt-4 text-green-600 font-semibold">
          Video saved successfully!
        </div>
      )}
    </div>
  );
}
