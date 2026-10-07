import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import PageBanner from '../../components/Pagebanner/Pagebanner';
import MeetOurTeam from '../../components/Meetourteam/Meetourteam';
import Testimonials from '../../components/Testimonials/Testimonials';
import ContactInfoBar from '../../components/Contactinfobar/Contactinfobar';
import TeamBanner from '../../assets/inner-banner.jpg';
import './TeamPage.css';
import TeamPages from '../../components/TeamMemberPage/TeamPages';

function TeamPage() {
  return (
    <div className="team-page">
      <Navbar />

      {/* ===== Page banner with breadcrumb ===== */}
      <PageBanner
        image={TeamBanner}
        title="Our Team"
        currentPage="Our Team"
      />

      {/* ===== Meet our team section ===== */}
      <MeetOurTeam />
      <TeamPages/>

      {/* ===== Clients testimonials ===== */}
      <Testimonials />

      <ContactInfoBar />
      <Footer />
    </div>
  );
}

export default TeamPage;