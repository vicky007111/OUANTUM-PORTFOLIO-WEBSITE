import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import useSEO from '../hooks/useSEO';
import aiEngineerImages from '../data/aiEngineerImages';
import dataEngineerImages from '../data/dataEngineerImages';
import fullStackDeveloperImages from '../data/fullStackDeveloperImages';
import { CanvasMarquee } from '../components/CanvasMarquee';
import { InteractiveSlider } from '../components/InteractiveSlider';

const BASE_URL = 'https://ouantum.com';

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Ouantum',
  url: BASE_URL,
  sameAs: ['https://www.linkedin.com/company/ouantum/'],
  founders: [
    {
      '@type': 'Person',
      name: 'Balakumaran D',
      jobTitle: 'President',
      description: 'Built Ouantum with a vision to transform manual QA into a single efficient workflow.',
    },
    {
      '@type': 'Person',
      name: 'Rahul',
      jobTitle: 'Chief Executive Officer',
      description: 'Leads commercial and strategic direction, shaping go-to-market across government infrastructure projects.',
    },
  ],
};

const team = [
  {
    role: 'PRESIDENT',
    name: 'Balakumaran D',
    image: '/assets/images/Balakumaran_CEO_Profile_Pic.png',
    initials: 'BD',
    bio: 'Balakumaran built Ouantum with a clear vision: civil engineers deserve infrastructure that works from day one. He works with clients across India to turn weeks of manual QA into a single efficient workflow.\n\nHe leads the company\'s strategic direction, ensuring every deployment meets high standards of deterministic quality assurance.\nReach him at +91 7695827158.',
  },
  {
    role: 'CHIEF EXECUTIVE OFFICER',
    name: 'Rahul',
    image: '/assets/images/rahul.jpeg',
    initials: 'RA',
    bio: 'Rahul leads the commercial and strategic direction of Ouantum. He has shaped the go-to-market across Tamil Nadu Housing Board, ADB-funded PMAY schemes, and Amaravati Capital City — building systems that help Ouantum scale without compromising audit quality.\n\nHis focus is on delivering reliable same-day outcomes for every client.\nReach him at +91 861 080 5559.',
  },
  {
    role: 'CHIEF MARKETING OFFICER',
    name: 'Raghu',
    image: '/assets/images/raghu.png',
    initials: 'RG',
    bio: 'Raghu handles the legal framework and compliance structures that underpin Ouantum\'s government-grade report generation. He also contributes to the AI pipeline — ensuring every automated output is legally defensible and technically sound.\n\nHis dual role bridges the gap between engineering precision and regulatory compliance.',
  },
  {
    role: 'CHIEF FINANCIAL OFFICER',
    name: 'Sabari Raja',
    image: '/assets/images/sabari.jpeg',
    initials: 'SR',
    bio: 'Sabari is the frontline interface between Ouantum and every civil engineering firm we serve. He qualifies projects, maps client pain to our capability stack, and ensures the right team is in the room before a single rupee changes hands.\n\nIf you are evaluating Ouantum for your next project, Sabari is your first call.',
  },
  {
    role: 'PROJECT MANAGER',
    name: 'VIGNESH SELVAA K S',
    image: '/assets/images/vignesh_profile.png',
    initials: 'VS',
    bio: 'Vignesh handles project delivery and execution at Ouantum. He manages multiple projects simultaneously, streamlining coordination between site engineers, structural auditors, and our internal AI development teams.\n\nHis operational focus ensures that data collection runs smoothly and reports are generated on schedule, maintaining Ouantum\'s commitment to speed and accuracy.',
  },
];

const FOOTER_H = 88;

