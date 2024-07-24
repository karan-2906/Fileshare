import React, { useEffect } from "react";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import { Toaster } from "react-hot-toast"
// import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoutes from "./utils/PrivateRoutes";
import Home from "./Pages/Home";
import Navbar from "./components/Navbar";
import { useHello } from "./hooks/user";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";




function App() {
  return (

    <div className="App h-screen dark:bg-slate-600">

      <Router>
        {/* <ToastContainer /> */}
        <Toaster />
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<PrivateRoutes />}>
            <Route path="/home" element={<Home />} />
          </Route>
        </Routes>
      </Router>

    </div>

  );
}

export default App;
