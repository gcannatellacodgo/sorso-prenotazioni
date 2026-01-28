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
        <div className="h-full w-full flex flex-col bg-black">
          <Notifications position="top-right" />

          {/* HEADER */}
          <HeaderOverlay onOpenMenu={() => setMenuOpened(true)} />

          {/* APP → prende lo spazio rimanente */}
          <div className="flex-1 overflow-hidden">
            <App />
          </div>

          {/* MENU */}
          <HomeMenuOverlay
            opened={menuOpened}
            onClose={() => setMenuOpened(false)}
          />
        </div>
      </MantineProvider>
    </BrowserRouter>
    );
}
ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Root />
    </React.StrictMode>
);