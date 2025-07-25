"use client";
import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import Controls from "../Components/Controls";

export default function WebcamCanvas() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [withAudio, setWithAudio] = useState(true);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      setModelsLoaded(true);
    };
    loadModels();
  }, []);

  useEffect(() => {
    const setupCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: withAudio, 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (err) {
        console.error("Error accessing media devices:", err);
      }
    };
    setupCamera();
  }, [withAudio]);

  useEffect(() => {
    if (!modelsLoaded) return;

    const interval = setInterval(async () => {
      if (!videoRef.current || !canvasRef.current) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const detections = await faceapi.detectAllFaces(
        video,
        new faceapi.TinyFaceDetectorOptions({ inputSize: 224 })
      );

      faceapi.draw.drawDetections(
        canvas,
        faceapi.resizeResults(detections, {
          width: canvas.width,
          height: canvas.height,
        })
      );
    }, 100);

    return () => clearInterval(interval);
  }, [modelsLoaded]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-4">
        <span className="font-medium">Audio:</span>
        <button
          onClick={() => setWithAudio(!withAudio)}
          className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${
            withAudio ? "bg-green-500" : "bg-gray-300"
          }`}
        >
          <div
            className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
              withAudio ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </button>
        <span className="text-sm text-gray-600">
          {withAudio ? "On" : "Off"}
        </span>
      </div>

      <video ref={videoRef} className="hidden" muted playsInline />
      <canvas ref={canvasRef} className="rounded-md shadow max-w-full border" />
      <Controls canvasRef={canvasRef} videoRef={videoRef} />
    </div>
  );
}
