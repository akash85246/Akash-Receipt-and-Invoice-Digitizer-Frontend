import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDocumentHistory,
  toggleSelect,
  selectAll,
  clearSelection,
} from "../redux/slices/documentHistorySlice";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Trash,
  Download,
  Utensils,
  Plane,
  ShoppingBag,
  Home,
  Wallet,
  HelpCircle,
} from "lucide-react";
import axios from "axios";

function History() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { documents, loading,total_pages, selectedIds } =
    useSelector((state) => state.documentHistory);
  const allIds = documents.map((d) => d.id);
  const allSelected =
    allIds.length > 0 && allIds.every((id) => selectedIds.includes(id));
  const [page, setPage] = useState(1);
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState({
    type: "all",
    start_date: "",
    end_date: "",
    category: "",
    min_amount: "",
    max_amount: "",
    search: "",
  });

  const [dateRange, setDateRange] = useState({
    from: "",
    to: "",
  });

  const [amountRange, setAmountRange] = useState({
    min: "",
    max: "",
  });

  const CATEGORY_ICON_MAP = {
    Food: {
      icon: Utensils,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
    Travel: {
      icon: Plane,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    Shopping: {
      icon: ShoppingBag,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    Utilities: {
      icon: Home,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    Other: {
      icon: Wallet,
      color: "text-slate-600",
      bg: "bg-slate-100",
    },
  };

  const DefaultIcon = HelpCircle;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        search: searchInput,
      }));
      setPage(1);
    }, 4000);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    dispatch(
      fetchDocumentHistory({
        page,
        ...filters,
      })
    );
  }, [dispatch, page, filters]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const deleteSelected = async () => {
    if (selectedIds.length === 0) return;

    try {
      const res = await axios.delete("/api/documents/delete-multiple", {
        data: { ids: selectedIds },
        withCredentials: true,
      });

      if (res.status === 200) {
        console.log("Documents deleted successfully");

        dispatch(fetchDocumentHistory({ page, ...filters }));

        dispatch(clearSelection());
      }
    } catch (error) {
      console.error("Error deleting documents", error);
    }
  };

  const PAGE_WINDOW = 5;

  const getPageWindow = () => {
    const start = Math.floor((page - 1) / PAGE_WINDOW) * PAGE_WINDOW + 1;

    const end = Math.min(start + PAGE_WINDOW - 1, total_pages);

    return { start, end };
  };

  const { start, end } = getPageWindow();

  if (loading) return <p className="text-center mt-10">Loading…</p>;

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <div>
        <h1 className="text-4xl font-black text-slate-900">
          Transaction History
        </h1>
        <p className="text-slate-500">
          View and manage all your receipts & invoices
        </p>
      </div>

      {/* FIlter and search section */}
      <div className="flex flex-col gap-4 bg-white  p-5 rounded-2xl shadow-sm border border-slate-200 ">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <label className="flex flex-col w-full md:flex-1 h-12">
            <div className="flex w-full flex-1 items-stretch rounded-full h-full border border-slate-200  focus-within:border-primary focus-within:ring-1 focus-within:ring-primary bg-gray-100  transition-all overflow-hidden bg-background-light ">
              <div className="text-slate-400 flex items-center justify-center pl-4 bg-transparent">
                <Search />
              </div>
              <input
                className="flex w-full min-w-0 flex-1 resize-none bg-transparent border-none text-slate-900 placeholder:text-slate-400 px-4 text-base font-normal focus:ring-0 h-full focus:outline-none"
                placeholder="Search merchant, date, amount"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
          </label>

          <div className="flex h-12 items-center justify-center p-1 w-full md:w-auto bg-gray-100 rounded-full">
            {[
              { label: "All", value: "all" },
              { label: "Receipts", value: "receipt" },
              { label: "Invoices", value: "invoice" },
            ].map((option) => (
              <label
                key={option.value}
                className={`flex cursor-pointer h-full items-center justify-center rounded-full px-4 text-sm font-semibold transition-all ${
                  filters.type === option.value
                    ? "bg-white shadow-sm text-primary"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <span className="truncate">{option.label}</span>
                <input
                  type="radio"
                  name="doc_type"
                  value={option.value}
                  checked={filters.type === option.value}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setFilters((prev) => ({ ...prev, search: searchInput }));
                      setPage(1);
                    }
                  }}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      type: e.target.value,
                    }))
                  }
                  className="hidden"
                />
              </label>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100  mt-1">
          <div ref={dropdownRef} className="flex flex-wrap gap-2 relative">
            {/* DATE RANGE */}
            <div className="relative">
              <button
                onClick={() =>
                  setOpenDropdown(openDropdown === "date" ? null : "date")
                }
                className="group flex h-9 items-center gap-x-2 rounded-full bg-gray-100 hover:bg-slate-200 px-3 border transition"
              >
                <span className="text-sm font-medium text-slate-700">
                  Date Range
                </span>
                {openDropdown === "date" ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </button>

              {openDropdown === "date" && (
                <div className="absolute z-30 mt-2 w-72 rounded-2xl border border-slate-200 bg-white shadow-xl">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <h4 className="text-sm font-semibold text-slate-800">
                      Filter by Date
                    </h4>
                  </div>

                  <div className="p-4 space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        From date
                      </label>
                      <input
                        type="date"
                        className=" w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                        value={dateRange.from}
                        onChange={(e) =>
                          setDateRange((prev) => ({
                            ...prev,
                            from: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        To date
                      </label>
                      <input
                        type="date"
                        className=" w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none "
                        value={dateRange.to}
                        onChange={(e) => {
                          setDateRange((prev) => ({
                            ...prev,
                            to: e.target.value,
                          }));
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
                    <button
                      className="text-sm text-slate-600 hover:text-slate-800"
                      onClick={() => {
                        setFilters((prev) => ({
                          ...prev,
                          start_date: "",
                          end_date: "",
                        }));
                        setDateRange({ from: "", to: "" });
                        setOpenDropdown(null);
                      }}
                    >
                      Reset
                    </button>

                    <button
                      className=" rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white  hover:bg-primary/90 transition "
                      onClick={() => {
                        setFilters((prev) => ({
                          ...prev,
                          start_date: dateRange.from,
                          end_date: dateRange.to,
                        }));

                        setOpenDropdown(null);
                      }}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* CATEGORY */}
            <div className="relative">
              <button
                onClick={() =>
                  setOpenDropdown(
                    openDropdown === "category" ? null : "category"
                  )
                }
                className="group flex h-9 items-center gap-x-2 rounded-full bg-gray-100 hover:bg-slate-200 px-3 border transition"
              >
                <span className="text-sm font-medium text-slate-700">
                  {filters.category || "All Categories"}
                </span>
                {openDropdown === "category" ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </button>

              {openDropdown === "category" && (
                <div className="absolute z-20 mt-2 w-48 rounded-xl border bg-white shadow-lg p-2">
                  {/* ALL OPTION */}
                  <button
                    onClick={() => {
                      setFilters((prev) => ({ ...prev, category: "" }));
                      setOpenDropdown(null);
                    }}
                    className={`w-full text-left px-4 py-2 rounded-lg text-sm transition
          ${
            filters.category === ""
              ? "bg-primary/10 text-primary font-medium"
              : "hover:bg-slate-100"
          }`}
                  >
                    All Categories
                  </button>

                  <div className="my-1 h-px bg-slate-100" />

                  {/* CATEGORY OPTIONS */}
                  {["Food", "Travel", "Shopping", "Utilities", "Other"].map(
                    (cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setFilters((prev) => ({ ...prev, category: cat }));
                          setOpenDropdown(null);
                        }}
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm transition
            ${
              filters.category === cat
                ? "bg-primary/10 text-primary font-medium"
                : "hover:bg-slate-100"
            }`}
                      >
                        {cat}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>

            {/* AMOUNT RANGE */}
            <div className="relative">
              <button
                onClick={() =>
                  setOpenDropdown(openDropdown === "amount" ? null : "amount")
                }
                className="group flex h-9 items-center gap-x-2 rounded-full bg-gray-100 hover:bg-slate-200 px-3 border transition"
              >
                <span className="text-sm font-medium text-slate-700">
                  Amount Range
                </span>
                {openDropdown === "amount" ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </button>
              {/* Amount dropdown */}
              {openDropdown === "amount" && (
                <div className="absolute z-30 mt-2 w-72 rounded-2xl border border-slate-200 bg-white shadow-xl">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <h4 className="text-sm font-semibold text-slate-800">
                      Filter by Amount
                    </h4>
                  </div>

                  <div className="p-4 space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Minimum Amount
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 1,000"
                        className=" w-full rounded-lg border border-slate-300 px-3 py-2 text-sm  focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none "
                        value={amountRange.min}
                        onChange={(e) =>
                          setAmountRange((prev) => ({
                            ...prev,
                            min: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Maximum Amount
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 50,000"
                        className=" w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-non "
                        value={amountRange.max}
                        onChange={(e) =>
                          setAmountRange((prev) => ({
                            ...prev,
                            max: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
                    <button
                      className="text-sm text-slate-600 hover:text-slate-800"
                      onClick={() => {
                        setFilters((prev) => ({
                          ...prev,
                          min_amount: "",
                          max_amount: "",
                        }));

                        setAmountRange({ min: "", max: "" });
                        setOpenDropdown(null);
                      }}
                    >
                      Reset
                    </button>

                    <button
                      className=" rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white  hover:bg-primary/90 transition "
                      onClick={() => {
                        setFilters((prev) => ({
                          ...prev,
                          min_amount: amountRange.min,
                          max_amount: amountRange.max,
                        }));
                        setOpenDropdown(null);
                      }}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={selectedIds.length === 0}
              className={`flex h-9 items-center justify-center gap-x-2 rounded-full px-3 transition-colors ${
                selectedIds.length === 0
                  ? "border border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "border border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Download size={18} />
              <span className="text-sm font-medium">CSV</span>
            </button>
            <button
              disabled={selectedIds.length === 0}
              className={`flex h-9 items-center justify-center gap-x-2 rounded-full px-3 transition-colors ${
                selectedIds.length === 0
                  ? "border border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "border border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Download size={18} />
              <span className="text-sm font-medium">JSON</span>
            </button>
            <button
              onClick={deleteSelected}
              disabled={selectedIds.length === 0}
              className={`flex h-9 items-center justify-center gap-x-2 rounded-full px-3 transition-colors ${
                selectedIds.length === 0
                  ? "border border-slate-200 text-slate-400 cursor-not-allowed bg-slate-100"
                  : "border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
              }`}
            >
              <Trash size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="hidden md:block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-slate-600 text-xs uppercase">
              <tr>
                <th className="p-4 text-center w-12">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) => {
                      e.stopPropagation();
                      if (e.target.checked) {
                        dispatch(selectAll(allIds));
                      } else {
                        dispatch(clearSelection());
                      }
                    }}
                    className="h-4 w-4 appearance-none rounded-full border border-slate-300 checked:bg-primary checked:border-primary cursor-pointer focus:ring-2 focus:ring-primary"
                  />
                </th>
                <th className="p-4 text-center">Type</th>
                <th className="p-4 text-center">Merchant</th>
                <th className="p-4 text-center">Category</th>
                <th className="p-4 text-center">Date</th>
                <th className="p-4 text-center">Amount</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {documents.map((doc) => (
                <tr
                  key={doc.id}
                  className="group hover:bg-slate-50 transition cursor-pointer"
                  onClick={() => navigate(`/${doc.type}/${doc.id}`)}
                >
                  <td
                    className="p-4 text-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(doc.id)}
                      onChange={() => dispatch(toggleSelect(doc.id))}
                      className="h-4 w-4 appearance-none rounded-full border border-slate-300 checked:bg-primary checked:border-primary cursor-pointer focus:ring-2 focus:ring-primary"
                    />
                  </td>

                  <td className="p-4 text-center capitalize font-medium text-slate-900">
                    {doc.type}
                  </td>

                  <td className="p-4 text-center font-medium text-slate-800">
                    <h3>{doc.merchant_name || "—"}</h3>

                    <p className="text-xs text-slate-500">
                      {doc.type === "receipt"
                        ? `RECEIPT #${doc.receipt_number || "-"}`
                        : `INVOICE #${doc.invoice_number || "-"}`}
                    </p>
                  </td>

                  <td className="p-4 text-center">
                    {doc.category ? (
                      (() => {
                        const config = CATEGORY_ICON_MAP[doc.category] || {};
                        const Icon = config.icon || DefaultIcon;

                        return (
                          <span
                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
                              config.bg || "bg-slate-100"
                            } ${config.color || "text-slate-700"}`}
                          >
                            <Icon size={14} />
                            {doc.category}
                          </span>
                        );
                      })()
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>

                  <td className="p-4 text-center text-slate-600">
                    {doc.date ? new Date(doc.date).toLocaleDateString() : "—"}
                  </td>

                  <td className="p-4 text-center font-mono font-semibold text-slate-900">
                    {doc.total_amount ? `₹${doc.total_amount}` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border-t bg-slate-50">
          <span className="text-sm text-slate-500 text-center sm:text-left">
            Showing <span className="font-semibold text-black">{page}</span> of{" "}
            <span className="font-semibold text-black">{total_pages}</span>{" "}
            pages
          </span>

          <div className="flex justify-center items-center sm:justify-end gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className={`p-2 text-xs rounded-full border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed ${page === total_pages ? "cursor-not-allowed border-slate-200 text-slate-400": "border-slate-300 hover:bg-slate-100"}`}
            >
              <ChevronLeft />
            </button>
            {Array.from({ length: end - start + 1 }, (_, i) => start + i).map(
              (pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`h-8 w-8 rounded-full text-sm font-medium border transition ${
                    pageNum === page
                      ? "bg-primary text-white border-primary"
                      : "border-slate-300 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {pageNum}
                </button>
              )
            )}
            <button
              disabled={page === total_pages || total_pages === 0}
              onClick={() => setPage((p) => p + 1)}
              className={`p-2 text-sm rounded-full border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed ${page === total_pages ? "cursor-not-allowed border-slate-200 text-slate-400": "border-slate-300 hover:bg-slate-100"}`}
            >
              <ChevronRight />
            </button>
          </div>
        </div>
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
                Amount: {doc.total_amount ? `₹${doc.total_amount}` : "—"}
              </span>
              <span className="capitalize">{doc.payment_mode || ""}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default History;