const TeamCard = ({ member, index }: { member: typeof team[0]; index: number }) => {
  const [expanded, setExpanded] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.1 }}
      onClick={() => setExpanded(e => !e)}
      className="about-team-card"
      role="button"
      tabIndex={0}
      aria-expanded={expanded}
      aria-label={`${member.name}, ${member.role} — click to view biography`}
      onKeyDown={(e) => e.key === 'Enter' && setExpanded(v => !v)}
    >
      {/* ── PORTRAIT ── */}
      <div
        className="about-team-portrait"
        style={{ transform: expanded ? 'translateY(-100%)' : 'translateY(0)' }}
        aria-hidden="true"
      >
        {member.image && !imgError ? (
          <img
            src={member.image}
            alt={`${member.name}, ${member.role} at Ouantum`}
            onError={() => setImgError(true)}
            className="about-team-portrait-img"
          />
        ) : (
          <div className="about-team-initials-bg">
            <span className="about-team-initials">{member.initials}</span>
          </div>
        )}
        <div className="about-team-tap-hint">TAP</div>
      </div>

      {/* ── BIO PANEL ── */}
      <div
        className="about-team-bio-panel"
        style={{ transform: expanded ? 'translateY(0)' : 'translateY(100%)' }}
      >
        {/* LEFT — passport photo */}
        <div className="about-team-bio-photo-col">
          <div className="about-team-bio-thumb">
            {member.image && !imgError ? (
              <img
                src={member.image}
                alt={`Portrait of ${member.name}`}
                className="about-team-portrait-img"
              />
            ) : (
              <div className="about-team-bio-thumb-placeholder">
                <span>{member.initials}</span>
              </div>
            )}
          </div>
          <p className="about-team-profile-label">PROFILE</p>
        </div>

        {/* RIGHT — bio text */}
        <div className="about-team-bio-text-col">
          <p className="about-team-bio-header">BIOGRAPHY</p>
          <div className="about-team-bio-paragraphs">
            {member.bio.split('\n\n').map((para, i) => (
              <p key={i} className="about-team-bio-para">{para}</p>
            ))}
          </div>
          <p className="about-team-tap-close">TAP TO CLOSE ↑</p>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div className="about-team-footer" style={{ height: FOOTER_H }}>
        <p className="about-team-footer-role">{member.role}</p>
        <h3 className="about-team-footer-name">{member.name}</h3>
      </div>
    </motion.div>
  );
};

const EngineerSection = ({
  images,
  title,
  eyebrow,
}: {
  images: string[];
  title: string;
  eyebrow: string;
}) => {
  const useSlider = images.length <= 6;
  const marqueeImages = images.map((src, i) => ({ src, alt: `${title} ${i + 1}` }));

  return (
    <section className="about-engineers-section" aria-label={`${title} team`}>
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="about-team-eyebrow"
      >
        {eyebrow}
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="about-team-heading"
      >
        {title}
      </motion.h2>

      <div className="about-team-rule" aria-hidden="true" />

      <div className="about-eng-marquee-outer" aria-hidden="true">
        {useSlider ? (
          <InteractiveSlider
            images={images}
            title={title}
            imageWidth={240}
            imageHeight={360}
            gap={20}
            borderRadius={16}
          />
        ) : (
          <CanvasMarquee
            images={marqueeImages}
            imageWidth={240}
            imageHeight={360}
            gap={20}
            speed={60}
            borderRadius={16}
          />
        )}
      </div>
    </section>
  );
};

