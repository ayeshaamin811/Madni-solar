import React from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import StatsCards from '../../components/Statscards/Statscards'
import ContactInfoBar from '../../components/Contactinfobar/Contactinfobar'
import ProductsBanner from "../../assets/hero-banner.webp";
import PageBanner from '../../components/Pagebanner/Pagebanner'
import Testimonials from '../../components/UserTestimonials/UserTestimonials'
import ProductsGrid from '../../components/Productsgrid/Productsgrid'


function ProductsPage() {
  return (
    <div>
      <Navbar/>
        <PageBanner
        image={ProductsBanner}
        title="Products"
        currentPage="Our Products"
      />
      <StatsCards/>
      <ProductsGrid/>
      <Testimonials/>
      <ContactInfoBar/>
      <Footer/>
      
    </div>
  )
}

export default ProductsPage
