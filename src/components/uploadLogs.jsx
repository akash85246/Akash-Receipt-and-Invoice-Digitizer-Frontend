import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

function UploadLogs({ loading, setLoading }) {
  const socketRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (!loading) return;

    const token = user.accessToken;
    const ws = new WebSocket(
      `ws://localhost:8000/ws/upload-progress/?token=${token}`
    );
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
      setLogs([]);
      setProgress(0);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.message) {
        setLogs((prev) => [...prev, data.message]);
      }

      if (typeof data.progress === "number") {
        setProgress(data.progress);
      }

      if (data.step === "done" || data.progress >= 100) {
        ws.close();
      }
    };

    ws.onerror = (err) => {
      console.error("WebSocket error", err);
      ws.close();
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
      socketRef.current = null;
      setLoading(false);
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [loading, setLoading]);

  if (!loading) return null;

  return (
    <div
      className="
    relative
    p-5
    rounded-xl
    bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950
    border border-slate-800
    font-mono
    text-emerald-400
    mb-12
  "
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-sm text-emerald-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="tracking-wide">Processing Logs</span>
        </div>

        <span className="text-xs text-slate-400">
          Uploading… <span className="text-emerald-400">{progress}%</span>
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden mb-4">
        <div
          className="h-full bg-emerald-500 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Logs */}
      <div
        className="
      h-48
      overflow-y-auto
      text-sm
      space-y-1.5
      pr-1
      scrollbar-thin
      scrollbar-thumb-slate-700
      scrollbar-track-transparent
    "
      >
        {logs.map((log, index) => (
          <div
            key={index}
            className="
          flex items-start gap-2
          text-slate-300
          animate-fade-in
        "
          >
            <span className="text-emerald-500">›</span>
            <span className="whitespace-pre-wrap leading-relaxed">{log}</span>
          </div>
        ))}
      </div>

      {/* Subtle Glow */}
      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-emerald-500/10" />
    </div>
  );
}

export default UploadLogs;
