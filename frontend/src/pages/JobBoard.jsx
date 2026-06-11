import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import './JobBoard.css'
import { API as APIS } from '../api'

const API = APIS.jobs
const TYPES = ['All', 'Full-time', 'Internship', 'Contract', 'Part-time']

function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t) }, [onClose])
  return <div className={`toast toast-${type}`}>{type === 'success' ? '✅' : '❌'} {msg}</div>
}

function Modal({ title, subtitle, onClose, children }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2 className="modal-title">{title}</h2>
        {subtitle && <p className="modal-subtitle">{subtitle}</p>}
        {children}
      </div>
    </div>
  )
}

export default function JobBoard() {
  const [jobs, setJobs]             = useState([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [selected, setSelected]     = useState(null)
  const [showPost, setShowPost]     = useState(false)
  const [showApply, setShowApply]   = useState(null)
  const [toast, setToast]           = useState(null)

  const fetchJobs = async () => {
    try {
      const { data } = await axios.get(API, { params: { q: search, type: typeFilter } })
      setJobs(data)
    } catch { setJobs([]) }
    setLoading(false)
  }

  useEffect(() => { fetchJobs() }, [search, typeFilter])

  const showToast = (msg, type = 'success') => setToast({ msg, type })

  const handleApply = async (jobId, form) => {
    try {
      await axios.post(`${API}/${jobId}/apply`, form)
      showToast('Application submitted successfully!')
      setShowApply(null)
      fetchJobs()
    } catch { showToast('Failed to submit. Is the backend running?', 'error') }
  }

  const handlePostJob = async (form) => {
    try {
      await axios.post(API, { ...form, requirements: form.requirements.split(',').map(r => r.trim()) })
      showToast('Job posted successfully!')
      setShowPost(false)
      fetchJobs()
    } catch { showToast('Failed to post. Is the backend running?', 'error') }
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/${id}`)
      showToast('Job removed')
      setSelected(null)
      fetchJobs()
    } catch { showToast('Failed to delete', 'error') }
  }

  return (
    <div className="jb-page">
      <div className="page-nav">
        <div className="page-nav-inner">
          <div className="page-nav-logo">💼 JobBoard</div>
          <div className="page-nav-right">
            <button className="btn btn-primary btn-sm" onClick={() => setShowPost(true)}>+ Post a Job</button>
            <Link to="/" className="back-link">← Home</Link>
          </div>
        </div>
      </div>

      {/* HERO */}
      <div className="jb-hero">
        <div className="jb-hero-bg" />
        <div className="container jb-hero-inner">
          <h1>Find Your <span className="gradient-text">Dream Job</span></h1>
          <p>Browse {jobs.length} opportunities from top companies. Apply in seconds.</p>
          <div className="jb-search-bar">
            <span className="jb-search-icon">🔍</span>
            <input className="jb-search-input" placeholder="Search jobs, companies, or locations…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="jb-filters">
            {TYPES.map(t => (
              <button key={t} className={`jb-filter-btn ${typeFilter === t ? 'active' : ''}`} onClick={() => setTypeFilter(t)}>{t}</button>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="container jb-main">
        <div className="jb-list">
          <p className="jb-count">{jobs.length} job{jobs.length !== 1 ? 's' : ''} found</p>
          {loading ? <div className="loader" /> : jobs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>No jobs found</h3>
              <p>Try different keywords or filters</p>
            </div>
          ) : jobs.map(job => (
            <div key={job.id} className={`jb-card ${selected?.id === job.id ? 'active' : ''}`} onClick={() => setSelected(job)}>
              <div className="jb-card-top">
                <div className="jb-company-logo">{job.company[0]}</div>
                <div>
                  <h3 className="jb-card-title">{job.title}</h3>
                  <p className="jb-card-company">{job.company} · {job.location}</p>
                </div>
                <span className={`tag ${job.type === 'Internship' ? 'tag-purple' : job.type === 'Contract' ? 'tag-yellow' : 'tag-green'}`}>{job.type}</span>
              </div>
              <div className="jb-card-meta">
                <span>💰 {job.salary}</span>
                <span>📅 {job.postedAt}</span>
                <span>👥 {job.applications?.length || 0} applicants</span>
              </div>
              <div className="jb-card-tags">{job.requirements?.slice(0, 3).map(r => <span key={r} className="tag">{r}</span>)}</div>
            </div>
          ))}
        </div>

        {/* JOB DETAIL */}
        <div className={`jb-detail ${selected ? 'visible' : ''}`}>
          {selected ? (
            <>
              <div className="jbd-header">
                <div className="jb-company-logo lg">{selected.company[0]}</div>
                <div>
                  <h2>{selected.title}</h2>
                  <p className="jbd-company">{selected.company} · {selected.location}</p>
                </div>
              </div>
              <div className="jbd-meta">
                <div className="jbd-meta-item"><span>💰</span>{selected.salary}</div>
                <div className="jbd-meta-item"><span>🕒</span>{selected.type}</div>
                <div className="jbd-meta-item"><span>📅</span>{selected.postedAt}</div>
                <div className="jbd-meta-item"><span>👥</span>{selected.applications?.length || 0} applied</div>
              </div>
              <div className="jbd-section">
                <h4>Description</h4>
                <p>{selected.description}</p>
              </div>
              <div className="jbd-section">
                <h4>Requirements</h4>
                <div className="jbd-reqs">{selected.requirements?.map(r => <span key={r} className="tag">{r}</span>)}</div>
              </div>
              <div className="jbd-cta">
                <button className="btn btn-primary" onClick={() => setShowApply(selected)}>Apply Now →</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(selected.id)}>Remove</button>
              </div>
            </>
          ) : (
            <div className="empty-state" style={{ padding: '60px 20px' }}>
              <div className="empty-icon">💼</div>
              <h3>Select a job</h3>
              <p>Click on any listing to see full details</p>
            </div>
          )}
        </div>
      </div>

      {/* POST JOB MODAL */}
      {showPost && <PostJobModal onClose={() => setShowPost(false)} onSubmit={handlePostJob} />}

      {/* APPLY MODAL */}
      {showApply && <ApplyModal job={showApply} onClose={() => setShowApply(null)} onSubmit={handleApply} />}

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}

function PostJobModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({ title: '', company: '', location: '', type: 'Full-time', salary: '', description: '', requirements: '' })
  const [loading, setLoading] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const handleSubmit = async e => {
    e.preventDefault(); setLoading(true)
    await onSubmit(form); setLoading(false)
  }
  return (
    <Modal title="Post a New Job" subtitle="Fill in the job details below" onClose={onClose}>
      <form className="flex-col" onSubmit={handleSubmit}>
        <div className="grid-2">
          <div className="form-group"><label className="label">Job Title *</label><input className="input" value={form.title} onChange={e => set('title', e.target.value)} required placeholder="e.g. Frontend Developer" /></div>
          <div className="form-group"><label className="label">Company *</label><input className="input" value={form.company} onChange={e => set('company', e.target.value)} required placeholder="e.g. TechCorp" /></div>
          <div className="form-group"><label className="label">Location *</label><input className="input" value={form.location} onChange={e => set('location', e.target.value)} required placeholder="e.g. Remote" /></div>
          <div className="form-group"><label className="label">Type *</label>
            <select className="input" value={form.type} onChange={e => set('type', e.target.value)}>
              {['Full-time','Internship','Contract','Part-time'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-group"><label className="label">Salary</label><input className="input" value={form.salary} onChange={e => set('salary', e.target.value)} placeholder="e.g. ₹6–10 LPA" /></div>
          <div className="form-group"><label className="label">Requirements (comma-separated)</label><input className="input" value={form.requirements} onChange={e => set('requirements', e.target.value)} placeholder="React, Node.js, SQL" /></div>
        </div>
        <div className="form-group"><label className="label">Description *</label><textarea className="input" rows="4" value={form.description} onChange={e => set('description', e.target.value)} required placeholder="Describe the role…" /></div>
        <div className="flex-row" style={{ justifyContent: 'flex-end', gap: 10 }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Posting…' : 'Post Job'}</button>
        </div>
      </form>
    </Modal>
  )
}

function ApplyModal({ job, onClose, onSubmit }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', coverLetter: '' })
  const [loading, setLoading] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const handleSubmit = async e => {
    e.preventDefault(); setLoading(true)
    await onSubmit(job.id, form); setLoading(false)
  }
  return (
    <Modal title={`Apply — ${job.title}`} subtitle={`${job.company} · ${job.location}`} onClose={onClose}>
      <form className="flex-col" onSubmit={handleSubmit}>
        <div className="grid-2">
          <div className="form-group"><label className="label">Full Name *</label><input className="input" value={form.name} onChange={e => set('name', e.target.value)} required placeholder="Your name" /></div>
          <div className="form-group"><label className="label">Email *</label><input className="input" type="email" value={form.email} onChange={e => set('email', e.target.value)} required placeholder="your@email.com" /></div>
          <div className="form-group"><label className="label">Phone</label><input className="input" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+91 xxxxx xxxxx" /></div>
        </div>
        <div className="form-group"><label className="label">Cover Letter</label><textarea className="input" rows="4" value={form.coverLetter} onChange={e => set('coverLetter', e.target.value)} placeholder="Why are you a great fit for this role?" /></div>
        <div className="flex-row" style={{ justifyContent: 'flex-end', gap: 10 }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Submitting…' : 'Submit Application'}</button>
        </div>
      </form>
    </Modal>
  )
}
