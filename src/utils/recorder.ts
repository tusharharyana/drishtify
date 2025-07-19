export const startRecording = (canvas: HTMLCanvasElement) => {
  const stream = canvas.captureStream(30); // 30 FPS
  const recordedChunks: Blob[] = [];

  const mediaRecorder = new MediaRecorder(stream, {
    mimeType: "video/webm; codecs=vp9",
  });

  mediaRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) {
      recordedChunks.push(e.data);
    }
  };

  const stop = () =>
    new Promise<Blob>((resolve) => {
      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: "video/webm" });
        resolve(blob);
      };
      mediaRecorder.stop();
    });

  mediaRecorder.start();

  return { stop };
};
