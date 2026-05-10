import React, { useEffect, useState } from 'react';
import { useTimerStore } from '../stores/useTimerStore';
import { useTaskStore } from '../stores/useTaskStore';

export const TimerBanner: React.FC = () => {
  const { 
    activeTask, timeLeft, status, tick, 
    pauseTimer, resumeTimer, stopTimer 
  } = useTimerStore();
  const { openCompleteModal, setActualDuration, setCompletedEarly } = useTaskStore();

  // Local state for give-up confirmation modal
  const [showGiveUpConfirm, setShowGiveUpConfirm] = useState(false);

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
    const elapsedMinutes = Math.max(1, Math.round(elapsedSeconds / 60));
    
    // Pause instead of stop — so timer can resume if user cancels the modal
    pauseTimer();
    openCompleteModal(activeTask);
    setActualDuration(elapsedMinutes);
    setCompletedEarly(true);
  };

  const handleGiveUp = () => {
    // Pause the timer while the user decides
    pauseTimer();
    setShowGiveUpConfirm(true);
  };

  const confirmGiveUp = () => {
    setShowGiveUpConfirm(false);
    stopTimer();
  };

  const cancelGiveUp = () => {
    setShowGiveUpConfirm(false);
    resumeTimer();
  };

  return (
    <>
      <div className="timer-banner animate-fade-in" style={{
        position: 'absolute',
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
        border: '1px solid rgba(255,255,255,0.1)',
        maxWidth: 'calc(100% - 48px)',
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
            <button onClick={pauseTimer} className="btn-secondary" style={{ padding: '8px 16px', margin: 0, width: 'auto' }}>
              Pause
            </button>
          ) : (
            <button onClick={resumeTimer} className="btn-primary-solid" style={{ padding: '8px 16px', margin: 0, width: 'auto' }}>
              Resume
            </button>
          )}
          <button onClick={handleFinishEarly} className="btn-primary-solid" style={{ padding: '8px 16px', margin: 0, width: 'auto', backgroundColor: '#10b981', borderColor: '#10b981' }}>
            Finish Early
          </button>
          <button onClick={handleGiveUp} className="btn-danger-outline" style={{ padding: '8px 16px', margin: 0, width: 'auto' }}>
            Give Up
          </button>
        </div>
      </div>

      {/* Give Up Confirmation Modal */}
      {showGiveUpConfirm && (
        <div className="modal-overlay" onClick={cancelGiveUp}>
          <div
            className="modal-content mini"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="confirm-body">
              <div className="confirm-icon" style={{ background: '#fef2f2', color: '#ef4444' }}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  style={{ width: "32px" }}
                >
                  <path d="M12 9v4M12 17h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3>Give Up?</h3>
              <p>
                คุณแน่ใจหรือไม่ว่าต้องการยกเลิก? ความคืบหน้าของคุณจะไม่ถูกบันทึก
              </p>
              <div className="confirm-actions">
                <button className="btn-confirm-cancel" onClick={cancelGiveUp}>
                  Cancel
                </button>
                <button className="btn-confirm-danger" onClick={confirmGiveUp}>
                  Give Up
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};