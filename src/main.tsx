import ReactDOM from "react-dom/client";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import "./index.css";
import App from "./App";
import {StrictMode} from "react";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <MantineProvider defaultColorScheme="dark">
            <Notifications position="top-right" />
            <App />
        </MantineProvider>
    </StrictMode>
);