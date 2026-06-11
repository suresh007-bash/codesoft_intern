import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import './ProjectManager.css'
import { API as APIS } from '../api'

const API = APIS.projects
const COLUMNS = ['todo', 'inprogress', 'done']
const COL_META = {
  todo:       { label: 'To Do',       icon: '📋', cls: 'col-todo' },
  inprogress: { label: 'In Progress', icon: '⚡', cls: 'col-wip' },
  done:       { label: 'Done',        icon: '✅', cls: 'col-done' },
}
const PRIORITIES = ['low', 'medium', 'high']
const PRIORITY_META = { low: 'tag-green', medium: 'tag-yellow', high: 'tag-red' }

function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t) }, [onClose])
  return <div className={`toast toast-${type}`}>{type === 'success' ? '✅' : '❌'} {msg}</div>
}

export default function ProjectManager() {
  const [projects, setProjects]     = useState([])
  const [loading, setLoading]       = useState(true)
  const [activeProj, setActive]     = useState(null)
  const [showProjModal, setShowProj]= useState(false)
  const [showTaskModal, setShowTask]= useState(false)
  const [taskStatus, setTaskStatus] = useState('todo')
  const [toast, setToast]           = useState(null)
  const [dragging, setDragging]     = useState(null)

  const fetchProjects = async () => {
    try { const { data } = await axios.get(API); setProjects(data); if (!activeProj && data.length) setActive(data[0]) }
    catch { setProjects([]) }
    setLoading(false)
  }
  useEffect(() => { fetchProjects() }, [])

  const showToast = (msg, type = 'success') => setToast({ msg, type })

  const handleCreateProject = async (form) => {
    try {
      const { data } = await axios.post(API, form)
      setProjects(p => [data, ...p]); setActive(data)
      setShowProj(false); showToast('Project created!')
    } catch { showToast('Failed to create project', 'error') }
  }

  const handleDeleteProject = async (id) => {
    try {
      await axios.delete(`${API}/${id}`)
      const updated = projects.filter(p => p.id !== id)
      setProjects(updated); setActive(updated[0] || null)
      showToast('Project deleted')
    } catch { showToast('Delete failed', 'error') }
  }

  const handleAddTask = async (form) => {
    if (!activeProj) return
    try {
      const { data } = await axios.post(`${API}/${activeProj.id}/tasks`, { ...form, status: taskStatus })
      const updated = { ...activeProj, tasks: [...(activeProj.tasks || []), data] }
      setActive(updated); setProjects(ps => ps.map(p => p.id === updated.id ? updated : p))
      setShowTask(false); showToast('Task added!')
    } catch {
      // Optimistic update if backend is off
      const newTask = { id: 't-' + Date.now(), ...form, status: taskStatus }
      const updated = { ...activeProj, tasks: [...(activeProj.tasks || []), newTask] }
      setActive(updated); setProjects(ps => ps.map(p => p.id === updated.id ? updated : p))
      setShowTask(false); showToast('Task added!')
    }
  }

  const handleUpdateTaskStatus = async (projId, taskId, newStatus) => {
    try {
      await axios.put(`${API}/${projId}/tasks/${taskId}`, { status: newStatus })
    } catch {}
    const updated = {
      ...activeProj,
      tasks: activeProj.tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t)
    }
    setActive(updated); setProjects(ps => ps.map(p => p.id === updated.id ? updated : p))
  }

  const handleDeleteTask = async (taskId) => {
    try { await axios.delete(`${API}/${activeProj.id}/tasks/${taskId}`) } catch {}
    const updated = { ...activeProj, tasks: activeProj.tasks.filter(t => t.id !== taskId) }
    setActive(updated); setProjects(ps => ps.map(p => p.id === updated.id ? updated : p))
    showToast('Task removed')
  }

  // Drag-and-drop
  const onDragStart = (e, task) => { setDragging(task); e.dataTransfer.effectAllowed = 'move' }
  const onDragOver = e => e.preventDefault()
  const onDrop = (e, status) => {
    e.preventDefault()
    if (dragging && dragging.status !== status) {
      handleUpdateTaskStatus(activeProj.id, dragging.id, status)
    }
    setDragging(null)
  }

  const tasksByStatus = (status) => (activeProj?.tasks || []).filter(t => t.status === status)
  const projProgress = activeProj ? Math.round(((activeProj.tasks || []).filter(t => t.status === 'done').length / Math.max((activeProj.tasks || []).length, 1)) * 100) : 0

  return (
    <div className="pm-page">
      <div className="page-nav">
        <div className="page-nav-inner">
          <div className="page-nav-logo">📊 ProjectHub</div>
          <div className="page-nav-right">
            <button className="btn btn-primary btn-sm" onClick={() => setShowProj(true)}>+ New Project</button>
            <Link to="/" className="back-link">← Home</Link>
          </div>
        </div>
      </div>

      {loading ? <div className="loader" style={{ marginTop: 60 }} /> : (
        <div className="pm-layout">
          {/* SIDEBAR */}
          <aside className="pm-sidebar">
            <div className="pm-sidebar-header">
              <h3>Projects</h3>
              <span className="pm-proj-count">{projects.length}</span>
            </div>
            <div className="pm-proj-list">
              {projects.map(p => (
                <div
                  key={p.id}
                  className={`pm-proj-item ${activeProj?.id === p.id ? 'active' : ''}`}
                  onClick={() => setActive(p)}
                >
                  <div className="pm-proj-dot" style={{ background: p.color || 'var(--accent)' }} />
                  <div className="pm-proj-item-info">
                    <span className="pm-proj-name">{p.name}</span>
                    <span className="pm-proj-meta">{(p.tasks || []).length} tasks</span>
                  </div>
                </div>
              ))}
              {projects.length === 0 && <p className="pm-empty-sidebar">No projects yet. Create one!</p>}
            </div>
          </aside>

          {/* MAIN */}
          <main className="pm-main">
            {!activeProj ? (
              <div className="empty-state">
                <div className="empty-icon">📊</div>
                <h3>No project selected</h3>
                <p>Create a project or select one from the sidebar</p>
              </div>
            ) : (
              <>
                {/* Project Header */}
                <div className="pm-proj-header">
                  <div>
                    <h2>{activeProj.name}</h2>
                    <p className="pm-proj-desc">{activeProj.description}</p>
                  </div>
                  <div className="pm-proj-actions">
                    <button className="btn btn-secondary btn-sm" onClick={() => { setTaskStatus('todo'); setShowTask(true) }}>+ Add Task</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteProject(activeProj.id)}>Delete</button>
                  </div>
                </div>

                {/* Progress */}
                <div className="pm-progress-card">
                  <div className="flex-between" style={{ marginBottom: 8 }}>
                    <span style={{ fontSize: '.82rem', color: 'var(--muted)' }}>Overall Progress</span>
                    <span style={{ fontWeight: 700, color: 'var(--a3)' }}>{projProgress}%</span>
                  </div>
                  <div className="pm-prog-bar"><div className="pm-prog-fill" style={{ width: `${projProgress}%` }} /></div>
                  <div className="pm-stat-row">
                    {COLUMNS.map(s => (
                      <div key={s} className="pm-stat-item">
                        <span>{COL_META[s].icon}</span>
                        <span>{tasksByStatus(s).length}</span>
                        <span>{COL_META[s].label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* KANBAN */}
                <div className="pm-kanban">
                  {COLUMNS.map(col => (
                    <div
                      key={col}
                      className={`pm-col ${COL_META[col].cls} ${dragging ? 'droppable' : ''}`}
                      onDragOver={onDragOver}
                      onDrop={e => onDrop(e, col)}
                    >
                      <div className="pm-col-header">
                        <span>{COL_META[col].icon} {COL_META[col].label}</span>
                        <span className="pm-col-count">{tasksByStatus(col).length}</span>
                      </div>
                      <div className="pm-col-cards">
                        {tasksByStatus(col).map(task => (
                          <div
                            key={task.id}
                            className="pm-task-card"
                            draggable
                            onDragStart={e => onDragStart(e, task)}
                          >
                            <div className="pm-task-top">
                              <span className={`tag ${PRIORITY_META[task.priority] || 'tag'}`} style={{ fontSize: '.65rem' }}>{task.priority}</span>
                              <button className="btn btn-ghost btn-sm" style={{ padding: '2px 6px', fontSize: '.7rem' }} onClick={() => handleDeleteTask(task.id)}>×</button>
                            </div>
                            <p className="pm-task-title">{task.title}</p>
                            {task.assignee && <p className="pm-task-meta">👤 {task.assignee}</p>}
                            {task.due && <p className="pm-task-meta">📅 {task.due}</p>}
                            <div className="pm-task-status-btns">
                              {COLUMNS.filter(c => c !== col).map(c => (
                                <button key={c} className="pm-move-btn" onClick={() => handleUpdateTaskStatus(activeProj.id, task.id, c)}>
                                  → {COL_META[c].label}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                        {tasksByStatus(col).length === 0 && (
                          <div className="pm-col-empty">
                            Drop tasks here or<br />
                            <button className="pm-add-task-inline" onClick={() => { setTaskStatus(col); setShowTask(true) }}>+ Add task</button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </main>
        </div>
      )}

      {/* CREATE PROJECT MODAL */}
      {showProjModal && <CreateProjectModal onClose={() => setShowProj(false)} onSubmit={handleCreateProject} />}

      {/* ADD TASK MODAL */}
      {showTaskModal && (
        <AddTaskModal status={taskStatus} onClose={() => setShowTask(false)} onSubmit={handleAddTask} />
      )}

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}

function CreateProjectModal({ onClose, onSubmit }) {
  const COLORS = ['#63b3ed','#a78bfa','#34d399','#fbbf24','#f87171','#fb923c']
  const [form, setForm] = useState({ name: '', description: '', color: COLORS[0] })
  const [loading, setLoading] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const handleSubmit = async e => { e.preventDefault(); setLoading(true); await onSubmit(form); setLoading(false) }
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2 className="modal-title">Create New Project</h2>
        <form className="flex-col" onSubmit={handleSubmit}>
          <div className="form-group"><label className="label">Project Name *</label><input className="input" value={form.name} onChange={e => set('name', e.target.value)} required placeholder="e.g. E-Commerce App" /></div>
          <div className="form-group"><label className="label">Description</label><textarea className="input" rows="2" value={form.description} onChange={e => set('description', e.target.value)} placeholder="Brief description…" /></div>
          <div className="form-group">
            <label className="label">Color</label>
            <div className="pm-color-picks">
              {COLORS.map(c => (
                <button key={c} type="button" className={`pm-color-pick ${form.color === c ? 'active' : ''}`} style={{ background: c }} onClick={() => set('color', c)} />
              ))}
            </div>
          </div>
          <div className="flex-row" style={{ justifyContent: 'flex-end', gap: 10 }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Creating…' : 'Create Project'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function AddTaskModal({ status, onClose, onSubmit }) {
  const [form, setForm] = useState({ title: '', assignee: '', due: '', priority: 'medium', status })
  const [loading, setLoading] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const handleSubmit = async e => { e.preventDefault(); setLoading(true); await onSubmit(form); setLoading(false) }
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2 className="modal-title">Add Task</h2>
        <form className="flex-col" onSubmit={handleSubmit}>
          <div className="form-group"><label className="label">Task Title *</label><input className="input" value={form.title} onChange={e => set('title', e.target.value)} required placeholder="e.g. Design landing page" /></div>
          <div className="grid-2">
            <div className="form-group">
              <label className="label">Status</label>
              <select className="input" value={form.status} onChange={e => set('status', e.target.value)}>
                {COLUMNS.map(c => <option key={c} value={c}>{COL_META[c].label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="label">Priority</label>
              <select className="input" value={form.priority} onChange={e => set('priority', e.target.value)}>
                {PRIORITIES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
              </select>
            </div>
            <div className="form-group"><label className="label">Assignee</label><input className="input" value={form.assignee} onChange={e => set('assignee', e.target.value)} placeholder="Name" /></div>
            <div className="form-group"><label className="label">Due Date</label><input className="input" type="date" value={form.due} onChange={e => set('due', e.target.value)} /></div>
          </div>
          <div className="flex-row" style={{ justifyContent: 'flex-end', gap: 10 }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Adding…' : 'Add Task'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
