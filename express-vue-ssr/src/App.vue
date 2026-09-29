<script setup lang="ts">
import { ref } from 'vue'
import type { NewTodo, Todo } from '../shared/types.ts'

const props = defineProps<{ initialTodos: Todo[] }>()
const todos = ref(props.initialTodos)
const title = ref('')

async function add() {
  const body: NewTodo = { title: title.value }
  const res = await fetch('/api/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) return
  todos.value.push((await res.json()) as Todo)
  title.value = ''
}
</script>

<template>
  <h1>Todos (SSR)</h1>
  <ul>
    <li v-for="todo in todos" :key="todo.id">{{ todo.title }}</li>
  </ul>
  <form @submit.prevent="add">
    <input v-model="title" required />
    <button>Ajouter</button>
  </form>
</template>
