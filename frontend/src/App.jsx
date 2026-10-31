import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./Landing";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<iframe src="/auth.html" title="Auth" className="w-full h-screen border-0" />} />
        <Route path="/signup" element={<iframe src="/auth.html" title="Auth" className="w-full h-screen border-0" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
