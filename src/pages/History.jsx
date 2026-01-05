import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDocumentHistory } from "../redux/slices/documentHistorySlice";
import { useNavigate } from "react-router-dom";

function History() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { documents, loading } = useSelector(
    (state) => state.documentHistory
  );

  useEffect(() => {
    dispatch(fetchDocumentHistory());
  }, [dispatch]);

  if (loading) {
    return <p className="text-center mt-10">Loading documents...</p>;
  }

  if (!documents.length) {
    return <p className="text-center mt-10">No documents found</p>;
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Document History</h2>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-left text-sm">
            <tr>
              <th className="p-3">Type</th>
              <th className="p-3">Merchant</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Payment</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>

          <tbody>
            {documents.map((doc) => (
              <tr
                key={doc.id}
                onClick={() => navigate(`/receipt/${doc.id}`)}
                className="cursor-pointer hover:bg-gray-50 border-t text-sm"
              >
                <td className="p-3 capitalize font-medium">{doc.type}</td>

                <td className="p-3">
                  {doc.merchant_name || "Unknown Merchant"}
                </td>

                <td className="p-3">
                  {doc.total_amount
                    ? `₹${doc.total_amount}`
                    : "—"}
                </td>

                <td className="p-3 capitalize">
                  {doc.payment_mode || "—"}
                </td>

                <td className="p-3">
                  {new Date(doc.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="md:hidden space-y-3">
        {documents.map((doc) => (
          <div
            key={doc.id}
            onClick={() => navigate(`/receipt/${doc.id}`)}
            className="border rounded-lg p-4 shadow-sm active:scale-[0.98] transition"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold capitalize">
                {doc.type}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(doc.created_at).toLocaleDateString()}
              </span>
            </div>

            <p className="font-medium">
              {doc.merchant_name || "Unknown Merchant"}
            </p>

            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>
                Amount:{" "}
                {doc.total_amount ? `₹${doc.total_amount}` : "—"}
              </span>
              <span className="capitalize">
                {doc.payment_mode || ""}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default History;