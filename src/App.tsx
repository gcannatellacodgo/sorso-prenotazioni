import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.tsx";
import About from "./pages/About.tsx";
import StaffLogin from "./pages/StaffLogin.tsx";
import StaffPage from "./pages/StaffPage.tsx";
import LogoutPage from "./pages/LogoutPage.tsx";



export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/staff" element={<StaffLogin />} />
            <Route path="/admin" element={<StaffPage />} />
            <Route path="/logout" element={<LogoutPage />} />
        </Routes>
    );
}