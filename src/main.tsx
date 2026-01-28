import React from "react";
import ReactDOM from "react-dom/client";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { BrowserRouter } from "react-router-dom";


import "./index.css";
import App from "./App.tsx";
import HeaderOverlay from "./components/HeaderOverlay.tsx";
import HomeMenuOverlay from "./components/HomeMenuOverlay.tsx";

function Root() {
    const [menuOpened, setMenuOpened] = React.useState(false);

    return (
        <BrowserRouter>
            <MantineProvider defaultColorScheme="dark">
                <Notifications position="top-right" />

                {/* HEADER (apre il menu) */}
                <HeaderOverlay onOpenMenu={() => setMenuOpened(true)} />

                {/* APP */}
                <App />

                {/* MENU (si chiude) */}
                <HomeMenuOverlay
                    opened={menuOpened}
                    onClose={() => setMenuOpened(false)}
                />
            </MantineProvider>
        </BrowserRouter>
    );
}
ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Root/>
    </React.StrictMode>
);