// Central API base URL — reads from .env in dev, from Vercel env vars in production
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const API = {
  jobs:     `${BASE}/api/jobs`,
  quizzes:  `${BASE}/api/quizzes`,
  products: `${BASE}/api/products`,
  projects: `${BASE}/api/projects`,
  contact:  `${BASE}/api/contact`,
}

export default BASE
