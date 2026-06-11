const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 5000;
const DB_PATH = path.join(__dirname, 'db', 'db.json');

// ── Middleware ──
app.use(cors());
app.use(bodyParser.json());

// ── DB helpers ──
const readDB = () => JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
const writeDB = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

// ══════════════════════════════════════════
// JOBS ROUTES
// ══════════════════════════════════════════
const jobsRouter = express.Router();

// GET all jobs (with optional search & type filter)
jobsRouter.get('/', (req, res) => {
  const db = readDB();
  let jobs = db.jobs;
  const { q, type } = req.query;
  if (q) {
    const lq = q.toLowerCase();
    jobs = jobs.filter(j =>
      j.title.toLowerCase().includes(lq) ||
      j.company.toLowerCase().includes(lq) ||
      j.location.toLowerCase().includes(lq)
    );
  }
  if (type && type !== 'All') {
    jobs = jobs.filter(j => j.type === type);
  }
  res.json(jobs);
});

// GET single job
jobsRouter.get('/:id', (req, res) => {
  const db = readDB();
  const job = db.jobs.find(j => j.id === req.params.id);
  if (!job) return res.status(404).json({ error: 'Job not found' });
  res.json(job);
});

// POST new job (employer)
jobsRouter.post('/', (req, res) => {
  const db = readDB();
  const job = {
    id: 'j' + uuidv4().slice(0, 8),
    ...req.body,
    postedAt: new Date().toISOString().split('T')[0],
    applications: []
  };
  db.jobs.unshift(job);
  writeDB(db);
  res.status(201).json(job);
});

// POST application to a job
jobsRouter.post('/:id/apply', (req, res) => {
  const db = readDB();
  const job = db.jobs.find(j => j.id === req.params.id);
  if (!job) return res.status(404).json({ error: 'Job not found' });
  const application = {
    id: uuidv4(),
    ...req.body,
    appliedAt: new Date().toISOString()
  };
  job.applications.push(application);
  writeDB(db);
  res.status(201).json({ message: 'Application submitted!', application });
});

// DELETE job
jobsRouter.delete('/:id', (req, res) => {
  const db = readDB();
  db.jobs = db.jobs.filter(j => j.id !== req.params.id);
  writeDB(db);
  res.json({ message: 'Job deleted' });
});

app.use('/api/jobs', jobsRouter);

// ══════════════════════════════════════════
// QUIZZES ROUTES
// ══════════════════════════════════════════
const quizRouter = express.Router();

// GET all quizzes (list, no questions exposed)
quizRouter.get('/', (req, res) => {
  const db = readDB();
  const list = db.quizzes.map(q => ({
    id: q.id, title: q.title, description: q.description,
    author: q.author, createdAt: q.createdAt,
    questionCount: q.questions.length,
    submissionCount: q.submissions.length
  }));
  res.json(list);
});

// GET single quiz (with questions, correct answers hidden for taking)
quizRouter.get('/:id', (req, res) => {
  const db = readDB();
  const quiz = db.quizzes.find(q => q.id === req.params.id);
  if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
  // Hide correct index when taking
  if (req.query.mode === 'take') {
    const safe = {
      ...quiz,
      questions: quiz.questions.map(({ correct, ...rest }) => rest)
    };
    return res.json(safe);
  }
  res.json(quiz);
});

// POST new quiz
quizRouter.post('/', (req, res) => {
  const db = readDB();
  const quiz = {
    id: 'q' + uuidv4().slice(0, 8),
    ...req.body,
    createdAt: new Date().toISOString().split('T')[0],
    submissions: []
  };
  db.quizzes.unshift(quiz);
  writeDB(db);
  res.status(201).json(quiz);
});

// POST quiz submission (answers)
quizRouter.post('/:id/submit', (req, res) => {
  const db = readDB();
  const quiz = db.quizzes.find(q => q.id === req.params.id);
  if (!quiz) return res.status(404).json({ error: 'Quiz not found' });

  const { answers, userName } = req.body; // answers: array of chosen indices
  let score = 0;
  const results = quiz.questions.map((q, i) => {
    const isCorrect = answers[i] === q.correct;
    if (isCorrect) score++;
    return {
      question: q.question,
      chosen: q.options[answers[i]],
      correct: q.options[q.correct],
      isCorrect
    };
  });

  const submission = {
    id: uuidv4(),
    userName: userName || 'Anonymous',
    score,
    total: quiz.questions.length,
    percentage: Math.round((score / quiz.questions.length) * 100),
    results,
    submittedAt: new Date().toISOString()
  };
  quiz.submissions.push(submission);
  writeDB(db);
  res.json(submission);
});

// DELETE quiz
quizRouter.delete('/:id', (req, res) => {
  const db = readDB();
  db.quizzes = db.quizzes.filter(q => q.id !== req.params.id);
  writeDB(db);
  res.json({ message: 'Quiz deleted' });
});

app.use('/api/quizzes', quizRouter);

