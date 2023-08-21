import React, { useState, useEffect } from "react";

function Timer({ timestamp, bombFn, style }) {
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    // Calculate the remaining time based on the timestamp and the current time
    const now = Date.now();
    const targetTime = new Date(timestamp).getTime();
    const diffInSeconds = Math.max(0, Math.floor((targetTime - now) / 1000));
    setRemainingTime(diffInSeconds);

    // Set up an interval to update the remaining time every second
    const intervalId = setInterval(() => {
      setRemainingTime((prevRemainingTime) => {
        if (prevRemainingTime <= 1) {
          if (bombFn) bombFn();
          clearInterval(intervalId);
          return 0;
        }
        return prevRemainingTime - 1;
      });
    }, 1000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [timestamp]);

  // Convert remainingTime to a formatted time (e.g., HH:MM:SS)
  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    return `${String(hours).padStart(2, "0")}hr ${String(minutes).padStart(
      2,
      "0"
    )}min ${String(seconds).padStart(2, "0")} sec`;
  };

  return (
    <div className="countdown-timer" >
      <h4 style={style} className="heading">{formatTime(remainingTime)}</h4>
    </div>
  );
}

export default Timer;
