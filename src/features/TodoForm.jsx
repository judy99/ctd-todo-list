import { useRef, useState } from 'react';
import TextInputWithLabel from '../shared/TextInputWithLabel'

const TodoForm = ({ onAddTodo, isSaving }) => {
  const todoTitleInput = useRef('');
  const [workingTodoTitle, setWorkingTodoTitle] = useState({title: '', isComplete: false});

  const handleAddTodo = (e) => {
    e.preventDefault();
    onAddTodo(workingTodoTitle);
    setWorkingTodoTitle({ title: '', isComplete: false });
    todoTitleInput.current.focus();
  };

  return (
    <form onSubmit={handleAddTodo}>
      <TextInputWithLabel
        labelText="Todo"
        elementId="todoTitle"
        onChange={(e) => setWorkingTodoTitle({title: e.target.value, isComplete: false})}
        ref={todoTitleInput}
        value={workingTodoTitle.title}
      />
      <button type="submit" disabled={!workingTodoTitle.title.trim()}>
        {isSaving ? 'Saving...' : 'Add Todo'}
      </button>
    </form>
  );
};

export default TodoForm;
