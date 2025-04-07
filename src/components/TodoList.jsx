import { useState, useEffect } from 'react';
import TodoItem from './TodoItem';
import { useTheme } from '../context/ThemeContext';
import React from 'react';

const TodoList = () => {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [inputValue, setInputValue] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTodo, setEditingTodo] = useState(null);
  const [sortOption, setSortOption] = useState('default');
  const [filterOption, setFilterOption] = useState('all');
  const { darkMode } = useTheme();

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      if (editingTodo) {
        setTodos(todos.map(todo =>
          todo.id === editingTodo.id
            ? { 
                ...todo, 
                text: inputValue, 
                description, 
                dueDate: dueDate || null,
                lastModified: new Date().toISOString()
              }
            : todo
        ));
        setEditingTodo(null);
      } else {
        setTodos([...todos, {
          id: Date.now(),
          text: inputValue,
          description,
          dueDate: dueDate || null,
          completed: false,
          createdAt: new Date().toISOString(),
          lastModified: new Date().toISOString()
        }]);
      }
      setInputValue('');
      setDescription('');
      setDueDate('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(prevTodos => 
      prevTodos.map(todo => 
        todo.id === id 
          ? { 
              ...todo, 
              completed: !todo.completed,
              lastModified: new Date().toISOString(),
              completedAt: !todo.completed ? new Date().toISOString() : null
            } 
          : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };

  const startEditing = (todo) => {
    setEditingTodo(todo);
    setInputValue(todo.text);
    setDescription(todo.description || '');
    setDueDate(todo.dueDate || '');
  };

  // Filter todos based on search query and filter option
  const getFilteredTodos = () => {
    let filtered = todos.filter(todo =>
      todo.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (todo.description && todo.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Apply additional filtering based on filter option
    switch (filterOption) {
      case 'active':
        filtered = filtered.filter(todo => !todo.completed);
        break;
      case 'completed':
        filtered = filtered.filter(todo => todo.completed);
        break;
      case 'due-today':
        const today = new Date().toISOString().split('T')[0];
        filtered = filtered.filter(todo => todo.dueDate === today);
        break;
      case 'overdue':
        const currentDate = new Date().toISOString().split('T')[0];
        filtered = filtered.filter(todo => 
          todo.dueDate && 
          todo.dueDate < currentDate && 
          !todo.completed
        );
        break;
      default:
        // 'all' - no additional filtering
        break;
    }

    return filtered;
  };

  // Sort todos based on sort option
  const getSortedTodos = () => {
    const filteredTodos = getFilteredTodos();
    
    switch (sortOption) {
      case 'date-asc':
        return [...filteredTodos].sort((a, b) => {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        });
      case 'date-desc':
        return [...filteredTodos].sort((a, b) => {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(b.dueDate) - new Date(a.dueDate);
        });
      case 'alpha-asc':
        return [...filteredTodos].sort((a, b) => 
          a.text.localeCompare(b.text)
        );
      case 'alpha-desc':
        return [...filteredTodos].sort((a, b) => 
          b.text.localeCompare(a.text)
        );
      case 'created-newest':
        return [...filteredTodos].sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
      case 'created-oldest':
        return [...filteredTodos].sort((a, b) => 
          new Date(a.createdAt) - new Date(b.createdAt)
        );
      default:
        // Default sorting (most recently modified at the top)
        return [...filteredTodos].sort((a, b) => 
          new Date(b.lastModified) - new Date(a.lastModified)
        );
    }
  };

  // Optimize component updates to avoid performance issues
  const getActiveTodos = React.useCallback(() => {
    return getSortedTodos().filter(todo => !todo.completed);
  }, [getSortedTodos]);

  const getCompletedTodos = React.useCallback(() => {
    return getSortedTodos().filter(todo => todo.completed);
  }, [getSortedTodos]);

  // Memoized todos to prevent unnecessary re-renders
  const activeTodos = React.useMemo(() => getActiveTodos(), [getActiveTodos, filterOption, sortOption, searchQuery, todos]);
  const completedTodos = React.useMemo(() => getCompletedTodos(), [getCompletedTodos, filterOption, sortOption, searchQuery, todos]);
  
  // Performance optimization to reduce calculations
  const todosLeft = React.useMemo(() => todos.filter(todo => !todo.completed).length, [todos]);
  const totalTodos = React.useMemo(() => todos.length, [todos]);

  return (
    <div className={`todo-container ${darkMode ? 'dark' : ''}`}>
      <div className="header">
        <h1>Todo List</h1>
      </div>

      <div className="todo-stats">
        <div className="stats-item">
          <span className="stats-value">{todosLeft}</span>
          <span className="stats-label">remaining</span>
        </div>
        <div className="stats-item">
          <span className="stats-value">{totalTodos - todosLeft}</span>
          <span className="stats-label">completed</span>
        </div>
        <div className="stats-item">
          <span className="stats-value">{totalTodos}</span>
          <span className="stats-label">total</span>
        </div>
      </div>

      <div className="search-and-filter">
        <div className="search-bar">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search todos..."
            className="search-input"
          />
        </div>
        
        <div className="filter-sort-controls">
          <div className="filter-control">
            <label htmlFor="filter">Filter:</label>
            <select 
              id="filter" 
              value={filterOption} 
              onChange={(e) => setFilterOption(e.target.value)}
              className="select-control"
            >
              <option value="all">All Tasks</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="due-today">Due Today</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
          
          <div className="sort-control">
            <label htmlFor="sort">Sort:</label>
            <select 
              id="sort" 
              value={sortOption} 
              onChange={(e) => setSortOption(e.target.value)}
              className="select-control"
            >
              <option value="default">Latest Modified</option>
              <option value="date-asc">Due Date (Earliest)</option>
              <option value="date-desc">Due Date (Latest)</option>
              <option value="alpha-asc">Name (A-Z)</option>
              <option value="alpha-desc">Name (Z-A)</option>
              <option value="created-newest">Newest First</option>
              <option value="created-oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="todo-form">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a new todo"
          className="todo-input"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add a description (optional)"
          className="todo-description"
        />
        <div className="date-input-container">
          <label htmlFor="dueDate">
            <span className="date-label-text">Due Date (Optional):</span>
            <span className="date-icon">📅</span>
          </label>
          <div className="date-input-wrapper">
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="todo-date"
              min={new Date().toISOString().split('T')[0]}
              placeholder="Pick a date (optional)"
              data-show-calendar="true"
            />
            {dueDate && (
              <button 
                type="button" 
                className="clear-date-btn" 
                onClick={() => setDueDate('')}
                title="Clear date"
              >
                ×
              </button>
            )}
          </div>
          {dueDate && (
            <div className="selected-date-display">
              Selected: {new Date(dueDate).toLocaleDateString(undefined, {
                weekday: 'short', 
                month: 'short', 
                day: 'numeric'
              })}
            </div>
          )}
        </div>
        <button type="submit" className="add-button">
          {editingTodo ? 'Update Task' : 'Add Task'}
        </button>
      </form>

      <div className="todo-list-header">
        <h2>Tasks ({activeTodos.length})</h2>
      </div>

      {activeTodos.length > 0 ? (
        <div className="todo-list">
          {activeTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onEdit={startEditing}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No active tasks</p>
          <span className="empty-subtitle">Add a new task to get started!</span>
        </div>
      )}

      {completedTodos.length > 0 && (
        <>
          <div className="todo-list-header completed-section">
            <h2>Completed Tasks ({completedTodos.length})</h2>
            <button 
              className="clear-completed-btn"
              onClick={() => setTodos(todos.filter(todo => !todo.completed))}
            >
              Clear Completed
            </button>
          </div>
          <div className="todo-list completed-list">
            {completedTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onEdit={startEditing}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TodoList; 