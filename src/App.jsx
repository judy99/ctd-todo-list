import './App.css';
import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';
import { useState } from 'react';

function App() {
  const [todoList, setTodoList] = useState([]);
  
 const addTodo = (title) => {
  const newTodo = { id: Date.now(), title: title, isCompleted: false };
  setTodoList([...todoList, newTodo]);
 };

 const completeTodo = (id) => {
  const updatedTodos = todoList.map((todo) => todo.id === id ? { ...todo, isCompleted: true } : todo)
  setTodoList(updatedTodos);
 };

 const updateTodo = (updatedTodo) => {
  const updatedTodos = todoList.map((todo) =>
    todo.id === updatedTodo.id ? updatedTodo : todo
  );
  setTodoList(updatedTodos);
 }
  
  return (
    <div>
      <h1>My Todos</h1>
      <TodoForm onAddTodo={addTodo} />
      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
      />
    </div>
  );
}

export default App;
