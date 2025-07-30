import { useState, useEffect, useCallback } from 'react';
import { useTaskStore } from '../store';

const FOCUS_TIME = 25 * 60; // 25 minutes
const BREAK_TIME = 5 * 60;  // 5 minutes
const LONG_BREAK_TIME = 25 * 60;

function PomodoroTimer() {
  const { activeTask, incrementPomodoro, setActiveTask } = useTaskStore();
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
  const [isActive, setIsActive] = useState(false);
  const [totalFocusSessions, setTotalFocusSessions] = useState(0);

  // 追加: セッション開始時刻と中断カウント
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [interruptionCount, setInterruptionCount] = useState(0);

  // ログ送信用関数
  const sendPomodoroLog = async (log: {
    date: string;
    startTime: string;
    endTime: string;
    taskId: string;
    taskTitle: string;
    interruptionCount: number;
    completed: boolean;
  }) => {
    try {
      await fetch("https://script.google.com/macros/s/1dZEDvs7AZ1PrryISCroAogOtV3uah5IE6EvgF5aOvoGLG5XRQQxUc4LX/exec?method=log", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(log),
      });
    } catch (error) {
      console.error("Failed to send Pomodoro log:", error);
    }
  };

  const handleTimerEnd = useCallback(() => {
    if (mode === 'focus' && activeTask) {
      incrementPomodoro(activeTask.ID);
      setTotalFocusSessions(prev => prev + 1);

      // ログ送信処理
      const now = new Date();
      if (sessionStartTime) {
        sendPomodoroLog({
          date: now.toISOString().split("T")[0],
          startTime: sessionStartTime.toTimeString().slice(0, 5),
          endTime: now.toTimeString().slice(0, 5),
          taskId: activeTask.ID,
          taskTitle: activeTask.Title,
          interruptionCount: interruptionCount,
          completed: true,
        });
      }

      // 状態リセットと長い休憩判定
      const nextBreak = (totalFocusSessions + 1) % 4 === 0 ? LONG_BREAK_TIME : BREAK_TIME;
      setMode('break');
      setTimeLeft(nextBreak);
      setSessionStartTime(null);
      setInterruptionCount(0);
      new Notification('Focus session complete!', { body: 'Time for a break.' });
    } else {
      setMode('focus');
      setTimeLeft(FOCUS_TIME);
      setIsActive(false);
      setActiveTask(null);
      new Notification('Break is over!', { body: 'Time to get back to work.' });
    }
  }, [mode, activeTask, incrementPomodoro, setActiveTask, sessionStartTime, interruptionCount, totalFocusSessions]);

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
    // タスク変更時に初期化
    if (!activeTask) {
      setIsActive(false);
      setMode('focus');
      setTimeLeft(FOCUS_TIME);
      setSessionStartTime(null);
      setInterruptionCount(0);
    }
  }, [activeTask]);

  const toggleTimer = () => {
    if (!activeTask) {
      alert("Please select a task to focus on from the list.");
      return;
    }

    if (!isActive) {
      // 初回スタート or 再開時に処理
      if (!sessionStartTime) setSessionStartTime(new Date());
      else setInterruptionCount(prev => prev + 1);
    }

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
        <button onClick={toggleTimer} disabled={!activeTask} className="start-button">
          {isActive ? 'Pause' : 'Start'}
        </button>
      </div>
      {activeTask && <p className="current-task">Task: {activeTask.Title}</p>}
    </div>
  );
}

export default PomodoroTimer;
