import React, { useState, useEffect } from "react";

const CountdownTimer = ({ minutes, setTimer }) => {
  const [countdown, setCountdown] = useState(minutes * 60 * 1000);

  useEffect(() => {
    const endTime = Date.now() + countdown;

    const interval = setInterval(() => {
      const remainingTime = endTime - Date.now();
      setCountdown(remainingTime);
      if (setTimer)
        setTimer(Math.floor(remainingTime / (1000 * 60)));
      if (remainingTime <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [countdown]);

  const formatTime = (time) => {
    const hours = Math.floor(time / (1000 * 60 * 60));
    const minutes = Math.floor((time / (1000 * 60)) % 60);
    const seconds = Math.floor((time / 1000) % 60);
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="countdown-timer">
      <h4 className="heading">{formatTime(countdown)}</h4>
    </div>
  );
};

export default CountdownTimer;
