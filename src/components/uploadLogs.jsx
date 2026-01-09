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
    <div className="p-4 border rounded bg-black text-green-400 font-mono">
      <div className="mb-2">Uploading... {progress}%</div>

      <div className="h-48 overflow-y-auto text-sm space-y-1">
        {logs.map((log, index) => (
          <div key={index}>• {log}</div>
        ))}
      </div>
    </div>
  );
}

export default UploadLogs;
