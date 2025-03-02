import { createEffect, createEvent, createStore, sample } from 'effector';
import { Filter, JSONPlaceholderTodo, Todo } from './types';

export const todoAdded = createEvent<string>();
export const todoToggled = createEvent<number>();
export const todoRemoved = createEvent<number>();
export const filterChanged = createEvent<Filter['type']>();

export const fetchTodosFx = createEffect(async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/todos');
  const todos: JSONPlaceholderTodo[] = await response.json();

  return todos
    .map(({ id, title, completed }) => ({
      id,
      text: title,
      completed,
    }))
    .slice(0, 10);
});

export const saveTodoFx = createEffect(async (todo: Omit<Todo, 'id'>) => {
  await new Promise((resolve) => setTimeout(resolve, 600));

  return {
    ...todo,
    id: Date.now(),
  };
});

export const $todos = createStore<Todo[]>([]);
export const $filter = createStore<Filter['type']>('all');
export const $newTodoText = createStore<string>('');

export const $filteredTodos = sample({
  source: { todos: $todos, filter: $filter },
  fn: ({ todos, filter }) => {
    switch (filter) {
      case 'active':
        return todos.filter((todo) => !todo.completed);
      case 'completed':
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  },
});

export const $pendingTodos = $todos.map((todos) =>
  todos.filter((todo) => !todo.completed)
);
export const $completedTodos = $todos.map((todos) =>
  todos.filter((todo) => todo.completed)
);
export const $todosCount = $todos.map((todos) => todos.length);
export const $activeTodosCount = $pendingTodos.map((todos) => todos.length);
export const $completedTodosCount = $completedTodos.map(
  (todos) => todos.length
);
export const $isLoading = fetchTodosFx.pending;
export const $isError = createStore(false)
  .on(fetchTodosFx.fail, () => true)
  .reset(fetchTodosFx);

$todos
  .on(fetchTodosFx.doneData, (_, todos) => todos)
  .on(todoToggled, (todos, id) => {
    return todos.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
  })
  .on(todoRemoved, (todos, id) => todos.filter((t) => t.id !== id))
  .on(saveTodoFx.doneData, (todos, newTodo) => [...todos, newTodo]);

$filter.on(filterChanged, (_, filter) => filter);

sample({
  clock: todoAdded,
  fn: (text) => ({ text, completed: false }),
  target: saveTodoFx,
});
