import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateMessage from "./components/CreateMessage";
import ViewMessage from "./components/ViewMessage";

function App() {
  const commitHash = import.meta.env.VITE_COMMIT_REF?.substring(0, 7) || "dev";
  const repoUrl = import.meta.env.VITE_REPO_URL || "";

  const commitUrl =
    repoUrl && commitHash !== "dev"
      ? `${repoUrl}/commit/${import.meta.env.VITE_COMMIT_REF}`
      : null;

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-black">
        <header className="border-b-2 border-black bg-black p-6">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-center font-mono text-2xl font-bold text-white">
              msg.pet
            </h1>
            <p className="text-center font-mono text-xs text-gray-600 mt-1">
              send self-destructing messages
            </p>
          </div>
        </header>

        <main className="py-8">
          <Routes>
            <Route path="/" element={<CreateMessage />} />
            <Route path="/:id" element={<ViewMessage />} />
          </Routes>
        </main>
        <footer className="fixed bottom-0 w-full border-t-2 border-gray-800 bg-black p-4">
          <p className="text-center font-mono text-xs text-gray-500">
            end-to-end encrypted · server blind · one view only
          </p>
          <p className="text-center font-mono text-xs text-gray-500">
            {commitUrl ? (
              <a
                href={commitUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-gray-400 hover:text-black transition underline"
              >
                commit: {commitHash}
              </a>
            ) : (
              <span className="ml-2 text-gray-400">commit: {commitHash}</span>
            )}
          </p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
