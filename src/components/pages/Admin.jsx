import { useState, useEffect, useCallback } from 'react'
import { list, create, update, remove } from '../../lib/db.js'

/* ------------------------------------------------------------------ */
/*  Shared sub-components                                              */
/* ------------------------------------------------------------------ */

function ConfirmModal({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-surface p-6 shadow-xl">
        <h3 className="font-serif text-xl text-text">{title}</h3>
        <p className="mt-2 text-text-muted">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-text hover:bg-surface-alt transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:brightness-110 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Category Manager                                                   */
/* ------------------------------------------------------------------ */

const emptyCategory = { name: '', description: '' }

function CategoryManager() {
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState(emptyCategory)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)

  const fetchCats = useCallback(async () => {
    try {
      setError('')
      const data = await list('categories')
      setCategories(data)
    } catch {
      setError('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchCats() }, [fetchCats])

  function resetForm() {
    setForm(emptyCategory)
    setEditingId(null)
    setError('')
  }

  function validate() {
    if (!form.name.trim()) return 'Category name is required.'
    return ''
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const err = validate()
    if (err) { setError(err); return }
    setError('')
    try {
      if (editingId) {
        await update('categories', editingId, form)
      } else {
        await create('categories', form)
      }
      resetForm()
      await fetchCats()
    } catch {
      setError('Failed to save category.')
    }
  }

  function startEdit(cat) {
    setForm({ name: cat.name, description: cat.description || '' })
    setEditingId(cat.id)
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    try {
      await remove('categories', deleteTarget.id)
      setDeleteTarget(null)
      await fetchCats()
    } catch {
      setError('Failed to delete category.')
    }
  }

  if (loading) return <p className="text-text-muted">Loading categories…</p>

  return (
    <div>
      <h3 className="font-serif text-2xl text-text mb-4">Categories</h3>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-surface-alt rounded-xl p-5 space-y-4 mb-8">
        <div>
          <label className="block text-sm font-semibold text-text mb-1">Name *</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Antipasti"
            className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-text placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-text mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Optional description…"
            rows={2}
            className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-text placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition resize-none"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:brightness-110 active:scale-[.98] transition"
          >
            {editingId ? 'Update Category' : 'Add Category'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-text hover:bg-surface transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* List */}
      {categories.length === 0 ? (
        <p className="text-text-muted">No categories yet. Add one above.</p>
      ) : (
        <div className="space-y-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center justify-between rounded-xl bg-surface border border-border p-4"
            >
              <div>
                <span className="font-semibold text-text">{cat.name}</span>
                {cat.description && (
                  <p className="text-sm text-text-muted mt-0.5">{cat.description}</p>
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => startEdit(cat)}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-text hover:bg-surface-alt transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteTarget(cat)}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Category?"
        message={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.name}"? Menu items in this category will become uncategorized.`
            : ''
        }
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Menu Item Manager                                                  */
/* ------------------------------------------------------------------ */

const emptyItem = { name: '', description: '', price: '', categoryId: '', imageUrl: '' }

function MenuItemManager() {
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState(emptyItem)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)

  const fetchData = useCallback(async () => {
    try {
      setError('')
      const [itms, cats] = await Promise.all([list('menuItems'), list('categories')])
      setItems(itms)
      setCategories(cats)
    } catch {
      setError('Failed to load data.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  function resetForm() {
    setForm(emptyItem)
    setEditingId(null)
    setError('')
    setSuccess('')
  }

  function validate() {
    if (!form.name.trim()) return 'Item name is required.'
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
      return 'A valid price is required.'
    return ''
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const err = validate()
    if (err) { setError(err); return }
    setError('')
    setSuccess('')
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        categoryId: form.categoryId || null,
        imageUrl: form.imageUrl.trim() || '',
      }
      if (editingId) {
        await update('menuItems', editingId, payload)
      } else {
        await create('menuItems', payload)
      }
      resetForm()
      setSuccess(editingId ? 'Item updated!' : 'Item added!')
      await fetchData()
    } catch {
      setError('Failed to save menu item.')
    }
  }

  function startEdit(item) {
    setForm({
      name: item.name,
      description: item.description || '',
      price: String(item.price),
      categoryId: item.categoryId || '',
      imageUrl: item.imageUrl || '',
    })
    setEditingId(item.id)
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    try {
      await remove('menuItems', deleteTarget.id)
      setDeleteTarget(null)
      await fetchData()
    } catch {
      setError('Failed to delete item.')
    }
  }

  function getCategoryName(catId) {
    const c = categories.find((cat) => cat.id === catId)
    return c ? c.name : 'Uncategorized'
  }

  if (loading)
    return <p className="text-text-muted">Loading menu items…</p>

  return (
    <div>
      <h3 className="font-serif text-2xl text-text mb-4">Menu Items</h3>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-surface-alt rounded-xl p-5 space-y-4 mb-8"
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-text mb-1">
              Name *
            </label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Bruschetta al Pomodoro"
              className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-text placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-text mb-1">
              Price (€) *
            </label>
            <input
              type="number"
              step="0.5"
              min="0"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="e.g. 12"
              className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-text placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-text mb-1">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            placeholder="Describe the dish…"
            rows={2}
            className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-text placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition resize-none"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-text mb-1">
              Category
            </label>
            <select
              value={form.categoryId}
              onChange={(e) =>
                setForm({ ...form, categoryId: e.target.value })
              }
              className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-text focus:outline-none focus:ring-2 focus:ring-primary/30 transition appearance-none"
            >
              <option value="">— Select a category —</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-text mb-1">
              Image URL
            </label>
            <input
              value={form.imageUrl}
              onChange={(e) =>
                setForm({ ...form, imageUrl: e.target.value })
              }
              placeholder="https://…"
              className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-text placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-secondary font-semibold">{success}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:brightness-110 active:scale-[.98] transition"
          >
            {editingId ? 'Update Item' : 'Add Item'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-text hover:bg-surface transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Items table */}
      {items.length === 0 ? (
        <p className="text-text-muted">No menu items yet. Add one above.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-alt text-text-muted text-xs uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold hidden sm:table-cell">
                  Category
                </th>
                <th className="px-4 py-3 font-semibold">Price</th>
                <th className="px-4 py-3 font-semibold sr-only">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-surface-alt/50 transition">
                  <td className="px-4 py-3 font-medium text-text">{item.name}</td>
                  <td className="px-4 py-3 text-text-muted hidden sm:table-cell">
                    {getCategoryName(item.categoryId)}
                  </td>
                  <td className="px-4 py-3 text-text">
                    <span className="rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                      €{item.price}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => startEdit(item)}
                        className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-text hover:bg-surface-alt transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(item)}
                        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Menu Item?"
        message={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.name}"? This cannot be undone.`
            : ''
        }
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Admin Page                                                         */
/* ------------------------------------------------------------------ */

export default function Admin() {
  const [tab, setTab] = useState('items')

  return (
    <main className="flex-1">
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl text-text">
              Admin Panel
            </h1>
            <p className="mt-3 text-lg text-text-muted max-w-xl mx-auto">
              Manage your menu — add, edit, or remove categories and menu items.
              All changes are saved automatically.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-10 border-b border-border pb-0">
            <button
              onClick={() => setTab('items')}
              className={`relative px-5 py-3 text-sm font-semibold transition-colors ${
                tab === 'items'
                  ? 'text-primary'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              Menu Items
              {tab === 'items' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </button>
            <button
              onClick={() => setTab('categories')}
              className={`relative px-5 py-3 text-sm font-semibold transition-colors ${
                tab === 'categories'
                  ? 'text-primary'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              Categories
              {tab === 'categories' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          </div>

          {/* Content */}
          {tab === 'categories' ? <CategoryManager /> : <MenuItemManager />}
        </div>
      </section>
    </main>
  )
}
