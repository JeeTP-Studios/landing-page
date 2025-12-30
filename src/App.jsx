import React, { useState, useEffect } from 'react'
import { LanguageProvider, useLanguage } from './contexts/LanguageContext'
import LanguageToggle from './components/LanguageToggle'
import './App.css'

const AppContent = () => {
  const [isVisible, setIsVisible] = useState({})
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const { t } = useLanguage()

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting
          }))
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('[id]').forEach((el) => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="App">
      <div 
        className="cursor-glow"
        style={{
          left: mousePosition.x - 200,
          top: mousePosition.y - 200,
        }}
      />
      
      <Header t={t} />
      <HeroSection isVisible={isVisible.hero} t={t} />
      <ServicesSection isVisible={isVisible.services} t={t} />
      <ProcessSection isVisible={isVisible.process} t={t} />
      <ContactSection isVisible={isVisible.contact} t={t} />
      <Footer t={t} />
    </div>
  )
}

const Header = ({ t }) => (
  <header className="header">
    <nav className="nav">
      <div className="nav-brand">
        <img src="/jeetp-logo-full-mixed.png" alt="JeeTP Studios Logo" className="logo" />
      </div>
      <div className="nav-links">
        <a href="#services" className="nav-link">{t('nav.services')}</a>
        <a href="#process" className="nav-link">{t('nav.process')}</a>
        <a href="#contact" className="nav-link">{t('nav.contact')}</a>
        <LanguageToggle />
        <button className="cta-button">{t('nav.getStarted')}</button>
      </div>
    </nav>
  </header>
)

const HeroSection = ({ isVisible, t }) => (
  <section id="hero" className="hero-section grid-bg">
    <div className="hero-content">
      <div className={`hero-text ${isVisible ? 'animate-slide-in-left' : ''}`}>
        <h1 className="hero-title">
          {t('hero.title')} <span className="gradient-text"></span>
          <br />
          {t('hero.titleAccent')}
        </h1>
        <p className="hero-subtitle">
          {t('hero.subtitle')}
        </p>
        <div className="hero-buttons">
          <button className="primary-button neon-glow">{t('hero.startProject')}</button>
          <button className="secondary-button">{t('hero.viewProcess')}</button>
        </div>
        <div className="hero-stats">
          <div className="stat">
            <span className="stat-number gradient-text">100+</span>
            <span className="stat-label">{t('hero.stats.projects')}</span>
          </div>
          <div className="stat">
            <span className="stat-number gradient-text">24/7</span>
            <span className="stat-label">{t('hero.stats.cycle')}</span>
          </div>
          <div className="stat">
            <span className="stat-number gradient-text">99.9%</span>
            <span className="stat-label">{t('hero.stats.uptime')}</span>
          </div>
        </div>
      </div>
      <div className={`hero-visual ${isVisible ? 'animate-slide-in-right' : ''}`}>
        <div className="code-window animate-float">
          <div className="window-header">
            <div className="window-dots">
              <span className="dot red"></span>
              <span className="dot yellow"></span>
              <span className="dot green"></span>
            </div>
            <span className="window-title mono">JeeTP_Studio.exe</span>
          </div>
          <div className="code-content mono">
            <div className="code-line">
              <span className="line-number">01</span>
              <span className="keyword">const&nbsp;</span> <span className="variable">solution</span> = <span className="function">JeeTP</span>.<span className="method">create</span>({`{`}
            </div>
            <div className="code-line">
              <span className="line-number">02</span>
              &nbsp;&nbsp;<span className="property">client</span>: <span className="string">"your-vision"</span>,
            </div>
            <div className="code-line">
              <span className="line-number">03</span>
              &nbsp;&nbsp;<span className="property">technology</span>: <span className="string">"cutting-edge"</span>,
            </div>
            <div className="code-line">
              <span className="line-number">04</span>
              &nbsp;&nbsp;<span className="property">delivery</span>: <span className="string">"perfection"</span>
            </div>
            <div className="code-line">
              <span className="line-number">05</span>
              {`}`});
            </div>
            <div className="code-line">
              <span className="line-number">06</span>
            </div>
            <div className="code-line">
              <span className="line-number">07</span>
              <span className="comment">// Deploying innovation...</span>
            </div>
            <div className="code-line">
              <span className="line-number">08</span>
              <span className="variable">solution</span>.<span className="method">deploy</span>() 
              <span className="cursor animate-pulse">|</span>
            </div>
          </div>
        </div>
        <div className="tech-orbs">
          <div className="orb orb-1 animate-float" style={{ animationDelay: '0s' }}></div>
          <div className="orb orb-2 animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="orb orb-3 animate-float" style={{ animationDelay: '4s' }}></div>
        </div>
      </div>
    </div>
  </section>
)

