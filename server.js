import express from 'express'
import { readFileSync, writeFileSync, renameSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { randomUUID } from 'crypto'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DB_PATH = join(__dirname, 'db.json')
const dist = join(__dirname, 'dist')

const app = express()
app.use(express.json())

/* ---- generic CRUD helpers ---- */

function readDB() {
  try {
    return JSON.parse(readFileSync(DB_PATH, 'utf-8'))
  } catch {
    return { categories: [], menuItems: [], orders: [], contacts: [] }
  }
}

function atomicWrite(data) {
  const tmp = DB_PATH + '.tmp.' + randomUUID()
  writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf-8')
  renameSync(tmp, DB_PATH)
}

/* ---- API routes (before static fallback) ---- */

// List all items in a collection
app.get('/api/:collection', (req, res) => {
  const db = readDB()
  const col = db[req.params.collection]
  if (!col) return res.status(404).json({ error: 'Collection not found' })
  res.json(col)
})

// Get single item
app.get('/api/:collection/:id', (req, res) => {
  const db = readDB()
  const col = db[req.params.collection]
  if (!col) return res.status(404).json({ error: 'Collection not found' })
  const item = col.find(i => i.id === req.params.id)
  if (!item) return res.status(404).json({ error: 'Item not found' })
  res.json(item)
})

// Create item
app.post('/api/:collection', (req, res) => {
  const db = readDB()
  const colName = req.params.collection
  if (!db[colName]) return res.status(404).json({ error: 'Collection not found' })
  const item = { id: randomUUID().slice(0, 8), ...req.body, createdAt: new Date().toISOString() }
  db[colName].push(item)
  atomicWrite(db)
  res.status(201).json(item)
})

// Replace item (PUT)
app.put('/api/:collection/:id', (req, res) => {
  const db = readDB()
  const col = db[req.params.collection]
  if (!col) return res.status(404).json({ error: 'Collection not found' })
  const idx = col.findIndex(i => i.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Item not found' })
  const updated = { ...req.body, id: req.params.id }
  col[idx] = updated
  atomicWrite(db)
  res.json(updated)
})

// Merge item (PATCH)
app.patch('/api/:collection/:id', (req, res) => {
  const db = readDB()
  const col = db[req.params.collection]
  if (!col) return res.status(404).json({ error: 'Collection not found' })
  const idx = col.findIndex(i => i.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Item not found' })
  col[idx] = { ...col[idx], ...req.body, id: req.params.id }
  atomicWrite(db)
  res.json(col[idx])
})

// Delete item
app.delete('/api/:collection/:id', (req, res) => {
  const db = readDB()
  const col = db[req.params.collection]
  if (!col) return res.status(404).json({ error: 'Collection not found' })
  const idx = col.findIndex(i => i.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Item not found' })
  col.splice(idx, 1)
  atomicWrite(db)
  res.status(204).end()
})

/* ---- SPA fallback (production only) ---- */

if (existsSync(dist)) {
  app.use(express.static(dist))
  app.get('*', (req, res) => {
    res.sendFile(join(dist, 'index.html'))
  })
}

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Trattoria Bella server running on http://localhost:${PORT}`)
})
