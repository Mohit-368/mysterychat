import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Landing from "./pages/Landing";
import About from "./pages/About";
import Login from "./pages/login";
import Register from "./pages/register";
import Chat from "./pages/Chat";
import NotFound from "./pages/404";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context";

export default function App() { return <AuthProvider><Router><Navbar /><Routes><Route path="/" element={<Landing />} /><Route path="/about" element={<About />} /><Route path="/login" element={<Login />} /><Route path="/register" element={<Register />} /><Route element={<ProtectedRoute />}><Route path="/chat" element={<Chat />} /></Route><Route path="*" element={<NotFound />} /></Routes><Footer /></Router></AuthProvider>; }