// ══════════════════════════════════════════
// PRODUCTS / E-COMMERCE ROUTES
// ══════════════════════════════════════════
const productsRouter = express.Router();

// GET all products (with optional category filter)
productsRouter.get('/', (req, res) => {
  const db = readDB();
  let products = db.products;
  const { category, maxPrice, search } = req.query;
  if (category && category !== 'All') products = products.filter(p => p.category === category);
  if (maxPrice) products = products.filter(p => p.price <= Number(maxPrice));
  if (search) {
    const s = search.toLowerCase();
    products = products.filter(p => p.name.toLowerCase().includes(s) || p.description.toLowerCase().includes(s));
  }
  res.json(products);
});

// GET single product
productsRouter.get('/:id', (req, res) => {
  const db = readDB();
  const product = db.products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

// POST order/checkout
productsRouter.post('/order', (req, res) => {
  const db = readDB();
  const order = {
    id: 'ORD-' + uuidv4().slice(0, 8).toUpperCase(),
    ...req.body,
    status: 'confirmed',
    createdAt: new Date().toISOString()
  };
  db.orders.push(order);
  writeDB(db);
  res.status(201).json({ message: 'Order placed successfully!', order });
});

// GET all orders
productsRouter.get('/orders/all', (req, res) => {
  const db = readDB();
  res.json(db.orders);
});

app.use('/api/products', productsRouter);

// ══════════════════════════════════════════
// PROJECTS / TASKS ROUTES
// ══════════════════════════════════════════
const projectsRouter = express.Router();

// GET all projects
projectsRouter.get('/', (req, res) => {
  const db = readDB();
  res.json(db.projects);
});

// GET single project
projectsRouter.get('/:id', (req, res) => {
  const db = readDB();
  const proj = db.projects.find(p => p.id === req.params.id);
  if (!proj) return res.status(404).json({ error: 'Project not found' });
  res.json(proj);
});

// POST new project
projectsRouter.post('/', (req, res) => {
  const db = readDB();
  const proj = {
    id: 'proj-' + uuidv4().slice(0, 8),
    ...req.body,
    createdAt: new Date().toISOString().split('T')[0],
    tasks: []
  };
  db.projects.unshift(proj);
  writeDB(db);
  res.status(201).json(proj);
});

// PUT update project
projectsRouter.put('/:id', (req, res) => {
  const db = readDB();
  const idx = db.projects.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  db.projects[idx] = { ...db.projects[idx], ...req.body };
  writeDB(db);
  res.json(db.projects[idx]);
});

// DELETE project
projectsRouter.delete('/:id', (req, res) => {
  const db = readDB();
  db.projects = db.projects.filter(p => p.id !== req.params.id);
  writeDB(db);
  res.json({ message: 'Deleted' });
});

// POST task to project
projectsRouter.post('/:id/tasks', (req, res) => {
  const db = readDB();
  const proj = db.projects.find(p => p.id === req.params.id);
  if (!proj) return res.status(404).json({ error: 'Project not found' });
  const task = {
    id: 't-' + uuidv4().slice(0, 8),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  proj.tasks.push(task);
  writeDB(db);
  res.status(201).json(task);
});

// PUT update task status
projectsRouter.put('/:id/tasks/:taskId', (req, res) => {
  const db = readDB();
  const proj = db.projects.find(p => p.id === req.params.id);
  if (!proj) return res.status(404).json({ error: 'Project not found' });
  const tidx = proj.tasks.findIndex(t => t.id === req.params.taskId);
  if (tidx === -1) return res.status(404).json({ error: 'Task not found' });
  proj.tasks[tidx] = { ...proj.tasks[tidx], ...req.body };
  writeDB(db);
  res.json(proj.tasks[tidx]);
});

// DELETE task
projectsRouter.delete('/:id/tasks/:taskId', (req, res) => {
  const db = readDB();
  const proj = db.projects.find(p => p.id === req.params.id);
  if (!proj) return res.status(404).json({ error: 'Project not found' });
  proj.tasks = proj.tasks.filter(t => t.id !== req.params.taskId);
  writeDB(db);
  res.json({ message: 'Task deleted' });
});

app.use('/api/projects', projectsRouter);

// ══════════════════════════════════════════
// CONTACT ROUTE
// ══════════════════════════════════════════
app.post('/api/contact', (req, res) => {
  const db = readDB();
  const msg = {
    id: uuidv4(),
    ...req.body,
    receivedAt: new Date().toISOString()
  };
  db.messages.push(msg);
  writeDB(db);
  res.json({ message: 'Message received! Will get back to you soon.' });
});

// ── Root ──
app.get('/', (req, res) => {
  res.json({
    name: 'SGV Dev API',
    version: '1.0.0',
    routes: ['/api/jobs', '/api/quizzes', '/api/products', '/api/projects', '/api/contact']
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Server running at http://localhost:${PORT}`);
  console.log(`📦 DB at: ${DB_PATH}\n`);
});
