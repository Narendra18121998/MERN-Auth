import React from "react";
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./pages/Home";
import ProtectedRoutes from "./services/protectedRoutes";
import ForgetPassword from "./pages/ForgetPassword";
import ChangePassword from "./pages/ChangePassword";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<Register/>} />
            <Route path='/reset-password' element={<ForgetPassword/>} />
            <Route path='/user/reset/:id/:token' element={<ChangePassword/>} />
            <Route path="/" element={<ProtectedRoutes />}>
                <Route path="/" element={<Home/>} />
            </Route>
        
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
