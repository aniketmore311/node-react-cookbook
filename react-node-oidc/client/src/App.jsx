import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import CognitoCB from "./pages/CognitoCB";
import Logout from "./pages/Logout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login" element={<Logout />} />
        <Route path="/auth/cognito/cb" element={<CognitoCB />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
