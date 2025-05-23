import { createRoot } from "react-dom/client";
import "./index.css";

// import { StrictMode } from "react";
import App from "./app";

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
	const root = createRoot(rootElement);
	root.render(
        <App />
        // <StrictMode>
        // </StrictMode>
    );
}
