import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import Navbar from './components/layout/Navbar/Navbar';
import Footer from './components/layout/Footer/Footer';
import Home from './pages/home/Home';
import WhyUs from './pages/WhyUs/WhyUs';
import Portfolio from './pages/Portfolio/Protfolio';
import Contact from './pages/Contact/Contact';
import ApiServices from './pages/Api Services/Api Services';
import DevelopmentServices from './pages/Developmemt Services/Development services';
import MoreServices from './pages/More Services/More Services';

function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="app-layout">
      {/* Scroll Progress Bar */}
      <motion.div className="scroll-progress-bar" style={{ scaleX }} />

      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/why-us" element={<WhyUs />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/api-services" element={<ApiServices />} />
          <Route path="/api-services/:serviceId" element={<ApiServices />} />
          <Route path="/development-services" element={<DevelopmentServices />} />
          <Route path="/development-services/:serviceId" element={<DevelopmentServices />} />
          <Route path="/more-services" element={<MoreServices />} />
          <Route path="/more-services/:serviceId" element={<MoreServices />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;