import React, { useState, useEffect, useMemo } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos } from './api/todos';
import { Todo } from './types/Todo';

type FilterStatus = 'all' | 'active' | 'completed';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [newTodoTitle, setNewTodoTitle] = useState('');

  const loadTodos = async () => {
    setError(null);
    setLoading(true);
    try {
      const fetchedTodos = await getTodos();

      setTodos(fetchedTodos);
    } catch (err) {
      setError('Unable to load todos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (USER_ID) {
      loadTodos();
    }
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleHideError = () => {
    setError(null);
  };

  const visibleTodos = useMemo(() => {
    return todos.filter(todo => {
      if (filterStatus === 'active') {
        return !todo.completed;
      }

      if (filterStatus === 'completed') {
        return todo.completed;
      }

      return true;
    });
  }, [todos, filterStatus]);

  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  const completedTodosCount = todos.filter(todo => todo.completed).length;

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* Toggle All Button: Will be fully implemented in Part 2 */}
          {/* It becomes 'active' if all todos are completed and there's at least one todo */}
          {/* It's disabled if there are no todos or while the app is loading */}
          <button
            type="button"
            className={`todoapp__toggle-all ${activeTodosCount === 0 && todos.length > 0 ? 'active' : ''}`}
            data-cy="ToggleAllButton"
            disabled={todos.length === 0 || loading}
          />

          {/* Form to add a new todo: Will be fully implemented in Part 2 */}
          {/* Input is disabled while the app is loading */}
          <form
            onSubmit={e => {
              e.preventDefault();

              setNewTodoTitle('');
            }}
          >
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodoTitle}
              onChange={e => setNewTodoTitle(e.target.value)}
              disabled={loading}
            />
          </form>
        </header>

        {/* Main section for the todo list */}
        <section className="todoapp__main" data-cy="TodoList">
          {/* Display a message if there are no todos and not currently loading */}
          {todos.length === 0 && !loading && (
            <p className="box has-text-centered mt-4">
              No todos yet! Add one above.
            </p>
          )}

          {/* Display a full-screen loading spinner during initial data fetch */}
          {loading && (
            <div className="modal overlay is-active">
              <div className="modal-background has-background-white-ter"></div>
              <div className="loader" />
            </div>
          )}

          {/* Render the list of visible todos if not loading and there are todos */}
          {!loading && todos.length > 0 && (
            <>
              {visibleTodos.map(todo => (
                <div
                  data-cy="Todo"
                  className={`todo ${todo.completed ? 'completed' : ''}`}
                  key={todo.id}
                >
                  {/* Label for the todo status checkbox. Using htmlFor and id for explicit association. */}
                  <label
                    className="todo__status-label"
                    htmlFor={`todo-status-${todo.id}`}
                  >
                    <input
                      id={`todo-status-${todo.id}`}
                      data-cy="TodoStatus"
                      type="checkbox"
                      className="todo__status"
                      checked={todo.completed}
                      onChange={() => {
                        /* Toggle todo status logic in Part 2 */
                      }}
                      aria-labelledby={`todo-status-label-${todo.id}`}
                    />
                  </label>
                  {/* Remove button: Will be implemented in Part 2 */}
                  <button
                    type="button"
                    className="todo__remove"
                    data-cy="TodoDelete"
                    onClick={() => {
                      /* Delete todo logic in Part 2 */
                    }}
                  >
                    ×
                  </button>

                  {/* Overlay for individual todo loading states (e.g., delete/update in progress) */}
                  {/* It will be 'is-active' when a specific todo operation is ongoing. */}
                  <div data-cy="TodoLoader" className="modal overlay">
                    <div
                      className="modal-background
                      has-background-white-ter"
                    ></div>
                    <div className="loader" />
                  </div>
                </div>
              ))}
            </>
          )}
        </section>

        {/* Footer section: Hidden if there are no todos */}
        <footer
          className={`todoapp__footer ${todos.length === 0 ? 'hidden' : ''}`}
          data-cy="Footer"
        >
          <span className="todo-count" data-cy="TodosCounter">
            {activeTodosCount} item{activeTodosCount === 1 ? '' : 's'} left
          </span>

          {/* Navigation for filtering todos: Updates filterStatus on click */}
          <nav className="filter" data-cy="Filter">
            <a
              href="#/"
              className={`filter__link ${filterStatus === 'all' ? 'selected' : ''}`}
              data-cy="FilterLinkAll"
              onClick={() => setFilterStatus('all')}
            >
              All
            </a>

            <a
              href="#/active"
              className={`filter__link ${filterStatus === 'active' ? 'selected' : ''}`}
              data-cy="FilterLinkActive"
              onClick={() => setFilterStatus('active')}
            >
              Active
            </a>

            <a
              href="#/completed"
              className={`filter__link ${filterStatus === 'completed' ? 'selected' : ''}`}
              data-cy="FilterLinkCompleted"
              onClick={() => setFilterStatus('completed')}
            >
              Completed
            </a>
          </nav>

          {/* Button to clear completed todos: Will be implemented in Part 2 */}
          {/* Disabled if no completed todos or while the app is loading */}
          <button
            type="button"
            className="todoapp__clear-completed"
            data-cy="ClearCompletedButton"
            disabled={completedTodosCount === 0 || loading}
            onClick={() => {
              /* Clear completed todos logic in Part 2 */
            }}
          >
            Clear completed
          </button>
        </footer>
      </div>

      {/* Error notification: Displayed when 'error' state is not null, hidden with 'hidden' class */}
      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${error ? '' : 'hidden'}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={handleHideError}
        />
        {error}
      </div>
    </div>
  );
};
