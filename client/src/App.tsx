import { Route, Routes, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import Header from './components/Header';
import Footer from './components/Footer';
import WhatsAppFloat from './components/WhatsAppFloat';
import SmoothScroll from './components/SmoothScroll';
import Cursor from './components/Cursor';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ExcursionDetail from './pages/ExcursionDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import PaymentResult from './pages/PaymentResult';
import Admin from './pages/admin/Admin';
import NotFound from './pages/NotFound';

export default function App() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');
  return (
    <div className="flex min-h-screen flex-col">
      <SmoothScroll />
      {!isAdmin && <Cursor />}
      {!isAdmin && <Header />}
      <motion.main
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex-1"
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/excursiones" element={<Catalog />} />
          <Route path="/excursion/:slug" element={<ExcursionDetail />} />
          <Route path="/nosotros" element={<About />} />
          <Route path="/contacto" element={<Contact />} />
          <Route path="/pago" element={<PaymentResult />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.main>
      {!isAdmin && <Footer />}
      {!isAdmin && <WhatsAppFloat />}
    </div>
  );
}
