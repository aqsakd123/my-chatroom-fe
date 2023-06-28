import './App.css';
import { Routes, Route } from "react-router-dom";
import Login from "./auth/login";
import SignUp from "./auth/sign-up";
import {AuthProvider} from "./auth/auth-context";
import ChatRoom from "./chat-room/chat-room";
import Dashboard from "./dashboard";
import TopBar from "./global/top-bar";
import UpdateProfile from "./auth/update-info";
import ForgotPassword from "./auth/reset-password";
import Page404 from "./global/404";

function App() {
  return (
    <div className="App">
        <AuthProvider>
            <TopBar />
            <Routes>
                <Route path={"/"} element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<SignUp />} />
                <Route path="/update-info" element={<UpdateProfile />} />
                <Route path="/forget-pass" element={<ForgotPassword />} />
                <Route path="*" element={<Page404 />} />
            </Routes>
        </AuthProvider>
    </div>
  );
}

export default App;
