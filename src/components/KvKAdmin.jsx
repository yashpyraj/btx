import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Upload, Trash2, FileText, Calendar, Loader2 } from "lucide-react";

const KvKAdmin = ({ onLogout }) => {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/kvk-upload`;

  useEffect(() => {
    fetchUploads();
  }, []);

  const fetchUploads = async () => {
    try {
      const response = await fetch(apiUrl, {
        headers: {
          "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.uploads) {
        setUploads(data.uploads);
      }
    } catch (error) {
      console.error("Error fetching uploads:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "text/csv") {
      setSelectedFile(file);
      setMessage({ type: "", text: "" });
    } else {
      setMessage({ type: "error", text: "Please select a valid CSV file" });
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedDate) {
      setMessage({ type: "error", text: "Please select both a file and a date" });
      return;
    }

    setUploading(true);
    setMessage({ type: "", text: "" });

    try {
      const csvData = await selectedFile.text();

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          csvData,
          uploadDate: selectedDate,
          filename: selectedFile.name,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: "success", text: `Uploaded ${data.recordCount} player records` });
        setSelectedFile(null);
        setSelectedDate("");
        document.getElementById("csv-input").value = "";
        fetchUploads();
      } else {
        setMessage({ type: "error", text: data.error || "Upload failed" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Upload failed: " + error.message });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (uploadId) => {
    if (!confirm("Are you sure you want to delete this upload? All associated player data will be removed.")) {
      return;
    }

    try {
      const response = await fetch(apiUrl, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uploadId }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: "success", text: "Upload deleted successfully" });
        fetchUploads();
      } else {
        setMessage({ type: "error", text: data.error || "Delete failed" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Delete failed: " + error.message });
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="fixed top-0 left-0 right-0 z-50 bg-slate-900 border-b border-slate-700">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-slate-300 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </Link>
          <h1 className="text-xl font-bold text-white">KvK Data Admin</h1>
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 mb-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload KvK Data
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Select Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">Select CSV File</label>
                <input
                  id="csv-input"
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2.5 px-4 text-white file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:bg-slate-600 file:text-white file:cursor-pointer"
                />
                {selectedFile && (
                  <p className="mt-2 text-sm text-slate-400">
                    Selected: {selectedFile.name}
                  </p>
                )}
              </div>

              <button
                onClick={handleUpload}
                disabled={uploading || !selectedFile || !selectedDate}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg font-medium flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Upload Data
                  </>
                )}
              </button>

              {message.text && (
                <div
                  className={`p-3 rounded-lg ${
                    message.type === "success"
                      ? "bg-emerald-900/50 text-emerald-300 border border-emerald-700"
                      : "bg-red-900/50 text-red-300 border border-red-700"
                  }`}
                >
                  {message.text}
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Uploaded Data ({uploads.length})
            </h2>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
              </div>
            ) : uploads.length === 0 ? (
              <p className="text-slate-400 text-center py-8">No uploads yet</p>
            ) : (
              <div className="space-y-3">
                {uploads.map((upload) => (
                  <div
                    key={upload.id}
                    className="flex items-center justify-between bg-slate-700/50 rounded-lg p-4"
                  >
                    <div>
                      <p className="text-white font-medium">{formatDate(upload.upload_date)}</p>
                      <p className="text-sm text-slate-400">
                        {upload.record_count.toLocaleString()} players - {upload.filename}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(upload.id)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-lg"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KvKAdmin;
