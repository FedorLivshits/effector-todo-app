import React, { useEffect } from 'react';
import { useUnit } from 'effector-react';
import {
  $filteredTodos,
  $filter,
  $todosCount,
  $activeTodosCount,
  $completedTodosCount,
  $isLoading,
  $isError,
  todoAdded,
  todoToggled,
  todoRemoved,
  filterChanged,
  fetchTodosFx,
} from './model';

function App() {
  const [
    filteredTodos,
    filter,
    todosCount,
    activeTodosCount,
    completedTodosCount,
    isLoading,
    isError,
  ] = useUnit([
    $filteredTodos,
    $filter,
    $todosCount,
    $activeTodosCount,
    $completedTodosCount,
    $isLoading,
    $isError,
  ]);

  useEffect(() => {
    fetchTodosFx();
  }, []);

  const handleAddTodo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const text = formData.get('text') as string;

    if (text.trim()) {
      todoAdded(text.trim());
      form.reset();
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 overflow-hidden">
      <div className="max-w-xl w-full h-[80vh] bg-white shadow-lg rounded-lg p-6 flex flex-col">
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">
          Todo List with Effector
        </h1>

        {isLoading && <p className="text-center text-gray-500">Loading...</p>}
        {isError && (
          <p className="text-center text-red-500">
            Failed to load todos. Try again.
          </p>
        )}

        {!isLoading && !isError && (
          <>
            <form onSubmit={handleAddTodo} className="flex mb-4">
              <input
                type="text"
                name="text"
                placeholder="Add a new task"
                required
                className="flex-1 px-4 py-2 text-base border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-md transition-all duration-200 transform active:scale-95 cursor-pointer"
              >
                Add
              </button>
            </form>

            <div className="flex justify-center space-x-2 mb-4">
              <button
                className={`px-3 py-2 rounded-md transition-all duration-200 transform active:scale-95 cursor-pointer ${
                  filter === 'all'
                    ? 'bg-gray-200 font-semibold'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                onClick={() => filterChanged('all')}
              >
                All ({todosCount})
              </button>
              <button
                className={`px-3 py-2 rounded-md transition-all duration-200 transform active:scale-95 cursor-pointer ${
                  filter === 'active'
                    ? 'bg-gray-200 font-semibold'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                onClick={() => filterChanged('active')}
              >
                Active ({activeTodosCount})
              </button>
              <button
                className={`px-3 py-2 rounded-md transition-all duration-200 transform active:scale-95 cursor-pointer ${
                  filter === 'completed'
                    ? 'bg-gray-200 font-semibold'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                onClick={() => filterChanged('completed')}
              >
                Completed ({completedTodosCount})
              </button>
            </div>
            <ul className="h-[60vh] overflow-y-auto space-y-2 border border-gray-200 rounded-md p-2">
              {filteredTodos.map((todo) => (
                <li
                  key={todo.id}
                  className={`flex items-center p-3 rounded-md ${
                    todo.completed ? 'bg-gray-100' : 'bg-white'
                  } shadow-sm border border-gray-200`}
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => todoToggled(todo.id)}
                    className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 mr-3"
                  />
                  <span
                    className={`flex-1 ${
                      todo.completed
                        ? 'line-through text-gray-500'
                        : 'text-gray-800'
                    }`}
                  >
                    {todo.text}
                  </span>
                  <button
                    onClick={() => todoRemoved(todo.id)}
                    className="ml-2 px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded transition-all duration-200 transform active:scale-95 сursor-pointer"
                  >
                    Delete
                  </button>
                </li>
              ))}
              {filteredTodos.length === 0 && (
                <li className="text-center py-4 text-gray-500">
                  {filter === 'all'
                    ? 'No tasks'
                    : filter === 'active'
                    ? 'No active tasks'
                    : 'No completed tasks'}
                </li>
              )}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
