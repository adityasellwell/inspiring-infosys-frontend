import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiExternalLink, FiSearch } from 'react-icons/fi';
import './Portfolio.css';

const PROJECTS = [
  {
    title: 'Spartan Nutrition',
    category: 'Websites',
    img: '/img/web-spartan.png',
    link: 'https://spartannutrition.com/',
    desc: 'Custom designed high-performance responsive website for sports nutrition products.',
  },
  {
    title: 'Tap2Cash',
    category: 'Software',
    img: '/img/tap2cash.png',
    link: 'https://tap2cash.in/',
    desc: 'Interactive POS and financial transaction software solution.',
  },
  {
    title: 'Lactra B2B',
    category: 'E-Commerce',
    img: '/img/web-lactra.png',
    link: 'https://www.lactra.in/',
    desc: 'Wholesale B2B ordering portal and e-commerce listing management solution.',
  },
  {
    title: 'Ayaan Toys',
    category: 'E-Commerce',
    img: '/img/Web-ayantoys.png',
    link: '',
    desc: 'Product catalog setup, inventory tracking and seller account automation.',
  },
  {
    title: 'Clasi Air',
    category: 'Websites',
    img: '/img/Web-clasair.png',
    link: '',
    desc: 'Brand website optimized for page speed, search visibility, and conversion.',
  },
  {
    title: 'Lycot Swimwear',
    category: 'E-Commerce',
    img: '/img/Web-lycot.png',
    link: '',
    desc: 'Marketplace account setup, listings optimization, and active ad campaign management.',
  },
];

const FILTERS = ['All', 'Websites', 'E-Commerce', 'Software'];

function Portfolio() {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = PROJECTS.filter((project) => {
    const matchesFilter = selectedFilter === 'All' || project.category === selectedFilter;
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="portfolio-page">
      {/* ── Page Hero ────────────────────────────────────────────── */}
      <section className="inner-page-hero">
        <div className="inner-page-hero-overlay"></div>
        <div className="container inner-page-hero-content">
          <motion.span 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-badge"
          >
            Our Work
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="page-hero-title"
          >
            Projects We've Built
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="page-hero-sub"
          >
            A curated showcase of software systems, web platforms, and successful e-commerce accounts built by our team.
          </motion.p>
        </div>
      </section>

      {/* ── Filter & Search Controls ──────────────────────────────── */}
      <section className="portfolio-controls-section">
        <div className="container controls-container">
          <div className="filter-chips">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                className={`filter-btn ${selectedFilter === filter ? 'active' : ''}`}
                onClick={() => setSelectedFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="search-bar">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* ── Projects Grid ─────────────────────────────────────────── */}
      <section className="portfolio-grid-section">
        <div className="container">
          <motion.div layout className="portfolio-grid-layout">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, idx) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={project.title}
                  className="portfolio-item-card"
                >
                  <div className="portfolio-card-img-wrap">
                    <img src={project.img} alt={project.title} className="portfolio-card-img" />
                    {project.link && (
                      <div className="portfolio-card-overlay">
                        <a 
                          href={project.link} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="portfolio-launch-btn"
                          aria-label={`Visit ${project.title}`}
                        >
                          <FiExternalLink size={20} />
                        </a>
                      </div>
                    )}
                  </div>
                  <div className="portfolio-card-info">
                    <span className="portfolio-card-category">{project.category}</span>
                    <h3 className="portfolio-card-title">{project.title}</h3>
                    <p className="portfolio-card-desc">{project.desc}</p>
                    {project.link ? (
                      <a 
                        href={project.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="portfolio-action-link"
                      >
                        Visit Website <FiExternalLink size={14} />
                      </a>
                    ) : (
                      <span className="portfolio-action-link disabled">Account Managed</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredProjects.length === 0 && (
            <div className="no-results">
              <p>No projects match your search query or filter choice.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Portfolio;
