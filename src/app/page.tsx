import WebcamCanvas from "../components/WebcamCanvas";
import { VideoCameraIcon } from "@heroicons/react/24/solid";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-sky-100 to-indigo-100">
      <div className="flex items-center gap-2 mb-4">
        <VideoCameraIcon className="w-8 h-8 text-indigo-700" />
        <h1 className="text-3xl font-bold text-indigo-800 tracking-wide">
          Drishtify
        </h1>
      </div>
      <WebcamCanvas />
    </main>
  );
}
