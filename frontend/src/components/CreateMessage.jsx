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

      const API_URL = import.meta.env.VITE_API_URL || "";
      const response = await fetch(`${API_URL}/api/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ encrypted_data: encrypted }),
      });

      const data = await response.json();
      const url = `${window.location.origin}/${data.id}#${key}`;
      setShareUrl(url);
    } catch (error) {
      alert("failed to create message: " + error.message);
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
        <div className="border-2 border-white bg-stone-9950 p-6">
          <p className="text-xl mb-4 text-neutral-500">
            (๑•̀ㅂ•́)و✧ link created! share it carefully.
          </p>
          <div className="bg-black p-4 mb-4 font-mono text-md break-all text-white">
            {shareUrl}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="flex-1 border-2 border-white bg-black text-white px-4 py-2 font-mono text-sm hover:bg-gray-100 transition"
            >
              {copied ? "✓ copied" : "copy link"}
            </button>
            <button
              onClick={() => {
                setShareUrl("");
                setMessage("");
              }}
              className="border-2 border-black bg-white px-4 py-2 font-mono text-sm hover:bg-gray-100 transition"
            >
              new
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            self-destructs after one view
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="border-2 border-white bg-black p-6">
        <p className="text-xl mb-4 text-gray-600">
          (｡•̀ᴗ-)✧ write something secret
        </p>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="your message goes here..."
          className="w-full h-48 p-4 border-2 border-black bg-black text-white font-mono text-md focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none"
        />
        <button
          onClick={handleCreate}
          disabled={loading || !message.trim()}
          className="w-full mt-4 border-2 border-black bg-white text-black px-6 py-3 font-mono text-sm hover:bg-gray-100 disabled:bg-stone-950 disabled:text-gray-500 disabled:border-stone-800 disabled:cursor-not-allowed transition"
        >
          {loading ? "creating..." : "→ create one-time link"}
        </button>
        <p className="text-xs text-gray-500 mt-4 text-center">
          encrypted in your browser, server never sees content
        </p>
      </div>
    </div>
  );
}
