import React from "react";
import "./Meetourteam.css";
import { FaInstagram, FaFacebookF, FaTwitter } from "react-icons/fa";

// Images imported from the assets folder
import team1 from "../../assets/teams/team.jpg";
import team2 from "../../assets/teams/rafay.jpg";
import team3 from "../../assets/teams/waleed.png";
import team4 from "../../assets/teams/team.jpg";

function MeetOurTeam() {
  // Common social media URLs for the team members.
  // Update these links with the actual team/profile pages as needed.
  const socialLinks = {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    twitter: "https://twitter.com/",
  };

  // Team data - easy to update or load from an API later
  const teamData = [
    {
      image: team1,
      name: "Safdar Hussain",
      role: "CEO",
    },
    {
      image: team2,
      name: "Abdul Raffay",
      role: "Director",
    },
    {
      image: team3,
      name: "Waleed Hussain",
      role: "Director",
    },
 
  ];

  // Social media icons shown on card hover
  const socialIcons = [
    { href: socialLinks.instagram, label: "Instagram", Icon: FaInstagram },
    { href: socialLinks.facebook, label: "Facebook", Icon: FaFacebookF },
    { href: socialLinks.twitter, label: "Twitter", Icon: FaTwitter },
  ];

  return (
    <section className="team-section">
      <div className="container">
        {/* Heading */}
        <h2 className="team-heading">Meet Our Team</h2>

        {/* Team grid */}
        <div className="team-grid grid">
          {teamData.map((member, index) => (
            <div className="team-card" key={index}>
              {/* Photo with social links overlay */}
              <div className="team-image-wrapper">
                <img
                  src={member.image}
                  alt={member.name}
                  className="team-image"
                />
                <div className="team-social-overlay">
                  {socialIcons.map(({ href, label, Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="team-social-link"
                    >
                      <Icon />
                    </a>
                  ))}
                </div>
              </div>

              {/* Name and role */}
              <div className="team-info">
                <h3 className="team-name">{member.name}</h3>
                <p className="team-role">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default MeetOurTeam;