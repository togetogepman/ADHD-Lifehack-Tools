import { useState, useEffect, useCallback } from 'react';
import { useTaskStore } from '../store';

const FOCUS_TIME = 25 * 60; // 25 minutes
const BREAK_TIME = 5 * 60; // 5 minutes

function PomodoroTimer() {
  const { activeTask, incrementPomodoro, setActiveTask } = useTaskStore();
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
  const [isActive, setIsActive] = useState(false);

  const handleTimerEnd = useCallback(() => {
    if (mode === 'focus' && activeTask) {
      incrementPomodoro(activeTask.ID);
      setMode('break');
      setTimeLeft(BREAK_TIME);
      new Notification('Focus session complete!', { body: 'Time for a short break.' });
    } else {
      setMode('focus');
      setTimeLeft(FOCUS_TIME);
      setIsActive(false); // Stop timer after break
      setActiveTask(null); // Clear active task
      new Notification('Break is over!', { body: 'Time to get back to work.' });
    }
  }, [mode, activeTask, incrementPomodoro, setActiveTask]);

  useEffect(() => {
    let interval: number | undefined = undefined;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev: number) => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      handleTimerEnd();
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, handleTimerEnd]);
  
  useEffect(() => {
    // Reset timer if active task is cleared or changed
    if (!activeTask) {
      setIsActive(false);
      setMode('focus');
      setTimeLeft(FOCUS_TIME);
    }
  }, [activeTask]);

  const toggleTimer = () => {
    if (!activeTask) {
      alert("Please select a task to focus on from the list.");
      return;
    }
    // 通知権限が拒否されている場合はユーザーに知らせる
    if (Notification.permission === 'denied') {
      alert('通知がブロックされているため、タイマー終了時の通知は表示されません。');
    } else if (Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'denied') {
          alert('通知がブロックされたため、タイマー終了時の通知は表示されません。');
        }
      });
    }
    setIsActive(!isActive);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="pomodoro-timer">
      <h3>Pomodoro Timer</h3>
      <div className="timer-display">{formatTime(timeLeft)}</div>
      <div className="timer-mode">{mode === 'focus' ? 'Focus' : 'Break'}</div>
      <div className="timer-controls">
        <button onClick={toggleTimer} disabled={!activeTask}>
          {isActive ? 'Pause' : 'Start'}
        </button>
      </div>
      {activeTask && <p className="current-task">Task: {activeTask.Title}</p>}
    </div>
  );
}

export default PomodoroTimer;
