import React, { useEffect } from 'react';
import { useTimerStore } from '../stores/useTimerStore';
import { useTaskStore } from '../stores/useTaskStore';

export const TimerBanner: React.FC = () => {
  const { 
    activeTask, timeLeft, status, tick, 
    pauseTimer, resumeTimer, stopTimer 
  } = useTimerStore();
  const { openCompleteModal, setActualDuration, setCompletedEarly } = useTaskStore();

  // Tick effect
  useEffect(() => {
    if (status !== 'RUNNING') return;
    const interval = setInterval(() => {
      tick();
    }, 1000);
    return () => clearInterval(interval);
  }, [status, tick]);

  // Handle auto-complete when time is up
  useEffect(() => {
    if (status === 'RUNNING' && timeLeft <= 0 && activeTask) {
      stopTimer();
      openCompleteModal(activeTask);
      setActualDuration(activeTask.expectedDuration);
      setCompletedEarly(false);
    }
  }, [timeLeft, status, activeTask, stopTimer, openCompleteModal, setActualDuration, setCompletedEarly]);

  if (!activeTask || status === 'IDLE') return null;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleFinishEarly = () => {
    const elapsedSeconds = (activeTask.expectedDuration * 60) - timeLeft;
    const elapsedMinutes = Math.max(1, Math.round(elapsedSeconds / 60)); // at least 1 min
    
    stopTimer();
    openCompleteModal(activeTask);
    setActualDuration(elapsedMinutes);
    setCompletedEarly(true);
  };

  const handleGiveUp = () => {
    if (window.confirm('Are you sure you want to give up? Your progress will not be saved.')) {
      stopTimer();
    }
  };

  return (
    <div className="timer-banner animate-fade-in" style={{
      position: 'fixed',
      bottom: '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: '#1e293b',
      color: 'white',
      padding: '16px 24px',
      borderRadius: '24px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
      display: 'flex',
      alignItems: 'center',
      gap: '24px',
      zIndex: 50,
      border: '1px solid rgba(255,255,255,0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '48px', height: '48px',
          borderRadius: '50%',
          border: '3px solid',
          borderColor: status === 'RUNNING' ? '#3b82f6' : '#f59e0b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem'
        }}>
          ⏱️
        </div>
        <div>
          <h4 style={{ margin: 0, fontSize: '0.875rem', opacity: 0.8 }}>{activeTask.title}</h4>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', fontFamily: 'monospace' }}>
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '8px' }}>
        {status === 'RUNNING' ? (
          <button onClick={pauseTimer} className="btn-secondary" style={{ padding: '8px 16px', margin: 0 }}>
            Pause
          </button>
        ) : (
          <button onClick={resumeTimer} className="btn-primary-solid" style={{ padding: '8px 16px', margin: 0 }}>
            Resume
          </button>
        )}
        <button onClick={handleFinishEarly} className="btn-primary-solid" style={{ padding: '8px 16px', margin: 0, backgroundColor: '#10b981', borderColor: '#10b981' }}>
          Finish Early
        </button>
        <button onClick={handleGiveUp} className="btn-secondary" style={{ padding: '8px 16px', margin: 0, color: '#ef4444' }}>
          Give Up
        </button>
      </div>
    </div>
  );
};