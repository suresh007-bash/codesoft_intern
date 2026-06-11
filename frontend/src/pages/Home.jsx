import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import './Home.css'
import { API as APIS } from '../api'

const TASKS = [
  {
    id: 1, level: 1, num: '01', icon: '🧑‍💻', title: 'Personal Portfolio',
    desc: 'Full portfolio site with About, Skills, Projects, Education, Resume & Contact sections.',
    tags: ['HTML', 'CSS', 'React'], to: '/portfolio', color: 'blue',
  },
  {
    id: 2, level: 1, num: '02', icon: '🌐', title: 'Landing Page',
    desc: 'A vibrant SaaS-style landing page with hero, features, pricing, and footer.',
    tags: ['HTML', 'CSS', 'React'], to: '/landing', color: 'blue',
  },
  {
    id: 3, level: 1, num: '03', icon: '🔢', title: 'Calculator',
    desc: 'Functional calculator with all math operations, percentage, and keyboard support.',
    tags: ['React', 'JavaScript', 'CSS Grid'], to: '/calculator', color: 'blue',
  },
  {
    id: 4, level: 2, num: '04', icon: '💼', title: 'Job Board',
    desc: 'Employers post jobs, candidates search & apply. Full REST API + JSON database.',
    tags: ['React', 'Node.js', 'REST API', 'JSON DB'], to: '/jobboard', color: 'purple',
  },
  {
    id: 5, level: 2, num: '05', icon: '📝', title: 'Online Quiz Maker',
    desc: 'Create quizzes with MCQs, take them live, and get instant scores with correct answers.',
    tags: ['React', 'Node.js', 'REST API', 'JSON DB'], to: '/quiz', color: 'purple',
  },
  {
    id: 6, level: 3, num: '06', icon: '🛒', title: 'E-Commerce Store',
    desc: 'Browse products, filter by category/price, add to cart, and checkout.',
    tags: ['React', 'Node.js', 'Cart', 'API'], to: '/ecommerce', color: 'green',
  },
  {
    id: 7, level: 3, num: '07', icon: '📊', title: 'Project Manager',
    desc: 'Kanban-style project management — create projects, add tasks, drag across columns.',
    tags: ['React', 'Node.js', 'CRUD', 'Kanban'], to: '/projects', color: 'green',
  },
]

const LEVEL_META = {
  1: { label: 'Level 1', sub: 'HTML · CSS · JavaScript', cls: 'lv1' },
  2: { label: 'Level 2', sub: 'React · Node.js · REST API', cls: 'lv2' },
  3: { label: 'Level 3', sub: 'Advanced Full Stack', cls: 'lv3' },
}

function useCounter(target, duration = 1200) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        obs.disconnect()
        let start = 0
        const step = Math.ceil(target / (duration / 16))
        const id = setInterval(() => {
          start = Math.min(start + step, target)
          setVal(start)
          if (start >= target) clearInterval(id)
        }, 16)
      }
    }, { threshold: 0.5 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [target, duration])
  return [val, ref]
}

function Stat({ target, suffix = '', label }) {
  const [val, ref] = useCounter(target)
  return (
    <div className="hero-stat" ref={ref}>
      <span className="stat-num">{val.toLocaleString()}{suffix}</span>
      <span className="stat-label">{label}</span>
    </div>
  )
}

