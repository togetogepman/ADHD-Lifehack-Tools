import { useEffect } from 'react';
import { useTaskStore } from './store';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import PomodoroTimer from './components/PomodoroTimer';

function App() {
  const { fetchTasks, loading, error, activeTask } = useTaskStore();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <div className="container">
      <header>
        <h1>ADHD Task Manager</h1>
      </header>
      <main>
        <div className="sidebar">
          <PomodoroTimer />
        </div>
        <div className="content">
          <TaskForm />
          {loading && <p>Loading tasks...</p>}
          {error && <p className="error">Error: {error}</p>}
          {!loading && !error && <TaskList />}
        </div>
      </main>
      <footer>
        <p>A simple tool to help you focus.</p>
        {activeTask && <p className="current-task-footer">Focusing on: {activeTask.Title}</p>}
      </footer>
    </div>
  );
}

export default App;
