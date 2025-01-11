
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import InventoryDashboard from './page/InventoryDashboard';

function App() {

  return (
    <>
       <BrowserRouter>
                <Routes>
                  <Route path="/" element={<InventoryDashboard />} />
                </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
