const base = (collection) => `/api/${collection}`

export const list = async (collection) => {
  const res = await fetch(base(collection))
  if (!res.ok) throw new Error(`Failed to list ${collection}`)
  return res.json()
}

export const get = async (collection, id) => {
  const res = await fetch(`${base(collection)}/${id}`)
  if (!res.ok) throw new Error(`Failed to get ${collection}/${id}`)
  return res.json()
}

export const create = async (collection, item) => {
  const res = await fetch(base(collection), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  })
  if (!res.ok) throw new Error(`Failed to create ${collection}`)
  return res.json()
}

export const update = async (collection, id, payload) => {
  const res = await fetch(`${base(collection)}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`Failed to update ${collection}/${id}`)
  return res.json()
}

export const patch = async (collection, id, payload) => {
  const res = await fetch(`${base(collection)}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`Failed to patch ${collection}/${id}`)
  return res.json()
}

export const remove = async (collection, id) => {
  const res = await fetch(`${base(collection)}/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(`Failed to delete ${collection}/${id}`)
}
