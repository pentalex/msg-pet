import { useState } from "react";
import { generateKey, encryptMessage } from "../utils/crypto";

export default function CreateMessage() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCreate = async () => {
    if (!message.trim()) return;

    setLoading(true);
    try {
      const key = await generateKey();
      const encrypted = await encryptMessage(message, key);

      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ encrypted_data: encrypted }),
      });

      const data = await response.json();
      const url = `${window.location.origin}/${data.id}#${key}`;
      setShareUrl(url);
    } catch (error) {
      alert("Failed to create message: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (shareUrl) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Message Created!
          </h2>
          <p className="text-gray-600 mb-4">
            Share this link. It will self-destruct after being viewed once.
          </p>
          <div className="bg-gray-50 p-4 rounded border border-gray-200 mb-4">
            <code className="text-sm break-all text-gray-700">{shareUrl}</code>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleCopy}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              {copied ? "✓ Copied!" : "Copy Link"}
            </button>
            <button
              onClick={() => {
                setShareUrl("");
                setMessage("");
              }}
              className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
            >
              Create Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Create Burner Message
        </h2>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your secret message..."
          className="w-full h-48 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={handleCreate}
          disabled={loading || !message.trim()}
          className="w-full mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
        >
          {loading ? "Creating..." : "Create One-Time Link"}
        </button>
        <p className="mt-4 text-sm text-gray-500 text-center">
          🔒 Messages are encrypted in your browser. We never see the content.
        </p>
      </div>
    </div>
  );
}
