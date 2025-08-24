import { useEffect, useState } from 'react';
import TextInputWithLabel from '../../shared/TextInputWithLabel';

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [workingTitle, setWorkingTitle] = useState(todo.title);

  const handleCancel = () => {
    setWorkingTitle(todo.title);
    setIsEditing(false);
  };

  const handleEdit = (e) => {
    setWorkingTitle(e.target.value);
  };

  const handleUpdate = (e) => {
    if (!isEditing) return;
    e.preventDefault();
    onUpdateTodo({ ...todo, title: workingTitle });
    setIsEditing(false);
  };

  const handleChange = () => {
    onCompleteTodo(todo.id);
  };

  useEffect(() => {
    setWorkingTitle(todo.title);
  }, [todo]);

  return (
    <li>
      <form>
        {isEditing ? (
          <>
            <TextInputWithLabel value={workingTitle} onChange={handleEdit} />
            <button type="button" onClick={handleCancel}>
              {'Cancel'}
            </button>
            <button
              type="button"
              disabled={!workingTitle.length}
              onClick={handleUpdate}
            >
              {'Update'}
            </button>
          </>
        ) : (
          <>
            <label>
              <input
                type="checkbox"
                checked={todo.isCompleted}
                onChange={handleChange}
              />
              <span onClick={() => setIsEditing(true)}>{todo.title}</span>
            </label>
          </>
        )}
      </form>
    </li>
  );
}

export default TodoListItem;