const About: React.FC = () => {
  useSEO({
    title: 'About Ouantum | Team, Mission & Partner Ecosystem',
    description:
      'Meet the core team behind Ouantum — civil engineers, AI specialists, and structural auditors building deterministic quality assurance for India\'s critical infrastructure.',
    keywords:
      'Ouantum team, Balakumaran D, about Ouantum, civil engineering AI team, structural auditing company India, Etherence, Zapsters, Amith',
    canonicalPath: '/about',
    jsonLd: [organizationSchema],
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main
      className="subpage-wrapper"
      style={{ background: '#000', color: '#fff', minHeight: '100vh', paddingBottom: '80px' }}
    >
      {/* Hero */}
      <section
        className="hero"
        style={{ minHeight: '60vh', paddingTop: '120px' }}
        aria-label="About Ouantum hero section"
      >
        <div className="container hero-content">
          <div className="section-split hero-main-layout">
            <motion.div className="sidebar-info hero-left">
              <div className="hero-labels">
                <span className="hero-tech-label">THE ORGANIZATION · ARCHIVE · INFRASTRUCTURE</span>
              </div>
              <p className="side-description hero-description">
                ARCHIVING THE MINDS BEHIND THE DETERMINISTIC INTELLIGENCE ENGINE.
              </p>
            </motion.div>
            <motion.div className="hero-right-content hero-right">
              <h1
                style={{
                  fontFamily: 'var(--font-adieu)',
                  fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                  lineHeight: 1.1,
                  marginBottom: '2rem',
                }}
              >
                ABOUT<br />ARCHIVE
              </h1>
              <p className="hero-subtext">
                Ouantum is driven by a core team of civil engineers, AI specialists, and structural auditors committed to bringing deterministic, intelligence-driven quality assurance to critical infrastructure.
              </p>
            </motion.div>
          </div>
        </div>
        <motion.div
          className="hero-image-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          style={{ height: '60vh' }}
        >
          <img
            src="/assets/images/about-hero.jpg"
            alt="Civil infrastructure site — background image for Ouantum About page"
            className="subpage-hero-image"
          />
          <div className="overlay-gradient" aria-hidden="true" />
        </motion.div>
      </section>

      {/* Content */}
      <div className="about-content-outer">
        <div className="about-content-stack">

          {/* LEADERSHIP */}
          <section aria-label="Leadership team">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="about-team-eyebrow"
            >
              THE TEAM
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="about-team-heading"
            >
              Meet The Core Team
            </motion.h2>

            <div className="about-team-rule" aria-hidden="true" />

            <div className="about-team-grid">
              {team.map((member, i) => (
                <TeamCard key={i} member={member} index={i} />
              ))}
            </div>
          </section>

          {/* AI ENGINEERS MARQUEE */}
          <EngineerSection
            images={aiEngineerImages}
            title="AI Engineers"
            eyebrow="THE ENGINEERS"
          />

          {/* DATA ENGINEERS MARQUEE */}
          <EngineerSection
            images={dataEngineerImages}
            title="Data Engineers"
            eyebrow="THE ENGINEERS"
          />

          {/* FULL STACK DEVELOPERS MARQUEE */}
          <EngineerSection
            images={fullStackDeveloperImages}
            title="Full Stack Developers"
            eyebrow="THE DEVELOPERS"
          />

          {/* PARTNER ECOSYSTEM */}
          <section className="about-partners-section" aria-label="Partner ecosystem">
            <h2 className="about-partners-heading">
              PARTNER ECOSYSTEM
            </h2>
            <div className="about-partners-grid">
              {[
                { name: 'ETHERENCE', desc: 'TECHNOLOGY & CYBERSECURITY', url: 'https://etherence.com', label: 'etherence.com' },
                { name: 'ZAPSTERS', desc: 'UI/UX & CIVIL INTERFACE', url: 'https://zapsters.in', label: 'zapsters.in' },
                { name: 'AMITH', desc: 'CIVIL & ALLIED ENGINEERING', url: 'https://amith.in.net', label: 'amith.in.net' },
              ].map(p => (
                <a
                  key={p.name}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="about-partner-link"
                  aria-label={`Visit ${p.name} — ${p.desc} partner of Ouantum`}
                >
                  <div className="animated-silver-bg about-partner-card">
                    <h3 className="about-partner-name">{p.name}</h3>
                    <p className="about-partner-desc">{p.desc}</p>
                    <span className="about-partner-url">{p.label} ↗</span>
                  </div>
                </a>
              ))}
            </div>
          </section>

        </div>
      </div>
    </main>
  );
};

export default About;
