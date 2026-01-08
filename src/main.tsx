import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./styles/globals.css";

const root = createRoot(document.getElementById('root')!);
root.render(
  <div className="page-container">
    <App />
  </div>
);