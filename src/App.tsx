import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.tsx";
import About from "./pages/About.tsx";



export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/" element={<About />} />
        </Routes>
    );
}