import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Camera,
  File,
  Trash2Icon,
  CloudUploadIcon,
  FileUpIcon,
  WandSparklesIcon,
} from "lucide-react";

import PreviewItemModal from "../components/PreviewItem";
import CameraModal from "../components/CameraModal";
import UploadLogs from "../components/uploadLogs.jsx";

function Scan() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [totalFilesSize, setTotalFilesSize] = useState(0);
  const fileInputRef = useRef(null);

  const ALLOWED_TYPES = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "application/pdf",
  ];

  const Backend_URL = import.meta.env.VITE_BACKEND_URL;

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e);
  };

  const handleFileSelect = (e) => {
    const files = e.target?.files || e.dataTransfer?.files;
    if (!files) return;

    const validFiles = Array.from(files).filter(
      (file) =>
        ALLOWED_TYPES.includes(file.type) || file.type.startsWith("image/")
    );

    if (!validFiles.length) {
      alert("Only PNG, JPG, JPEG, PDF, or image files are allowed.");
      return;
    }

    if (
      totalFilesSize + validFiles.reduce((acc, file) => acc + file.size, 0) >
      20 * 1024 * 1024
    ) {
      alert("Total file size exceeds 20MB limit.");
      return;
    }

    setTotalFilesSize((prevSize) => {
      const newSize = validFiles.reduce((acc, file) => acc + file.size, 0);
      return prevSize + newSize;
    });

    setFiles((prev) => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setTotalFilesSize((prevSize) => prevSize - files[index].size);
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (!files.length) return alert("No files selected");

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      setLoading(true);
      const res = await axios.post(`/api/documents/upload`, formData, {
        withCredentials: true,
      });
      alert("Uploaded successfully");
      navigate("/history");
      setTotalFilesSize(0);
      setFiles([]);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCamera = () => {
    setIsCameraOpen((prev) => !prev);
  };

  return (
    <section className="max-w-7xl mx-auto p-4 pb-0 space-y-6">
      <div className="flex-1 ">
        <div className="mb-8">
          <h1 className="text-4xl font-black leading-tight tracking-tight mb-2">
            Scanner &amp; Upload
          </h1>
          <p className="text-[#617289]  text-base font-normal">
            Capture or upload your receipts and invoices for instant
            digitization.
          </p>
        </div>

        {loading ? (
          <UploadLogs loading={loading} setLoading={setLoading} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            <div className="glass-card rounded-xl p-6 flex flex-col gap-4 min-h-[400px]] bg-white ">
              <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
                <Camera className="text-primary" />
                Click Photo
              </h3>
              <div className="relative flex-1 bg-black rounded-lg overflow-hidden flex items-center justify-center group">
                <div className="absolute inset-0 opacity-40 bg-cover bg-center" />
                <div className="absolute inset-8 border-2 border-white/30 rounded-md pointer-events-none">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary"></div>
                </div>

                <div className="z-10 text-center px-6">
                  <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-white border-4 border-primary p-1 shadow-xl hover:scale-105 transition-transform">
                    <div className="h-full w-full rounded-full bg-primary flex items-center justify-center">
                      <Camera className="text-white" size={36} />
                    </div>
                  </div>

                  <p className="text-lg text-white font-bold mb-1">
                    Capture receipt using camera
                  </p>
                  <p className="text-sm text-white mb-6">
                    Opens your device camera to instantly scan receipts or
                    invoices
                  </p>

                  {/* Action Button */}
                  <button
                    type="button"
                    disabled={loading || totalFilesSize >= 20 * 1024 * 1024}
                    onClick={handleToggleCamera}
                    className={`px-6 py-2.5 rounded-lg font-bold transition-all duration-200 active:scale-[0.98] ${
                      loading || totalFilesSize >= 20 * 1024 * 1024
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-primary text-white hover:bg-primary/90"
                    }`}
                  >
                    Open Camera
                  </button>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-xl p-6 flex flex-col gap-4 min-h-100 bg-white">
              <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
                <FileUpIcon className="text-primary" />
                Upload Document
              </h3>

              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                className={`flex-1 border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-8 cursor-pointer transition-all
          ${
            isDragging
              ? "border-primary bg-primary/15 scale-[1.01]"
              : "border-primary/40 bg-primary/5 hover:bg-primary/10"
          }
        `}
              >
                <div className="bg-primary/20 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                  <CloudUploadIcon className="text-primary" size={36} />
                </div>

                <p className="text-lg font-bold mb-1">
                  Drop receipts or invoices here
                </p>
                <p className="text-sm text-[#617289] mb-6">
                  Supports PDF, PNG, JPG (up to 20MB)
                </p>

                <button
                  type="button"
                  disabled={loading || totalFilesSize >= 20 * 1024 * 1024}
                  className={`px-6 py-2.5 rounded-lg font-bold transition-all duration-200 active:scale-[0.98] ${
                    loading || totalFilesSize >= 20 * 1024 * 1024
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-primary text-white hover:bg-primary/90"
                  }`}
                >
                  Browse Files
                </button>

                {/* Hidden input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/png,image/jpeg,application/pdf"
                  hidden
                  onChange={handleFileSelect}
                />
              </div>
            </div>
          </div>
        )}

        <div className="mb-10">
          <div className="flex items-center justify-between px-4 pb-4">
            <h2 className="text-[22px] font-bold tracking-tight">
              Selected Documents ({files.length})
            </h2>
            <button
              className="text-primary text-sm font-bold hover:underline"
              onClick={() => setFiles([])}
            >
              Clear All
            </button>
          </div>
          <div className="space-y-3 max-h-90 overflow-auto">
            {files.map((file, index) => (
              <ListItem
                key={index}
                file={file}
                onRemove={() => removeFile(index)}
              />
            ))}
            {files.length === 0 && (
              <p className="text-center text-[#617289] py-10">
                No documents selected.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className=" bg-white/80  backdrop-blur-md border-t border-gray-200  px-6 py-4 flex justify-center items-center z-50">
        <div className="max-w-240 w-full flex items-center justify-between">
          <div className="hidden md:flex flex-col">
            <p className="text-xs font-bold text-[#617289] uppercase tracking-wider">
              Total Queue
            </p>
            <p className="text-lg font-black">
              {files.length} Documents (
              {(totalFilesSize / (1024 * 1024)).toFixed(2)} MB)
            </p>
          </div>
          <button
            disabled={loading || files.length === 0}
            onClick={uploadFiles}
            className={`glow-btn flex-1 md:flex-none md:min-w-75 flex items-center justify-center gap-3 h-14 rounded-xl font-bold text-lg text-white transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${
              loading
                ? "bg-primary/80"
                : files.length === 0
                ? "bg-gray-300 text-gray-500"
                : "bg-primary hover:bg-primary/90"
            }`}
          >
            {loading ? (
              <>
                {/* Spinner */}
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Uploading…
              </>
            ) : (
              <>
                <WandSparklesIcon size={20} />
                Upload &amp; Digitize
              </>
            )}
          </button>
        </div>
      </div>
      <CameraModal
        isCameraOpen={isCameraOpen}
        onClose={handleToggleCamera}
        setFiles={setFiles}
        totalFilesSize={totalFilesSize}
        setTotalFilesSize={setTotalFilesSize}
      />
    </section>
  );
}

function ListItem({ file, onRemove }) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);

  const isPDF = file.type === "application/pdf";
  return (
    <div className="flex items-center gap-4 bg-white px-4 min-h-18 py-3 justify-between rounded-xl border border-gray-100 shadow-sm">
      <div
        className="flex items-center gap-4"
        onClick={() => {
          setPreviewFile(file);
          setIsPreviewOpen(true);
        }}
      >
        {isPDF ? (
          <div className="bg-gray-200 aspect-square rounded-lg size-14 flex items-center justify-center">
            <span className="material-symbols-outlined text-gray-400">
              <File />
              pdf
            </span>
          </div>
        ) : (
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-14"
            style={{ backgroundImage: `url(${URL.createObjectURL(file)})` }}
          ></div>
        )}
        <div className="flex flex-col justify-center">
          <p className="text-base font-medium leading-normal line-clamp-1">
            {file.name}
          </p>
          <p className="text-[#617289] text-sm font-normal">
            {file.size > 1024 * 1024
              ? (file.size / (1024 * 1024)).toFixed(2) + " MB"
              : (file.size / 1024).toFixed(2) + " KB"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full">
          READY
        </span>
        <button
          onClick={onRemove}
          className="text-gray-400 hover:text-red-500 transition-colors p-2"
        >
          <Trash2Icon size={20} />
        </button>
      </div>
      <PreviewItemModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        file={previewFile}
      />
    </div>
  );
}

export default Scan;
