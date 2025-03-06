import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

/**
 * CountdownComponent calculates and displays the remaining time or "Timeout."
 * Changes the color to red when the remaining time is less than 1/4 of the total duration.
 * Displays months, days, hours, minutes, and seconds as appropriate.
 * @param {string} startDate - The start datetime in ISO format (e.g., "2024-11-26T07:00:00Z").
 * @param {string} endDate - The end datetime in ISO format (e.g., "2024-11-27T20:00:00Z").
 */
const CountdownComponent = ({ startDate, endDate }) => {
  const [remainingTime, setRemainingTime] = useState({ months: 0, days: 0, time: "" });
  const [isCritical, setIsCritical] = useState(false);

  useEffect(() => {
    const calculateRemainingTime = () => {
      const now = dayjs();
      const start = dayjs(startDate);
      const end = dayjs(endDate);

      const totalDuration = end.diff(start); // Total duration in milliseconds
      const diff = end.diff(now); // Remaining time in milliseconds

      if (diff <= 0) {
        setRemainingTime({ months: 0, days: 0, time: "หมดเวลา" });
        return;
      }

      const timeLeft = dayjs.duration(diff);

      const months = Math.floor(timeLeft.asMonths()); // Calculate remaining months
      const days = timeLeft.days();
      const hours = String(timeLeft.hours()).padStart(2, "0");
      const minutes = String(timeLeft.minutes()).padStart(2, "0");
      const seconds = String(timeLeft.seconds()).padStart(2, "0");

      // Check if remaining time is less than 1/4 of the total duration
      setIsCritical(diff < totalDuration / 4);

      setRemainingTime({
        months,
        days,
        time: `${hours}:${minutes}:${seconds} ชม.`,
      });
    };

    calculateRemainingTime(); // Initial calculation
    const interval = setInterval(calculateRemainingTime, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [startDate, endDate]);

  return (
    <span
      className={`${
        isCritical ? "text-danger font-semibold" : "text-primary"
      }`}
    >
      {remainingTime.time === "หมดเวลา" ? (
        <span className="text-danger">หมดเวลา</span>
      ) : (
        <>
          {remainingTime.months > 0 && (
            <span className="text-gray-500">{remainingTime.months} เดือน </span>
          )}
          {remainingTime.days > 0 && (
            <span className="text-gray-500">{remainingTime.days} วัน </span>
          )}
          <span>{remainingTime.time}</span>
        </>
      )}
    </span>
  );
};

export default CountdownComponent;
