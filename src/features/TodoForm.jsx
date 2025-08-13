import { useRef, useState } from 'react';
import TextInputWithLabel from '../shared/TextInputWithLabel'

const TodoForm = ({ onAddTodo }) => {
  const todoTitleInput = useRef('')
  const [ workingTodoTitle, setWorkingTodoTitle ] = useState('');
  
  const handleAddTodo = (e) => {
    e.preventDefault();
    onAddTodo(workingTodoTitle);
    setWorkingTodoTitle('');
    todoTitleInput.current.focus();
  };

  return (
    <form onSubmit={handleAddTodo}>
      <TextInputWithLabel
        labelText="Todo"
        elementId="todoTitle"
        onChange={(e) => setWorkingTodoTitle(e.target.value)}
        ref={todoTitleInput}
        value={workingTodoTitle}
      />
      <button type="submit" disabled={!workingTodoTitle.trim()}>
        Add Todo
      </button>
    </form>
  );
};

export default TodoForm;
