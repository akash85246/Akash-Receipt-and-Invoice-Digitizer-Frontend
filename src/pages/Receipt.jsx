import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Image } from "lucide-react";

function Receipt() {
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showImage, setShowImage] = useState(false);

  const Backend_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const res = await axios.get(`/api/documents/${id}/`, {
          withCredentials: true,
        });
        setDocument(res.data);
      } catch (err) {
        console.error("Failed to fetch document", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id]);

  if (loading) {
    return <p className="text-center mt-10">Loading receipt...</p>;
  }

  if (!document) {
    return <p className="text-center mt-10">Document not found</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold capitalize">
            {document.type} Details
          </h1>
          <p className="text-sm text-gray-500">
            Uploaded on {new Date(document.created_at).toLocaleDateString()}
          </p>
        </div>

        
        <button
          onClick={() => setShowImage(true)}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
          title="View Receipt Image"
        >
          <Image className="w-5 h-5 text-gray-700" />
        </button>
      </div>

     
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT INFO */}
        <div className="md:col-span-1 space-y-4">
          <InfoCard label="Merchant" value={document.merchant_name} />
          <InfoCard
            label="Total Amount"
            value={
              document.total_amount ? `₹${document.total_amount}` : null
            }
          />
          <InfoCard label="Date" value={document.date} />
          {document.payment_mode && (
            <InfoCard
              label="Payment Mode"
              value={document.payment_mode}
            />
          )}
          {document.invoice_number && (
            <InfoCard
              label="Invoice Number"
              value={document.invoice_number}
            />
          )}
          {document.gst_number && (
            <InfoCard label="GST Number" value={document.gst_number} />
          )}
        </div>

        {/* OCR TEXT */}
        <div className="md:col-span-2">
          <div className="bg-white border rounded-xl p-4 shadow-sm">
            <h2 className="font-semibold mb-3 text-gray-800">
              Extracted Text
            </h2>
            <pre className="bg-gray-50 p-3 rounded text-xs leading-relaxed whitespace-pre-wrap max-h-105 overflow-y-auto">
              {document.extracted_text || "No OCR text available"}
            </pre>
          </div>
        </div>
      </div>

   
      {showImage && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-xl overflow-hidden max-w-3xl w-full">
            <button
              onClick={() => setShowImage(false)}
              className="absolute top-2 right-2 bg-black/60 text-white px-3 py-1 rounded text-sm"
            >
              Close
            </button>
            <img
              src={Backend_URL + document.image}
              alt="Receipt"
              className="w-full h-[80vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}


function InfoCard({ label, value }) {
  return (
    <div className="bg-white border rounded-xl p-4 shadow-sm">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="font-medium text-gray-800">
        {value || "—"}
      </p>
    </div>
  );
}

export default Receipt;