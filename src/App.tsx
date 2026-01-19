import { Routes, Route, Navigate } from "react-router-dom";

import StaffPage from "./pages/StaffPage";
import BookingPage from "./pages/BookingPage";
import StaffLogin from "./pages/StaffLogin";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<BookingPage />} />

            <Route path="/staff-login" element={<StaffLogin />} />
            <Route path="/staff" element={<StaffPage />} />

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}