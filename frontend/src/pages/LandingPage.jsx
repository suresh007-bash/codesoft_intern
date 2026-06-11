import { Link } from 'react-router-dom'
import './LandingPage.css'

const FEATURES = [
  { icon: '⚡', title: 'Lightning Fast', desc: 'Blazing performance with optimized code and lazy-loading. Zero compromise on speed.' },
  { icon: '🔐', title: 'Secure by Design', desc: 'End-to-end encryption, zero-trust architecture, and automatic security updates.' },
  { icon: '📊', title: 'Real-Time Analytics', desc: 'Live dashboards, custom reports, and AI-powered insights that drive decisions.' },
  { icon: '🌍', title: 'Global Scale', desc: 'Distributed across 40+ regions with 99.99% uptime SLA and automatic failover.' },
  { icon: '🤝', title: 'Team Collaboration', desc: 'Role-based permissions, comments, and live co-editing for distributed teams.' },
  { icon: '🔌', title: '200+ Integrations', desc: 'Connect with Slack, Jira, GitHub, Notion, Figma, and hundreds more tools.' },
]

const PLANS = [
  { name: 'Starter', price: '₹0', period: '/mo', desc: 'Perfect to get started', features: ['5 Projects', '10 GB Storage', 'Basic Analytics', 'Email Support'], cta: 'Get Started Free', highlight: false },
  { name: 'Pro', price: '₹999', period: '/mo', desc: 'For growing teams', features: ['Unlimited Projects', '100 GB Storage', 'Advanced Analytics', 'Priority Support', 'Custom Domain', 'API Access'], cta: 'Start Pro Trial', highlight: true },
  { name: 'Enterprise', price: 'Custom', period: '', desc: 'For large organisations', features: ['Everything in Pro', 'Dedicated Server', 'SSO & SAML', 'SLA Guarantee', 'Onboarding Manager', 'Audit Logs'], cta: 'Contact Sales', highlight: false },
]

const TESTIMONIALS = [
  { name: 'Priya Sharma', role: 'CTO, TechVenture', quote: 'Switched our entire platform in 2 weeks. The performance gains were immediate and massive.', avatar: '👩‍💼' },
  { name: 'Arjun Mehta', role: 'Lead Dev, StartupX', quote: 'The API is a dream to work with. Clean docs, zero downtime, and incredible DX.', avatar: '👨‍💻' },
  { name: 'Sneha Rajan', role: 'PM, FinEdge', quote: 'Our team collaboration improved 3x. Real-time sync and permissions are exactly what we needed.', avatar: '👩‍🏫' },
]

