import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import { Provider } from "./provider.jsx";
import "./styles/globals.css";
import { ResponseDataProvider } from "./component/ResponseDataContext.jsx";
import AppContextProvider from "./contexts/AppContext.jsx";
import { TransferProvider } from "./pages/WeOne/Components/TransferContext.jsx";
import { NotificationProvider } from "./pages/WeOne/Components/NotificationContext.jsx";
import { LeaderProvider } from "./pages/DashboardCrm/contexts/LeaderContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <AppContextProvider>
    <BrowserRouter>
      <Provider>
        <NotificationProvider>
          <TransferProvider>
            <LeaderProvider>
              <App />
            </LeaderProvider>
          </TransferProvider>
        </NotificationProvider>
      </Provider>
    </BrowserRouter>
  </AppContextProvider>
  // </React.StrictMode>
);
