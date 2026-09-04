import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import Navbar from './components/layout/Navbar/Navbar';
import Footer from './components/layout/Footer/Footer';
import ScrollToTop from './components/layout/ScrollToTop/ScrollToTop';
import Home from './pages/Home/Home';
import WhyUs from './pages/WhyUs/WhyUs';
import Portfolio from './pages/Portfolio/Portfolio';
import Contact from './pages/Contact/Contact';
import ApiServices from './pages/ApiServices/ApiServices';
import DevelopmentServices from './pages/DevelopmentServices/DevelopmentServices';
import MoreServices from './pages/MoreServices/MoreServices';
import BusinessAutomation from './pages/BusinessAutomation/BusinessAutomation';
import WhatsAppApi from './pages/WhatsAppApi/WhatsAppApi';
import Course from './pages/Course/Course';
import GetQuote from './pages/GetQuote/GetQuote';
import Admin from './pages/Admin/Admin';


function App() {
  const location = useLocation();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Reset scroll position to top instantly on route change unless noScroll state is passed
  useEffect(() => {
    if (location.state?.noScroll) {
      return;
    }
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className={isAdmin ? "admin-app-layout" : "app-layout"}>
      {/* Scroll Progress Bar */}
      {!isAdmin && <motion.div className="scroll-progress-bar" style={{ scaleX }} />}

      {!isAdmin && <Navbar />}
      <main className={isAdmin ? "admin-main-wrapper" : "main-content"}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/why-us" element={<Navigate to="/why-us/it-company-in-mumbai" replace />} />
          <Route path="/why-us/it-company-in-mumbai" element={<WhyUs />} />
          <Route path="/portfolio" element={<Navigate to="/portfolio/ecommerce-development-company-in-mumbai" replace />} />
          <Route path="/portfolio/ecommerce-development-company-in-mumbai" element={<Portfolio />} />
          <Route path="/contact" element={<Navigate to="/contact/ecommerce-management-company-in-mumbai" replace />} />
          <Route path="/contact/ecommerce-management-company-in-mumbai" element={<Contact />} />
          <Route path="/api-services" element={<ApiServices />} />
          <Route path="/api-services/:serviceId" element={<ApiServices />} />
          <Route path="/development-services" element={<DevelopmentServices />} />
          <Route path="/development-services/:serviceId" element={<DevelopmentServices />} />
          <Route path="/more-services" element={<MoreServices />} />
          <Route path="/more-services/:serviceId" element={<MoreServices />} />
          <Route path="/ecommerce-services" element={<Navigate to="/ecommerce-services/account-management-service-in-mumbai" replace />} />
          <Route path="/ecommerce-services/:serviceId" element={<BusinessAutomation />} />
          <Route path="/business-tools" element={<Navigate to="/business-tools/business-card-scanner-in-mumbai" replace />} />
          <Route path="/business-tools/:serviceId" element={<BusinessAutomation />} />
          {/* Kept for backward compatibility if needed, though they will redirect inside the component */}
          <Route path="/business-automation" element={<BusinessAutomation />} />
          <Route path="/business-automation/:serviceId" element={<BusinessAutomation />} />
          <Route path="/whatsapp-api" element={<WhatsAppApi />} />
          <Route path="/whatsapp-api/:serviceId" element={<WhatsAppApi />} />
          <Route path="/course" element={<Navigate to="/course/ecommerce-courses-in-mumbai" replace />} />
          <Route path="/course/ecommerce-courses-in-mumbai" element={<Course />} />
          <Route path="/get-quote" element={<GetQuote />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          
          {/* Legacy & Short URL redirects */}
          <Route path="/api-services/amazon" element={<Navigate to="/api-services/amazon-api-service-provider-in-mumbai" replace />} />
          <Route path="/development-services/website-development" element={<Navigate to="/development-services/website-development-service-in-mumbai" replace />} />
          <Route path="/development-services/software-development" element={<Navigate to="/development-services/software-development-service-in-mumbai" replace />} />
          <Route path="/development-services/app-development" element={<Navigate to="/development-services/mobile-app-development-service-in-mumbai" replace />} />
          <Route path="/more-services/seo-services" element={<Navigate to="/more-services/seo-and-digital-marketing-service-in-mumbai" replace />} />

          {/* Catch-all redirect for any unknown paths */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
      {!isAdmin && <ScrollToTop />}
    </div>
  );
}

export default App;