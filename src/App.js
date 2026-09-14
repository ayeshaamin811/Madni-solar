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
import BatteryBrandPage from "./pages/BatteryBrandPage/BatteryBrandPage";
import BatteryDetailPage from "./pages/BatteryDetailPage/BatteryDetailPage";
import ProductsCatalogPage from "./pages/ProductsCatalogPage/ProductsCatalogPage";
import ProductCategoryPage from "./pages/ProductCategoryPage/ProductCategoryPage";
import ProductItemPage from "./pages/ProductItemPage/ProductItemPage";
import ProductItemDetailPage from "./pages/ProductItemDetailPage/ProductItemDetailPage";
import CalculatorPage from "./pages/CalculatorPage/CalculatorPage";
import productCategories from "./data/productCategories";

// Inverter categories ab backend se aati hain (src/api/inverters.js), lekin
// in teeno ki slugs stable hain (naya category add karna khud hi code change
// maangta hai) — is liye yahan static rakhi hain. Static rehna zaroori bhi hai:
// category segment ko bhi :param bana dete tou /inverters/:category/:brandSlug
// aur purani flat /inverters/:brandSlug/:productSlug route ek jaisi shape ki
// ban jati (dono "/inverters/:a/:b"), jo React Router mein ambiguous hai —
// static segment hi unhe ek dusre se alag rakhta hai.
const INVERTER_CATEGORY_SLUGS = [
  "ongrid-inverters",
  "batteryless-pv-inverters",
  "hybrid-inverters",
];


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
        <Route path="/request-quote" element={<SendRequest />} />
        <Route path="/calculator" element={<CalculatorPage />} />
        <Route path="/our-products" element={<ProductsPage />} />
        <Route path="/careers" element={<Career />} />
        <Route path="/policy-trading" element={<PolicyTrading />} />
        <Route path="/inverters" element={<InvertersPage />} />


        {INVERTER_CATEGORY_SLUGS.map((categorySlug) => (
          <React.Fragment key={categorySlug}>
            <Route
              path={`/inverters/${categorySlug}`}
              element={<InverterCategoryPage categorySlug={categorySlug} />}
            />
            <Route
              path={`/inverters/${categorySlug}/:brandSlug`}
              element={<InverterBrandPage categorySlug={categorySlug} />}
            />
            <Route
              path={`/inverters/${categorySlug}/:brandSlug/:productSlug`}
              element={<InverterDetailPage categorySlug={categorySlug} />}
            />
          </React.Fragment>
        ))}

        {/* Purane flat URLs — bookmarks/links tootne se bachane ke liye rakhe
            hain; category pata na ho tou breadcrumb khud dhoond leta hai. */}
        <Route path="/inverters/:brandSlug" element={<InverterBrandPage />} />
        <Route path="/inverters/:brandSlug/:productSlug" element={<InverterDetailPage />} />

        <Route path="/batteries" element={<BatteriesPage />} />
        <Route path="/batteries/:brandSlug" element={<BatteryBrandPage />} />
        <Route
          path="/batteries/:brandSlug/:productSlug"
          element={<BatteryDetailPage />}
        />
        <Route path="/products" element={<ProductsCatalogPage />} />

        {productCategories.map((category) => (
          <React.Fragment key={category.slug}>
            <Route
              path={`/products/${category.slug}`}
              element={<ProductCategoryPage categorySlug={category.slug} />}
            />
            <Route
              path={`/products/${category.slug}/:itemSlug`}
              element={<ProductItemPage categorySlug={category.slug} />}
            />
            <Route
              path={`/products/${category.slug}/:itemSlug/:productSlug`}
              element={<ProductItemDetailPage categorySlug={category.slug} />}
            />
          </React.Fragment>
        ))}

        {/* Category ke baghair flat URLs — breadcrumb khud category dhoond leta hai. */}
        <Route path="/products/:itemSlug" element={<ProductItemPage />} />
        <Route
          path="/products/:itemSlug/:productSlug"
          element={<ProductItemDetailPage />}
        />
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