export default function LandingPage() {
  return (
    <div className="lp">
      {/* NAV */}
      <header className="lp-nav">
        <div className="lp-nav-inner">
          <div className="lp-logo"><span className="lp-logo-mark">▲</span> NovaDash</div>
          <div className="lp-nav-links">
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#testimonials">Reviews</a>
            <a href="#cta" className="lp-nav-cta">Get Started Free</a>
          </div>
          <Link to="/" className="btn btn-ghost btn-sm" style={{marginLeft:16}}>← Back</Link>
        </div>
      </header>

      {/* HERO */}
      <section className="lp-hero">
        <div className="lp-hero-glow" />
        <div className="container lp-hero-inner">
          <div className="lp-hero-announce">
            <span className="lp-badge">🎉 New</span> v3.0 is live — AI-powered workflows →
          </div>
          <h1>
            The Dev Platform<br />
            Built for <span className="gradient-text">Modern Teams</span>
          </h1>
          <p className="lp-hero-desc">
            Ship faster, collaborate better, and scale without limits. NovaDash combines project management, CI/CD, and analytics in one seamless platform.
          </p>
          <div className="lp-hero-cta">
            <a href="#cta" className="btn btn-primary btn-lg">Start for Free →</a>
            <a href="#features" className="btn btn-secondary btn-lg">See How It Works</a>
          </div>
          <div className="lp-hero-trust">
            <span>Trusted by <strong>12,000+</strong> developers worldwide</span>
            <div className="lp-stars">{'★★★★★'} <span>4.9/5</span></div>
          </div>
        </div>
        <div className="lp-hero-img">
          <div className="lp-dashboard-mock">
            <div className="ldm-topbar">
              <span className="ldm-dot red"/><span className="ldm-dot yellow"/><span className="ldm-dot green"/>
              <span className="ldm-title">NovaDash — Dashboard</span>
            </div>
            <div className="ldm-body">
              <div className="ldm-sidebar">
                {['📊 Overview','📁 Projects','⚙️ Settings','🔌 Integrations'].map(i=><div key={i} className="ldm-si">{i}</div>)}
              </div>
              <div className="ldm-main">
                <div className="ldm-stat-row">
                  {[{l:'Deployments',v:'142'},{l:'Uptime',v:'99.9%'},{l:'Active Users',v:'2.4K'},{l:'API Calls',v:'1.2M'}].map(s=>(
                    <div key={s.l} className="ldm-stat"><strong>{s.v}</strong><span>{s.l}</span></div>
                  ))}
                </div>
                <div className="ldm-chart">
                  {[60,80,45,90,70,95,55,85,75,88,65,92].map((h,i)=>(
                    <div key={i} className="ldm-bar" style={{height:`${h}%`}} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section lp-features" id="features">
        <div className="container">
          <p className="sec-label" style={{textAlign:'center'}}>Features</p>
          <h2 className="sec-title" style={{textAlign:'center',margin:'0 auto 12px'}}>Everything you need to ship</h2>
          <p className="sec-desc" style={{textAlign:'center',margin:'0 auto 48px'}}>One platform for all your development workflow needs.</p>
          <div className="lp-feat-grid">
            {FEATURES.map(f => (
              <div key={f.title} className="lp-feat-card card">
                <div className="lp-feat-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="section" id="pricing" style={{background:'rgba(10,15,30,.5)'}}>
        <div className="container">
          <p className="sec-label" style={{textAlign:'center'}}>Pricing</p>
          <h2 className="sec-title" style={{textAlign:'center',margin:'0 auto 12px'}}>Simple, transparent pricing</h2>
          <p className="sec-desc" style={{textAlign:'center',margin:'0 auto 48px'}}>No hidden fees. Cancel anytime. Start free forever.</p>
          <div className="lp-plans">
            {PLANS.map(p => (
              <div key={p.name} className={`lp-plan ${p.highlight ? 'lp-plan-highlight' : ''}`}>
                {p.highlight && <div className="lp-popular">Most Popular</div>}
                <h3 className="lp-plan-name">{p.name}</h3>
                <div className="lp-plan-price"><span className="lp-price-val">{p.price}</span><span className="lp-price-per">{p.period}</span></div>
                <p className="lp-plan-desc">{p.desc}</p>
                <ul className="lp-plan-features">
                  {p.features.map(f => <li key={f}><span className="lp-check">✓</span>{f}</li>)}
                </ul>
                <button className={`btn btn-full ${p.highlight ? 'btn-primary' : 'btn-secondary'}`}>{p.cta}</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section" id="testimonials">
        <div className="container">
          <p className="sec-label" style={{textAlign:'center'}}>Testimonials</p>
          <h2 className="sec-title" style={{textAlign:'center',margin:'0 auto 48px'}}>What developers say</h2>
          <div className="grid-3">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="lp-testi card">
                <div className="lp-stars-sm">★★★★★</div>
                <p className="lp-testi-quote">"{t.quote}"</p>
                <div className="lp-testi-author">
                  <span className="lp-testi-avatar">{t.avatar}</span>
                  <div><strong>{t.name}</strong><p>{t.role}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-sm" id="cta">
        <div className="container">
          <div className="lp-cta-card">
            <div className="lp-cta-glow" />
            <h2>Ready to ship faster?</h2>
            <p>Join 12,000+ developers who build with NovaDash. Free forever, no credit card needed.</p>
            <div className="lp-cta-btns">
              <button className="btn btn-primary btn-lg">Start for Free →</button>
              <button className="btn btn-secondary btn-lg">Book a Demo</button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="lp-footer">
        <div className="container lp-footer-inner">
          <div className="lp-logo"><span className="lp-logo-mark">▲</span> NovaDash</div>
          <div className="lp-footer-links">
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#testimonials">Reviews</a>
          </div>
          <p>© 2024 NovaDash · <Link to="/" style={{color:'var(--accent)'}}>← Showcase</Link></p>
        </div>
      </footer>
    </div>
  )
}
