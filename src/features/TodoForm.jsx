import { useRef, useState } from 'react';
import TextInputWithLabel from '../shared/TextInputWithLabel';
import styled from 'styled-components';

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
    <form onSubmit={handleAddTodo} className="oneLineForm">
      <TextInputWithLabel
        elementId="todoTitle"
        onChange={handleChange}
        ref={todoTitleInput}
        value={workingTodoTitle.title}
        placeholder={'Add new task...'}
      />
      <StyledButton
        type="submit"
        className="formButton"
        disabled={!workingTodoTitle.title.trim()}
      >
        {isSaving ? 'Saving...' : 'Add Todo'}
      </StyledButton>
    </form>
  );
};

const StyledButton = styled.button`
  &:disabled {
    font-style: italic;
  }
`;

export default TodoForm;
