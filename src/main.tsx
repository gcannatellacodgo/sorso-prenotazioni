import React from "react";
import ReactDOM from "react-dom/client";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { BrowserRouter } from "react-router-dom";


import "./index.css";
import AppRoutes from "./AppRoutes.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <BrowserRouter>
            <MantineProvider defaultColorScheme="dark">
                <Notifications position="top-right" />
                <AppRoutes />
            </MantineProvider>
        </BrowserRouter>
    </React.StrictMode>
);