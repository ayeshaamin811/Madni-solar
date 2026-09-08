import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import PageBanner from "../../components/Pagebanner/Pagebanner";
import heroBanner from "../../assets/hero-banner.webp";
import "./BatteriesPage.css";

/*
  ============================================================================
  BATTERIES PAGE
  ----------------------------------------------------------------------------
  This is a skeleton page. The Navbar, Footer and banner are already wired up,
  and an empty container section is provided below — add your battery brand /
  capacity content in the <section className="batteries-content"> block.
  ============================================================================
*/
function BatteriesPage() {
  return (
    <div>
      <Navbar />

      <PageBanner
        image={heroBanner}
        title="Batteries"
        currentPage="Batteries"
      />

      {/* ===== Add your batteries data here ===== */}
      <section className="batteries-content">
        <div className="container">
          {/* Placeholder — replace with your battery brands / capacities */}
          <p className="batteries-placeholder">
            Batteries content coming soon.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default BatteriesPage;