import { useEffect, useRef, useState } from "react";
import {
  Camera,
  X,
  RotateCcw,
  Trash2,
  Check,
  ChevronDown,
  ChevronUp,
  Info,
} from "lucide-react";

function CameraModal({ isCameraOpen, onClose, setFiles ,totalFilesSize,setTotalFilesSize}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [facingMode, setFacingMode] = useState("environment");
  const [captures, setCaptures] = useState([]);

  const CAMERA_TIPS = [
    "Keep the receipt straight and fully visible",
    "Use good lighting to avoid shadows",
    "Place the receipt on a flat surface",
    "Avoid glare and reflections",
    "Hold the camera steady while capturing",
  ];

  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % CAMERA_TIPS.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const savePhotos = () => {
    const newFiles = captures.map((dataUrl, i) => {
      const blob = dataURLtoBlob(dataUrl);
      return new File([blob], `capture_${Date.now()}_${i}.jpg`, {
        type: "image/jpeg",
      });
    });

    setTotalFilesSize((prevSize) => {
      const newSize = newFiles.reduce((acc, file) => acc + file.size, 0);
      return prevSize + newSize;
    });
    setFiles((prev) => [...prev, ...newFiles]);
    setCaptures([]);
    onClose();
  };

  const dataURLtoBlob = (dataUrl) => {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new Blob([u8arr], { type: mime });
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    if (!isCameraOpen) return;

    const startCamera = async () => {
      try {
        stopCamera();

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
          audio: false,
        });

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera error:", err);
      }
    };

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isCameraOpen, facingMode]);

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
    if( totalFilesSize + dataURLtoBlob(dataUrl).size > 20 * 1024 * 1024){
      alert("Total file size exceeds 20MB limit.");
      return;
    }
    setCaptures((prev) => [...prev, dataUrl]);
  };

  if (!isCameraOpen) return null;

  return (
    isCameraOpen && (
      <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
        <div className="bg-white  rounded-2xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden shadow-2xl">
          {/* CAMERA TIPS */}
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/50 backdrop-blur-md text-white text-sm shadow-lg">
              <Info size={14} className="text-primary" />
              <span className="whitespace-nowrap transition-opacity duration-300">
                {CAMERA_TIPS[tipIndex]}
              </span>
            </div>
          </div>
          
          {/* Camera Preview */}

          <div className="relative flex-1 bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />

            {/* Camera Controls */}
            <div className="absolute bottom-65 left-1/2 -translate-x-1/2 flex items-center gap-6">
              <button
                onClick={() =>
                  setFacingMode((p) =>
                    p === "environment" ? "user" : "environment"
                  )
                }
                className="bg-white/90 p-3 rounded-full"
              >
                <RotateCcw />
              </button>
              <button
                onClick={capturePhoto}
                className="w-16 h-16 rounded-full bg-primary flex items-center justify-center ring-4 ring-white"
              >
                <Camera className="text-white" size={28} />
              </button>

              {/* Close Button */}
              <button
                onClick={() => {
                  setCaptures([]);
                  onClose();
                }}
                className="bg-white/90 p-3 rounded-full"
              >
                <X />
              </button>
            </div>

            {/* RIGHT CAPTURES PANEL */}
            {captures.length > 0 && (
              <div className="absolute top-10 right-4 bottom-4 w-24 bg-black/40 backdrop-blur-md rounded-xl flex flex-col items-center py-3 gap-2 max-h-[75vh]">
                {/* UP ARROW */}
                {captures.length > 2 && (
                  <ChevronUp className="text-white/80 mb-1" size={18} />
                )}

                {/* CAPTURES */}
                <div className="flex-1 overflow-y-auto flex flex-col gap-2 px-1">
                  {captures.map((img, i) => (
                    <div key={i} className="relative group">
                      <img
                        src={img}
                        alt="capture"
                        className="h-16 w-16 rounded-lg object-cover border border-white/30"
                      />

                      {/* Delete */}
                      <button
                        onClick={() =>
                          setCaptures(captures.filter((_, idx) => idx !== i))
                        }
                        className="absolute -top-2 -right-2 bg-red-500 p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                      >
                        <Trash2 size={10} className="text-white" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* DOWN ARROW */}
                {captures.length > 1 && (
                  <ChevronDown className="text-white/80 mt-1" size={18} />
                )}
                {captures.length > 0 && (
                  <button
                    onClick={savePhotos}
                    className="mt-2 bg-green-500 p-2 rounded-lg flex items-center justify-center w-full mx-5"
                  >
                    <Check size={16} className="text-white" />
                  </button>
                )}
              </div>
            )}
          </div>

          <canvas ref={canvasRef} hidden />
        </div>
      </div>
    )
  );
}

export default CameraModal;
