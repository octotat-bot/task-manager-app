import React, { useState, useEffect } from 'react';

const TodoItem = ({ todo, onToggle, onDelete, onEdit }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [animation, setAnimation] = useState('');
  const [isCompleted, setIsCompleted] = useState(todo.completed);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  // Manage completion state changes
  useEffect(() => {
    setIsCompleted(todo.completed);
  }, [todo.completed]);

  // Format the due date for display
  const formatDueDate = (dateString) => {
    if (!dateString) return null;
    
    const dueDate = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Check if due date is today
    if (dueDate.toDateString() === today.toDateString()) {
      return { text: 'Today', class: 'due-today' };
    }
    
    // Check if due date is tomorrow
    if (dueDate.toDateString() === tomorrow.toDateString()) {
      return { text: 'Tomorrow', class: 'due-tomorrow' };
    }
    
    // Check if due date is in the past
    if (dueDate < today && !todo.completed) {
      return { text: formatDate(dueDate), class: 'overdue' };
    }
    
    // Regular date display
    return { text: formatDate(dueDate), class: 'upcoming' };
  };
  
  const formatDate = (date) => {
    const options = { month: 'short', day: 'numeric' };
    if (date.getFullYear() !== new Date().getFullYear()) {
      options.year = 'numeric';
    }
    return date.toLocaleDateString(undefined, options);
  };
  
  const dueDateInfo = todo.dueDate ? formatDueDate(todo.dueDate) : null;
  
  useEffect(() => {
    // Add a slight animation when the component mounts
    setAnimation('fade-in');
    const timer = setTimeout(() => setAnimation(''), 500);
    return () => clearTimeout(timer);
  }, []);
  
  // Determine priority class
  const getPriorityClass = () => {
    if (!todo.dueDate) return '';
    const today = new Date();
    const dueDate = new Date(todo.dueDate);
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0 && !todo.completed) return 'priority-high';
    if (diffDays === 0) return 'priority-medium';
    if (diffDays <= 2) return 'priority-low';
    return '';
  };

  // Get time since creation
  const getTimeSince = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'just now';
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks}w ago`;
    
    const months = Math.floor(days / 30);
    return `${months}mo ago`;
  };

  const handleToggle = () => {
    onToggle(todo.id);
  };

  return (
    <div 
      className={`todo-item ${todo.completed ? 'completed' : ''} ${animation} ${getPriorityClass()}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="todo-status-indicator"></div>
      <div className="todo-main">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
          className="todo-checkbox"
        />
        <div className="todo-content" onClick={() => setIsExpanded(!isExpanded)}>
          <div className="todo-text-container">
            <span className="todo-text">{todo.text}</span>
            
            {dueDateInfo && (
              <span className={`todo-date-badge ${dueDateInfo.class}`}>
                {dueDateInfo.text}
              </span>
            )}
            
            {todo.description && (
              <span className="todo-has-description-indicator" title="Has description">
                📝
              </span>
            )}
          </div>
          
          <div className="todo-timestamps">
            {todo.completed && todo.completedAt && (
              <span className="timestamp completed-timestamp">
                ✅ Completed: {new Date(todo.completedAt).toLocaleString()}
              </span>
            )}
            <span className="timestamp created-timestamp">
              🕒 Created: {new Date(todo.createdAt).toLocaleString()}
            </span>
          </div>
        </div>
        
        <div className={`todo-actions ${isHovered ? 'visible' : ''}`}>
          {todo.description && (
            <button 
              className={`expand-button ${isExpanded ? 'expanded' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              title={isExpanded ? "Hide details" : "Show details"}
            >
              {isExpanded ? '▲' : '▼'}
            </button>
          )}
          <button
            onClick={() => onEdit(todo)}
            className="edit-button"
            title="Edit task"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className="delete-button"
            title="Delete task"
          >
            🗑️
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="todo-details">
          {todo.description && (
            <div className="todo-description-display">
              <h4>Description:</h4>
              <p>{todo.description}</p>
            </div>
          )}
          
          <div className="todo-dates">
            {todo.dueDate && (
              <div className="todo-date-info">
                <span className="date-label">Due:</span>
                <span className={`date-value ${dueDateInfo.class}`}>
                  {new Date(todo.dueDate).toLocaleDateString(undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            )}
            
            <div className="todo-date-info">
              <span className="date-label">Created:</span>
              <span className="date-value">
                {new Date(todo.createdAt).toLocaleDateString(undefined, {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            
            {todo.lastModified !== todo.createdAt && (
              <div className="todo-date-info">
                <span className="date-label">Modified:</span>
                <span className="date-value">
                  {new Date(todo.lastModified).toLocaleDateString(undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="progress-indicator"></div>
    </div>
  );
};

export default TodoItem; 