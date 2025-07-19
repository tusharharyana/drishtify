"use client";
import { useEffect, useRef, useState } from "react";
import { loadModels, detectFace } from "../utils/faceApi";
import Controls from "../components/Controls";

export default function WebcamCanvas() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);

  useEffect(() => {
    const setupCamera = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    };

    loadModels().then(() => setModelsLoaded(true));
    setupCamera();
  }, []);

  useEffect(() => {
    if (!modelsLoaded) return;
    const interval = setInterval(() => {
      if (videoRef.current && canvasRef.current) {
        detectFace(videoRef.current, canvasRef.current);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [modelsLoaded]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-md aspect-video mx-auto">
        <video
          ref={videoRef}
          className="absolute w-full h-full object-cover rounded-md"
          muted
        />
        <canvas ref={canvasRef} className="absolute w-full h-full rounded-md" />
      </div>

      <Controls canvasRef={canvasRef} />
    </div>
  );
}
