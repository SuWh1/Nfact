import React, { useState, useEffect } from 'react';
import Finish from '../assets/Finish.mp3';

const motivationalPhrases = [
  "Отлично сделано!",
  "Ты хорош!",
  "🔥Машина! Трактор!",
  "Нереально круто!",
  "🔥 Жесткий результат!"
];

export default function Timer() {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [finalPhrase, setFinalPhrase] = useState('');
  const [completedCount, setCompletedCount] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const savedName = localStorage.getItem('name');
    const savedCompletedCount = localStorage.getItem('completedCount');
  
    if (savedName) setName(savedName);
    if (savedCompletedCount !== null) setCompletedCount(Number(savedCompletedCount));
    
    setLoaded(true); 
  }, []);

  useEffect(() => {
    if (!loaded) return;

    console.log('Saving to localStorage:', completedCount); 
    localStorage.setItem('name', name);
    localStorage.setItem('completedCount', String(completedCount));
  }, [name, completedCount, loaded]);
    
  useEffect(() => {
    if (!isRunning) return;

    if (timeLeft === 0) {
      setIsRunning(false);

      const audio = new Audio(Finish);
      audio.play();

      const random = motivationalPhrases[Math.floor(Math.random() * motivationalPhrases.length)];
      setFinalPhrase(random);

      setCompletedCount(prev => prev + 1);

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

    if (duration == null) {
      alert('Выберите длительность!');
      return;
    }

    setTimeLeft(duration);
    setIsRunning(true);
    setFinalPhrase('');
  };

  const retryTimer = () => {
    setTimeLeft(duration);
    setIsRunning(true);
    setFinalPhrase('');
  };

  const reset = () => {
    setIsRunning(false);
    setTimeLeft(null);
    setName('');
    setFinalPhrase('');
    setCompletedCount(0);
  };

  const progressPercent = timeLeft !== null ? ((duration - timeLeft) / duration) * 100 : 0;

  return (
    <div style={{ padding: '36px', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '16px', fontSize: '2.2rem', letterSpacing: '0.5px' }}>Таймер</h2>
      <div style={{ textAlign: 'center', color: '#64748b', fontSize: '1.25rem', marginBottom: '28px' }}>
        Завершено: <span style={{ fontWeight: 700, color: '#10b981', fontSize: '1.4rem' }}>{completedCount}</span>
      </div>

      <input
        style={{
          width: '100%',
          boxSizing: 'border-box',
          padding: '20px 24px',
          fontSize: '1.5rem',
          border: '3px solid #4f46e5',
          borderRadius: '12px',
          outline: 'none',
          marginBottom: '22px',
          transition: 'border 0.2s',
        }}

        type="text"
        placeholder="Введите имя"
        value={name}
        onChange={e => setName(e.target.value)}
        disabled={isRunning}
      />

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '22px', width: '100%' }}>
        {[10, 20, 30].map(val => {
          const isSelected = duration === val;
          return (
            <button
              key={val}
              onClick={() => setDuration(val)}
              disabled={isRunning}

              style={{
                flex: 1,
                minWidth: 0,
                padding: '18px 0',
                fontSize: '1.3rem',
                borderRadius: '12px',
                border: `3px solid ${isSelected ? '#10b981' : '#111'}`,
                background: isSelected ? '#111' : '#222',
                color: '#fff',
                cursor: isRunning ? 'not-allowed' : 'pointer',
                outline: '3px solid transparent',
                transition: 'all 0.2s',
              }}
            >
              {val} сек.
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '28px' }}>
        <button
          onClick={startTimer}
          disabled={isRunning}

          style={{
            flex: 1,
            padding: '18px 0',
            fontSize: '1.3rem',
            borderRadius: '12px',
            border: '3px solid #10b981',
            background: isRunning ? '#111' : '#222',
            color: isRunning ? '#a1a1aa' : '#fff',
            fontWeight: 700,
            cursor: isRunning ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s',
            outline: '3px solid transparent', 
          }}
        >Старт таймера</button>

        <button
          onClick={reset}

          style={{
            flex: 1,
            padding: '18px 0',
            fontSize: '1.3rem',
            borderRadius: '12px',
            border: '3px solid #f43f5e',
            background: '#111',
            color: '#f43f5e',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.15s',
            outline: '3px solid transparent', 
          }}
        >Сброс</button>
      </div>

      <div style={{ marginTop: '32px', fontSize: '2.2rem' }}>
        {timeLeft !== null && timeLeft > 0 && (
        <>
            <p style={{ fontSize: '20px' }}>{name}, осталось: {timeLeft} сек</p>
            <div style={{
              height: '12px',
              width: '100%',
              background: '#ddd',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                width: `${progressPercent}%`,
                background: '#10b981',
                transition: 'width 1s linear'
              }} />
            </div>
        </>
        )}

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