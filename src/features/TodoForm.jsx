import { useRef, useState } from 'react';
import TextInputWithLabel from '../shared/TextInputWithLabel';

const TodoForm = ({ onAddTodo, isSaving }) => {
  const todoTitleInput = useRef('');
  const [workingTodoTitle, setWorkingTodoTitle] = useState({
    title: '',
    isComplete: false,
  });

  const handleAddTodo = (e) => {
    e.preventDefault();
    onAddTodo(workingTodoTitle);
    setWorkingTodoTitle({ title: '', isComplete: false });
    todoTitleInput.current.focus();
  };

  const handleChange = (e) => {
    setWorkingTodoTitle((prev) => ({
      ...prev,
      title: e.target.value,
    }));
  };

  return (
    <form onSubmit={handleAddTodo}>
      <TextInputWithLabel
        elementId="todoTitle"
        onChange={handleChange}
        ref={todoTitleInput}
        value={workingTodoTitle.title}
        placeholder={'Add new task...'}
      />
      <button
        type="submit"
        className="formButton"
        disabled={!workingTodoTitle.title.trim()}
      >
        {isSaving ? 'Saving...' : 'Add Todo'}
      </button>
    </form>
  );
};

export default TodoForm;
