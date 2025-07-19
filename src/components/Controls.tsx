"use client";
import { useState } from "react";

interface ControlsProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

export default function Controls({ canvasRef }: ControlsProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [stopFunc, setStopFunc] = useState<(() => Promise<Blob>) | null>(null);

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
    const url = URL.createObjectURL(blob);
    setRecordedUrl(url);
    localStorage.setItem("recorded-video", url);
    setIsRecording(false);
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
    </div>
  );
}
