import React, { useState } from 'react';
import { useTaskStore } from '../store';
import { NewTask } from '../types';

function TaskForm() {
  const addTask = useTaskStore(state => state.addTask);
  const [title, setTitle] = useState('');
  const [dueISO, setDueISO] = useState('');
  const [priority, setPriority] = useState<'H' | 'M' | 'L'>('M');
  const [estPom, setEstPom] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !dueISO) {
      alert('Please fill in Task Title and Deadline.');
      return;
    }
    const newTask: NewTask = {
      Title: title,
      DueISO: new Date(dueISO).toISOString(),
      Priority: priority,
      EstPom: estPom,
    };
    addTask(newTask);

    // Reset form
    setTitle('');
    setDueISO('');
    setPriority('M');
    setEstPom(1);
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <h3>Add New Task</h3>

      {/* Task title */}
      <label className="input-label">
        Task title<span className="required">*</span>
        <input
          type="text"
          placeholder="e.g. Budget report"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
      </label>

      {/* Deadline */}
      <label className="input-label">
        Deadline<span className="required">*</span>
        <input
          type="datetime-local"
          value={dueISO}
          onChange={e => setDueISO(e.target.value)}
          required
        />
      </label>

      {/* Details group */}
      <fieldset className="details-group">
        <legend>Task details</legend>

        {/* Priority */}
        <div className="radio-group">
          <span className="group-label">Priority:</span>
          <label>
            <input
              type="radio"
              value="H"
              checked={priority === 'H'}
              onChange={() => setPriority('H')}
            />
            <span className="priority-badge priority-H">High</span>
          </label>
          <label>
            <input
              type="radio"
              value="M"
              checked={priority === 'M'}
              onChange={() => setPriority('M')}
            />
            <span className="priority-badge priority-M">Medium</span>
          </label>
          <label>
            <input
              type="radio"
              value="L"
              checked={priority === 'L'}
              onChange={() => setPriority('L')}
            />
            <span className="priority-badge priority-L">Low</span>
          </label>
        </div>

        {/* Estimated Pomodoros */}
        <label className="input-label">
          Estimate&nbsp;(Pomodoros)
          <select value={estPom} onChange={e => setEstPom(Number(e.target.value))}>
            {[...Array(8)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </label>
      </fieldset>

      <button type="submit" className="secondary-button">
        Add Task
      </button>
    </form>
  );
}

export default TaskForm;
