export function startRecording(
  canvas: HTMLCanvasElement,
  video: HTMLVideoElement,
  withAudio: boolean
) {
  const canvasStream = canvas.captureStream(30); // 30 FPS
  let combinedStream: MediaStream;

  if (withAudio) {
    const audioTracks = (video.srcObject as MediaStream).getAudioTracks();
    combinedStream = new MediaStream([
      ...canvasStream.getVideoTracks(),
      ...audioTracks,
    ]);
  } else {
    combinedStream = new MediaStream(canvasStream.getVideoTracks());
  }

  const recorder = new MediaRecorder(combinedStream);
  const chunks: Blob[] = [];

  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  recorder.start();

  return {
    stop: () =>
      new Promise<Blob>((resolve) => {
        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: "video/webm" });
          resolve(blob);
        };
        recorder.stop();
      }),
  };
}
