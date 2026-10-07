import React from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import ContactInfoBar from '../../components/Contactinfobar/Contactinfobar'
import CareerContent from '../../components/CareerContent/CareerContent'
import PageBanner from './../../components/Pagebanner/Pagebanner';
import CareerBanner from "../../assets/inner-banner.jpg";


function Career() {
  return (
    <div>
      <Navbar/>
      <PageBanner
        image={CareerBanner}
        title="Careers"
        currentPage="Careers"
      />
      <CareerContent/>
      <ContactInfoBar/>
      <Footer/>
      
    </div>
  )
}

export default Career
