import { useTaskStore } from '../store';
import { Task } from '../types';

function TaskList() {
  const { tasks, setActiveTask, activeTask } = useTaskStore();

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString();
  };

  return (
    <div className="task-list">
      <h3>My Tasks</h3>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Pomodoros</th>
            <th>Due Date</th>
            <th>Priority</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task: Task) => (
            <tr key={task.ID} className={activeTask?.ID === task.ID ? 'active' : ''}>
              <td>{task.Title}</td>
              <td>{task.SpentPom} / {task.EstPom}</td>
              <td>{formatDate(task.DueISO)}</td>
              <td>
                <span className={`priority-badge priority-${task.Priority}`}>{task.Priority}</span>
              </td>
              <td>
                <button onClick={() => setActiveTask(task)} className="secondary-button">
                  Focus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TaskList;
