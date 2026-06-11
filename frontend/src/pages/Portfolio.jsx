import { Link } from 'react-router-dom'
import './Portfolio.css'

const DATA = {
  name: 'Suresh Gopi V', role: 'Aspiring Full Stack Developer',
  bio: 'Computer Science & Engineering student at National Engineering College, Kovilpatti (2023–2027). Passionate about building scalable applications, competitive programming, and real-world full-stack projects.',
  email: 'sureshgopy07@gmail.com', phone: '+91 97919 90242', location: 'Tirunelveli, Tamil Nadu',
  github: 'https://github.com/suresh007-bash', linkedin: 'https://www.linkedin.com/in/suresh-gopi-7a7220321',
  skills: [
    { cat: 'Languages', items: ['Java', 'C', 'C++', 'JavaScript', 'SQL'] },
    { cat: 'Frontend', items: ['React JS', 'HTML5', 'CSS3', 'Responsive Design'] },
    { cat: 'Backend', items: ['Node.js', 'Express', 'REST APIs'] },
    { cat: 'Tools', items: ['Git', 'GitHub', 'VS Code', 'Postman'] },
    { cat: 'Databases', items: ['MySQL', 'JSON/File DB', 'MongoDB (basics)'] },
    { cat: 'Soft Skills', items: ['Problem Solving', 'Teamwork', 'Communication', 'Continuous Learning'] },
  ],
  projects: [
    { icon: '🌿', name: 'Plant Disease Prediction', desc: 'AI-driven system for early detection of plant diseases using image analysis. Helps farmers identify crop issues quickly and accurately.', tags: ['AI', 'Python', 'Image Analysis'] },
    { icon: '🅿️', name: 'Smart Parking System', desc: 'Efficient IoT-based parking management system to optimize space utilization with real-time slot availability monitoring.', tags: ['IoT', 'Embedded', 'Hardware'] },
    { icon: '🥗', name: 'Food Management + AI Diet Planner', desc: 'AI-assisted food management and diet planning application with a user-friendly interface and personalized recommendations.', tags: ['AI', 'React', 'Full Stack'] },
  ],
  education: [
    { year: '2023–2027', degree: 'B.E Computer Science & Engineering', place: 'National Engineering College, Kovilpatti', grade: 'CGPA: 6.87' },
    { year: '2022–2023', degree: 'HSC (Class 12)', place: 'Reach Matriculation HSS, Moolaikaraipatti', grade: '88%' },
    { year: '2021–2022', degree: 'SSLC (Class 10)', place: 'Reach Matriculation HSS, Moolaikaraipatti', grade: 'Passed' },
  ],
  certifications: [
    { icon: '☁️', name: 'Introduction to Cloud Computing', org: 'AWS Academy' },
    { icon: '🏭', name: 'Introduction to Industry 4.0', org: 'NPTEL' },
    { icon: '🌐', name: 'Social Network Analysis', org: 'NPTEL' },
    { icon: '⚛️', name: 'MERN Stack Development (Advanced)', org: 'Udemy' },
  ],
  achievements: [
    'Solved 1500+ programming problems on Skillrack',
    '1st Prize – Technical Escape Room, Saveetha Engineering College',
    'Participated in Smart India Hackathon (SIH)',
    'Participated in ANVESHANA Hackathon, Sasi Institute of Technology',
  ],
  internships: [
    { role: 'Web Development Intern', company: 'Prodigy', desc: 'Worked on frontend and backend modules of web applications.' },
    { role: 'Full Stack Development Intern', company: 'CodSoft', desc: 'Developed full-stack applications and improved backend logic implementation.' },
  ],
}

const NAV_ITEMS = ['About', 'Skills', 'Projects', 'Education', 'Resume', 'Contact']

