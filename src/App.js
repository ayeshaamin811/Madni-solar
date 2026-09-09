import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import SolarPanelsPage from "./pages/SolarPanelsPage/SolarPanelsPage";
import InverterCategoryPage from "./pages/InverterCategoryPage/InverterCategoryPage";
import InverterBrandPage from "./pages/InverterBrandPage/InverterBrandPage";
import InverterDetailPage from "./pages/InverterDetailPage/InverterDetailPage";
import BatteriesPage from "./pages/BatteriesPage/BatteriesPage";
import inverterCategories from "./data/inverterCategories";


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

        {/* ===== Inverter category routes =====
            Har category ke teen routes bante hain:

              /inverters/ongrid-inverters                    -> category page
              /inverters/ongrid-inverters/:brandSlug         -> brand page
              /inverters/ongrid-inverters/:brandSlug/:productSlug -> detail page

            Category segment static hai (data se generate hoti hai), is liye ye
            neeche waale purane dynamic routes se pehle match hoti hain — React
            Router static segments ko priority deta hai. */}
        {inverterCategories.map((category) => (
          <React.Fragment key={category.slug}>
            <Route
              path={`/inverters/${category.slug}`}
              element={<InverterCategoryPage categorySlug={category.slug} />}
            />
            <Route
              path={`/inverters/${category.slug}/:brandSlug`}
              element={<InverterBrandPage categorySlug={category.slug} />}
            />
            <Route
              path={`/inverters/${category.slug}/:brandSlug/:productSlug`}
              element={<InverterDetailPage categorySlug={category.slug} />}
            />
          </React.Fragment>
        ))}

        {/* Purane flat URLs — bookmarks/links tootne se bachane ke liye rakhe
            hain; category pata na ho tou breadcrumb khud dhoond leta hai. */}
        <Route path="/inverters/:brandSlug" element={<InverterBrandPage />} />
        <Route path="/inverters/:brandSlug/:productSlug" element={<InverterDetailPage />} />
        <Route path="/batteries" element={<BatteriesPage />} />
        <Route path="/blog" element={<BlogPage />} />
        {/* /solar-panels par saare panels ki listing (Inverters page jaisi) */}
        <Route path="/solar-panels" element={<SolarPanelsPage />} />
        <Route path="/solar-panels/:brandSlug" element={<SolarPanelBrandPage />} />
        <Route path="/solar-panels/:brandSlug/:productSlug" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
      </Routes>
    </Router>
  );
}

export default App;