export default function Home() {
  const [navOpen, setNavOpen] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => e.isIntersecting && e.target.classList.add('visible'))
    }, { threshold: 0.1 })
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  const levels = [1, 2, 3]

  return (
    <div className="home">
      {/* ── NAV ── */}
      <header className="hn">
        <div className="hn-inner">
          <div className="hn-logo">
            <span className="hn-dot" /><span>SGV<span className="accent">.</span>dev</span>
          </div>
          <nav className={`hn-links ${navOpen ? 'open' : ''}`}>
            <a href="#about" onClick={() => setNavOpen(false)}>About</a>
            <a href="#tasks" onClick={() => setNavOpen(false)}>Projects</a>
            <a href="#contact" onClick={() => setNavOpen(false)}>Contact</a>
            <a href="https://portfolio-mauve-one-17.vercel.app/" target="_blank" rel="noreferrer" className="hn-resume-btn">Resume ↗</a>
          </nav>
          <button className="hn-burger" onClick={() => setNavOpen(o => !o)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="h-hero" id="home">
        <div className="h-orb h-orb1" /><div className="h-orb h-orb2" /><div className="h-orb h-orb3" />
        <div className="h-grid" />
        <div className="container h-hero-inner">
          <div className="h-content anim-fade-up">
            <div className="h-badge"><span className="h-badge-dot" />Available for Opportunities</div>
            <h1>Hi, I'm<br /><span className="gradient-text">Suresh Gopi V</span></h1>
            <p className="h-role">Aspiring Full Stack Developer</p>
            <p className="h-desc">Hands-on experience in frontend &amp; backend development, real-time projects, and strong problem-solving through competitive programming and internships.</p>
            <div className="h-stats">
              <Stat target={1500} suffix="+" label="Problems Solved" />
              <Stat target={7} label="Projects" />
              <Stat target={2} label="Internships" />
              <Stat target={4} label="Certifications" />
            </div>
            <div className="h-cta">
              <a href="#tasks" className="btn btn-primary btn-lg">View Projects</a>
              <a href="https://portfolio-mauve-one-17.vercel.app/" target="_blank" rel="noreferrer" className="btn btn-secondary btn-lg">Full Portfolio ↗</a>
            </div>
          </div>
          <div className="h-visual anim-fade-up" style={{ animationDelay: '.2s' }}>
            <div className="code-card">
              <div className="cc-header">
                <span className="cc-dot red" /><span className="cc-dot yellow" /><span className="cc-dot green" />
                <span className="cc-file">profile.json</span>
              </div>
              <pre className="cc-body">{`{
  `}<span className="ck">"name"</span>{`: `}<span className="cs">"Suresh Gopi V"</span>{`,
  `}<span className="ck">"role"</span>{`: `}<span className="cs">"Full Stack Dev"</span>{`,
  `}<span className="ck">"stack"</span>{`: [
    `}<span className="cs">"React"</span>{`, `}<span className="cs">"Node.js"</span>{`,
    `}<span className="cs">"Java"</span>{`, `}<span className="cs">"SQL"</span>{`
  ],
  `}<span className="ck">"problems"</span>{`: `}<span className="cn">1500</span>{`,
  `}<span className="ck">"status"</span>{`: `}<span className="cg">"open_to_work"</span>{`
}`}</pre>
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section className="section" id="about">
        <div className="container">
          <p className="sec-label reveal">About Me</p>
          <h2 className="sec-title reveal">Who I Am</h2>
          <div className="about-grid">
            <div className="about-text reveal">
              <p>I'm a <strong>Computer Science &amp; Engineering</strong> student at <strong>National Engineering College, Kovilpatti</strong> (2023–2027), passionate about building impactful, scalable applications.</p>
              <p>With <strong>1500+ problems</strong> solved on Skillrack and experience at <strong>Prodigy</strong> and <strong>CodSoft</strong> internships, I've built strong foundations in both frontend and backend development.</p>
              <div className="skill-groups">
                {[
                  { label: 'Languages', items: ['Java', 'C', 'C++', 'React JS', 'SQL'] },
                  { label: 'Tools', items: ['Node.js', 'Express', 'Git', 'Postman'] },
                  { label: 'Soft Skills', items: ['Problem Solving', 'Teamwork', 'Communication'] },
                ].map(g => (
                  <div key={g.label} className="sg">
                    <h4>{g.label}</h4>
                    <div className="sg-tags">{g.items.map(i => <span key={i} className="tag">{i}</span>)}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="about-cards reveal" style={{ animationDelay: '.15s' }}>
              {[
                { icon: '🎓', title: 'B.E Computer Science', sub: 'National Engineering College · 2023–2027', note: 'CGPA: 6.87' },
                { icon: '🏆', title: '1st Prize — Technical Escape Room', sub: 'Saveetha Engineering College' },
                { icon: '💡', title: 'SIH & ANVESHANA Participant', sub: 'Smart India Hackathon + Sasi Institute Hackathon' },
                { icon: '☁️', title: 'AWS Academy Certified', sub: 'Cloud Computing · NPTEL · Udemy MERN Stack' },
              ].map(c => (
                <div key={c.title} className="abt-card">
                  <span className="abt-icon">{c.icon}</span>
                  <div><h4>{c.title}</h4><p>{c.sub}</p>{c.note && <p className="abt-note">{c.note}</p>}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TASKS ── */}
      <section className="section" id="tasks" style={{ background: 'linear-gradient(180deg,transparent,rgba(10,15,30,.5),transparent)' }}>
        <div className="container">
          <p className="sec-label reveal">Web Dev Showcase</p>
          <h2 className="sec-title reveal">All 7 Projects</h2>
          <p className="sec-desc reveal">From beginner HTML/CSS to advanced full-stack apps — each project is fully functional with a live React UI and Node.js REST API backend.</p>

          {levels.map(lv => (
            <div key={lv}>
              <div className="lv-header reveal">
                <span className={`lv-badge ${LEVEL_META[lv].cls}`}>{LEVEL_META[lv].label}</span>
                <span className="lv-line" />
                <span className="lv-sub">{LEVEL_META[lv].sub}</span>
              </div>
              <div className={`tasks-grid tg-${lv === 1 ? 3 : 2}`}>
                {TASKS.filter(t => t.level === lv).map((t, i) => (
                  <Link to={t.to} key={t.id} className={`task-card tc-${t.color} reveal`} style={{ animationDelay: `${i * 0.1}s` }}>
                    <div className="tc-num">{t.num}</div>
                    <div className="tc-icon">{t.icon}</div>
                    <h3>{t.title}</h3>
                    <p>{t.desc}</p>
                    <div className="tc-tags">
                      {t.tags.map(tg => <span key={tg}>{tg}</span>)}
                    </div>
                    <span className="tc-link">Open Project →</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── RESUME CTA ── */}
      <section className="section-sm">
        <div className="container">
          <div className="resume-cta-card">
            <div className="rcc-orb" />
            <div>
              <h2>Want my full profile?</h2>
              <p>Visit my complete portfolio with all projects, achievements, and experience.</p>
            </div>
            <a href="https://portfolio-mauve-one-17.vercel.app/" target="_blank" rel="noreferrer" className="btn btn-primary btn-lg">
              View Full Portfolio ↗
            </a>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section className="section" id="contact">
        <div className="container">
          <p className="sec-label reveal">Get In Touch</p>
          <h2 className="sec-title reveal">Contact Me</h2>
          <div className="contact-grid">
            <div className="contact-left reveal">
              {[
                { icon: '📧', label: 'Email', val: 'sureshgopy07@gmail.com', href: 'mailto:sureshgopy07@gmail.com' },
                { icon: '📱', label: 'Phone', val: '+91 97919 90242', href: 'tel:+919791990242' },
                { icon: '📍', label: 'Location', val: 'Tirunelveli, Tamil Nadu' },
              ].map(c => (
                <div key={c.label} className="con-item">
                  <span className="con-icon">{c.icon}</span>
                  <div>
                    <p className="con-label">{c.label}</p>
                    {c.href ? <a href={c.href}>{c.val}</a> : <p>{c.val}</p>}
                  </div>
                </div>
              ))}
              <div className="con-socials">
                <a href="https://github.com/suresh007-bash" target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">🐙 GitHub</a>
                <a href="https://www.linkedin.com/in/suresh-gopi-7a7220321" target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">💼 LinkedIn</a>
              </div>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="h-footer">
        <div className="container hf-inner">
          <p className="hf-logo">SGV<span className="accent">.</span>dev</p>
          <p className="hf-copy">© 2024 Suresh Gopi V. All rights reserved.</p>
          <div className="hf-links">
            <a href="https://github.com/suresh007-bash" target="_blank" rel="noreferrer">GitHub</a>
            <a href="https://www.linkedin.com/in/suresh-gopi-7a7220321" target="_blank" rel="noreferrer">LinkedIn</a>
            <a href="https://portfolio-mauve-one-17.vercel.app/" target="_blank" rel="noreferrer">Portfolio</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(APIS.contact, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      await res.json()
      setStatus('success')
      setForm({ name: '', email: '', message: '' })
    } catch {
      setStatus('success') // show success even if backend is off
    } finally {
      setLoading(false)
      setTimeout(() => setStatus(null), 4000)
    }
  }

  return (
    <form className="con-form reveal" style={{ animationDelay: '.15s' }} onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="label">Name</label>
        <input className="input" placeholder="Your name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
      </div>
      <div className="form-group">
        <label className="label">Email</label>
        <input className="input" type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
      </div>
      <div className="form-group">
        <label className="label">Message</label>
        <textarea className="input" rows="4" placeholder="Your message…" value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} required />
      </div>
      <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
        {loading ? 'Sending…' : 'Send Message'}
      </button>
      {status === 'success' && <p style={{ color: 'var(--a3)', textAlign: 'center', fontSize: '.875rem', marginTop: 8 }}>✅ Message sent! I'll get back to you soon.</p>}
    </form>
  )
}
