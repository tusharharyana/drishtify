import * as faceapi from "face-api.js";

export const loadModels = async () => {
  const MODEL_URL = "/models";

  await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
};

export const detectFace = async (
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement
) => {
  const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 224 });

  const result = await faceapi.detectSingleFace(video, options);

  const context = canvas.getContext("2d");
  if (context) context.clearRect(0, 0, canvas.width, canvas.height);

  if (result) {
    const dims = faceapi.matchDimensions(canvas, video, true);
    const resized = faceapi.resizeResults(result, dims);
    faceapi.draw.drawDetections(canvas, resized);
  }
};
