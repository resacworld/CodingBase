const list = document.querySelector('#todos')
const todoForm = document.querySelector('#todo-form')
const title = document.querySelector('#title')
const primesForm = document.querySelector('#primes-form')
const limit = document.querySelector('#limit')
const primesResult = document.querySelector('#primes-result')

// A todo can arrive twice (POST response + live event): the id deduplicates it.
function showTodo(todo) {
  if (list.querySelector(`[data-id="${todo.id}"]`)) return
  const item = document.createElement('li')
  item.dataset.id = todo.id
  item.textContent = todo.title
  list.append(item)
}

todoForm.addEventListener('submit', async (e) => {
  e.preventDefault()
  const res = await fetch('/api/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: title.value }),
  })
  if (!res.ok) return
  showTodo(await res.json())
  title.value = ''
})

const events = new EventSource('/api/events')
events.onmessage = (e) => showTodo(JSON.parse(e.data))
// Catch up on anything added before this connection opened.
events.onopen = async () => {
  const res = await fetch('/api/todos')
  ;(await res.json()).forEach(showTodo)
}

primesForm.addEventListener('submit', async (e) => {
  e.preventDefault()
  const button = primesForm.querySelector('button')
  button.disabled = true
  primesResult.textContent = 'Calcul en cours…'
  try {
    const res = await fetch(`/api/primes?limit=${limit.value}`)
    if (!res.ok) throw new Error(res.status)
    const r = await res.json()
    const format = (n) => n.toLocaleString('fr-FR', { maximumFractionDigits: 1 })
    primesResult.textContent =
      `${format(r.count)} nombres premiers jusqu'à ${format(r.limit)} : ` +
      `${format(r.sequential_ms)} ms sur 1 cœur, ${format(r.parallel_ms)} ms sur ${r.threads} ` +
      `(×${format(r.sequential_ms / r.parallel_ms)}).`
  } catch {
    primesResult.textContent = 'Le calcul a échoué.'
  } finally {
    button.disabled = false
  }
})
