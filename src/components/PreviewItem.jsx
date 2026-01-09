import { X } from "lucide-react";
import { useEffect, useMemo } from "react";

function PreviewItemModal({ isOpen, onClose, file }) {
  const objectUrl = useMemo(() => {
    return URL.createObjectURL(file || new Blob());
  }, [file]);

  useEffect(() => {
    return () => URL.revokeObjectURL(objectUrl);
  }, [objectUrl]);



  if (!isOpen || !file) return null;

  const isPDF = file.type === "application/pdf";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-5xl mx-4 h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden animate-scaleIn">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-white">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              File Preview
            </h2>
            <p className="text-sm text-gray-500 truncate max-w-[300px]">
              {file.name}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <X className="text-gray-600" size={20} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex items-center justify-center bg-gray-50 h-full">
          {isPDF ? (
            <iframe
              src={objectUrl}
              title="PDF Preview"
              className="w-full h-full"
            />
          ) : (
            <img
              src={objectUrl}
              alt="Preview"
              className="max-w-full max-h-full mx-auto object-center object-contain p-6"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default PreviewItemModal;
