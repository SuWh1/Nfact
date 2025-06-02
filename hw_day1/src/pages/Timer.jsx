import React, { useState, useEffect } from 'react';

export default function Timer() {
  const [name, setName] = useState('');
  const [timeLeft, setTimeLeft] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    if (timeLeft === 0) {
      setIsRunning(false);
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);

  }, [isRunning, timeLeft]);

  const startTimer = () => {
    if (name.trim() === '') {
      alert('Введите имя!');
      return;
    }
    setTimeLeft(10);
    setIsRunning(true);
  };

  const reset = () => {
    setIsRunning(false);
    setTimeLeft(null);
    setName('');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '300px' }}>
      <input
        style={{
            width: '100%',
            padding: '12px 16px',
            fontSize: '1.2rem',
            border: '2px solid #4f46e5',
            borderRadius: '8px',
            outline: 'none',
            marginBottom: '16px'
        }}
        
        type="text"
        placeholder="Введите имя"
        value={name}
        onChange={e => setName(e.target.value)}
        disabled={isRunning}
      />

      <button onClick={startTimer} disabled={isRunning}>Старт таймера</button>
      <button onClick={reset} style={{ marginLeft: '10px' }}>Сброс</button>

      <div style={{ marginTop: '20px', fontSize: '24px' }}>
        {timeLeft !== null && timeLeft > 0 && <p>Осталось: {timeLeft} сек</p>}
        {timeLeft === 0 && <p>Ты справился, {name} 💪</p>}
      </div>
    </div>
  );
}