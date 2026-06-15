import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './components/pages/Home.jsx'
import MenuPage from './components/pages/MenuPage.jsx'
import ItemDetail from './components/pages/ItemDetail.jsx'
import Contact from './components/pages/Contact.jsx'
import Admin from './components/pages/Admin.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/item/:id" element={<ItemDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
