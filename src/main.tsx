import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ContentProvider } from "@/content/ContentContext";
import App from "./App";

import "@/styles/tokens.css";
import "@/styles/layout.css";
import "@/styles/home.css";
import "@/styles/pages.css";
import "@/styles/casestudy.css";
import "@/styles/admin.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ContentProvider>
        <App />
      </ContentProvider>
    </BrowserRouter>
  </React.StrictMode>
);
