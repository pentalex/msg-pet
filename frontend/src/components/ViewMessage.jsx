import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { decryptMessage } from "../utils/crypto";

export default function ViewMessage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const loadMessage = async () => {
      try {
        const key = window.location.hash.slice(1);
        if (!key) {
          throw new Error("no decryption key found");
        }

        const API_URL = import.meta.env.VITE_API_URL || "";
        const response = await fetch(`${API_URL}/api/messages/${id}`);
        if (!response.ok) {
          throw new Error("message not found or already viewed");
        }

        const data = await response.json();
        const decrypted = await decryptMessage(data.encrypted_data, key);
        setMessage(decrypted);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadMessage();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="border-2 border-black bg-white p-8 text-center">
          <p className="font-mono text-sm">decrypting message... (　･ω･)</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="border-2 border-red-500 bg-black p-8">
          <p className="font-mono text-sm mb-4 text-red-600">
            (｡•́︿•̀｡) {error}
          </p>
          <button
            onClick={() => navigate("/")}
            className="border-2 border-white bg-white text-black px-4 py-2 font-mono text-sm hover:bg-gray-100 transition"
          >
            ← back home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="border-2 border-black bg-black p-6">
        <div className="flex items-center justify-between mb-4 pb-4 ">
          <p className="font-mono text-sm text-gray-600">secret message</p>
          <p className="font-mono text-xs text-red-600">burns after reading</p>
        </div>
        <div className="bg-black border-white border-2 p-6 font-mono text-sm text-white whitespace-pre-wrap min-h-[200px]">
          {message}
        </div>
      </div>
    </div>
  );
}
