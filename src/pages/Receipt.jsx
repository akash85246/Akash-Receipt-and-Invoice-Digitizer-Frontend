import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Image,
  Store,
  ChartBarStacked,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Sparkles,
  Calendar,
  ChartNoAxesColumn,
  Info,
  CircleCheck,
  FileText,
  FileBracesCorner,
  Trash2Icon,
  Wallet,
  Banknote,
  Smartphone,
} from "lucide-react";

function Receipt() {
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("image");
  const [items, setItems] = useState(document?.items || []);
  const [category, setCategory] = useState(document?.category || "");
  const [receiptNumber, setReceiptNumber] = useState(
    document?.receipt_number || ""
  );
  const [totalAmount, setTotalAmount] = useState(document?.total_amount || "");
  const [taxAmount, setTaxAmount] = useState(document?.tax_amount || "");
  const [paymentMode, setPaymentMode] = useState(document?.payment_mode || "");
  const [expenseType, setExpenseType] = useState(
    document?.expense_type || "personal"
  );
  const [merchant_name, setMerchantName] = useState(
    document?.merchant_name || ""
  );
  const [date, setDate] = useState(document?.date || "");
  const [number, setNumber] = useState("");

  const addItem = () => {
    setItems((prev) => [...prev, { name: "", cost: "" }]);
  };

  console.log("Document Data:", document);
  const Backend_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const res = await axios.get(`/api/receipt/${id}/`, {
          withCredentials: true,
        });
        setDocument(res.data);
        setCategory(res.data.category || "");
        setItems(res.data.items || []);
        setExpenseType(res.data.expense_type || "personal");
        setMerchantName(res.data.merchant_name || "");
        setDate(res.data.date || "");
        if (res.data.type === "receipt") {
          setNumber(res.data.receipt_number || "");
        } else {
          setNumber(res.data.invoice_number || "");
        }
        setReceiptNumber(res.data.receipt_number || "");
        setTotalAmount(res.data.total_amount || "");
        setTaxAmount(res.data.tax_amount || "");
        setPaymentMode(res.data.payment_mode || "");
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

  const paymentConfig = {
    cash: {
      label: "Cash",
      icon: Banknote,
    },
    card: {
      label: "Card",
      icon: CreditCard,
    },
    upi: {
      label: "UPI",
      icon: Smartphone,
    },
    wallet: {
      label: "Wallet",
      icon: Wallet,
    },
  };

  const CATEGORY_OPTIONS = [
    { value: "food", label: "Food" },
    { value: "travel", label: "Travel" },
    { value: "shopping", label: "Shopping" },
    { value: "medical", label: "Medical" },
    { value: "education", label: "Education" },
    { value: "entertainment", label: "Entertainment" },
    { value: "housing", label: "Housing" },
    { value: "business", label: "Business" },
    { value: "utilities", label: "Utilities" },
  ];

  const getConfidenceGradient = (score) => {
    const percent = score * 100;

    if (percent >= 85) {
      return "from-emerald-600 to-emerald-400";
    }
    if (percent >= 70) {
      return "from-blue-600 to-blue-400";
    }
    if (percent >= 50) {
      return "from-yellow-600 to-yellow-400";
    }
    return "from-red-600 to-red-400";
  };

  const CURRENCY_CODE_TO_SYMBOL = {
    INR: "₹",
    USD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    CNY: "¥",
    KRW: "₩",
    RUB: "₽",
    TRY: "₺",
    VND: "₫",
    PHP: "₱",
    ILS: "₪",
    NGN: "₦",
    UAH: "₴",
    CRC: "₡",
    PYG: "₲",
    KZT: "₸",
    THB: "฿",
    LAK: "₭",
    MNT: "₮",
    KHR: "៛",
    BDT: "৳",
    BTC: "₿",
    ETH: "Ξ",
    LTC: "Ł",
    DOGE: "Ð",
  };

  const currencySymbol =
    CURRENCY_CODE_TO_SYMBOL[document?.currency?.toUpperCase()] ||
    document?.currency ||
    "";

  const getCategoryConfidenceBadge = (confidence = 0) => {
    if (confidence >= 0.85) {
      return (
        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
          High Confidence
        </span>
      );
    }

    if (confidence >= 0.7) {
      return (
        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
          Medium Confidence
        </span>
      );
    }

    if (confidence >= 0.5) {
      return (
        <span className="text-[10px] font-bold text-yellow-600 bg-yellow-50 px-1.5 py-0.5 rounded border border-yellow-200">
          Low Confidence
        </span>
      );
    }

    return (
      <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
        Very Low Confidence
      </span>
    );
  };
  if (!document) {
    return <p className="text-center mt-10">Document not found</p>;
  }

  return (
    <div className="h-screen overflow-y-auto bg-slate-50 space-y-6 flex">
      <section className="flex-1 sticky top-6 bg-slate-50 border-l p-10  border-slate-200 overflow-hidden space-y-8 custom-scrollbar ">
        <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
          {/* ENGINE USED */}
          <span
            className={`px-3 py-1.5 text-[0.8rem] font-semibold tracking-wide uppercase rounded-full bg-gradient-to-r ${getConfidenceGradient(
              document.ocr_metadata.confidence_score
            )} bg-clip-text text-transparent border border-slate-200`}
          >
            {document.ocr_metadata.engine_used}
          </span>

          {/* CONFIDENCE */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <p className="text-[0.8rem] font-medium text-slate-600">
                OCR Confidence
              </p>
              <span className="text-[0.8rem] font-semibold text-slate-800">
                {(document.ocr_metadata.confidence_score * 100).toFixed(2)}%
              </span>
            </div>

            <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
              <div
                className={`h-full rounded-full bg-linear-to-r ${getConfidenceGradient(
                  document.ocr_metadata.confidence_score
                )} transition-all duration-500`}
                style={{
                  width: `${document.ocr_metadata.confidence_score * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* ORIGINAL DOCUMENT */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-800">
                Uploaded Document
              </h3>
              <p className="text-[0.8rem] text-slate-500 mt-0.5">
                Original file preview
              </p>
            </div>

            <div className="p-4 flex justify-center items-center bg-slate-50">
              <img
                src={Backend_URL + document.image}
                alt="Original Document"
                className="max-h-[65vh] w-auto rounded-xl border bg-white object-contain shadow-sm"
              />
            </div>
          </div>

          {/* PRE-PROCESSED IMAGE / EXTRACTED TEXT */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-800">
                  {viewMode === "image"
                    ? "Pre-Processed Image"
                    : "Extracted Text"}
                </h3>
                <p className="text-[0.8rem] text-slate-500 mt-0.5">
                  {viewMode === "image"
                    ? "Input sent to OCR engine"
                    : "Text extracted from OCR engine"}
                </p>
              </div>

              <button
                onClick={() =>
                  setViewMode(viewMode === "image" ? "text" : "image")
                }
                className="flex items-center gap-2 text-[0.8rem] px-3 py-1.5 rounded-full
                 bg-indigo-50 text-indigo-600 font-medium
                 hover:bg-indigo-100 transition"
              >
                {viewMode === "image" ? "View Text" : "View Image"}
              </button>
            </div>

            <div className="p-4 bg-slate-50">
              {viewMode === "image" ? (
                <div className="flex justify-center items-center">
                  <img
                    src={Backend_URL + document.ocr_metadata.processed_image}
                    alt="Preprocessed Document"
                    className="max-h-[65vh] w-auto rounded-xl border bg-white object-contain shadow-sm"
                  />
                </div>
              ) : (
                <pre
                  className="max-h-[65vh] overflow-y-auto rounded-xl border bg-white p-4
                   text-[0.8rem] leading-relaxed whitespace-pre-wrap text-slate-700
                   scrollbar-thin scrollbar-thumb-slate-300"
                >
                  {document.extracted_text !== null ||
                  document.extracted_text !== "" ||
                  document.extracted_text !== undefined
                    ? document.extracted_text
                    : "No OCR text available"}
                </pre>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="w-full max-w-130 h-full  bg-white border-l border-slate-200 flex flex-col shadow-xl z-10">
        <div className="bg-white">
          <div className="px-6 py-4 border-b border-slate-100  bg-white ">
            <div className="flex flex-col gap-2">
              <nav className="flex items-center text-[0.8rem] text-slate-500 mb-1">
                <a
                  className="hover:text-primary transition-colors"
                  href="/home"
                >
                  Dashboard
                </a>
                <span className="mx-1">/</span>
                <a
                  className="hover:text-primary transition-colors"
                  href="/history"
                >
                  Scans
                </a>
                <span className="mx-1">/</span>
                <a
                  className="hover:text-primary transition-colors text-slate-800"
                  href={
                    document.type === "receipt"
                      ? `/receipt/${document.id}`
                      : `/invoice/${document.id}`
                  }
                >
                  {document.type === "invoice" ? "Invoice" : "Receipt"} #
                  {document.id}
                </a>
              </nav>
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 leading-tight">
                    {document.type === "invoice" ? "Invoice" : "Receipt"}{" "}
                    Details
                  </h2>
                  <p className="text-xs text-slate-500  mt-1">
                    Review and verify the extracted data below.
                  </p>
                </div>
                {document.is_reviewed ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.8rem] font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.8rem] font-semibold bg-amber-100 text-amber-700 border border-amber-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    Needs Review
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 p-6 py-4 space-y-4">
            <div className="space-y-4">
              <div className="group relative">
                <label className="block text-[0.8rem] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Merchant Name
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Store className="text-[16px]" />
                  </div>
                  <input
                    className="w-full pl-10 pr-24 py-2.5 bg-slate-50  border border-slate-200  rounded-lg text-slate-900 font-semibold focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
                    type="text"
                    value={merchant_name}
                    onChange={(e) => setMerchantName(e.target.value)}
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
                    <span
                      className={`flex items-center gap-1 bg-emerald-100  text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 `}
                    >
                      {(document.ocr_metadata.confidence_score * 100).toFixed(
                        2
                      ) || 0}
                      %
                      <span className="material-symbols-outlined text-[12px]">
                        check
                      </span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.8rem] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Total Amount
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-serif text-md">
                      {currencySymbol}
                    </div>
                    <input
                      className="w-full pl-8 pr-2 py-2.5 bg-slate-50  border border-slate-200  rounded-lg text-slate-900 font-bold text-md focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
                      type="number"
                      value={totalAmount || ""}
                      onChange={(e) => setTotalAmount(e.target.value)}
                    />
                  </div>
                  <div className="mt-1 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[99%]"></div>
                  </div>
                </div>

                <div>
                  <label className="block text-[0.8rem] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Date
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <Calendar className="text-[18px]" />
                    </div>
                    <input
                      className="w-full pl-10 pr-2 py-2.5 bg-slate-50  border border-slate-200  rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
                      type="date"
                      value={date || ""}
                      onChange={(e) => {
                        setDate(e.target.value);
                      }}
                    />
                  </div>
                  <div className="mt-1 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[95%]"></div>
                  </div>
                </div>
              </div>
            </div>
            <hr className="border-slate-100 " />

            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <ChartNoAxesColumn className="text-[18px] text-white bg-blue-700 rounded-sm" />
                Transaction Details
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <div className="flex justify-between mb-1.5">
                    <label className="text-[0.8rem] font-semibold text-slate-500 uppercase tracking-wider">
                      Category
                    </label>

                    {getCategoryConfidenceBadge(document?.confidence_score)}
                  </div>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <ChartBarStacked className="text-[16px]" />
                    </div>

                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full pl-10 pr-8 py-2.5 bg-white  border border-amber-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-amber-200 focus:border-amber-400 transition-all outline-none appearance-none cursor-pointer"
                    >
                      <option value="" disabled>
                        Select category
                      </option>

                      {CATEGORY_OPTIONS.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                      <ChevronDown className="text-[16px]" />
                    </div>
                  </div>
                  <p className="text-[11px] text-amber-600 mt-1 flex items-center gap-1">
                    <Info
                      size={12}
                      className="text-white bg-amber-600 rounded-full"
                    />
                    AI suggested '{document.category}' based on keywords. Please
                    confirm.
                  </p>
                </div>

                {(document.invoice_number || document.receipt_number) && (
                  <div>
                    <label className="block text-[0.8rem] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                      {document.type === "invoice"
                        ? "Invoice Number"
                        : "Receipt Number"}
                    </label>
                    <input
                      className="w-full px-3 py-2.5 bg-slate-50  border border-slate-200  rounded-lg text-slate-700  focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none font-mono text-xs"
                      type="text"
                      onChange={(e) => setNumber(e.target.value)}
                      value={number || ""}
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[0.8rem] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                      Tax / GST
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                        {currencySymbol}
                      </span>
                      <input
                        className="w-full pl-6 pr-3 py-2.5 bg-slate-50  border border-slate-200  rounded-lg text-slate-700  focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none"
                        type="text"
                        value={taxAmount || ""}
                        placeholder="eg. 709"
                        onChange={(e) => setTaxAmount(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[0.8rem] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                      Payment Mode
                    </label>

                    <div className="relative">
                      {/* Left Icon */}
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        {(() => {
                          const Icon =
                            paymentConfig[paymentMode]?.icon || CreditCard;
                          return <Icon size={16} />;
                        })()}
                      </div>

                      {/* Select */}
                      <select
                        value={paymentMode}
                        onChange={(e) => setPaymentMode(e.target.value)}
                        className="w-full pl-9 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none appearance-none cursor-pointer"
                      >
                        <option value="" disabled>
                          Select payment mode
                        </option>

                        {Object.entries(paymentConfig).map(
                          ([value, { label }]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          )
                        )}
                      </select>

                      {/* Right Chevron */}
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        <ChevronDown size={16} />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Items & Cost */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <h3 className="text-sm text-[0.8rem] font-semibold text-slate-500 uppercase tracking-wider">
                      Items & Cost
                    </h3>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-2 text-left text-[0.8rem] font-semibold text-slate-500 uppercase tracking-wider">
                            Item
                          </th>
                          <th className="px-4 py-2 text-centre text-[0.8rem] font-semibold text-slate-500 uppercase tracking-wider">
                            Qty.
                          </th>
                          <th className="px-4 py-2 text-right text-[0.8rem] font-semibold text-slate-500 uppercase tracking-wider">
                            Cost
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {items.length ? (
                          items.map((item, idx) => (
                            <tr key={idx} className="border-b last:border-b-0">
                              <td className="px-4 py-2">
                                <input
                                  type="text"
                                  value={item.name}
                                  onChange={(e) => {
                                    const updated = [...items];
                                    updated[idx].name = e.target.value;
                                    setItems(updated);
                                  }}
                                  placeholder="Item name"
                                  className="w-full bg-transparent focus:outline-none"
                                />
                              </td>
                              <td className="px-4 py-2 text-centre">
                                <input
                                  type="number"
                                  value={item.quantity || 1}
                                  min={1}
                                  onChange={(e) => {
                                    const updated = [...items];
                                    updated[idx].quantity = e.target.value;
                                    setItems(updated);
                                  }}
                                  placeholder="1"
                                  className="w-12 text-right bg-transparent focus:outline-none"
                                />
                              </td>

                              <td className="px-4 py-2 text-right">
                                <input
                                  type="number"
                                  value={item.price}
                                  onChange={(e) => {
                                    const updated = [...items];
                                    updated[idx].price = e.target.value;
                                    setItems(updated);
                                  }}
                                  min={0}
                                  placeholder="0.00"
                                  className="w-24 text-right bg-transparent focus:outline-none"
                                />
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={2}
                              className="px-4 py-6 text-center text-slate-400"
                            >
                              No items
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* ADD BUTTON */}
                  <div className="px-4 py-3 border-t border-slate-100 bg-slate-50">
                    <button
                      onClick={addItem}
                      className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg border border-dashed border-slate-300 text-slate-600 hover:text-indigo-600 hover:border-indigo-400 hover:bg-indigo-50 transition"
                    >
                      + Add Item
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-900">
                      Expense Type
                    </span>
                    <span className="text-[0.8rem] text-slate-500">
                      Categorize for reporting
                    </span>
                  </div>

                  <div className="flex bg-slate-200 p-1 rounded-lg">
                    <button
                      type="button"
                      onClick={() =>
                        setDocument({ ...document, expense_type: "business" })
                      }
                      className={`px-4 py-1.5 rounded-md text-[0.8rem] font-bold transition-all ${
                        document.expense_type === "business"
                          ? "bg-white shadow-sm text-primary"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      Business
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setDocument({ ...document, expense_type: "personal" })
                      }
                      className={`px-4 py-1.5 rounded-md text-[0.8rem] font-bold transition-all ${
                        document.expense_type === "personal" ||
                        document.expense_type === undefined
                          ? "bg-white shadow-sm text-primary"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      Personal
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex gap-4 items-start">
              <div className="bg-white  p-1.5 rounded-full shadow-sm text-primary shrink-0 float-left">
                <Sparkles className="text-[20px]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800  mb-1">
                  AI Insight
                </h4>
                <p className="text-[0.8rem] text-slate-600  leading-relaxed">
                  We detected a potential
                  <span className="font-bold text-slate-900 ">
                    Tip of $2.00
                  </span>
                  that wasn't included in the subtotal. Would you like to add a
                  separate field for gratuity?
                </p>
                <div className="mt-2 flex gap-4">
                  <button className="text-[0.8rem] font-bold text-primary hover:underline">
                    Add Gratuity
                  </button>
                  <button className="text-[0.8rem] font-bold text-slate-500 hover:text-slate-700 ">
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 py-4 bg-white  border-t border-slate-200  flex flex-col gap-4">
            <button className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-primary/30 transition-all active:scale-[0.98]">
              <CircleCheck className="text-[18px]  bg-white text-blue-400 rounded-full" />
              Save &amp; Verify{" "}
              {document.type === "invoice" ? "Invoice" : "Receipt"}
            </button>
            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200  text-slate-700  font-semibold py-2.5 px-4 rounded-xl transition-all border border-transparent ">
                <FileText className="text-[18px]" />
                <span className="text-xs">PDF</span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200  text-slate-700  font-semibold py-2.5 px-4 rounded-xl transition-all border border-transparent ">
                <FileBracesCorner className="text-[18px]" />
                <span className="text-xs">CSV</span>
              </button>
              <button
                className="px-3 flex items-center justify-center bg-white hover:bg-slate-50  text-slate-400 hover:text-red-500 border border-slate-200  rounded-xl transition-all"
                title="Delete Receipt"
              >
                <Trash2Icon className="text-[18px]" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="bg-white border rounded-xl p-4 shadow-sm">
      <p className="text-[0.8rem] text-gray-500 mb-1">{label}</p>
      <p className="font-medium text-gray-800">{value || "—"}</p>
    </div>
  );
}

export default Receipt;
