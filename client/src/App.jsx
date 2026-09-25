import { BrowserRouter } from "react-router-dom";
import { useState } from "react";

import AppRoutes from "./routes/routes";
import NotificationCenter from "./components/NotificationCenter";

import "./App.css";

function App() {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <BrowserRouter>
      <AppRoutes
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <NotificationCenter />
    </BrowserRouter>
  );
}

export default App;