import WebcamCanvas from "../components/WebcamCanvas";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <h1 className="text-2xl font-semibold mb-4">Face Tracking App</h1>
      <WebcamCanvas />
    </main>
  );
}
