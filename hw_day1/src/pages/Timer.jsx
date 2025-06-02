import React, { useState, useEffect } from 'react';

const motivationalPhrases = [
  "Отлично сделано!",
  "Ты хорош!",
  "🔥Машина! Трактор!",
  "Нереально круто!",
  "🔥 Жесткий результат!"
];

export default function Timer() {
  const [name, setName] = useState('');
  const [timeLeft, setTimeLeft] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [finalPhrase, setFinalPhrase] = useState('');

  useEffect(() => {
    if (!isRunning) return;

    if (timeLeft === 0) {
      setIsRunning(false);

      const random = motivationalPhrases[Math.floor(Math.random() * motivationalPhrases.length)];
      setFinalPhrase(random);

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

    setTimeLeft(3);
    setIsRunning(true);
    setFinalPhrase('');
  };

  const retryTimer = () => {
    setTimeLeft(3);
    setIsRunning(true);
    setFinalPhrase('');
  };

  const reset = () => {
    setIsRunning(false);
    setTimeLeft(null);
    setName('');
    setFinalPhrase('');
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
        {timeLeft !== null && timeLeft > 0 && <p>{name}, осталось: {timeLeft} сек</p>}
        {timeLeft === 0 && (
          <div style={{ display: 'grid', alignItems: 'center', gap: '10px', marginTop: '20px', fontSize: '24px' }}>
          <p style={{ margin: 0 }}>{finalPhrase}</p>
          <button onClick={retryTimer}>Попробовать ещё раз</button>
        </div>
        )}
      </div>
    </div>
  );
}