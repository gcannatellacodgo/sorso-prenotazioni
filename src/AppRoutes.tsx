import { Navigate, Route, Routes } from "react-router-dom";


import App from "./App.tsx";
import AdminPage from "./AdminPage.tsx";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}