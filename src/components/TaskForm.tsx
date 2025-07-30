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
      alert('Please fill in Title and Due Date.');
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
      <input
        type="text"
        placeholder="Task Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />
      <input
        type="datetime-local"
        value={dueISO}
        onChange={e => setDueISO(e.target.value)}
        required
      />
      <div className="radio-group">
        <label><input type="radio" value="H" checked={priority === 'H'} onChange={() => setPriority('H')} /> High</label>
        <label><input type="radio" value="M" checked={priority === 'M'} onChange={() => setPriority('M')} /> Medium</label>
        <label><input type="radio" value="L" checked={priority === 'L'} onChange={() => setPriority('L')} /> Low</label>
      </div>
      <select value={estPom} onChange={e => setEstPom(Number(e.target.value))}>
        {[...Array(8)].map((_, i) => (
          <option key={i + 1} value={i + 1}>{i + 1} Pomodoro(s)</option>
        ))}
      </select>
      <button type="submit" className="secondary-button">Add Task</button>
    </form>
  );
}

export default TaskForm;
