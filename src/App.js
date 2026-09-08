import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/home';
import ContactPage from './pages/ContactPage/ContactPage';
import FaqPage from './pages/FaqPage';
import PrivacyPolicy from './pages/Privacypolicy/Privacypolicy';
import TermsAndConditions from './pages/TermsAndConditions/TermsAndConditions';
import RefundPolicy from './pages/RefundPolicy/RefundPolicy';
import AboutPage from './pages/AboutPage/AboutPage';
import TeamPage from './pages/TeamPage/TeamPage';
import ServicesPage from './pages/ServicesPage/ServicesPage';
import ProjectsPage from './pages/ProjectsPage/ProjectsPage';
import LoginRegister from './pages/Loginregister/Loginregister';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import SendRequest from './pages/RequestQuote/RequestQuote';
import ProductsPage from './pages/ProductsPage/ProductsPage';
import Career from './pages/CareerPage/Career';
import BlogPage from './pages/BlogPage/Blog';
import SolarPanelBrandPage from "./pages/SolarPanelBrandPage/SolarPanelBrandPage";
import ProductDetailPage from "./pages/ProductDetailPage/ProductDetailPage";
import CartPage from "./pages/CartPage/CartPage";
import CheckoutPage from "./pages/CheckoutPage/CheckoutPage";
import PolicyTrading from "./pages/PolicyTrading/PolicyTrading";
import InvertersPage from "./pages/InvertersPage/InvertersPage";
import InverterBrandPage from "./pages/InverterBrandPage/InverterBrandPage";
import InverterDetailPage from "./pages/InverterDetailPage/InverterDetailPage";
import BatteriesPage from "./pages/BatteriesPage/BatteriesPage";


function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/Faqs" element={<FaqPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/our-projects" element={<ProjectsPage />} />
        <Route path="/orders" element={<LoginRegister />} />
        <Route path="/request-quote" element={<SendRequest />} />
        <Route path="/our-products" element={<ProductsPage />} />
        <Route path="/careers" element={<Career />} />
        <Route path="/policy-trading" element={<PolicyTrading />} />
        <Route path="/inverters" element={<InvertersPage />} />
        <Route path="/inverters/:brandSlug" element={<InverterBrandPage />} />
        <Route path="/inverters/:brandSlug/:productSlug" element={<InverterDetailPage />} />
        <Route path="/batteries" element={<BatteriesPage />} />
        <Route path="/blog" element={<BlogPage />} />
        {/* Bare /solar-panels (no brand chosen) redirects to the first brand */}
        <Route path="/solar-panels" element={<Navigate to="/solar-panels/yingli" replace />} />
        <Route path="/solar-panels/:brandSlug" element={<SolarPanelBrandPage />} />
        <Route path="/solar-panels/:brandSlug/:productSlug" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
      </Routes>
    </Router>
  );
}

export default App;