const ServicesSection = ({ isVisible, t }) => (
  <section id="services" className="services-section">
    <div className="container">
      <div className={`section-header ${isVisible ? 'animate-fade-in-up' : ''}`}>
        <h2 className="section-title">
          {t('services.title').split(' ')[0]} <span className="gradient-text">{t('services.title').split(' ').slice(1).join(' ')}</span>
        </h2>
        <p className="section-subtitle">
          {t('services.subtitle')}
        </p>
      </div>
      <div className="services-grid">
        {t('services.items').map((service, index) => (
          <div 
            key={index}
            className={`service-card ${isVisible ? 'animate-fade-in-up' : ''}`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="service-icon">{['🚀', '📱', '🤖', '⚡', '☁️', '🔐'][index]}</div>
            <h3 className="service-title">{service.title}</h3>
            <p className="service-description">{service.description}</p>
            <div className="service-tech">
              {service.tech.map((tech, i) => (
                <span key={i} className="tech-tag">{tech}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)

const ProcessSection = ({ isVisible, t }) => (
  <section id="process" className="process-section">
    <div className="container">
      <div className={`section-header ${isVisible ? 'animate-fade-in-up' : ''}`}>
        <h2 className="section-title">
          {t('process.title').split(' ').slice(0, 1).join(' ')} <span className="gradient-text">{t('process.title').split(' ').slice(1).join(' ')}</span>
        </h2>
        <p className="section-subtitle">
          {t('process.subtitle')}
        </p>
      </div>
      <div className="process-timeline">
        {t('process.steps').map((process, index) => (
          <div 
            key={index}
            className={`process-step ${isVisible ? 'animate-slide-in-left' : ''}`}
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <div className="step-number gradient-text">{String(index + 1).padStart(2, '0')}</div>
            <div className="step-content">
              <div className="step-icon">{['🔍', '📋', '⚡', '✅', '🚀', '🛡️'][index]}</div>
              <h3 className="step-title">{process.title}</h3>
              <p className="step-description">{process.description}</p>
            </div>
            {index < 5 && <div className="step-connector"></div>}
          </div>
        ))}
      </div>
    </div>
  </section>
)

const ContactSection = ({ isVisible, t }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    project: '',
    budget: '',
    message: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <div className={`section-header ${isVisible ? 'animate-fade-in-up' : ''}`}>
          <h2 className="section-title">
            {t('contact.title').split(' ').slice(0, -3).join(' ')} <span className="gradient-text">{t('contact.title').split(' ').slice(-3, -2).join(' ')}</span> {t('contact.title').split(' ').slice(-2).join(' ')}
          </h2>
          <p className="section-subtitle">
            {t('contact.subtitle')}
          </p>
        </div>
        <div className="contact-content">
          <div className={`contact-info ${isVisible ? 'animate-slide-in-left' : ''}`}>
            <div className="contact-card">
              <h3 className="contact-title">{t('contact.getInTouch')}</h3>
              <div className="contact-item">
                <span className="contact-icon">📧</span>
                <div>
                  <span className="contact-label">{t('contact.email')}</span>
                  <a href="mailto:hello@jeetpstudios.com" className="contact-value">
                    hello@jeetpstudios.com
                  </a>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon">🌐</span>
                <div>
                  <span className="contact-label">{t('contact.web')}</span>
                  <span className="contact-value">www.jeetpstudios.com</span>
                </div>
              </div>
              <div className="contact-item">
                <span className="contact-icon">⚡</span>
                <div>
                  <span className="contact-label">{t('contact.responseTime')}</span>
                  <span className="contact-value">{t('contact.responseValue')}</span>
                </div>
              </div>
            </div>
            <div className="tech-showcase">
              <h4 className="showcase-title">{t('contact.techShowcase')}</h4>
              <div className="tech-cloud">
                {["React", "Node.js", "Python", "AI/ML", "AWS", "Docker", "MongoDB", "GraphQL", "TypeScript", "Flutter"].map((tech, i) => (
                  <span key={i} className="tech-bubble animate-float" style={{ animationDelay: `${i * 0.2}s` }}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <form 
            className={`contact-form ${isVisible ? 'animate-slide-in-right' : ''}`}
            onSubmit={handleSubmit}
          >
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder={t('contact.form.name')}
                required
                value={formData.name}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder={t('contact.form.email')}
                required
                value={formData.email}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="company"
                placeholder={t('contact.form.company')}
                value={formData.company}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <select
                name="project"
                value={formData.project}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">{t('contact.form.projectTypes.placeholder')}</option>
                <option value="web-app">{t('contact.form.projectTypes.webApp')}</option>
                <option value="mobile-app">{t('contact.form.projectTypes.mobileApp')}</option>
                <option value="ai-ml">{t('contact.form.projectTypes.aiMl')}</option>
                <option value="api">{t('contact.form.projectTypes.api')}</option>
                <option value="cloud">{t('contact.form.projectTypes.cloud')}</option>
                <option value="consulting">{t('contact.form.projectTypes.consulting')}</option>
                <option value="other">{t('contact.form.projectTypes.other')}</option>
              </select>
            </div>
            <div className="form-group">
              <select
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">{t('contact.form.budgetRanges.placeholder')}</option>
                <option value="10k-25k">{t('contact.form.budgetRanges.small')}</option>
                <option value="25k-50k">{t('contact.form.budgetRanges.medium')}</option>
                <option value="50k-100k">{t('contact.form.budgetRanges.large')}</option>
                <option value="100k+">{t('contact.form.budgetRanges.enterprise')}</option>
                <option value="discuss">{t('contact.form.budgetRanges.discuss')}</option>
              </select>
            </div>
            <div className="form-group">
              <textarea
                name="message"
                placeholder={t('contact.form.message')}
                rows="5"
                value={formData.message}
                onChange={handleChange}
                className="form-textarea"
                required
              ></textarea>
            </div>
            <button type="submit" className="form-submit neon-glow">
              {t('contact.form.submit')}
              <span className="submit-arrow">→</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

const Footer = ({ t }) => (
  <footer className="footer">
    <div className="container">
      <div className="footer-content">
        <div className="footer-brand">
          <img src="/jeetp-logo-full-mixed.png" alt="JeeTP Studios" className="footer-logo" />
          <p className="footer-tagline">
            {t('footer.tagline').split('.')[0]}. <span className="gradient-text">{t('footer.tagline').split('.')[1]}.</span>
          </p>
        </div>
        <div className="footer-links">
          <div className="link-group">
            <h4 className="link-title">{t('footer.sections.services.title')}</h4>
            {t('footer.sections.services.links').map((link, i) => (
              <a key={i} href="#" className="footer-link">{link}</a>
            ))}
          </div>
          <div className="link-group">
            <h4 className="link-title">{t('footer.sections.company.title')}</h4>
            {t('footer.sections.company.links').map((link, i) => (
              <a key={i} href="#" className="footer-link">{link}</a>
            ))}
          </div>
          <div className="link-group">
            <h4 className="link-title">{t('footer.sections.contact.title')}</h4>
            {t('footer.sections.contact.links').map((link, i) => (
              <a key={i} href={i === 0 ? 'mailto:hello@jeetpstudios.com' : '#'} className="footer-link">{link}</a>
            ))}
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p className="copyright">
          {t('footer.copyright')} 
          <span className="mono"> {t('footer.crafted')}</span>
        </p>
      </div>
    </div>
  </footer>
)

const App = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  )
}

export default App
