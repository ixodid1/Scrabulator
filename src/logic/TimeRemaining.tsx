import React, { useState, useEffect } from 'react';
import './TimeRemainingClock.scss';

function ScrabbleTimer() {
    const initialTime = 600; // 10 minutes
    const [time, setTime] = useState(initialTime);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        let timerInterval;

        if (isRunning) {
            timerInterval = setInterval(() => {
                setTime((prevTime) => prevTime - 1);
            }, 1000);
        } else {
            clearInterval(timerInterval);
        }

        if (time <= 0) {
            clearInterval(timerInterval);
            alert("Time's up!");
            setIsRunning(false);
        }

        return () => clearInterval(timerInterval);
    }, [isRunning, time]);

    const startTimer = () => {
        setIsRunning(true);
    };

    const pauseTimer = () => {
        setIsRunning(false);
    };

    const resetTimer = () => {
        setIsRunning(false);
        setTime(initialTime);
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    };

    return (
        <div>
            <h1>Scrabble Time Clock</h1>
            <p>Time Remaining: {formatTime(time)}</p>
            <button onClick={startTimer} disabled={isRunning}>Start</button>
            <button onClick={pauseTimer} disabled={!isRunning}>Pause</button>
            <button onClick={resetTimer}>Reset</button>
        </div>
    );
}

export default ScrabbleTimer;