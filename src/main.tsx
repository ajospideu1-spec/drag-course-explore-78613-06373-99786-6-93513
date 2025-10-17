import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const removeFixedElements = () => {
  document.querySelectorAll('[style*="position: fixed"][style*="bottom: 1rem"][style*="right: 1rem"][style*="z-index: 2147483647"]').forEach(el => el.remove());
};

window.addEventListener('load', removeFixedElements);
setInterval(removeFixedElements, 1000);

createRoot(document.getElementById("root")!).render(<App />);
