import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import CreateMessage from "./components/CreateMessage";
import ViewMessage from "./components/ViewMessage";
import Logo from "./assets/logo.svg";
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
        <header className="  bg-black p-6">
          <div className="max-w-2xl mx-auto">
            <Link
              to="/"
              className="flex items-center justify-center gap-3 hover:opacity-80 transition"
            >
              <img src={Logo} alt="msg.pet logo" className="w-12 h-12" />
              <h1 className="font-mono text-4xl font-bold text-white">
                msg.pet
              </h1>
            </Link>
            <p className="text-center font-mono text-md text-gray-600 mt-2">
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
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
