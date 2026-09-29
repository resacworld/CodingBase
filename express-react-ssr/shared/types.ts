// Shared between Express (server.ts) and Vue (src/).
export interface Todo {
  id: number
  title: string
}

export type NewTodo = Pick<Todo, 'title'>

// Data rendered by the server and handed to the client for hydration.
export interface AppState {
  todos: Todo[]
}
