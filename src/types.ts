export type JSONPlaceholderTodo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

export type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

export type Filter = {
  type: 'all' | 'active' | 'completed';
};
