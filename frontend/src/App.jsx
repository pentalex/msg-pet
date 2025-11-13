import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateMessage from "./components/CreateMessage";
import ViewMessage from "./components/ViewMessage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-black">
        <header className="p-6">
          <h1 className="text-4xl font-bold text-center text-gray-800">
            o.page
          </h1>
          <p className="text-center text-gray-600 mt-2">
            send self-destructing messages that disappear after one view
          </p>
        </header>

        <main className="py-8">
          <Routes>
            <Route path="/" element={<CreateMessage />} />
            <Route path="/:id" element={<ViewMessage />} />
          </Routes>
        </main>

        <footer className="text-center text-gray-500 text-sm py-8"></footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
