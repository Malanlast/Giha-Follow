import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './Pages/login.jsx';
import DashBoard from './Pages/DashBoard.jsx';

function App() { 
  return (
   <BrowserRouter>
   <Routes>
    <Route path="/" element={<Login />}/>
    <Route path="/dashboard" element={<DashBoard />} />
   </Routes>
  </BrowserRouter>
  )
}

export default App