export default function Portfolio() {
  return (
    <div className="pf-page">
      {/* NAV */}
      <nav className="pf-nav">
        <div className="pf-nav-inner">
          <div className="pf-logo">SGV<span className="accent">.</span>dev</div>
          <div className="pf-nav-links">
            {NAV_ITEMS.map(n => <a key={n} href={`#pf-${n.toLowerCase()}`}>{n}</a>)}
            <Link to="/" className="btn btn-secondary btn-sm">← Back</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pf-hero" id="pf-about">
        <div className="pf-hero-bg" />
        <div className="container pf-hero-inner">
          <div className="pf-avatar">
            <div className="pf-avatar-ring" />
            <div className="pf-avatar-inner">🧑‍💻</div>
            <div className="pf-status-dot" />
          </div>
          <div className="pf-hero-text anim-fade-up">
            <p className="pf-greeting">👋 Hello World!</p>
            <h1>I'm <span className="gradient-text">{DATA.name}</span></h1>
            <p className="pf-role">{DATA.role}</p>
            <p className="pf-bio">{DATA.bio}</p>
            <div className="pf-hero-cta">
              <a href="#pf-contact" className="btn btn-primary btn-lg">Contact Me</a>
              <a href="https://portfolio-mauve-one-17.vercel.app/" target="_blank" rel="noreferrer" className="btn btn-secondary btn-lg">Full Portfolio ↗</a>
              <a href="#pf-projects" className="btn btn-secondary btn-lg">View Projects</a>
            </div>
            <div className="pf-meta">
              <span>📍 {DATA.location}</span>
              <span>📧 {DATA.email}</span>
              <span>📱 {DATA.phone}</span>
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section className="section pf-section" id="pf-skills" style={{background:'rgba(10,15,30,.4)'}}>
        <div className="container">
          <p className="sec-label">Skills</p>
          <h2 className="sec-title">What I Know</h2>
          <div className="pf-skills-grid">
            {DATA.skills.map(s => (
              <div key={s.cat} className="pf-skill-card card">
                <h4>{s.cat}</h4>
                <div className="pf-skill-tags">{s.items.map(i => <span key={i} className="tag">{i}</span>)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="section pf-section" id="pf-projects">
        <div className="container">
          <p className="sec-label">Projects</p>
          <h2 className="sec-title">My Work</h2>
          <div className="grid-3">
            {DATA.projects.map(p => (
              <div key={p.name} className="pf-proj-card card">
                <div className="pf-proj-icon">{p.icon}</div>
                <h3>{p.name}</h3>
                <p>{p.desc}</p>
                <div className="pf-proj-tags">{p.tags.map(t => <span key={t} className="tag">{t}</span>)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EDUCATION */}
      <section className="section pf-section" id="pf-education" style={{background:'rgba(10,15,30,.4)'}}>
        <div className="container">
          <p className="sec-label">Education</p>
          <h2 className="sec-title">Academic Background</h2>
          <div className="pf-edu-list">
            {DATA.education.map(e => (
              <div key={e.degree} className="pf-edu-item">
                <span className="pf-edu-year">{e.year}</span>
                <div className="pf-edu-body card">
                  <h4>{e.degree}</h4>
                  <p>{e.place}</p>
                  <p className="pf-edu-grade">{e.grade}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Experience/Internships */}
          <h3 style={{marginTop:48, marginBottom:20, fontWeight:700}}>Internship Experience</h3>
          <div className="grid-2">
            {DATA.internships.map(i => (
              <div key={i.company} className="card" style={{padding:22}}>
                <p style={{fontSize:'.72rem',color:'var(--accent)',fontWeight:700,letterSpacing:'.08em',textTransform:'uppercase',marginBottom:6}}>{i.company}</p>
                <h4 style={{marginBottom:8}}>{i.role}</h4>
                <p style={{color:'var(--muted)',fontSize:'.85rem'}}>{i.desc}</p>
              </div>
            ))}
          </div>
          {/* Certifications */}
          <h3 style={{marginTop:48, marginBottom:20, fontWeight:700}}>Certifications</h3>
          <div className="grid-2">
            {DATA.certifications.map(c => (
              <div key={c.name} className="pf-cert-card card">
                <span className="pf-cert-icon">{c.icon}</span>
                <div><h4>{c.name}</h4><p>{c.org}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RESUME */}
      <section className="section-sm" id="pf-resume">
        <div className="container">
          <div className="pf-resume-cta">
            <div>
              <h2>Want my full profile?</h2>
              <p>My complete portfolio with all projects, achievements, and downloadable resume is on Vercel.</p>
            </div>
            <a href="https://portfolio-mauve-one-17.vercel.app/" target="_blank" rel="noreferrer" className="btn btn-primary btn-lg">View Full Portfolio ↗</a>
          </div>
        </div>
      </section>

      {/* ACHIEVEMENTS */}
      <section className="section pf-section" id="pf-achievements" style={{background:'rgba(10,15,30,.4)'}}>
        <div className="container">
          <p className="sec-label">Achievements</p>
          <h2 className="sec-title">Highlights</h2>
          <div className="pf-achievements">
            {DATA.achievements.map(a => (
              <div key={a} className="pf-ach-item card">
                <span>🏅</span><p>{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="section pf-section" id="pf-contact">
        <div className="container">
          <p className="sec-label">Contact</p>
          <h2 className="sec-title">Get In Touch</h2>
          <div className="pf-contact-grid">
            {[
              { icon: '📧', label: 'Email', val: DATA.email, href: `mailto:${DATA.email}` },
              { icon: '📱', label: 'Phone', val: DATA.phone, href: `tel:+919791990242` },
              { icon: '📍', label: 'Location', val: DATA.location },
              { icon: '🐙', label: 'GitHub', val: 'suresh007-bash', href: DATA.github },
              { icon: '💼', label: 'LinkedIn', val: 'Suresh Gopi', href: DATA.linkedin },
            ].map(c => (
              <div key={c.label} className="pf-con-card card" style={{padding:22,textAlign:'center'}}>
                <div style={{fontSize:'1.8rem',marginBottom:8}}>{c.icon}</div>
                <p style={{fontSize:'.72rem',color:'var(--muted)',fontWeight:700,textTransform:'uppercase',letterSpacing:'.08em',marginBottom:6}}>{c.label}</p>
                {c.href ? <a href={c.href} target={c.label==='Email'||c.label==='Phone'?'_self':'_blank'} rel="noreferrer" style={{fontSize:'.875rem',color:'var(--accent)'}}>{c.val}</a> : <p style={{fontSize:'.875rem'}}>{c.val}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer style={{borderTop:'1px solid var(--border)',padding:'24px',textAlign:'center',color:'var(--muted)',fontSize:'.8rem'}}>
        © 2024 {DATA.name} · <Link to="/" style={{color:'var(--accent)'}}>Back to Showcase</Link>
      </footer>
    </div>
  )
}
