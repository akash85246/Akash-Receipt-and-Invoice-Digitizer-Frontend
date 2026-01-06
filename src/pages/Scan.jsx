import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Camera, Upload, X } from "lucide-react";

function Scan() {
  // const dispatch = useDispatch();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const Backend_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera access denied", err);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, []);

 
  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      const file = new File([blob], `scan-${Date.now()}.jpg`, {
        type: "image/jpeg",
      });
      setFiles((prev) => [...prev, file]);
    }, "image/jpeg");
  };


  const handleFileSelect = (e) => {
    const selected = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selected]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  
  const uploadFiles = async () => {
    if (!files.length) return alert("No files selected");

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      setLoading(true);
      const res =await axios.post(`/api/documents/upload`, formData, {
        withCredentials: true,
      });
      const documents = res.data.documents;
      console.log("Documents uploaded:", documents);
      alert("Uploaded successfully");
      navigate("/history");
      setFiles([]);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-0 min-h-screen  text-white">
      
      <div className="relative h-[70vh] w-full ">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="h-full w-full object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />

        
        <button
          onClick={capturePhoto}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white text-black rounded-full p-5 shadow-lg"
        >
          <Camera size={28} />
        </button>

       
        <label className="absolute bottom-6 right-6 bg-white text-black p-3 rounded-full cursor-pointer">
          <Upload size={22} />
          <input
            type="file"
            multiple
            accept="image/*,application/pdf"
            hidden
            onChange={handleFileSelect}
          />
        </label>
      </div>

      {/* PREVIEW STRIP */}
      {files.length > 0 && (
        <div className="bg-white text-black p-4">
          <div className="flex gap-3 overflow-x-auto mb-4">
            {files.map((file, index) => (
              <div key={index} className="relative min-w-[80px]">
                <button
                  onClick={() => removeFile(index)}
                  className="absolute top-0 right-0 bg-white rounded-full p-1 shadow"
                >
                  <X size={12} />
                </button>

                {file.type === "application/pdf" ? (
                  <div className="h-20 w-20 flex items-center justify-center border rounded text-xs">
                    📄 PDF
                  </div>
                ) : (
                  <img
                    src={URL.createObjectURL(file)}
                    className="h-20 w-20 object-cover rounded"
                    alt="preview"
                  />
                )}
              </div>
            ))}
          </div>

          <button
            onClick={uploadFiles}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg"
          >
            {loading ? "Uploading..." : `Upload ${files.length} file(s)`}
          </button>
        </div>
      )}
    </div>
  );
}

export default Scan;