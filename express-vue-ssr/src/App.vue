<script setup lang="ts">
import { ref } from 'vue'
import { api } from './api.ts'
import type { AppState } from '../server/router.ts'

const props = defineProps<{ initialTodos: AppState['todos'] }>()
const todos = ref(props.initialTodos)
const title = ref('')

async function add() {
  const todo = await api.todoAdd.mutate({ title: title.value })
  todos.value.push(todo)
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
